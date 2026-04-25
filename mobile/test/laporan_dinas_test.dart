import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dio/dio.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/performance/data/repositories/laporan_dinas_repository.dart';
import 'package:mahesa_mobile/features/performance/data/models/laporan_dinas_model.dart';
import 'package:mahesa_mobile/core/utils/secure_storage_helper.dart';

import 'laporan_dinas_test.mocks.dart';

@GenerateMocks([Dio, SecureStorageHelper])
void main() {
  late LaporanDinasRepository repository;
  late MockDio mockDio;
  late MockSecureStorageHelper mockStorage;
  late DioClient dioClient;

  setUp(() {
    mockDio = MockDio();
    mockStorage = MockSecureStorageHelper();
    
    when(mockDio.options).thenReturn(BaseOptions());
    when(mockDio.interceptors).thenReturn(Interceptors());

    dioClient = DioClient(dio: mockDio, storage: mockStorage);
    repository = LaporanDinasRepository(dioClient);
  });

  group('LaporanDinasRepository Test', () {
    test('getHistory success should return list of LaporanDinasModel', () async {
      final responseData = {
        'status': 'success',
        'data': [
          {
            'id': '1',
            'idUnitKerja': 'U1',
            'idPimpinan': 'P1',
            'bulan': 4,
            'tahun': 2026,
            'totalPegawai': 10,
            'totalHadir': 8,
            'totalCuti': 1,
            'totalDl': 1,
            'status': 'dikirim',
            'dibuatPada': '2026-04-24T10:00:00Z',
          }
        ]
      };
      
      when(mockDio.get(any)).thenAnswer((_) async => Response(
        data: responseData,
        statusCode: 200,
        requestOptions: RequestOptions(path: ''),
      ));

      final result = await repository.getHistory();

      expect(result.length, 1);
      expect(result[0].bulan, 4);
      verify(mockDio.get('/v1/laporan/dinas')).called(1);
    });

    test('getSummary success should return LaporanSummaryModel', () async {
      final responseData = {
        'status': 'success',
        'data': {
          'periode': '4-2026',
          'summary': {
            'total_pegawai': 10,
            'total_hadir': 8,
            'total_cuti': 1,
            'total_dl': 1,
          }
        }
      };
      
      when(mockDio.get(any, queryParameters: anyNamed('queryParameters'))).thenAnswer((_) async => Response(
        data: responseData,
        statusCode: 200,
        requestOptions: RequestOptions(path: ''),
      ));

      final result = await repository.getSummary(4, 2026);

      expect(result.totalPegawai, 10);
      expect(result.periode, '4-2026');
    });

    test('submitLaporan success should return LaporanDinasModel', () async {
      final responseData = {
        'status': 'success',
        'data': {
          'id': '1',
          'idUnitKerja': 'U1',
          'idPimpinan': 'P1',
          'bulan': 4,
          'tahun': 2026,
          'totalPegawai': 10,
          'totalHadir': 8,
          'totalCuti': 1,
          'totalDl': 1,
          'status': 'dikirim',
          'dibuatPada': '2026-04-24T10:00:00Z',
        }
      };
      
      when(mockDio.post(any, data: anyNamed('data'))).thenAnswer((_) async => Response(
        data: responseData,
        statusCode: 200,
        requestOptions: RequestOptions(path: ''),
      ));

      final result = await repository.submitLaporan({
        'bulan': 4,
        'tahun': 2026,
        'totalPegawai': 10,
        'totalHadir': 8,
        'totalCuti': 1,
        'totalDl': 1,
      });

      expect(result.status, 'dikirim');
      verify(mockDio.post('/v1/laporan/dinas', data: anyNamed('data'))).called(1);
    });
  });
}
