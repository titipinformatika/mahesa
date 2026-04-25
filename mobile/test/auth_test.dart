import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'package:dio/dio.dart';
import 'package:mahesa_mobile/features/auth/data/datasources/auth_remote_data_source.dart';

import 'auth_test.mocks.dart';

@GenerateMocks([Dio])
void main() {
  late AuthRemoteDataSource dataSource;
  late MockDio mockDio;

  setUp(() {
    mockDio = MockDio();
    dataSource = AuthRemoteDataSource(mockDio);
  });

  group('AuthRemoteDataSource Test', () {
    test('login success should return AuthResponse', () async {
      // Arrange
      final responseData = {
        'status': 'success',
        'data': {
          'token': 'dummy_token',
          'peran': 'pegawai',
        }
      };
      
      when(mockDio.post(
        any,
        data: anyNamed('data'),
      )).thenAnswer((_) async => Response(
            data: responseData,
            statusCode: 200,
            requestOptions: RequestOptions(path: ''),
          ));

      // Act
      final result = await dataSource.login('test@example.com', 'password123');

      // Assert
      expect(result.token, 'dummy_token');
      expect(result.peran, 'pegawai');
      verify(mockDio.post(
        '/v1/otentikasi/masuk',
        data: {'email': 'test@example.com', 'password': 'password123'},
      )).called(1);
    });

    test('login failure should throw exception', () async {
      // Arrange
      when(mockDio.post(
        any,
        data: anyNamed('data'),
      )).thenThrow(DioException(
        requestOptions: RequestOptions(path: ''),
        response: Response(
          data: {'message': 'Invalid credentials'},
          statusCode: 401,
          requestOptions: RequestOptions(path: ''),
        ),
      ));

      // Act & Assert
      expect(
        () => dataSource.login('test@example.com', 'wrong_password'),
        throwsException,
      );
    });

    test('getMe success should return profile data', () async {
      // Arrange
      final responseData = {
        'status': 'success',
        'data': {
          'id': 'user123',
          'email': 'test@example.com',
          'peran': 'pegawai',
          'nama_lengkap': 'Test User',
          'nama_unit': 'Unit Test'
        }
      };

      when(mockDio.get('/v1/otentikasi/profil-saya'))
          .thenAnswer((_) async => Response(
                data: responseData,
                statusCode: 200,
                requestOptions: RequestOptions(path: ''),
              ));

      // Act
      final result = await dataSource.getMe();

      // Assert
      expect(result['status'], 'success');
      expect(result['data']['nama_lengkap'], 'Test User');
      expect(result['data']['nama_unit'], 'Unit Test');
      verify(mockDio.get('/v1/otentikasi/profil-saya')).called(1);
    });
  });
}
