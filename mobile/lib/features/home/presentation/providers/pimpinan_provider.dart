import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';

final ringkasanPimpinanProvider = FutureProvider<Map<String, dynamic>>((ref) async {
  final dio = ref.watch(dioProvider);
  
  // Mock data for statistics as backend might not have summary endpoint yet
  // In a real app, this would hit something like /v1/absensi/statistik-unit
  // For now we can fetch /v1/absensi/terlambat to count some stats
  
  try {
    final resTerlambat = await dio.get('/v1/absensi/terlambat');
    final terlambatList = resTerlambat.data['data'] as List;
    
    return {
      'hadir': 42, // Dummy
      'terlambat': terlambatList.length,
      'izin': 3, // Dummy
      'dl': 5, // Dummy
    };
  } catch (e) {
    return {
      'hadir': 0,
      'terlambat': 0,
      'izin': 0,
      'dl': 0,
    };
  }
});

final daftarTerlambatProvider = FutureProvider<List<dynamic>>((ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get('/v1/absensi/terlambat');
  return response.data['data'] as List<dynamic>;
});
