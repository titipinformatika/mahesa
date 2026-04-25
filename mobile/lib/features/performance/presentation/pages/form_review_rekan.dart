import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/performance_provider.dart';
import '../../data/models/review_rekan_model.dart';

class FormReviewRekan extends ConsumerWidget {
  const FormReviewRekan({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final targetsAsync = ref.watch(targetReviewProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Review Rekan Sejawat')),
      body: targetsAsync.when(
        data: (targets) {
          if (targets.isEmpty) {
            return const Center(child: Text('Tidak ada rekan untuk direview'));
          }
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: targets.length,
            itemBuilder: (context, index) {
              final target = targets[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: CircleAvatar(child: Text(target.namaLengkap[0])),
                  title: Text(target.namaLengkap),
                  subtitle: Text(target.jabatan),
                  trailing: target.sudahDireview
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : ElevatedButton(
                        onPressed: () => _showReviewDialog(context, ref, target),
                        child: const Text('Review'),
                      ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, s) => Center(child: Text('Error: $e')),
      ),
    );
  }

  void _showReviewDialog(BuildContext context, WidgetRef ref, TargetReviewModel target) {
    int selectedSkor = 5;
    final komentarController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setState) => AlertDialog(
          title: Text('Review ${target.namaLengkap}'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Skor Kinerja (1-5)'),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) => IconButton(
                    icon: Icon(
                      index < selectedSkor ? Icons.star : Icons.star_border,
                      color: Colors.amber,
                    ),
                    onPressed: () => setState(() => selectedSkor = index + 1),
                  )),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: komentarController,
                  decoration: const InputDecoration(
                    labelText: 'Komentar/Catatan',
                    border: OutlineInputBorder(),
                  ),
                  maxLines: 3,
                ),
              ],
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
            ElevatedButton(
              onPressed: () async {
                await ref.read(reviewActionProvider.notifier).submitReview(
                  idTarget: target.id,
                  skor: selectedSkor,
                  komentar: komentarController.text,
                );
                if (context.mounted) Navigator.pop(context);
              },
              child: const Text('Simpan'),
            ),
          ],
        ),
      ),
    );
  }
}
