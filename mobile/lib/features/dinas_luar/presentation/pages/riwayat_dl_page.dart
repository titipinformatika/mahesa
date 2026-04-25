import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/dinas_luar_provider.dart';
import 'pengajuan_dl_page.dart';
import 'checkpoint_dl_page.dart';

class RiwayatDLPage extends ConsumerWidget {
  const RiwayatDLPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final riwayatAsync = ref.watch(riwayatDLProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Dinas Luar')),
      body: riwayatAsync.when(
        data: (riwayat) {
          if (riwayat.isEmpty) {
            return const Center(child: Text('Belum ada riwayat pengajuan DL.'));
          }
          return RefreshIndicator(
            onRefresh: () async => ref.refresh(riwayatDLProvider.future),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: riwayat.length,
              itemBuilder: (context, index) {
                final item = riwayat[index];
                return _buildDLCard(context, item);
              },
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Gagal memuat: $e', style: const TextStyle(color: Colors.red)),
              ElevatedButton(
                onPressed: () => ref.refresh(riwayatDLProvider),
                child: const Text('Coba Lagi'),
              )
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (_) => const PengajuanDLPage()));
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildDLCard(BuildContext context, dynamic item) {
    Color statusColor;
    switch (item['status']) {
      case 'disetujui': statusColor = Colors.green; break;
      case 'ditolak': statusColor = Colors.red; break;
      case 'dibatalkan': statusColor = Colors.grey; break;
      case 'menunggu': statusColor = Colors.orange; break;
      default: statusColor = Colors.blue; break;
    }

    final startDate = DateTime.tryParse(item['tanggal_mulai'] ?? '');
    final endDate = DateTime.tryParse(item['tanggal_selesai'] ?? '');
    
    String dateRange = '';
    if (startDate != null && endDate != null) {
      if (startDate == endDate) {
        dateRange = DateFormat('dd MMM yyyy').format(startDate);
      } else {
        dateRange = '${DateFormat('dd MMM').format(startDate)} - ${DateFormat('dd MMM yyyy').format(endDate)}';
      }
    }

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: () {
          if (item['status'] == 'disetujui' || item['status'] == 'sedang_berjalan') {
            Navigator.push(context, MaterialPageRoute(builder: (_) => CheckpointDLPage(pengajuan: item)));
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      item['tujuan'] ?? '-', 
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: statusColor),
                    ),
                    child: Text(
                      (item['status'] ?? '').toUpperCase(),
                      style: TextStyle(color: statusColor, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                  const SizedBox(width: 8),
                  Text(dateRange),
                ],
              ),
              if (item['keterangan'] != null && item['keterangan'].toString().isNotEmpty) ...[
                const SizedBox(height: 8),
                Text(
                  'Ket: ${item['keterangan']}',
                  style: const TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
                ),
              ]
            ],
          ),
        ),
      ),
    );
  }
}
