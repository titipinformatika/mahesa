import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../utils/secure_storage_helper.dart';

class DioClient {
  final Dio dio;
  final SecureStorageHelper storage;

  DioClient({required this.dio, required this.storage}) {
    dio.options.baseUrl = 'http://10.174.195.247:3000'; // Update with your computer local IP
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storage.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          if (e.response?.statusCode == 401) {
            await storage.deleteToken();
            // Handle redirect to login if necessary
            // In a real app, you'd use a navigator key or a provider to trigger navigation
          }
          return handler.next(e);
        },
      ),
    );
  }
}

final dioProvider = Provider((ref) => Dio());
final storageProvider = Provider((ref) => SecureStorageHelper());

final dioClientProvider = Provider((ref) {
  return DioClient(
    dio: ref.read(dioProvider),
    storage: ref.read(storageProvider),
  );
});
