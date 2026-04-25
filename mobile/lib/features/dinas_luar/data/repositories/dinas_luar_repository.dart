import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';

class DinasLuarRepository {
  final DioClient dioClient;

  DinasLuarRepository(this.dioClient);

  Future<Response> getSkema() async {
    return dioClient.dio.get('/v1/dinas-luar/skema');
  }

  Future<Response> getRiwayat() async {
    return dioClient.dio.get('/v1/dinas-luar');
  }

  Future<Response> getSemuaRiwayat({bool onlyWaiting = false}) async {
    return dioClient.dio.get('/v1/dinas-luar', queryParameters: {
      'all': 'true',
      if (onlyWaiting) 'status': 'menunggu',
    });
  }

  Future<Response> getPetaLangsung() async {
    return dioClient.dio.get('/v1/dinas-luar/peta-langsung');
  }

  Future<Response> ajukanDL({
    required String idSkema,
    required String tujuan,
    required String tanggalMulai,
    required String tanggalSelesai,
    String? keterangan,
  }) async {
    return dioClient.dio.post(
      '/v1/dinas-luar',
      data: {
        'id_skema_dinas_luar': idSkema,
        'tujuan': tujuan,
        'tanggal_mulai': tanggalMulai,
        'tanggal_selesai': tanggalSelesai,
        if (keterangan != null && keterangan.isNotEmpty) 'keterangan': keterangan,
      },
    );
  }

  Future<Response> setujuiDL({
    required String id,
    required String status,
    String? catatan,
  }) async {
    return dioClient.dio.put(
      '/v1/dinas-luar/$id/persetujuan',
      data: {
        'status': status,
        'catatan': catatan,
      },
    );
  }

  Future<Response> pingLokasi({
    required String idPengajuanDL,
    required double latitude,
    required double longitude,
  }) async {
    return dioClient.dio.post(
      '/v1/dinas-luar/lokasi',
      data: {
        'id_pengajuan_dl': idPengajuanDL,
        'latitude': latitude,
        'longitude': longitude,
      },
    );
  }
}

final dinasLuarRepositoryProvider = Provider<DinasLuarRepository>((ref) {
  final dioClient = ref.watch(dioClientProvider);
  return DinasLuarRepository(dioClient);
});
