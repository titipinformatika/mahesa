import 'package:dio/dio.dart';
import '../models/auth_response.dart';

class AuthRemoteDataSource {
  final Dio dio;

  AuthRemoteDataSource(this.dio);

  Future<AuthResponse> login(String identifier, String password, {String? deviceId}) async {
    try {
      final response = await dio.post(
        '/v1/otentikasi/masuk',
        data: {
          'identifier': identifier,
          'password': password,
          'device_id': deviceId,
        },
      );
      return AuthResponse.fromJson(response.data['data']);
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Login failed');
    }
  }

  Future<dynamic> getMe() async {
    try {
      final response = await dio.get('/v1/otentikasi/profil-saya');
      return response.data;
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to get profile');
    }
  }

  Future<void> updateFcmToken(String token) async {
    try {
      await dio.put(
        '/v1/otentikasi/token-fcm',
        data: {'token_fcm': token},
      );
    } on DioException catch (e) {
      throw Exception(e.response?.data['message'] ?? 'Failed to update FCM token');
    }
  }
}
