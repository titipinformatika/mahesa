import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/attendance/data/repositories/attendance_repository.dart';
import 'package:mahesa_mobile/core/cache/cache_service.dart';
import 'package:mahesa_mobile/core/network/connectivity_service.dart';

final attendanceRepositoryProvider = Provider((ref) {
  return AttendanceRepository(ref.read(dioClientProvider));
});

final attendanceStatusProvider = FutureProvider((ref) async {
  final repo = ref.read(attendanceRepositoryProvider);
  final response = await repo.getStatusHariIni();
  return response.data;
});

final attendanceHistoryProvider = FutureProvider.family<dynamic, ({int bulan, int tahun})>((ref, arg) async {
  final repo = ref.read(attendanceRepositoryProvider);
  final cache = ref.watch(cacheServiceProvider);
  final isOnline = ref.watch(isOnlineProvider);

  if (!isOnline) {
    final cached = cache.getCachedAttendance();
    if (cached != null) return cached;
  }

  try {
    final response = await repo.getRekapBulanan(arg.bulan, arg.tahun);
    await cache.cacheAttendance(response.data);
    return response.data;
  } catch (e) {
    final cached = cache.getCachedAttendance();
    if (cached != null) return cached;
    rethrow;
  }
});

final ringkasanPegawaiProvider = FutureProvider.family<dynamic, ({int bulan, int tahun})>((ref, arg) async {
  final repo = ref.read(attendanceRepositoryProvider);
  final response = await repo.getRingkasanPegawai(arg.bulan, arg.tahun);
  return response['data'];
});

final unitDetailProvider = FutureProvider.family<dynamic, String>((ref, id) async {
  final repo = ref.read(attendanceRepositoryProvider);
  final response = await repo.getUnitDetail(id);
  return response.data;
});

// Using ValueNotifier for action status to remain compatible with Riverpod 3.x without generators
final attendanceActionStatusProvider = Provider((ref) => ValueNotifier<AsyncValue<void>>(const AsyncValue.data(null)));

class AttendanceService {
  final Ref ref;
  AttendanceService(this.ref);

  Future<void> submitAbsensi({
    required String jenisTitik,
    required double latitude,
    required double longitude,
    File? foto,
    String? catatan,
    bool isMockLocation = false,
  }) async {
    final statusNotifier = ref.read(attendanceActionStatusProvider);
    statusNotifier.value = const AsyncValue.loading();
    
    try {
      final repository = ref.read(attendanceRepositoryProvider);
      await repository.clockInOut(
        jenisTitik: jenisTitik,
        latitude: latitude,
        longitude: longitude,
        foto: foto,
        catatan: catatan,
        isMockLocation: isMockLocation,
      );
      statusNotifier.value = const AsyncValue.data(null);
      ref.invalidate(attendanceStatusProvider);
    } catch (e, stack) {
      statusNotifier.value = AsyncValue.error(e, stack);
      rethrow;
    }
  }
}

final attendanceServiceProvider = Provider((ref) => AttendanceService(ref));
