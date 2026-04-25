import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/performance_provider.dart';
import 'form_laporan_harian.dart';

class DaftarLaporanHarian extends ConsumerStatefulWidget {
  const DaftarLaporanHarian({super.key});

  @override
  ConsumerState<DaftarLaporanHarian> createState() => _DaftarLaporanHarianState();
}

class _DaftarLaporanHarianState extends ConsumerState<DaftarLaporanHarian> {
  String? _selectedStatus;

  @override
  Widget build(BuildContext context) {
    final riwayatAsync = ref.watch(riwayatLhkpProvider(status: _selectedStatus));

    return Scaffold(
      appBar: AppBar(
        title: const Text('LHKP'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const FormLaporanHarian()),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => ref.refresh(riwayatLhkpProvider(status: _selectedStatus).future),
              child: riwayatAsync.when(
                data: (riwayat) {
                  if (riwayat.isEmpty) {
                    return const Center(child: Text('Belum ada laporan harian'));
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: riwayat.length,
                    itemBuilder: (context, index) {
                      final item = riwayat[index];
                      return _buildLhkpCard(item);
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, s) => Center(child: Text('Error: $e')),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    final statuses = [
      {'label': 'Semua', 'value': null},
      {'label': 'Menunggu', 'value': 'menunggu'},
      {'label': 'Disetujui', 'value': 'disetujui'},
      {'label': 'Revisi', 'value': 'revisi'},
    ];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: statuses.map((s) {
          final isSelected = _selectedStatus == s['value'];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(s['label'] as String),
              selected: isSelected,
              onSelected: (val) {
                setState(() => _selectedStatus = s['value'] as String?);
              },
              selectedColor: Colors.blue.withValues(alpha: 0.2),
              checkmarkColor: Colors.blue,
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildLhkpCard(dynamic item) {
    final dateFormat = DateFormat('EEEE, dd MMM yyyy');
    
    Color statusColor;
    switch (item.status.toLowerCase()) {
      case 'disetujui':
        statusColor = Colors.green;
        break;
      case 'revisi':
        statusColor = Colors.orange;
        break;
      case 'ditolak':
        statusColor = Colors.red;
        break;
      default:
        statusColor = Colors.blue;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        title: Text(
          dateFormat.format(item.tanggal),
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text('${item.jumlahKegiatan ?? 0} Kegiatan'),
            if (item.catatanPimpinan != null) ...[
              const SizedBox(height: 8),
              Text(
                'Catatan: ${item.catatanPimpinan}',
                style: const TextStyle(color: Colors.red, fontSize: 12),
              ),
            ],
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: statusColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            item.status.toUpperCase(),
            style: TextStyle(color: statusColor, fontSize: 10, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
