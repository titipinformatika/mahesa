import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:local_auth/local_auth.dart';
import 'package:mahesa_mobile/core/utils/biometric_service.dart';
import 'package:flutter/services.dart';

@GenerateMocks([LocalAuthentication])
import 'biometric_service_test.mocks.dart';

void main() {
  late MockLocalAuthentication mockAuth;
  late BiometricService biometricService;

  setUp(() {
    mockAuth = MockLocalAuthentication();
    biometricService = BiometricService(auth: mockAuth);
  });

  group('BiometricService', () {
    test('isAvailable returns true when supported and can check biometrics', () async {
      when(mockAuth.canCheckBiometrics).thenAnswer((_) async => true);
      when(mockAuth.isDeviceSupported()).thenAnswer((_) async => true);

      final result = await biometricService.isAvailable();
      expect(result, isTrue);
    });

    test('isAvailable returns false when not supported', () async {
      when(mockAuth.canCheckBiometrics).thenAnswer((_) async => true);
      when(mockAuth.isDeviceSupported()).thenAnswer((_) async => false);

      final result = await biometricService.isAvailable();
      expect(result, isFalse);
    });

    test('authenticate returns true on success', () async {
      when(mockAuth.authenticate(
        localizedReason: anyNamed('localizedReason'),
        options: anyNamed('options'),
      )).thenAnswer((_) async => true);

      final result = await biometricService.authenticate();
      expect(result, isTrue);
    });

    test('authenticate returns false on PlatformException', () async {
      when(mockAuth.authenticate(
        localizedReason: anyNamed('localizedReason'),
        options: anyNamed('options'),
      )).thenThrow(PlatformException(code: 'error'));

      final result = await biometricService.authenticate();
      expect(result, isFalse);
    });
  });
}
