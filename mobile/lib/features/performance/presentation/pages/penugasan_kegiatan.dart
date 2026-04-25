import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/performance_provider.dart';

class PenugasanKegiatan extends ConsumerStatefulWidget {
  const PenugasanKegiatan({super.key});

  @override
  ConsumerState<PenugasanKegiatan> createState() => _PenugasanKegiatanState();
}

class _PenugasanKegiatanState extends ConsumerState<PenugasanKegiatan> {
  String? _selectedJenisKegiatanId;
  final Set<String> _selectedPegawaiIds = {};

  void _submit() async {
    if (_selectedJenisKegiatanId == null || _selectedPegawaiIds.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Pilih kegiatan dan minimal satu pegawai')));
      return;
    }

    await ref.read(pimpinanPerformanceActionProvider.notifier).assignKegiatan(
      idJenisKegiatan: _selectedJenisKegiatanId!,
      idPegawais: _selectedPegawaiIds.toList(),
    );

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Penugasan berhasil disimpan')));
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final typesAsync = ref.watch(penugasanKegiatanProvider);
    final teamAsync = ref.watch(teamSummaryProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Penugasan Kegiatan')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            typesAsync.when(
              data: (list) => DropdownButtonFormField<String>(
                decoration: const InputDecoration(labelText: 'Pilih Jenis Kegiatan', border: OutlineInputBorder()),
                items: list.map((e) => DropdownMenuItem(value: e.id, child: Text(e.nama))).toList(),
                onChanged: (val) => setState(() => _selectedJenisKegiatanId = val),
              ),
              loading: () => const LinearProgressIndicator(),
              error: (e, s) => Text('Error: $e'),
            ),
            const SizedBox(height: 24),
            const Text('Pilih Pegawai', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(height: 8),
            Expanded(
              child: teamAsync.when(
                data: (list) => ListView.builder(
                  itemCount: list.length,
                  itemBuilder: (context, index) {
                    final p = list[index];
                    return CheckboxListTile(
                      title: Text(p.namaLengkap),
                      subtitle: Text(p.jabatan),
                      value: _selectedPegawaiIds.contains(p.id),
                      onChanged: (val) {
                        setState(() {
                          if (val == true) {
                            _selectedPegawaiIds.add(p.id);
                          } else {
                            _selectedPegawaiIds.remove(p.id);
                          }
                        });
                      },
                    );
                  },
                ),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, s) => Text('Error: $e'),
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _submit,
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
              child: const Text('Simpan Penugasan', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }
}
