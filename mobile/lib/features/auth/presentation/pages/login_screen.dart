import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:local_auth/local_auth.dart';
import '../providers/auth_provider.dart';
import 'package:mahesa_mobile/core/utils/biometric_service.dart';
import 'package:mahesa_mobile/core/utils/secure_storage_helper.dart';
import 'package:mahesa_mobile/core/utils/device_info_helper.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _identifierController = TextEditingController();
  bool _isBiometricAvailable = false;
  IconData _biometricIcon = Icons.fingerprint;
  String _biometricLabel = 'Biometrik';
  
  final _biometricService = BiometricService();
  final _storage = SecureStorageHelper();

  @override
  void initState() {
    super.initState();
    _checkBiometrics();
  }

  Future<void> _checkBiometrics() async {
    final available = await _biometricService.isAvailable();
    if (!available) return;

    final biometrics = await _biometricService.getAvailableBiometrics();
    final enabled = await _storage.isBiometricEnabled();
    final token = await _storage.getToken();

    setState(() {
      _isBiometricAvailable = available && enabled && token != null;
      if (biometrics.contains(BiometricType.face)) {
        _biometricIcon = Icons.face;
        _biometricLabel = 'Face ID';
      } else if (biometrics.contains(BiometricType.fingerprint)) {
        _biometricIcon = Icons.fingerprint;
        _biometricLabel = 'Sidik Jari';
      }
    });
  }

  Future<void> _handleBiometricLogin() async {
    final authenticated = await _biometricService.authenticate();
    if (authenticated && mounted) {
      context.go('/home');
    }
  }

  Future<void> _handleLogin() async {
    final messenger = ScaffoldMessenger.of(context);
    final identifier = _identifierController.text.trim();

    if (identifier.isEmpty) {
      messenger.showSnackBar(
        const SnackBar(content: Text('NIP / NIK wajib diisi')),
      );
      return;
    }

    final deviceId = await DeviceInfoHelper.getDeviceId();

    await ref.read(authControllerProvider.notifier).login(
      identifier,
      '', // Kirim password kosong, backend akan bypass untuk pegawai
      deviceId: deviceId,
    );

    if (!mounted) return;

    final state = ref.read(authControllerProvider);
    if (state.hasError) {
      messenger.showSnackBar(
        SnackBar(
          content: Text(state.error.toString().replaceAll('Exception: ', '')),
          backgroundColor: Colors.redAccent,
        ),
      );
    } else {
      await _storage.setBiometricEnabled(true);
      if (context.mounted) {
        context.go('/home');
      }
    }
  }

  @override
  void dispose() {
    _identifierController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLoading = ref.watch(authControllerProvider).isLoading;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1565C0), Color(0xFF0D47A1)],
          ),
        ),
        child: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight,
                  ),
                  child: IntrinsicHeight(
                    child: Column(
                      children: [
                        const SizedBox(height: 60),
              // Logo & Title
              Hero(
                tag: 'app_logo',
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.school, size: 80, color: Colors.white),
                ),
              ),
              const SizedBox(height: 20),
              const Text(
                'MAHESA',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 2,
                ),
              ),
              const Text(
                'Manajemen Pegawai Dinas Pendidikan',
                style: TextStyle(color: Colors.white70, fontSize: 14),
              ),
              const Spacer(),
              
              // Login Form Card
              Container(
                padding: const EdgeInsets.all(32),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(40),
                    topRight: Radius.circular(40),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Selamat Datang',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0D47A1),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Silakan masuk menggunakan NIP atau NIK Anda',
                      style: TextStyle(color: Colors.grey, fontSize: 14),
                    ),
                    const SizedBox(height: 32),
                    
                    // NIP/NIK Input
                    TextField(
                      controller: _identifierController,
                      decoration: InputDecoration(
                        labelText: 'NIP / NIK',
                        hintText: 'Masukkan NIP atau NIK',
                        prefixIcon: const Icon(Icons.person_outline),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: BorderSide(color: Colors.grey.shade300),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    
                    // Login Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed: isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1565C0),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 4,
                          shadowColor: Colors.blue.withOpacity(0.5),
                        ),
                        child: isLoading
                            ? const CircularProgressIndicator(color: Colors.white)
                            : const Text(
                                'MASUK',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1.2,
                                ),
                              ),
                      ),
                    ),
                    
                    // Biometric Option
                    if (_isBiometricAvailable) ...[
                      const SizedBox(height: 24),
                      Center(
                        child: Column(
                          children: [
                            const Text(
                              'Atau login cepat dengan',
                              style: TextStyle(color: Colors.grey, fontSize: 12),
                            ),
                            const SizedBox(height: 12),
                            InkWell(
                              onTap: _handleBiometricLogin,
                              borderRadius: BorderRadius.circular(50),
                              child: Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.blue.shade100),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  _biometricIcon,
                                  size: 40,
                                  color: const Color(0xFF1565C0),
                                ),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _biometricLabel,
                              style: const TextStyle(
                                color: Color(0xFF1565C0),
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ],
          ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
