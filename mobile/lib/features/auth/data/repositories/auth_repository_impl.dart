import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_data_source.dart';
import '../models/auth_response.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;

  AuthRepositoryImpl(this.remoteDataSource);

  @override
  Future<AuthResponse> login(String identifier, String password, {String? deviceId}) {
    return remoteDataSource.login(identifier, password, deviceId: deviceId);
  }

  @override
  Future<dynamic> getMe() async {
    final response = await remoteDataSource.getMe();
    return response;
  }

  @override
  Future<void> updateFcmToken(String token) {
    return remoteDataSource.updateFcmToken(token);
  }
}
