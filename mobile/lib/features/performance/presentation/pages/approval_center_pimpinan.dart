import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:mahesa_mobile/features/cuti/presentation/providers/cuti_provider.dart';
import 'package:mahesa_mobile/features/performance/presentation/providers/performance_provider.dart';

class ApprovalCenterPimpinan extends ConsumerWidget {
  const ApprovalCenterPimpinan({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Approval Center'),
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Cuti'),
              Tab(text: 'LHKP'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _TabPersetujuanCuti(),
            _TabPersetujuanLhkp(),
          ],
        ),
      ),
    );
  }
}

class _TabPersetujuanCuti extends ConsumerWidget {
  const _TabPersetujuanCuti();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listAsync = ref.watch(persetujuanCutiProvider);

    return listAsync.when(
      data: (list) {
        if (list.isEmpty) return const Center(child: Text('Tidak ada antrean cuti'));
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: list.length,
          itemBuilder: (context, index) {
            final cuti = list[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text(cuti.namaJenisCuti ?? 'Cuti'),
                subtitle: Text('Oleh: Staf\n${DateFormat('dd/MM/yy').format(cuti.tanggalMulai)} - ${DateFormat('dd/MM/yy').format(cuti.tanggalSelesai)}'),
                isThreeLine: true,
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.check_circle, color: Colors.green),
                      onPressed: () => _verifikasi(context, ref, cuti.id, 'disetujui'),
                    ),
                    IconButton(
                      icon: const Icon(Icons.cancel, color: Colors.red),
                      onPressed: () => _verifikasi(context, ref, cuti.id, 'ditolak'),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, s) => Center(child: Text('Error: $e')),
    );
  }

  void _verifikasi(BuildContext context, WidgetRef ref, String id, String status) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Konfirmasi ${status.toUpperCase()}'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Catatan (Opsional)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              await ref.read(pimpinanCutiActionProvider.notifier).verifikasiCuti(
                idCuti: id,
                status: status,
                catatan: controller.text,
              );
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
  }
}

class _TabPersetujuanLhkp extends ConsumerWidget {
  const _TabPersetujuanLhkp();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listAsync = ref.watch(persetujuanLhkpProvider);

    return listAsync.when(
      data: (list) {
        if (list.isEmpty) return const Center(child: Text('Tidak ada antrean LHKP'));
        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: list.length,
          itemBuilder: (context, index) {
            final lhkp = list[index];
            return Card(
              margin: const EdgeInsets.only(bottom: 12),
              child: ListTile(
                title: Text('LHKP ${DateFormat('dd MMM').format(lhkp.tanggal)}'),
                subtitle: Text('Oleh: ${lhkp.namaPegawai ?? 'Staf'}\n${lhkp.jumlahKegiatan} Kegiatan'),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.check_circle, color: Colors.green),
                      onPressed: () => _verifikasi(context, ref, lhkp.id, 'disetujui'),
                    ),
                    IconButton(
                      icon: const Icon(Icons.assignment_return, color: Colors.orange),
                      onPressed: () => _verifikasi(context, ref, lhkp.id, 'revisi'),
                    ),
                  ],
                ),
                onTap: () => _showDetail(context, lhkp),
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, s) => Center(child: Text('Error: $e')),
    );
  }

  void _showDetail(BuildContext context, dynamic lhkp) {
    // Show detail in a dialog or new page
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        expand: false,
        builder: (context, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Detail LHKP', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ... (lhkp.details ?? []).map((d) => ListTile(
              title: Text(d.namaJenisKegiatan ?? 'Kegiatan'),
              subtitle: Text('${d.jamMulai} - ${d.jamSelesai}\n${d.uraian}'),
            )),
          ],
        ),
      ),
    );
  }

  void _verifikasi(BuildContext context, WidgetRef ref, String id, String status) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Konfirmasi ${status.toUpperCase()}'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(labelText: 'Catatan (Opsional)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Batal')),
          ElevatedButton(
            onPressed: () async {
              await ref.read(pimpinanPerformanceActionProvider.notifier).verifikasiLhkp(
                idLhkp: id,
                status: status,
                catatan: controller.text,
              );
              if (context.mounted) Navigator.pop(context);
            },
            child: const Text('Simpan'),
          ),
        ],
      ),
    );
  }
}
