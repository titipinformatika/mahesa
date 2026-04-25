import 'package:flutter_test/flutter_test.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mahesa_mobile/core/utils/location_validator.dart';

void main() {
  group('LocationValidator', () {
    test('isMockLocation returns true if position is mocked', () {
      final pos = Position(
        latitude: -6.2,
        longitude: 106.8,
        timestamp: DateTime.now(),
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        speedAccuracy: 0,
        isMocked: true,
        altitudeAccuracy: 0,
        headingAccuracy: 0,
      );
      expect(LocationValidator.isMockLocation(pos), isTrue);
    });

    test('validate returns error if mock location is detected', () async {
      final pos = Position(
        latitude: -6.2,
        longitude: 106.8,
        timestamp: DateTime.now(),
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        speedAccuracy: 0,
        isMocked: true,
        altitudeAccuracy: 0,
        headingAccuracy: 0,
      );

      final result = await LocationValidator.validate(
        pos,
        officeLat: -6.2,
        officeLng: 106.8,
        radiusMeter: 100,
      );

      expect(result.isValid, isFalse);
      expect(result.reason, contains('Fake GPS'));
    });

    test('validate returns error if outside radius', () async {
      final pos = Position(
        latitude: -6.21, // ~1km away
        longitude: 106.81,
        timestamp: DateTime.now(),
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        speedAccuracy: 0,
        isMocked: false,
        altitudeAccuracy: 0,
        headingAccuracy: 0,
      );

      final result = await LocationValidator.validate(
        pos,
        officeLat: -6.2,
        officeLng: 106.8,
        radiusMeter: 100,
      );

      expect(result.isValid, isFalse);
      expect(result.reason, contains('radius'));
    });

    test('validate returns OK if within radius and not mocked', () async {
      final pos = Position(
        latitude: -6.2,
        longitude: 106.8,
        timestamp: DateTime.now(),
        accuracy: 10,
        altitude: 0,
        heading: 0,
        speed: 0,
        speedAccuracy: 0,
        isMocked: false,
        altitudeAccuracy: 0,
        headingAccuracy: 0,
      );

      final result = await LocationValidator.validate(
        pos,
        officeLat: -6.2,
        officeLng: 106.8,
        radiusMeter: 100,
      );

      expect(result.isValid, isTrue);
      expect(result.reason, 'OK');
    });
  });
}
