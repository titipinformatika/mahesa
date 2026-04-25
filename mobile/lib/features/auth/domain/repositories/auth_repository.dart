import '../../data/models/auth_response.dart';

abstract class AuthRepository {
  Future<AuthResponse> login(String identifier, String password, {String? deviceId});
  Future<dynamic> getMe();
  Future<void> updateFcmToken(String token);
}
