import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/core/utils/secure_storage_helper.dart';
import 'package:mahesa_mobile/core/utils/biometric_service.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  final _storage = SecureStorageHelper();
  final _biometricService = BiometricService();

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  void _checkAuth() async {
    await Future.delayed(const Duration(seconds: 2));
    if (!mounted) return;

    final token = await _storage.getToken();
    if (token != null) {
      final biometricEnabled = await _storage.isBiometricEnabled();
      if (biometricEnabled && await _biometricService.isAvailable()) {
        final authenticated = await _biometricService.authenticate();
        if (authenticated && mounted) {
          context.go('/home');
          return;
        }
      } else {
        // Just go to home if biometric not enabled but token exists
        context.go('/home');
        return;
      }
    }
    
    context.go('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              'assets/splash/splash_logo.png',
              width: 150,
              height: 150,
            ),
            const SizedBox(height: 24),
            const Text(
              'MAHESA',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
