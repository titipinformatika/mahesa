import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/cuti/data/models/cuti_model.dart';
import 'package:mahesa_mobile/features/cuti/data/models/saldo_cuti_model.dart';
import 'package:mahesa_mobile/features/cuti/data/repositories/cuti_repository.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';

import 'cuti_test.mocks.dart';

@GenerateMocks([DioClient, Dio])
void main() {
  late MockDioClient mockDioClient;
  late MockDio mockDio;
  late CutiRepositoryImpl repository;

  setUp(() {
    mockDioClient = MockDioClient();
    mockDio = MockDio();
    when(mockDioClient.dio).thenReturn(mockDio);
    repository = CutiRepositoryImpl(mockDioClient);
  });

  group('CutiRepository', () {
    test('getSaldoCuti returns list of SaldoCutiModel', () async {
      final mockResponse = {
        'status': 'success',
        'data': [
          {
            'id': '1',
            'id_jenis_cuti': 'j1',
            'nama_jenis_cuti': 'Cuti Tahunan',
            'total': 12,
            'terpakai': 2,
            'sisa': 10,
          }
        ]
      };

      when(mockDio.get('/v1/cuti/saldo')).thenAnswer(
        (_) async => Response(
          data: mockResponse,
          statusCode: 200,
          requestOptions: RequestOptions(path: '/v1/cuti/saldo'),
        ),
      );

      final result = await repository.getSaldoCuti();

      expect(result, isA<List<SaldoCutiModel>>());
      expect(result.first.namaJenisCuti, 'Cuti Tahunan');
      expect(result.first.sisa, 10);
    });

    test('getRiwayatCuti returns list of CutiModel', () async {
      final mockResponse = {
        'status': 'success',
        'data': [
          {
            'id': 'c1',
            'id_pegawai': 'p1',
            'id_jenis_cuti': 'j1',
            'nama_jenis_cuti': 'Cuti Tahunan',
            'tanggal_mulai': '2024-05-01',
            'tanggal_selesai': '2024-05-03',
            'total_hari': 3,
            'alasan': 'Liburan',
            'status': 'menunggu',
          }
        ]
      };

      when(mockDio.get('/v1/cuti')).thenAnswer(
        (_) async => Response(
          data: mockResponse,
          statusCode: 200,
          requestOptions: RequestOptions(path: '/v1/cuti'),
        ),
      );

      final result = await repository.getRiwayatCuti();

      expect(result, isA<List<CutiModel>>());
      expect(result.first.alasan, 'Liburan');
    });

    test('ajukanCuti calls POST with correct data', () async {
      when(mockDio.post(any, data: anyNamed('data'))).thenAnswer(
        (_) async => Response(
          data: {'status': 'success'},
          statusCode: 201,
          requestOptions: RequestOptions(path: '/v1/cuti'),
        ),
      );

      await repository.ajukanCuti(
        idJenisCuti: 'j1',
        tanggalMulai: DateTime(2024, 5, 1),
        tanggalSelesai: DateTime(2024, 5, 3),
        alasan: 'Liburan',
      );

      verify(mockDio.post('/v1/cuti', data: anyNamed('data'))).called(1);
    });
  });
}
