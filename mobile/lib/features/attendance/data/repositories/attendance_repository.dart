import 'dart:io';
import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';

class AttendanceRepository {
  final DioClient dioClient;

  AttendanceRepository(this.dioClient);

  Future<Response> clockInOut({
    required String jenisTitik,
    required double latitude,
    required double longitude,
    File? foto,
    String? catatan,
    bool isMockLocation = false,
  }) async {
    final formData = FormData.fromMap({
      'jenis_titik': jenisTitik,
      'latitude': latitude,
      'longitude': longitude,
      'catatan': catatan,
      'is_mock_location': isMockLocation,
      if (foto != null)
        'foto': await MultipartFile.fromFile(
          foto.path,
          filename: foto.path.split('/').last,
        ),
    });

    return dioClient.dio.post('/v1/absensi', data: formData);
  }

  Future<Response> getStatusHariIni() async {
    return dioClient.dio.get('/v1/absensi/hari-ini');
  }

  Future<Response> getRekapBulanan(int bulan, int tahun) async {
    return dioClient.dio.get(
      '/v1/absensi/rekap',
      queryParameters: {
        'bulan': bulan.toString(),
        'tahun': tahun.toString(),
      },
    );
  }

  Future<Response> getUnitDetail(String id) async {
    return dioClient.dio.get('/v1/organisasi/unit-kerja/$id');
  }

  Future<dynamic> getRingkasanPegawai(int bulan, int tahun) async {
    final response = await dioClient.dio.get(
      '/v1/absensi/ringkasan-pegawai',
      queryParameters: {
        'bulan': bulan.toString(),
        'tahun': tahun.toString(),
      },
    );
    return response.data;
  }
}
