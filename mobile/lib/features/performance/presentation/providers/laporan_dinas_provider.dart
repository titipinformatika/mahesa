import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/performance/data/models/laporan_dinas_model.dart';
import 'package:mahesa_mobile/features/performance/data/repositories/laporan_dinas_repository.dart';

final laporanDinasRepositoryProvider = Provider((ref) {
  return LaporanDinasRepository(ref.watch(dioClientProvider));
});

final laporanDinasHistoryProvider = FutureProvider<List<LaporanDinasModel>>((ref) async {
  return ref.watch(laporanDinasRepositoryProvider).getHistory();
});

final laporanDinasSummaryProvider = FutureProvider.family<LaporanSummaryModel, ({int bulan, int tahun})>((ref, arg) async {
  return ref.watch(laporanDinasRepositoryProvider).getSummary(arg.bulan, arg.tahun);
});

// Using ValueNotifier for action status to remain compatible with Riverpod 3.x
final submitLaporanActionProvider = Provider((ref) => ValueNotifier<AsyncValue<LaporanDinasModel?>>(const AsyncValue.data(null)));

class LaporanDinasService {
  final Ref ref;
  LaporanDinasService(this.ref);

  Future<void> submit({
    required int bulan,
    required int tahun,
    required int totalPegawai,
    required int totalHadir,
    required int totalCuti,
    required int totalDl,
    String? catatan,
    String status = 'dikirim',
  }) async {
    final statusNotifier = ref.read(submitLaporanActionProvider);
    statusNotifier.value = const AsyncValue.loading();
    try {
      final res = await ref.read(laporanDinasRepositoryProvider).submitLaporan({
        'bulan': bulan,
        'tahun': tahun,
        'totalPegawai': totalPegawai,
        'totalHadir': totalHadir,
        'totalCuti': totalCuti,
        'totalDl': totalDl,
        'catatanPimpinan': catatan,
        'status': status,
      });
      statusNotifier.value = AsyncValue.data(res);
      ref.invalidate(laporanDinasHistoryProvider);
    } catch (e, st) {
      statusNotifier.value = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

final laporanDinasServiceProvider = Provider((ref) => LaporanDinasService(ref));
