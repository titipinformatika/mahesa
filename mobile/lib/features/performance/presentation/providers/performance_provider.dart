import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/lhkp_model.dart';
import '../../data/models/review_rekan_model.dart';
import '../../data/models/team_model.dart';
import '../../data/repositories/performance_repository.dart';
import '../../../../core/network/dio_client.dart';

part 'performance_provider.g.dart';

@riverpod
PerformanceRepository performanceRepository(Ref ref) {
  final client = ref.watch(dioClientProvider);
  return PerformanceRepositoryImpl(client);
}

@riverpod
Future<List<JenisKegiatanModel>> penugasanKegiatan(Ref ref) {
  return ref.watch(performanceRepositoryProvider).getPenugasanKegiatan();
}

@riverpod
Future<List<LhkpModel>> riwayatLhkp(Ref ref, {String? status}) {
  return ref.watch(performanceRepositoryProvider).getRiwayatLhkp(status: status);
}

@riverpod
Future<List<TargetReviewModel>> targetReview(Ref ref) {
  return ref.watch(performanceRepositoryProvider).getTargetReview();
}

@riverpod
Future<List<LhkpModel>> persetujuanLhkp(Ref ref) {
  return ref.watch(performanceRepositoryProvider).getPersetujuanLhkp();
}

@riverpod
Future<List<TeamMemberSummaryModel>> teamSummary(Ref ref) {
  return ref.watch(performanceRepositoryProvider).getTeamSummary();
}

@riverpod
class LhkpAction extends _$LhkpAction {
  @override
  FutureOr<void> build() {}

  Future<void> submitLhkp({
    required DateTime tanggal,
    required List<LhkpDetailModel> details,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(performanceRepositoryProvider).submitLhkp(
        tanggal: tanggal,
        details: details,
      );
      ref.invalidate(riwayatLhkpProvider);
    });
  }
}

@riverpod
class ReviewAction extends _$ReviewAction {
  @override
  FutureOr<void> build() {}

  Future<void> submitReview({
    required String idTarget,
    required int skor,
    required String komentar,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(performanceRepositoryProvider).submitReview(
        idTarget: idTarget,
        skor: skor,
        komentar: komentar,
      );
      ref.invalidate(targetReviewProvider);
    });
  }
}

@riverpod
class PimpinanPerformanceAction extends _$PimpinanPerformanceAction {
  @override
  FutureOr<void> build() {}

  Future<void> verifikasiLhkp({
    required String idLhkp,
    required String status,
    String? catatan,
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(performanceRepositoryProvider).verifikasiLhkp(
        idLhkp: idLhkp,
        status: status,
        catatan: catatan,
      );
      ref.invalidate(persetujuanLhkpProvider);
    });
  }

  Future<void> createJenisKegiatan({required String nama, String? keterangan}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(performanceRepositoryProvider).createJenisKegiatan(nama: nama, keterangan: keterangan);
      ref.invalidate(penugasanKegiatanProvider);
    });
  }

  Future<void> assignKegiatan({required String idJenisKegiatan, required List<String> idPegawais}) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      await ref.read(performanceRepositoryProvider).assignKegiatan(idJenisKegiatan: idJenisKegiatan, idPegawais: idPegawais);
    });
  }
}
