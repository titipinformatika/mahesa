import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:mahesa_mobile/features/performance/presentation/providers/laporan_dinas_provider.dart';

class LayarFormLaporanDinas extends ConsumerStatefulWidget {
  const LayarFormLaporanDinas({super.key});

  @override
  ConsumerState<LayarFormLaporanDinas> createState() => _LayarFormLaporanDinasState();
}

class _LayarFormLaporanDinasState extends ConsumerState<LayarFormLaporanDinas> {
  int _selectedMonth = DateTime.now().month;
  int _selectedYear = DateTime.now().year;
  final _catatanController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final summaryAsync = ref.watch(laporanDinasSummaryProvider((bulan: _selectedMonth, tahun: _selectedYear)));
    final isSubmitting = ref.watch(submitLaporanActionProvider).value.isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Form Laporan Dinas'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Periode Laporan', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: DropdownButtonFormField<int>(
                            value: _selectedMonth,
                            decoration: const InputDecoration(labelText: 'Bulan', border: OutlineInputBorder()),
                            items: List.generate(12, (i) => DropdownMenuItem(
                              value: i + 1,
                              child: Text(DateFormat('MMMM', 'id').format(DateTime(2026, i + 1))),
                            )),
                            onChanged: (val) => setState(() => _selectedMonth = val!),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: DropdownButtonFormField<int>(
                            value: _selectedYear,
                            decoration: const InputDecoration(labelText: 'Tahun', border: OutlineInputBorder()),
                            items: [DateTime.now().year, DateTime.now().year - 1].map((y) => DropdownMenuItem(
                              value: y,
                              child: Text(y.toString()),
                            )).toList(),
                            onChanged: (val) => setState(() => _selectedYear = val!),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Pratinjau Data', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            summaryAsync.when(
              data: (summary) => _buildSummaryPreview(summary),
              loading: () => const Center(child: Padding(
                padding: EdgeInsets.all(32.0),
                child: CircularProgressIndicator(),
              )),
              error: (e, st) => Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Text('Gagal memuat pratinjau: $e', style: const TextStyle(color: Colors.red)),
                ),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _catatanController,
              decoration: const InputDecoration(
                labelText: 'Catatan Pimpinan (Opsional)',
                border: OutlineInputBorder(),
                alignLabelWithHint: true,
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 32),
            summaryAsync.when(
              data: (summary) => ElevatedButton(
                onPressed: isSubmitting ? null : () => _handleSubmit(summary),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: isSubmitting 
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('Kirim ke Dinas', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
              loading: () => const ElevatedButton(onPressed: null, child: Text('Menunggu Data...')),
              error: (_, __) => const ElevatedButton(onPressed: null, child: Text('Gagal Memuat Data')),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryPreview(summary) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildSummaryRow('Total Pegawai', summary.totalPegawai.toString(), Icons.people),
            const Divider(),
            _buildSummaryRow('Total Hadir', summary.totalHadir.toString(), Icons.check_circle, Colors.green),
            const Divider(),
            _buildSummaryRow('Total Cuti', summary.totalCuti.toString(), Icons.event_busy, Colors.orange),
            const Divider(),
            _buildSummaryRow('Total Dinas Luar', summary.totalDl.toString(), Icons.business_center, Colors.blue),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, IconData icon, [Color? color]) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: color),
          const SizedBox(width: 12),
          Text(label),
          const Spacer(),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }

  void _handleSubmit(summary) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Konfirmasi'),
        content: const Text('Apakah Anda yakin ingin mengirim laporan ini ke Dinas? Data yang sudah dikirim tidak dapat diubah.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Batal')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Kirim')),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await ref.read(laporanDinasServiceProvider).submit(
          bulan: _selectedMonth,
          tahun: _selectedYear,
          totalPegawai: summary.totalPegawai,
          totalHadir: summary.totalHadir,
          totalCuti: summary.totalCuti,
          totalDl: summary.totalDl,
          catatan: _catatanController.text,
        );
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Laporan berhasil dikirim')));
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal mengirim laporan: $e')));
        }
      }
    }
  }

  @override
  void dispose() {
    _catatanController.dispose();
    super.dispose();
  }
}
