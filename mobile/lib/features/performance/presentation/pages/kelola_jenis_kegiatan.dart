import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/performance_provider.dart';

class KelolaJenisKegiatan extends ConsumerWidget {
  const KelolaJenisKegiatan({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listAsync = ref.watch(penugasanKegiatanProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Master Kegiatan Unit'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showForm(context, ref),
        child: const Icon(Icons.add),
      ),
      body: listAsync.when(
        data: (list) {
          return ListView.builder(
            itemCount: list.length,
            itemBuilder: (context, index) {
              final item = list[index];
              return ListTile(
                title: Text(item.nama),
                subtitle: Text(item.keterangan ?? '-'),
                trailing: IconButton(
                  icon: const Icon(Icons.edit, size: 20),
                  onPressed: () => _showForm(context, ref, id: item.id, nama: item.nama, keterangan: item.keterangan),
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

  void _showForm(BuildContext context, WidgetRef ref, {String? id, String? nama, String? keterangan}) {
    final nameController = TextEditingController(text: nama);
    final descController = TextEditingController(text: keterangan);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(id == null ? 'Tambah Kegiatan' : 'Edit Kegiatan'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Nama Kegiatan')),
            TextField(controller: descController, decoration: const InputDecoration(labelText: 'Keterangan')),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              if (id == null) {
                await ref.read(pimpinanPerformanceActionProvider.notifier).createJenisKegiatan(
                  nama: nameController.text,
                  keterangan: descController.text,
                );
              }
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
  }
}
