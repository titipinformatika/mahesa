import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/performance_provider.dart';
import '../../data/models/lhkp_model.dart';

class FormLaporanHarian extends ConsumerStatefulWidget {
  const FormLaporanHarian({super.key});

  @override
  ConsumerState<FormLaporanHarian> createState() => _FormLaporanHarianState();
}

class _FormLaporanHarianState extends ConsumerState<FormLaporanHarian> {
  DateTime _selectedDate = DateTime.now();
  final List<LhkpDetailModel> _details = [];

  @override
  void initState() {
    super.initState();
    // Start with one empty detail
    _addDetail();
  }

  void _addDetail() {
    setState(() {
      _details.add(LhkpDetailModel(
        idJenisKegiatan: '',
        jamMulai: '08:00',
        jamSelesai: '10:00',
        uraian: '',
      ));
    });
  }

  void _removeDetail(int index) {
    if (_details.length > 1) {
      setState(() {
        _details.removeAt(index);
      });
    }
  }

  Future<void> _selectTime(int index, bool isStart) async {
    final initialTime = TimeOfDay(
      hour: int.parse((isStart ? _details[index].jamMulai : _details[index].jamSelesai).split(':')[0]),
      minute: int.parse((isStart ? _details[index].jamMulai : _details[index].jamSelesai).split(':')[1]),
    );

    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
    );

    if (picked != null) {
      setState(() {
        final timeStr = '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
        if (isStart) {
          _details[index] = _details[index].copyWith(jamMulai: timeStr);
        } else {
          _details[index] = _details[index].copyWith(jamSelesai: timeStr);
        }
      });
    }
  }

  void _submit() async {
    // Validation
    if (_details.any((d) => d.idJenisKegiatan.isEmpty || d.uraian.isEmpty)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Harap lengkapi semua rincian kegiatan')),
      );
      return;
    }

    await ref.read(lhkpActionProvider.notifier).submitLhkp(
      tanggal: _selectedDate,
      details: _details,
    );

    if (mounted) {
      final state = ref.read(lhkpActionProvider);
      if (!state.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Laporan harian berhasil dikirim')),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal mengirim laporan: ${state.error}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final penugasanAsync = ref.watch(penugasanKegiatanProvider);
    final loading = ref.watch(lhkpActionProvider).isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Input LHKP')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildDatePicker(),
            const SizedBox(height: 24),
            const Text(
              'Rincian Kegiatan',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            ..._details.asMap().entries.map((entry) => _buildDetailItem(entry.key, entry.value, penugasanAsync)),
            const SizedBox(height: 16),
            OutlinedButton.icon(
              onPressed: _addDetail,
              icon: const Icon(Icons.add),
              label: const Text('Tambah Kegiatan'),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: loading ? null : _submit,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: loading 
                ? const CircularProgressIndicator(color: Colors.white)
                : const Text('Simpan Laporan', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDatePicker() {
    return InkWell(
      onTap: () async {
        final picked = await showDatePicker(
          context: context,
          initialDate: _selectedDate,
          firstDate: DateTime.now().subtract(const Duration(days: 7)),
          lastDate: DateTime.now(),
        );
        if (picked != null) setState(() => _selectedDate = picked);
      },
      child: InputDecorator(
        decoration: const InputDecoration(
          labelText: 'Tanggal Laporan',
          border: OutlineInputBorder(),
          prefixIcon: Icon(Icons.calendar_today),
        ),
        child: Text(DateFormat('EEEE, dd MMMM yyyy').format(_selectedDate)),
      ),
    );
  }

  Widget _buildDetailItem(int index, LhkpDetailModel detail, AsyncValue<List<JenisKegiatanModel>> penugasanAsync) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Kegiatan #${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                if (_details.length > 1)
                  IconButton(
                    icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                    onPressed: () => _removeDetail(index),
                  ),
              ],
            ),
            const SizedBox(height: 8),
            penugasanAsync.when(
              data: (types) => DropdownButtonFormField<String>(
                value: detail.idJenisKegiatan.isEmpty ? null : detail.idJenisKegiatan,
                decoration: const InputDecoration(labelText: 'Jenis Kegiatan', border: OutlineInputBorder()),
                items: types.map((t) => DropdownMenuItem(value: t.id, child: Text(t.nama))).toList(),
                onChanged: (val) => setState(() {
                  _details[index] = _details[index].copyWith(idJenisKegiatan: val!);
                }),
              ),
              loading: () => const LinearProgressIndicator(),
              error: (e, s) => Text('Error: $e'),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => _selectTime(index, true),
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Jam Mulai', border: OutlineInputBorder()),
                      child: Text(detail.jamMulai),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () => _selectTime(index, false),
                    child: InputDecorator(
                      decoration: const InputDecoration(labelText: 'Jam Selesai', border: OutlineInputBorder()),
                      child: Text(detail.jamSelesai),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            TextFormField(
              initialValue: detail.uraian,
              decoration: const InputDecoration(labelText: 'Uraian Tugas', border: OutlineInputBorder()),
              maxLines: 2,
              onChanged: (val) => _details[index] = _details[index].copyWith(uraian: val),
            ),
          ],
        ),
      ),
    );
  }
}
