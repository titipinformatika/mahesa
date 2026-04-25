import 'package:geolocator/geolocator.dart';

class LocationValidator {
  /// Deteksi apakah posisi berasal dari mock/fake GPS
  static bool isMockLocation(Position position) {
    return position.isMocked;
  }

  /// Validasi lengkap sebelum submit absensi
  static Future<LocationValidationResult> validate(Position position, {
    required double officeLat,
    required double officeLng,
    required double radiusMeter,
  }) async {
    if (isMockLocation(position)) {
      return LocationValidationResult(
        isValid: false,
        reason: 'Terdeteksi penggunaan lokasi palsu (Fake GPS). Matikan aplikasi mock location untuk melanjutkan.',
      );
    }

    final distance = Geolocator.distanceBetween(
      position.latitude,
      position.longitude,
      officeLat,
      officeLng,
    );

    if (distance > radiusMeter) {
      return LocationValidationResult(
        isValid: false,
        reason: 'Anda berada di luar radius kantor (${distance.toStringAsFixed(0)}m). Jarak maksimal: ${radiusMeter.toStringAsFixed(0)}m',
      );
    }

    return LocationValidationResult(isValid: true, reason: 'OK');
  }
}

class LocationValidationResult {
  final bool isValid;
  final String reason;

  LocationValidationResult({required this.isValid, required this.reason});
}
