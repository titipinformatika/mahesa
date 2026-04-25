# 🏛️ Eksekusi Issue #13: [Mobile] Inisialisasi Proyek Flutter & Otorisasi

Panduan **langkah-demi-langkah** untuk menyiapkan proyek Flutter MAHESA, mengatur arsitektur, dan mengimplementasikan sistem login.

---

## 📚 Konteks

### Apa yang akan dibuat?
1. Inisialisasi proyek Flutter di folder `mobile/`.
2. Setup **Clean Architecture** (Feature-driven).
3. Integrasi library utama: `dio`, `riverpod`, `go_router`, `flutter_secure_storage`.
4. Halaman **Splash Screen** dan **Login Screen**.
5. Logika otentikasi: Simpan JWT ke *Secure Storage* dan otomatisasi *Bearer Token* di setiap request.

---

## 🛠️ Langkah 1: Inisialisasi Proyek & Dependensi

Buka terminal di root proyek, lalu jalankan:
```bash
# Buat proyek flutter (pastikan sudah install flutter SDK)
flutter create --org com.mahesa --project-name mahesa_app mobile

# Masuk ke folder mobile
cd mobile

# Tambahkan dependensi utama
flutter pub add dio flutter_riverpod go_router flutter_secure_storage intl google_fonts
flutter pub add --dev freezed json_serializable riverpod_generator build_runner
```

---

## 🛠️ Langkah 2: Struktur Folder (Clean Architecture)

Atur folder di `lib/` agar mengikuti pola berikut:
```text
lib/
├── core/
│   ├── constants/        # Endpoint API, Key constants
│   ├── network/          # Dio client & Interceptors
│   ├── theme/            # App colors & typography
│   └── utils/            # Secure storage helper, validators
├── features/
│   ├── auth/
│   │   ├── data/         # Repositories impl, Data sources (API)
│   │   ├── domain/       # Entities, Repository interfaces
│   │   └── presentation/ # Providers, Screens, Widgets
│   └── home/             # (Placeholder untuk fitur selanjutnya)
├── main.dart
└── app.dart              # Root widget & Router config
```

---

## 🛠️ Langkah 3: Implementasi Inti (Core)

### 3a. Secure Storage Helper: `lib/core/utils/secure_storage_helper.dart`
```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageHelper {
  static const _storage = FlutterSecureStorage();
  static const _keyToken = 'jwt_token';

  static Future<void> saveToken(String token) async {
    await _storage.write(key: _keyToken, value: token);
  }

  static Future<String?> getToken() async {
    return await _storage.read(key: _keyToken);
  }

  static Future<void> logout() async {
    await _storage.delete(key: _keyToken);
  }
}
```

### 3b. Dio Client & Interceptor: `lib/core/network/api_client.dart`
```dart
import 'package:dio/dio.dart';
import '../utils/secure_storage_helper.dart';

class ApiClient {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:3000/v1', // Ganti dengan IP server jika real device
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
    ),
  );

  ApiClient() {
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await SecureStorageHelper.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (e, handler) {
        if (e.response?.statusCode == 401) {
          // Logika logout otomatis jika token expired bisa diletakkan di sini
          SecureStorageHelper.logout();
        }
        return handler.next(e);
      },
    ));
  }
}
```

---

## 🛠️ Langkah 4: Implementasi Fitur Auth (Riverpod)

### 4a. Auth State & Provider: `lib/features/auth/presentation/providers/auth_provider.dart`
```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/api_client.dart';
import '../../../../core/utils/secure_storage_helper.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<bool>>((ref) {
  return AuthNotifier();
});

class AuthNotifier extends StateNotifier<AsyncValue<bool>> {
  AuthNotifier() : super(const AsyncValue.data(false));

  final _api = ApiClient().dio;

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.post('/otentikasi/masuk', data: {
        'email': email,
        'hash_kata_sandi': password, // Pastikan field sesuai dengan API backend
      });

      if (response.statusCode == 200) {
        final token = response.data['data']['token'];
        await SecureStorageHelper.saveToken(token);
        state = const AsyncValue.data(true);
      } else {
        throw Exception('Gagal masuk: ${response.data['message']}');
      }
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> cekStatus() async {
    final token = await SecureStorageHelper.getToken();
    state = AsyncValue.data(token != null);
  }
}
```

---

## 🛠️ Langkah 5: Antarmuka Pengguna (UI)

### 5a. Splash Screen: `lib/features/auth/presentation/screens/splash_screen.dart`
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () async {
      await ref.read(authProvider.notifier).cekStatus();
      final loggedIn = ref.read(authProvider).value ?? false;
      if (mounted) {
        context.go(loggedIn ? '/home' : '/login');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('🏛️', style: TextStyle(fontSize: 80)),
            SizedBox(height: 20),
            Text('MAHESA', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 4)),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
```

### 5b. Login Screen: `lib/features/auth/presentation/screens/login_screen.dart`
```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

class LoginScreen extends ConsumerWidget {
  LoginScreen({super.key});

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);

    ref.listen(authProvider, (previous, next) {
      next.whenOrNull(
        data: (loggedIn) {
          if (loggedIn) context.go('/home');
        },
        error: (e, s) => ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        ),
      );
    });

    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Selamat Datang', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
            const Text('Silakan masuk ke akun MAHESA Anda', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 40),
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Kata Sandi', border: OutlineInputBorder()),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: authState.isLoading 
                ? null 
                : () => ref.read(authProvider.notifier).login(_emailController.text, _passwordController.text),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
              child: authState.isLoading 
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('MASUK'),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## 🧪 Langkah 6: Pengujian

1. **Jalankan Aplikasi**: `flutter run`.
2. **Cek Splash**: Aplikasi harus menampilkan logo 🏛️ selama 2 detik.
3. **Cek Login**:
   - Coba login dengan kredensial salah -> Muncul SnackBar error.
   - Coba login dengan kredensial benar (sesuai database seeder) -> Token tersimpan dan pindah ke halaman Home (buat halaman dummy `/home`).
4. **Cek Persistensi**: Tutup aplikasi (kill process) lalu buka kembali -> Harus langsung masuk ke Home tanpa login lagi (jika token masih ada).

---

> [!TIP]
> Pastikan backend sudah berjalan dan endpoint `/v1/otentikasi/masuk` bisa diakses dari emulator/device (gunakan IP `10.0.2.2` untuk emulator Android ke localhost).
