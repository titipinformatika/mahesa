import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mahesa_mobile/features/announcement/data/models/announcement_model.dart';
import 'package:mahesa_mobile/features/announcement/data/repositories/announcement_repository.dart';

final announcementsProvider = FutureProvider<List<AnnouncementModel>>((ref) async {
  final repository = ref.watch(announcementRepositoryProvider);
  return repository.getAnnouncements();
});

final announcementDetailProvider = FutureProvider.family<AnnouncementModel, String>((ref, id) async {
  final repository = ref.watch(announcementRepositoryProvider);
  return repository.getAnnouncementDetail(id);
});

final latestAnnouncementsProvider = FutureProvider<List<AnnouncementModel>>((ref) async {
  final list = await ref.watch(announcementsProvider.future);
  // Get top 5 active
  final active = list.where((a) => a.aktif).toList();
  active.sort((a, b) => b.dibuatPada.compareTo(a.dibuatPada));
  return active.take(5).toList();
});
