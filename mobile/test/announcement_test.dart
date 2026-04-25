import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dio/dio.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/announcement/data/repositories/announcement_repository.dart';
import 'package:mahesa_mobile/features/announcement/data/models/announcement_model.dart';
import 'package:mahesa_mobile/core/utils/secure_storage_helper.dart';

import 'announcement_test.mocks.dart';

@GenerateMocks([Dio, SecureStorageHelper])
void main() {
  late AnnouncementRepository repository;
  late MockDio mockDio;
  late MockSecureStorageHelper mockStorage;
  late DioClient dioClient;

  setUp(() {
    mockDio = MockDio();
    mockStorage = MockSecureStorageHelper();
    
    // Stub options to prevent MissingStubError
    when(mockDio.options).thenReturn(BaseOptions());
    when(mockDio.interceptors).thenReturn(Interceptors());

    dioClient = DioClient(dio: mockDio, storage: mockStorage);
    repository = AnnouncementRepository(dioClient);
  });

  group('AnnouncementRepository Test', () {
    test('getAnnouncements success should return list of AnnouncementModel', () async {
      // Arrange
      final responseData = {
        'status': 'success',
        'data': [
          {
            'id': '1',
            'judul': 'Test Judul',
            'konten': 'Test Konten',
            'tanggalBerlaku': '2026-04-24',
            'tanggalBerakhir': '2026-04-25',
            'aktif': true,
            'dibuatPada': '2026-04-24T10:00:00Z',
          }
        ]
      };
      
      when(mockDio.get(any)).thenAnswer((_) async => Response(
        data: responseData,
        statusCode: 200,
        requestOptions: RequestOptions(path: ''),
      ));

      // Act
      final result = await repository.getAnnouncements();

      // Assert
      expect(result, isA<List<AnnouncementModel>>());
      expect(result.length, 1);
      expect(result[0].judul, 'Test Judul');
      verify(mockDio.get('/pengumuman')).called(1);
    });

    test('getAnnouncementDetail success should return AnnouncementModel', () async {
      // Arrange
      final responseData = {
        'status': 'success',
        'data': {
          'id': '1',
          'judul': 'Test Judul',
          'konten': 'Test Konten',
          'tanggalBerlaku': '2026-04-24',
          'tanggalBerakhir': '2026-04-25',
          'aktif': true,
          'dibuatPada': '2026-04-24T10:00:00Z',
        }
      };
      
      when(mockDio.get(any)).thenAnswer((_) async => Response(
        data: responseData,
        statusCode: 200,
        requestOptions: RequestOptions(path: ''),
      ));

      // Act
      final result = await repository.getAnnouncementDetail('1');

      // Assert
      expect(result.id, '1');
      expect(result.judul, 'Test Judul');
      verify(mockDio.get('/pengumuman/1')).called(1);
    });
  });
}
