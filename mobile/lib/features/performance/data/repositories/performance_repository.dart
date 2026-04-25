import 'package:mahesa_mobile/core/network/dio_client.dart';
import '../models/lhkp_model.dart';
import '../models/review_rekan_model.dart';
import '../models/team_model.dart';

abstract class PerformanceRepository {
  Future<List<JenisKegiatanModel>> getPenugasanKegiatan();
  Future<List<LhkpModel>> getRiwayatLhkp({String? status});
  Future<void> submitLhkp({
    required DateTime tanggal,
    required List<LhkpDetailModel> details,
  });
  Future<List<TargetReviewModel>> getTargetReview();
  Future<void> submitReview({
    required String idTarget,
    required int skor,
    required String komentar,
  });
  Future<List<LhkpModel>> getPersetujuanLhkp();
  Future<void> verifikasiLhkp({
    required String idLhkp,
    required String status,
    String? catatan,
  });
  Future<void> createJenisKegiatan({required String nama, String? keterangan});
  Future<void> updateJenisKegiatan({required String id, required String nama, String? keterangan});
  Future<void> deleteJenisKegiatan(String id);
  Future<void> assignKegiatan({required String idJenisKegiatan, required List<String> idPegawais});
  Future<List<TeamMemberSummaryModel>> getTeamSummary();
}

class PerformanceRepositoryImpl implements PerformanceRepository {
  final DioClient client;

  PerformanceRepositoryImpl(this.client);

  @override
  Future<List<JenisKegiatanModel>> getPenugasanKegiatan() async {
    final response = await client.dio.get('/v1/lhkp/penugasan');
    return (response.data['data'] as List)
        .map((e) => JenisKegiatanModel.fromJson(e))
        .toList();
  }

  @override
  Future<List<LhkpModel>> getRiwayatLhkp({String? status}) async {
    final response = await client.dio.get('/v1/lhkp', queryParameters: {
      if (status != null) 'status': status,
    });
    return (response.data['data'] as List)
        .map((e) => LhkpModel.fromJson(e))
        .toList();
  }

  @override
  Future<void> submitLhkp({
    required DateTime tanggal,
    required List<LhkpDetailModel> details,
  }) async {
    await client.dio.post('/v1/lhkp', data: {
      'tanggal': tanggal.toIso8601String().split('T')[0],
      'details': details.map((e) => {
        'id_jenis_kegiatan': e.idJenisKegiatan,
        'jam_mulai': e.jamMulai,
        'jam_selesai': e.jamSelesai,
        'uraian': e.uraian,
      }).toList(),
    });
  }

  @override
  Future<List<TargetReviewModel>> getTargetReview() async {
    final response = await client.dio.get('/v1/review-rekan/target');
    return (response.data['data'] as List)
        .map((e) => TargetReviewModel.fromJson(e))
        .toList();
  }

  @override
  Future<void> submitReview({
    required String idTarget,
    required int skor,
    required String komentar,
  }) async {
    await client.dio.post('/v1/review-rekan', data: {
      'id_target': idTarget,
      'skor': skor,
      'komentar': komentar,
    });
  }

  @override
  Future<List<LhkpModel>> getPersetujuanLhkp() async {
    final response = await client.dio.get('/v1/lhkp/persetujuan');
    return (response.data['data'] as List)
        .map((e) => LhkpModel.fromJson(e))
        .toList();
  }

  @override
  Future<void> verifikasiLhkp({
    required String idLhkp,
    required String status,
    String? catatan,
  }) async {
    await client.dio.post('/v1/lhkp/verifikasi', data: {
      'id_laporan_harian': idLhkp,
      'status': status,
      'catatan': catatan,
    });
  }

  @override
  Future<void> createJenisKegiatan({required String nama, String? keterangan}) async {
    await client.dio.post('/v1/lhkp/jenis-kegiatan', data: {
      'nama': nama,
      'keterangan': keterangan,
    });
  }

  @override
  Future<void> updateJenisKegiatan({required String id, required String nama, String? keterangan}) async {
    await client.dio.put('/v1/lhkp/jenis-kegiatan/$id', data: {
      'nama': nama,
      'keterangan': keterangan,
    });
  }

  @override
  Future<void> deleteJenisKegiatan(String id) async {
    await client.dio.delete('/v1/lhkp/jenis-kegiatan/$id');
  }

  @override
  Future<void> assignKegiatan({required String idJenisKegiatan, required List<String> idPegawais}) async {
    await client.dio.post('/v1/lhkp/penugasan', data: {
      'id_jenis_kegiatan': idJenisKegiatan,
      'id_pegawais': idPegawais,
    });
  }

  @override
  Future<List<TeamMemberSummaryModel>> getTeamSummary() async {
    final response = await client.dio.get('/v1/performance/team-summary');
    return (response.data['data'] as List)
        .map((e) => TeamMemberSummaryModel.fromJson(e))
        .toList();
  }
}
