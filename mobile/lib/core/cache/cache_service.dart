import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CacheService {
  static const _profileBox = 'profile_cache';
  static const _attendanceBox = 'attendance_cache';

  Future<void> init() async {
    await Hive.openBox(_profileBox);
    await Hive.openBox(_attendanceBox);
  }

  // Profile
  Future<void> cacheProfile(Map<String, dynamic> data) async {
    final box = Hive.box(_profileBox);
    await box.put('profile', data);
  }

  Map<String, dynamic>? getCachedProfile() {
    final box = Hive.box(_profileBox);
    final data = box.get('profile');
    return data != null ? Map<String, dynamic>.from(data) : null;
  }

  // Attendance History
  Future<void> cacheAttendance(dynamic data) async {
    final box = Hive.box(_attendanceBox);
    await box.put('history', data);
  }

  dynamic getCachedAttendance() {
    final box = Hive.box(_attendanceBox);
    return box.get('history');
  }

  Future<void> clearAll() async {
    await Hive.box(_profileBox).clear();
    await Hive.box(_attendanceBox).clear();
  }
}

final cacheServiceProvider = Provider((ref) => CacheService());
