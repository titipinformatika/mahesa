import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/attendance_provider.dart';
import '../../../home/presentation/widgets/offline_banner.dart';

class AttendanceHistoryPage extends ConsumerStatefulWidget {
  const AttendanceHistoryPage({super.key});

  @override
  ConsumerState<AttendanceHistoryPage> createState() => _AttendanceHistoryPageState();
}

class _AttendanceHistoryPageState extends ConsumerState<AttendanceHistoryPage> {
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;

  @override
  Widget build(BuildContext context) {
    final historyAsync = ref.watch(attendanceHistoryProvider((bulan: _selectedMonth, tahun: _selectedYear)));

    return Scaffold(
      appBar: AppBar(title: const Text('Riwayat Absensi')),
      body: Column(
        children: [
          const OfflineBanner(),
          _buildFilters(),
          Expanded(
            child: historyAsync.when(
              data: (data) => _buildList(data['data'] ?? []),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Gagal memuat data: $err')),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.blue.shade50,
      child: Row(
        children: [
          Expanded(
            child: DropdownButton<int>(
              value: _selectedMonth,
              isExpanded: true,
              items: List.generate(12, (i) => i + 1).map((m) {
                return DropdownMenuItem(
                  value: m,
                  child: Text(DateFormat('MMMM').format(DateTime(2024, m))),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedMonth = val);
              },
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: DropdownButton<int>(
              value: _selectedYear,
              isExpanded: true,
              items: [2024, 2025, 2026].map((y) {
                return DropdownMenuItem(value: y, child: Text(y.toString()));
              }).toList(),
              onChanged: (val) {
                if (val != null) setState(() => _selectedYear = val);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildList(List<dynamic> items) {
    if (items.isEmpty) {
      return const Center(child: Text('Tidak ada data pada bulan ini.'));
    }

    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      separatorBuilder: (_, index) => const SizedBox(height: 12),
      itemBuilder: (context, index) {
        final item = items[index];
        final DateTime tanggal = DateTime.parse(item['tanggal']);
        final String status = item['status'];
        
        return Card(
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: BorderSide(color: Colors.grey.shade200),
          ),
          child: ListTile(
            leading: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _getStatusColor(status).withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                DateFormat('dd').format(tanggal),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: _getStatusColor(status),
                ),
              ),
            ),
            title: Text(DateFormat('EEEE, dd MMM').format(tanggal)),
            subtitle: Row(
              children: [
                _buildTimeTag(item['detail_titik']),
                const SizedBox(width: 8),
                _buildStatusBadge(status),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildTimeTag(List<dynamic>? titik) {
    final tMasuk = titik?.find((t) => t['jenis_titik'] == 'jam_masuk');
    final tPulang = titik?.find((t) => t['jenis_titik'] == 'jam_pulang');

    final String masuk = tMasuk != null ? DateFormat('HH:mm').format(DateTime.parse(tMasuk['waktu'])) : '--';
    final String pulang = tPulang != null ? DateFormat('HH:mm').format(DateTime.parse(tPulang['waktu'])) : '--';

    return Text(
      '$masuk - $pulang',
      style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
    );
  }

  Widget _buildStatusBadge(String status) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: _getStatusColor(status),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        status.toUpperCase(),
        style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'hadir': return Colors.green;
      case 'terlambat': return Colors.amber;
      case 'tidak_hadir': return Colors.red;
      case 'izin':
      case 'sakit': return Colors.blue;
      default: return Colors.grey;
    }
  }
}

extension ListFind<T> on List<T> {
  T? find(bool Function(T) test) {
    try {
      return firstWhere(test);
    } catch (_) {
      return null;
    }
  }
}
