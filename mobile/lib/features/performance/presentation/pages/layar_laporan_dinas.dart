import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:mahesa_mobile/features/performance/presentation/providers/laporan_dinas_provider.dart';

class LayarLaporanDinas extends ConsumerWidget {
  const LayarLaporanDinas({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final historyAsync = ref.watch(laporanDinasHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Laporan ke Dinas'),
      ),
      body: historyAsync.when(
        data: (list) {
          if (list.isEmpty) {
            return const Center(child: Text('Belum ada laporan yang dibuat'));
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: list.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = list[index];
              final bulanNama = DateFormat('MMMM', 'id').format(DateTime(2026, item.bulan));
              
              return Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Colors.grey.shade200),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '$bulanNama ${item.tahun}',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          _buildStatusBadge(item.status),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          _buildMiniStat('Pegawai', item.totalPegawai.toString()),
                          _buildMiniStat('Hadir', item.totalHadir.toString()),
                          _buildMiniStat('Cuti', item.totalCuti.toString()),
                          _buildMiniStat('DL', item.totalDl.toString()),
                        ],
                      ),
                      if (item.catatanPimpinan != null && item.catatanPimpinan!.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        const Divider(),
                        Text(
                          'Catatan: ${item.catatanPimpinan}',
                          style: TextStyle(fontSize: 12, color: Colors.grey.shade600, fontStyle: FontStyle.italic),
                        ),
                      ],
                    ],
                  ),
                ),
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/form-laporan-dinas'),
        label: const Text('Buat Laporan'),
        icon: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'dikirim': color = Colors.blue; break;
      case 'diterima': color = Colors.green; break;
      case 'ditolak': color = Colors.red; break;
      default: color = Colors.grey;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(4),
        border: Border.all(color: color.withOpacity(0.5)),
      ),
      child: Text(
        status.toUpperCase(),
        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color),
      ),
    );
  }

  Widget _buildMiniStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey)),
      ],
    );
  }
}
