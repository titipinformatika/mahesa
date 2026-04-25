import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/performance/data/models/lhkp_model.dart';
import 'package:mahesa_mobile/features/performance/data/repositories/performance_repository.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'performance_test.mocks.dart';

@GenerateMocks([DioClient, Dio])
void main() {
  late MockDioClient mockDioClient;
  late MockDio mockDio;
  late PerformanceRepositoryImpl repository;

  setUp(() {
    mockDioClient = MockDioClient();
    mockDio = MockDio();
    when(mockDioClient.dio).thenReturn(mockDio);
    repository = PerformanceRepositoryImpl(mockDioClient);
  });

  group('PerformanceRepository', () {
    test('getRiwayatLhkp returns list of LhkpModel', () async {
      final mockResponse = {
        'status': 'success',
        'data': [
          {
            'id': '1',
            'id_pegawai': 'p1',
            'tanggal': '2024-05-01',
            'status': 'disetujui',
            'jumlah_kegiatan': 3,
          }
        ]
      };

      when(mockDio.get('/v1/lhkp', queryParameters: anyNamed('queryParameters')))
          .thenAnswer((_) async => Response(
                data: mockResponse,
                statusCode: 200,
                requestOptions: RequestOptions(path: '/v1/lhkp'),
              ));

      final result = await repository.getRiwayatLhkp();

      expect(result, isA<List<LhkpModel>>());
      expect(result.first.status, 'disetujui');
    });

    test('submitLhkp calls POST with correct body', () async {
      when(mockDio.post('/v1/lhkp', data: anyNamed('data')))
          .thenAnswer((_) async => Response(
                data: {'status': 'success'},
                statusCode: 201,
                requestOptions: RequestOptions(path: '/v1/lhkp'),
              ));

      final details = [
        LhkpDetailModel(
          idJenisKegiatan: 'j1',
          jamMulai: '08:00',
          jamSelesai: '10:00',
          uraian: 'Test',
        )
      ];

      await repository.submitLhkp(tanggal: DateTime.now(), details: details);

      verify(mockDio.post('/v1/lhkp', data: argThat(predicate((data) {
        if (data is Map<String, dynamic>) {
          return data['details'] != null && (data['details'] as List).length == 1;
        }
        return false;
      }), named: 'data'))).called(1);
    });

    test('getPersetujuanLhkp returns list of LhkpModel', () async {
      final mockResponse = {
        'status': 'success',
        'data': [
          {'id': '1', 'id_pegawai': 'p1', 'tanggal': '2024-05-01', 'status': 'menunggu', 'jumlah_kegiatan': 2}
        ]
      };

      when(mockDio.get('/v1/lhkp/persetujuan')).thenAnswer((_) async => Response(
        data: mockResponse,
        statusCode: 200,
        requestOptions: RequestOptions(path: '/v1/lhkp/persetujuan'),
      ));

      final result = await repository.getPersetujuanLhkp();
      expect(result.first.status, 'menunggu');
    });

    test('verifikasiLhkp calls POST with correct data', () async {
      when(mockDio.post('/v1/lhkp/verifikasi', data: anyNamed('data'))).thenAnswer((_) async => Response(
        data: {'status': 'success'},
        statusCode: 200,
        requestOptions: RequestOptions(path: '/v1/lhkp/verifikasi'),
      ));

      await repository.verifikasiLhkp(idLhkp: '1', status: 'disetujui', catatan: 'Good');
      verify(mockDio.post('/v1/lhkp/verifikasi', data: argThat(predicate((data) {
        return data is Map && data['status'] == 'disetujui';
      }), named: 'data'))).called(1);
    });

    test('assignKegiatan calls POST with correct data', () async {
      when(mockDio.post('/v1/lhkp/penugasan', data: anyNamed('data'))).thenAnswer((_) async => Response(
        data: {'status': 'success'},
        statusCode: 200,
        requestOptions: RequestOptions(path: '/v1/lhkp/penugasan'),
      ));

      await repository.assignKegiatan(idJenisKegiatan: 'j1', idPegawais: ['p1', 'p2']);
      verify(mockDio.post('/v1/lhkp/penugasan', data: argThat(predicate((data) {
        return data is Map && (data['id_pegawais'] as List).length == 2;
      }), named: 'data'))).called(1);
    });
  });
}
