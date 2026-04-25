import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../data/models/cuti_model.dart';
import '../providers/cuti_provider.dart';
import 'form_pengajuan_cuti.dart';

class LayarDaftarCuti extends ConsumerWidget {
  const LayarDaftarCuti({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final riwayatAsync = ref.watch(riwayatCutiProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Riwayat Cuti'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const FormPengajuanCuti()),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(riwayatCutiProvider.future),
        child: riwayatAsync.when(
          data: (riwayat) {
            if (riwayat.isEmpty) {
              return const Center(child: Text('Belum ada riwayat pengajuan cuti'));
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: riwayat.length,
              itemBuilder: (context, index) {
                final cuti = riwayat[index];
                return _buildCutiCard(context, cuti);
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
        ),
      ),
    );
  }

  Widget _buildCutiCard(BuildContext context, CutiModel cuti) {
    final dateFormat = DateFormat('dd MMM yyyy');
    
    Color statusColor;
    switch (cuti.status.toLowerCase()) {
      case 'disetujui':
        statusColor = Colors.green;
        break;
      case 'ditolak':
        statusColor = Colors.red;
        break;
      case 'revisi':
        statusColor = Colors.orange;
        break;
      default:
        statusColor = Colors.blue;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  cuti.namaJenisCuti ?? 'Cuti',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    cuti.status.toUpperCase(),
                    style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              '${dateFormat.format(cuti.tanggalMulai)} - ${dateFormat.format(cuti.tanggalSelesai)}',
              style: TextStyle(color: Colors.grey[600], fontSize: 14),
            ),
            const SizedBox(height: 4),
            Text(
              '${cuti.totalHari} Hari Kerja',
              style: const TextStyle(fontWeight: FontWeight.w500),
            ),
            const Divider(height: 24),
            Text(
              'Alasan:',
              style: TextStyle(color: Colors.grey[500], fontSize: 12),
            ),
            Text(cuti.alasan, style: const TextStyle(fontSize: 14)),
            if (cuti.catatanPimpinan != null) ...[
              const SizedBox(height: 8),
              Text(
                'Catatan Pimpinan:',
                style: TextStyle(color: Colors.orange[800], fontSize: 12, fontWeight: FontWeight.bold),
              ),
              Text(cuti.catatanPimpinan!, style: TextStyle(fontSize: 13, color: Colors.orange[900])),
            ],
          ],
        ),
      ),
    );
  }
}
