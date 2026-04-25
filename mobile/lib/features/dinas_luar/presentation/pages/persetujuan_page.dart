import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/dinas_luar_provider.dart';

class PersetujuanPage extends ConsumerWidget {
  const PersetujuanPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final persetujuanAsync = ref.watch(persetujuanDLProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Persetujuan Dinas Luar')),
      body: persetujuanAsync.when(
        data: (riwayat) {
          if (riwayat.isEmpty) {
            return const Center(child: Text('Tidak ada pengajuan yang menunggu persetujuan.'));
          }
          return RefreshIndicator(
            onRefresh: () async => ref.refresh(persetujuanDLProvider.future),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: riwayat.length,
              itemBuilder: (context, index) {
                final item = riwayat[index];
                return _buildPersetujuanCard(context, ref, item);
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Gagal memuat: $e')),
      ),
    );
  }

  Widget _buildPersetujuanCard(BuildContext context, WidgetRef ref, dynamic item) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const CircleAvatar(child: Icon(Icons.person)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item['nama_lengkap'] ?? 'Pegawai',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      Text(item['tujuan'] ?? '-', style: const TextStyle(color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 24),
            Row(
              children: [
                const Icon(Icons.calendar_today, size: 16, color: Colors.blue),
                const SizedBox(width: 8),
                Text('${item['tanggal_mulai']} s.d ${item['tanggal_selesai']}'),
              ],
            ),
            if (item['keterangan'] != null) ...[
              const SizedBox(height: 8),
              Text('Alasan: ${item['keterangan']}', style: const TextStyle(fontStyle: FontStyle.italic)),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => _showRejectDialog(context, ref, item['id']),
                    style: OutlinedButton.styleFrom(foregroundColor: Colors.red),
                    child: const Text('TOLAK'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _handleApprove(context, ref, item['id']),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                    child: const Text('SETUJUI'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _handleApprove(BuildContext context, WidgetRef ref, String id) async {
    try {
      await ref.read(dinasLuarServiceProvider).setujuiDL(id: id, status: 'disetujui');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pengajuan disetujui')));
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
      }
    }
  }

  void _showRejectDialog(BuildContext context, WidgetRef ref, String id) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Tolak Pengajuan'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Alasan Penolakan', border: OutlineInputBorder()),
          maxLines: 3,
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('BATAL')),
          ElevatedButton(
            onPressed: () async {
              if (controller.text.isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Alasan harus diisi')));
                return;
              }
              try {
                await ref.read(dinasLuarServiceProvider).setujuiDL(id: id, status: 'ditolak', catatan: controller.text);
                if (context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pengajuan ditolak')));
                }
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('TOLAK'),
          ),
        ],
      ),
    );
  }
}
