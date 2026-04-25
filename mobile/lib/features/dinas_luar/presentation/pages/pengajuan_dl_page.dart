import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/dinas_luar_provider.dart';

class PengajuanDLPage extends ConsumerStatefulWidget {
  const PengajuanDLPage({super.key});

  @override
  ConsumerState<PengajuanDLPage> createState() => _PengajuanDLPageState();
}

class _PengajuanDLPageState extends ConsumerState<PengajuanDLPage> {
  final _formKey = GlobalKey<FormState>();
  final _tujuanController = TextEditingController();
  final _keteranganController = TextEditingController();
  
  String? _selectedSkemaId;
  DateTime? _tanggalMulai;
  DateTime? _tanggalSelesai;

  @override
  void dispose() {
    _tujuanController.dispose();
    _keteranganController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context, bool isStart) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: isStart ? (_tanggalMulai ?? DateTime.now()) : (_tanggalSelesai ?? (_tanggalMulai ?? DateTime.now())),
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );

    if (picked != null) {
      setState(() {
        if (isStart) {
          _tanggalMulai = picked;
          if (_tanggalSelesai != null && _tanggalSelesai!.isBefore(_tanggalMulai!)) {
            _tanggalSelesai = _tanggalMulai;
          }
        } else {
          _tanggalSelesai = picked;
        }
      });
    }
  }

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedSkemaId == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih Skema DL')));
        return;
      }
      if (_tanggalMulai == null || _tanggalSelesai == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih Tanggal Mulai dan Selesai')));
        return;
      }

      final formatter = DateFormat('yyyy-MM-dd');
      
      try {
        await ref.read(dinasLuarServiceProvider).ajukanDL(
          idSkema: _selectedSkemaId!,
          tujuan: _tujuanController.text,
          tanggalMulai: formatter.format(_tanggalMulai!),
          tanggalSelesai: formatter.format(_tanggalSelesai!),
          keterangan: _keteranganController.text,
        );

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pengajuan DL berhasil dikirim')));
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: $e')));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final skemaAsync = ref.watch(skemaDLProvider);
    final status = ref.watch(dinasLuarActionStatusProvider).value;
    final isLoading = status is AsyncLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Pengajuan Dinas Luar')),
      body: skemaAsync.when(
        data: (skemaList) {
          return Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Skema Dinas Luar', border: OutlineInputBorder()),
                  initialValue: _selectedSkemaId,
                  items: skemaList.map<DropdownMenuItem<String>>((s) {
                    return DropdownMenuItem<String>(
                      value: s['id'],
                      child: Text(s['nama']),
                    );
                  }).toList(),
                  onChanged: (val) => setState(() => _selectedSkemaId = val),
                  validator: (val) => val == null ? 'Wajib diisi' : null,
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _tujuanController,
                  decoration: const InputDecoration(labelText: 'Tujuan DL', border: OutlineInputBorder()),
                  validator: (val) => val == null || val.isEmpty ? 'Wajib diisi' : null,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () => _selectDate(context, true),
                        child: InputDecorator(
                          decoration: const InputDecoration(labelText: 'Tanggal Mulai', border: OutlineInputBorder()),
                          child: Text(_tanggalMulai != null ? DateFormat('dd MMM yyyy').format(_tanggalMulai!) : 'Pilih...'),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: InkWell(
                        onTap: () => _selectDate(context, false),
                        child: InputDecorator(
                          decoration: const InputDecoration(labelText: 'Tanggal Selesai', border: OutlineInputBorder()),
                          child: Text(_tanggalSelesai != null ? DateFormat('dd MMM yyyy').format(_tanggalSelesai!) : 'Pilih...'),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _keteranganController,
                  decoration: const InputDecoration(labelText: 'Keterangan/Keperluan (Opsional)', border: OutlineInputBorder()),
                  maxLines: 3,
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                  child: isLoading 
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Ajukan DL', style: TextStyle(fontSize: 16)),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Gagal memuat form: $e')),
      ),
    );
  }
}
