import 'dart:io';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/cuti_model.dart';
import '../../data/models/saldo_cuti_model.dart';
import '../../data/repositories/cuti_repository.dart';
import '../../../../core/network/dio_client.dart';

part 'cuti_provider.g.dart';

@riverpod
CutiRepository cutiRepository(Ref ref) {
  final client = ref.watch(dioClientProvider);
  return CutiRepositoryImpl(client);
}

@riverpod
Future<List<SaldoCutiModel>> saldoCuti(Ref ref) {
  return ref.watch(cutiRepositoryProvider).getSaldoCuti();
}

@riverpod
Future<List<CutiModel>> riwayatCuti(Ref ref) {
  return ref.watch(cutiRepositoryProvider).getRiwayatCuti();
}

@riverpod
Future<List<JenisCutiModel>> jenisCuti(Ref ref) {
  return ref.watch(cutiRepositoryProvider).getJenisCuti();
}

@riverpod
Future<List<CutiModel>> persetujuanCuti(Ref ref) {
  return ref.watch(cutiRepositoryProvider).getPersetujuanCuti();
}

@riverpod
class AjukanCutiAction extends _$AjukanCutiAction {
  @override
  FutureOr<void> build() {}

  Future<void> ajukanCuti({
    required String idJenisCuti,
    required DateTime tanggalMulai,
    required DateTime tanggalSelesai,
    required String alasan,
    File? dokumen,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(cutiRepositoryProvider).ajukanCuti(
        idJenisCuti: idJenisCuti,
        tanggalMulai: tanggalMulai,
        tanggalSelesai: tanggalSelesai,
        alasan: alasan,
        dokumen: dokumen,
      );
      // Refresh data
      ref.invalidate(riwayatCutiProvider);
      ref.invalidate(saldoCutiProvider);
    });
  }
}

@riverpod
class PimpinanCutiAction extends _$PimpinanCutiAction {
  @override
  FutureOr<void> build() {}

  Future<void> verifikasiCuti({
    required String idCuti,
    required String status,
    String? catatan,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(cutiRepositoryProvider).verifikasiCuti(
        idCuti: idCuti,
        status: status,
        catatan: catatan,
      );
      ref.invalidate(persetujuanCutiProvider);
    });
  }
}
