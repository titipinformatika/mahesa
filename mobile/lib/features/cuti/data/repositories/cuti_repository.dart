import 'dart:io';
import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';
import '../models/cuti_model.dart';
import '../models/saldo_cuti_model.dart';

abstract class CutiRepository {
  Future<List<SaldoCutiModel>> getSaldoCuti();
  Future<List<CutiModel>> getRiwayatCuti();
  Future<List<JenisCutiModel>> getJenisCuti();
  Future<void> ajukanCuti({
    required String idJenisCuti,
    required DateTime tanggalMulai,
    required DateTime tanggalSelesai,
    required String alasan,
    File? dokumen,
  });
  Future<List<CutiModel>> getPersetujuanCuti();
  Future<void> verifikasiCuti({
    required String idCuti,
    required String status,
    String? catatan,
  });
}

class CutiRepositoryImpl implements CutiRepository {
  final DioClient client;

  CutiRepositoryImpl(this.client);

  @override
  Future<List<SaldoCutiModel>> getSaldoCuti() async {
    final response = await client.dio.get('/v1/cuti/saldo');
    return (response.data['data'] as List)
        .map((e) => SaldoCutiModel.fromJson(e))
        .toList();
  }

  @override
  Future<List<CutiModel>> getRiwayatCuti() async {
    final response = await client.dio.get('/v1/cuti');
    return (response.data['data'] as List)
        .map((e) => CutiModel.fromJson(e))
        .toList();
  }

  @override
  Future<List<JenisCutiModel>> getJenisCuti() async {
    final response = await client.dio.get('/v1/cuti/jenis-cuti');
    return (response.data['data'] as List)
        .map((e) => JenisCutiModel.fromJson(e))
        .toList();
  }

  @override
  Future<void> ajukanCuti({
    required String idJenisCuti,
    required DateTime tanggalMulai,
    required DateTime tanggalSelesai,
    required String alasan,
    File? dokumen,
  }) async {
    final formData = FormData.fromMap({
      'id_jenis_cuti': idJenisCuti,
      'tanggal_mulai': tanggalMulai.toIso8601String().split('T')[0],
      'tanggal_selesai': tanggalSelesai.toIso8601String().split('T')[0],
      'alasan': alasan,
      if (dokumen != null)
        'dokumen': await MultipartFile.fromFile(
          dokumen.path,
          filename: dokumen.path.split('/').last,
        ),
    });

    await client.dio.post('/v1/cuti', data: formData);
  }

  @override
  Future<List<CutiModel>> getPersetujuanCuti() async {
    final response = await client.dio.get('/v1/cuti/persetujuan');
    return (response.data['data'] as List)
        .map((e) => CutiModel.fromJson(e))
        .toList();
  }

  @override
  Future<void> verifikasiCuti({
    required String idCuti,
    required String status,
    String? catatan,
  }) async {
    await client.dio.post('/v1/cuti/verifikasi', data: {
      'id_cuti': idCuti,
      'status': status,
      'catatan': catatan,
    });
  }
}
