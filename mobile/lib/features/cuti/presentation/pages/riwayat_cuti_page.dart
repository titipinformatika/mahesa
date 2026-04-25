import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:go_router/go_router.dart';
import '../providers/cuti_provider.dart';

class RiwayatCutiPage extends ConsumerWidget {
  const RiwayatCutiPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final riwayatAsync = ref.watch(riwayatCutiProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Cuti')),
      body: riwayatAsync.when(
        data: (riwayat) {
          if (riwayat.isEmpty) {
            return const Center(child: Text('Belum ada riwayat pengajuan cuti.'));
          }
          return RefreshIndicator(
            onRefresh: () async => ref.refresh(riwayatCutiProvider.future),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: riwayat.length,
              itemBuilder: (context, index) {
                final item = riwayat[index];
                return _buildCutiCard(context, item);
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Gagal memuat: $e')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/pengajuan-cuti'),
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildCutiCard(BuildContext context, dynamic item) {
    Color statusColor;
    switch (item.status) {
      case 'disetujui': statusColor = Colors.green; break;
      case 'ditolak': statusColor = Colors.red; break;
      case 'menunggu': statusColor = Colors.orange; break;
      default: statusColor = Colors.blue; break;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(item.jenisCuti?.nama ?? 'Cuti'),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('${DateFormat('dd MMM').format(item.tanggalMulai)} - ${DateFormat('dd MMM yyyy').format(item.tanggalSelesai)}'),
            Text(item.alasan, style: const TextStyle(fontStyle: FontStyle.italic), maxLines: 1, overflow: TextOverflow.ellipsis),
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: statusColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: statusColor),
          ),
          child: Text(item.status.toUpperCase(), style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
