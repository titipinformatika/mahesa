import 'package:flutter_test/flutter_test.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:mahesa_mobile/core/cache/cache_service.dart';
import 'dart:io';

void main() {
  late CacheService cacheService;

  // We can't easily mock Hive.box() directly without wrapping Hive.
  // So I'll just use a real Hive with a temp directory for testing.
  
  setUp(() async {
    final tempDir = Directory.systemTemp.createTempSync();
    Hive.init(tempDir.path);
    cacheService = CacheService();
    await cacheService.init();
  });

  tearDown(() async {
    await Hive.close();
  });

  group('CacheService', () {
    test('cacheProfile and getCachedProfile', () async {
      final profile = {'id': '1', 'name': 'Test User'};
      await cacheService.cacheProfile(profile);
      
      final cached = cacheService.getCachedProfile();
      expect(cached, equals(profile));
    });

    test('cacheAttendance and getCachedAttendance', () async {
      final attendance = [{'id': '101', 'status': 'Hadir'}];
      await cacheService.cacheAttendance(attendance);
      
      final cached = cacheService.getCachedAttendance();
      expect(cached, equals(attendance));
    });

    test('clearAll clears boxes', () async {
      await cacheService.cacheProfile({'id': '1'});
      await cacheService.clearAll();
      
      expect(cacheService.getCachedProfile(), isNull);
    });
  });
}
