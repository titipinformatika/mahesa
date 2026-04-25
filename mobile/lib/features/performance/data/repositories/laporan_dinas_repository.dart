import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/performance/data/models/laporan_dinas_model.dart';

class LaporanDinasRepository {
  final DioClient _dioClient;

  LaporanDinasRepository(this._dioClient);

  Future<List<LaporanDinasModel>> getHistory() async {
    try {
      final response = await _dioClient.dio.get('/v1/laporan/dinas');
      final List data = response.data['data'];
      return data.map((json) => LaporanDinasModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<LaporanSummaryModel> getSummary(int bulan, int tahun) async {
    try {
      final response = await _dioClient.dio.get(
        '/v1/laporan/dinas',
        queryParameters: {
          'bulan': bulan.toString(),
          'tahun': tahun.toString(),
        },
      );
      return LaporanSummaryModel.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  Future<LaporanDinasModel> submitLaporan(Map<String, dynamic> data) async {
    try {
      final response = await _dioClient.dio.post('/v1/laporan/dinas', data: data);
      return LaporanDinasModel.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }
}
