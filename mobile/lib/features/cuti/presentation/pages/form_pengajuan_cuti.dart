import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../providers/cuti_provider.dart';

class FormPengajuanCuti extends ConsumerStatefulWidget {
  const FormPengajuanCuti({super.key});

  @override
  ConsumerState<FormPengajuanCuti> createState() => _FormPengajuanCutiState();
}

class _FormPengajuanCutiState extends ConsumerState<FormPengajuanCuti> {
  final _formKey = GlobalKey<FormState>();
  final _alasanController = TextEditingController();
  
  String? _selectedJenisCutiId;
  DateTime? _startDate;
  DateTime? _endDate;
  File? _selectedFile;

  final _picker = ImagePicker();

  Future<void> _pickImage() async {
    final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() {
        _selectedFile = File(pickedFile.path);
      });
    }
  }

  Future<void> _selectDateRange() async {
    final pickedRange = await showDateRangePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: _startDate != null && _endDate != null
          ? DateTimeRange(start: _startDate!, end: _endDate!)
          : null,
    );

    if (pickedRange != null) {
      setState(() {
        _startDate = pickedRange.start;
        _endDate = pickedRange.end;
      });
    }
  }

  void _submit() async {
    if (_formKey.currentState!.validate() && 
        _selectedJenisCutiId != null && 
        _startDate != null && 
        _endDate != null) {
      
      await ref.read(ajukanCutiActionProvider.notifier).ajukanCuti(
        idJenisCuti: _selectedJenisCutiId!,
        tanggalMulai: _startDate!,
        tanggalSelesai: _endDate!,
        alasan: _alasanController.text,
        dokumen: _selectedFile,
      );

      final state = ref.read(ajukanCutiActionProvider);
      if (state.hasError) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Gagal mengajukan cuti: ${state.error}')),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Cuti berhasil diajukan')),
          );
          Navigator.pop(context);
        }
      }
    } else if (_selectedJenisCutiId == null || _startDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Harap lengkapi semua data')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final jenisCutiAsync = ref.watch(jenisCutiProvider);
    final loading = ref.watch(ajukanCutiActionProvider).isLoading;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pengajuan Cuti'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              jenisCutiAsync.when(
                data: (types) => DropdownButtonFormField<String>(
                  value: _selectedJenisCutiId,
                  decoration: const InputDecoration(
                    labelText: 'Jenis Cuti',
                    border: OutlineInputBorder(),
                  ),
                  items: types.map((t) => DropdownMenuItem(
                    value: t.id,
                    child: Text(t.nama),
                  )).toList(),
                  onChanged: (val) => setState(() => _selectedJenisCutiId = val),
                  validator: (val) => val == null ? 'Wajib diisi' : null,
                ),
                loading: () => const LinearProgressIndicator(),
                error: (e, s) => Text('Gagal memuat jenis cuti: $e'),
              ),
              const SizedBox(height: 16),
              InkWell(
                onTap: _selectDateRange,
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Rentang Tanggal',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.date_range),
                  ),
                  child: Text(
                    _startDate == null 
                        ? 'Pilih Tanggal' 
                        : '${DateFormat('dd/MM/yyyy').format(_startDate!)} - ${DateFormat('dd/MM/yyyy').format(_endDate!)}',
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _alasanController,
                decoration: const InputDecoration(
                  labelText: 'Alasan Cuti',
                  border: OutlineInputBorder(),
                  alignLabelWithHint: true,
                ),
                maxLines: 3,
                validator: (val) => val == null || val.isEmpty ? 'Alasan wajib diisi' : null,
              ),
              const SizedBox(height: 16),
              const Text('Dokumen Lampiran (Opsional)', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pickImage,
                child: Container(
                  height: 150,
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: _selectedFile == null
                      ? const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.upload_file, size: 40, color: Colors.grey),
                            Text('Klik untuk unggah foto/dokumen', style: TextStyle(color: Colors.grey)),
                          ],
                        )
                      : Stack(
                          children: [
                            Image.file(_selectedFile!, width: double.infinity, height: 150, fit: BoxFit.cover),
                            Positioned(
                              right: 8,
                              top: 8,
                              child: CircleAvatar(
                                backgroundColor: Colors.red,
                                radius: 15,
                                child: IconButton(
                                  icon: const Icon(Icons.close, size: 15, color: Colors.white),
                                  onPressed: () => setState(() => _selectedFile = null),
                                ),
                              ),
                            ),
                          ],
                        ),
                ),
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
                    : const Text('Kirim Pengajuan', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _alasanController.dispose();
    super.dispose();
  }
}
