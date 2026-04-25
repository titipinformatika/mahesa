import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/repositories/dinas_luar_repository.dart';

final skemaDLProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(dinasLuarRepositoryProvider);
  final response = await repo.getSkema();
  return response.data['data'] as List<dynamic>;
});

final riwayatDLProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(dinasLuarRepositoryProvider);
  final response = await repo.getRiwayat();
  return response.data['data'] as List<dynamic>;
});

final persetujuanDLProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(dinasLuarRepositoryProvider);
  final response = await repo.getSemuaRiwayat(onlyWaiting: true);
  return response.data['data'] as List<dynamic>;
});

final petaPantauanProvider = FutureProvider<List<dynamic>>((ref) async {
  final repo = ref.read(dinasLuarRepositoryProvider);
  final response = await repo.getPetaLangsung();
  return response.data['data'] as List<dynamic>;
});

class DinasLuarService {
  final Ref ref;
  
  DinasLuarService(this.ref);

  Future<void> ajukanDL({
    required String idSkema,
    required String tujuan,
    required String tanggalMulai,
    required String tanggalSelesai,
    String? keterangan,
  }) async {
    final statusNotifier = ref.read(dinasLuarActionStatusProvider);
    statusNotifier.value = const AsyncValue.loading();
    
    try {
      final repo = ref.read(dinasLuarRepositoryProvider);
      await repo.ajukanDL(
        idSkema: idSkema,
        tujuan: tujuan,
        tanggalMulai: tanggalMulai,
        tanggalSelesai: tanggalSelesai,
        keterangan: keterangan,
      );
      statusNotifier.value = const AsyncValue.data(null);
      ref.invalidate(riwayatDLProvider);
    } catch (e, st) {
      statusNotifier.value = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> setujuiDL({
    required String id,
    required String status,
    String? catatan,
  }) async {
    final statusNotifier = ref.read(dinasLuarActionStatusProvider);
    statusNotifier.value = const AsyncValue.loading();
    
    try {
      final repo = ref.read(dinasLuarRepositoryProvider);
      await repo.setujuiDL(id: id, status: status, catatan: catatan);
      statusNotifier.value = const AsyncValue.data(null);
      ref.invalidate(persetujuanDLProvider);
    } catch (e, st) {
      statusNotifier.value = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> pingLokasi({
    required String idPengajuanDL,
    required double latitude,
    required double longitude,
  }) async {
    try {
      final repo = ref.read(dinasLuarRepositoryProvider);
      await repo.pingLokasi(
        idPengajuanDL: idPengajuanDL,
        latitude: latitude,
        longitude: longitude,
      );
    } catch (e) {
      // Background ping errors can be ignored or logged
      debugPrint("Gagal ping lokasi: $e");
    }
  }
}

final dinasLuarServiceProvider = Provider((ref) => DinasLuarService(ref));

final dinasLuarActionStatusProvider = Provider((ref) => ValueNotifier<AsyncValue<void>>(const AsyncValue.data(null)));
