import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/core/network/dio_client.dart';
import 'package:mahesa_mobile/features/announcement/data/models/announcement_model.dart';

final announcementRepositoryProvider = Provider((ref) {
  final dio = ref.watch(dioClientProvider);
  return AnnouncementRepository(dio);
});

class AnnouncementRepository {
  final DioClient _dioClient;

  AnnouncementRepository(this._dioClient);

  Future<List<AnnouncementModel>> getAnnouncements() async {
    try {
      final response = await _dioClient.dio.get('/pengumuman');
      final List data = response.data['data'];
      return data.map((json) => AnnouncementModel.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<AnnouncementModel> getAnnouncementDetail(String id) async {
    try {
      final response = await _dioClient.dio.get('/pengumuman/$id');
      return AnnouncementModel.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }
}
