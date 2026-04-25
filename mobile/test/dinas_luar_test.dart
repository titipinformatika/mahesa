import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dio/dio.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/dinas_luar/data/repositories/dinas_luar_repository.dart';
import 'package:mahesa_mobile/core/utils/secure_storage_helper.dart';

import 'dinas_luar_test.mocks.dart';

@GenerateMocks([DioClient, Dio, SecureStorageHelper])
void main() {
  late DinasLuarRepository repository;
  late MockDioClient mockDioClient;
  late MockDio mockDio;

  setUp(() {
    mockDioClient = MockDioClient();
    mockDio = MockDio();
    when(mockDioClient.dio).thenReturn(mockDio);
    repository = DinasLuarRepository(mockDioClient);
  });

  group('DinasLuarRepository', () {
    test('getSkema returns success data', () async {
      final responseData = {
        'status': 'success',
        'data': [
          {'id': '1', 'nama': 'DL Dalam Kota'}
        ]
      };

      when(mockDio.get('/v1/dinas-luar/skema'))
          .thenAnswer((_) async => Response(
                data: responseData,
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      final result = await repository.getSkema();

      expect(result.data['status'], 'success');
      expect((result.data['data'] as List).length, 1);
      verify(mockDio.get('/v1/dinas-luar/skema')).called(1);
    });

    test('getRiwayat returns success data', () async {
      final responseData = {
        'status': 'success',
        'data': [
          {'id': '1', 'tujuan': 'Kantor Pusat', 'status': 'disetujui'}
        ]
      };

      when(mockDio.get('/v1/dinas-luar'))
          .thenAnswer((_) async => Response(
                data: responseData,
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      final result = await repository.getRiwayat();

      expect(result.data['status'], 'success');
      expect((result.data['data'] as List)[0]['tujuan'], 'Kantor Pusat');
      verify(mockDio.get('/v1/dinas-luar')).called(1);
    });

    test('ajukanDL posts data correctly', () async {
      final responseData = {
        'status': 'success',
        'data': {'id': '1'}
      };

      when(mockDio.post('/v1/dinas-luar', data: anyNamed('data')))
          .thenAnswer((_) async => Response(
                data: responseData,
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      final result = await repository.ajukanDL(
        idSkema: '1',
        tujuan: 'Dinas Luar Test',
        tanggalMulai: '2026-05-01',
        tanggalSelesai: '2026-05-02',
        keterangan: 'Rapat Koordinasi',
      );

      expect(result.data['status'], 'success');
      verify(mockDio.post(
        '/v1/dinas-luar',
        data: {
          'id_skema_dinas_luar': '1',
          'tujuan': 'Dinas Luar Test',
          'tanggal_mulai': '2026-05-01',
          'tanggal_selesai': '2026-05-02',
          'keterangan': 'Rapat Koordinasi',
        },
      )).called(1);
    });

    test('pingLokasi posts coordinates correctly', () async {
      final responseData = {
        'status': 'success',
        'data': {'id': 'log1'}
      };

      when(mockDio.post('/v1/dinas-luar/lokasi', data: anyNamed('data')))
          .thenAnswer((_) async => Response(
                data: responseData,
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      final result = await repository.pingLokasi(
        idPengajuanDL: 'dl123',
        latitude: -6.12345,
        longitude: 106.12345,
      );

      expect(result.data['status'], 'success');
      verify(mockDio.post(
        '/v1/dinas-luar/lokasi',
        data: {
          'id_pengajuan_dl': 'dl123',
          'latitude': -6.12345,
          'longitude': 106.12345,
        },
      )).called(1);
    });
  });
}
