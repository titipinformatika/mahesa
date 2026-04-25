import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:image_picker/image_picker.dart';
import '../providers/cuti_provider.dart';

class PengajuanCutiPage extends ConsumerStatefulWidget {
  const PengajuanCutiPage({super.key});

  @override
  ConsumerState<PengajuanCutiPage> createState() => _PengajuanCutiPageState();
}

class _PengajuanCutiPageState extends ConsumerState<PengajuanCutiPage> {
  final _formKey = GlobalKey<FormState>();
  final _alasanController = TextEditingController();
  
  String? _selectedJenisCutiId;
  DateTime? _tanggalMulai;
  DateTime? _tanggalSelesai;
  File? _dokumen;

  @override
  void dispose() {
    _alasanController.dispose();
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

  Future<void> _pickDocument() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() => _dokumen = File(picked.path));
    }
  }

  void _submit() async {
    if (_formKey.currentState!.validate()) {
      if (_selectedJenisCutiId == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih Jenis Cuti')));
        return;
      }
      if (_tanggalMulai == null || _tanggalSelesai == null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih Tanggal Mulai dan Selesai')));
        return;
      }

      await ref.read(ajukanCutiActionProvider.notifier).ajukanCuti(
        idJenisCuti: _selectedJenisCutiId!,
        tanggalMulai: _tanggalMulai!,
        tanggalSelesai: _tanggalSelesai!,
        alasan: _alasanController.text,
        dokumen: _dokumen,
      );

      final status = ref.read(ajukanCutiActionProvider);
      if (!status.hasError) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pengajuan Cuti berhasil dikirim')));
          Navigator.pop(context);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Gagal: ${status.error}')));
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final jenisAsync = ref.watch(jenisCutiProvider);
    final status = ref.watch(ajukanCutiActionProvider);
    final isLoading = status is AsyncLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Pengajuan Cuti')),
      body: jenisAsync.when(
        data: (list) {
          return Form(
            key: _formKey,
            child: ListView(
              padding: const EdgeInsets.all(16.0),
              children: [
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(labelText: 'Jenis Cuti', border: OutlineInputBorder()),
                  items: list.map((e) => DropdownMenuItem(value: e.id, child: Text(e.nama))).toList(),
                  onChanged: (val) => setState(() => _selectedJenisCutiId = val),
                  validator: (val) => val == null ? 'Wajib diisi' : null,
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
                  controller: _alasanController,
                  decoration: const InputDecoration(labelText: 'Alasan Cuti', border: OutlineInputBorder()),
                  maxLines: 3,
                  validator: (val) => val == null || val.isEmpty ? 'Wajib diisi' : null,
                ),
                const SizedBox(height: 16),
                InkWell(
                  onTap: _pickDocument,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(border: Border.all(color: Colors.grey), borderRadius: BorderRadius.circular(4)),
                    child: Row(
                      children: [
                        const Icon(Icons.attach_file),
                        const SizedBox(width: 8),
                        Expanded(child: Text(_dokumen != null ? _dokumen!.path.split('/').last : 'Lampiran Dokumen (Opsional)')),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                  child: isLoading 
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('Ajukan Cuti', style: TextStyle(fontSize: 16)),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Gagal: $e')),
      ),
    );
  }
}
