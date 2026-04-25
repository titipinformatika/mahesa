import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../../../core/network/notification_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/secure_storage_helper.dart';
import '../../../../core/cache/cache_service.dart';
import '../../../../core/network/connectivity_service.dart';
import '../../data/datasources/auth_remote_data_source.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';

part 'auth_provider.g.dart';

@riverpod
SecureStorageHelper secureStorageHelper(Ref ref) {
  return SecureStorageHelper();
}

@riverpod
Dio dio(Ref ref) {
  final storage = ref.watch(secureStorageHelperProvider);
  final client = DioClient(dio: Dio(), storage: storage);
  return client.dio;
}

@riverpod
AuthRemoteDataSource authRemoteDataSource(Ref ref) {
  final dio = ref.watch(dioProvider);
  return AuthRemoteDataSource(dio);
}

@riverpod
AuthRepository authRepository(Ref ref) {
  final dataSource = ref.watch(authRemoteDataSourceProvider);
  return AuthRepositoryImpl(dataSource);
}

@riverpod
Future<dynamic> userProfile(Ref ref) async {
  final repo = ref.watch(authRepositoryProvider);
  final cache = ref.watch(cacheServiceProvider);
  final isOnline = ref.watch(isOnlineProvider);

  if (!isOnline) {
    final cached = cache.getCachedProfile();
    if (cached != null) return cached;
  }

  try {
    final response = await repo.getMe();
    final data = response['data'];
    await cache.cacheProfile(data as Map<String, dynamic>);
    return data;
  } catch (e) {
    final response = cache.getCachedProfile();
    if (response != null) return response;
    rethrow;
  }
}

@riverpod
class AuthController extends _$AuthController {
  @override
  AsyncValue<void> build() {
    return const AsyncValue.data(null);
  }

  Future<void> login(String identifier, String password, {String? deviceId}) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(authRepositoryProvider);
      final response = await repository.login(identifier, password, deviceId: deviceId);
      await ref.read(secureStorageHelperProvider).saveToken(response.token);
      
      // Update FCM token
      try {
        final fcmToken = await NotificationService().getToken();
        if (fcmToken != null) {
          await repository.updateFcmToken(fcmToken);
        }
      } catch (e) {
        debugPrint('Failed to update FCM token: $e');
      }
    });
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    await ref.read(secureStorageHelperProvider).deleteToken();
    state = const AsyncValue.data(null);
  }
}
