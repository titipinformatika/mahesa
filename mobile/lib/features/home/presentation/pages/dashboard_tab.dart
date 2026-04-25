import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:shimmer/shimmer.dart';
import 'package:mahesa_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:mahesa_mobile/features/home/presentation/providers/pimpinan_provider.dart';
import 'package:mahesa_mobile/features/announcement/presentation/providers/announcement_provider.dart';
import 'package:mahesa_mobile/features/attendance/presentation/providers/attendance_provider.dart';

class DashboardTab extends ConsumerWidget {
  const DashboardTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);

    return profileAsync.when(
      data: (profile) {
        final isPimpinan = profile['peran'] == 'pimpinan' || 
                          profile['peran'] == 'admin_unit' || 
                          profile['peran'] == 'admin_upt' ||
                          profile['peran'] == 'admin_dinas';
        final isPegawai = profile['peran'] == 'pegawai';
        if (isPimpinan) {
          return _buildPimpinanDashboard(context, ref, profile);
        }
        return _buildPegawaiDashboard(context, ref, profile);
      },
      loading: () => _buildLoadingState(),
      error: (e, st) => Scaffold(body: Center(child: Text('Terjadi kesalahan: $e'))),
    );
  }

  Widget _buildLoadingState() {
    return Scaffold(
      body: Shimmer.fromColors(
        baseColor: Colors.grey[300]!,
        highlightColor: Colors.grey[100]!,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              const SizedBox(height: 40),
              Container(
                width: double.infinity, 
                height: 120, 
                decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20))
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(child: Container(height: 100, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)))),
                  const SizedBox(width: 12),
                  Expanded(child: Container(height: 100, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)))),
                ],
              ),
              const SizedBox(height: 24),
              Container(width: 200, height: 20, color: Colors.white),
              const SizedBox(height: 12),
              Container(width: double.infinity, height: 150, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPimpinanDashboard(BuildContext context, WidgetRef ref, dynamic profile) {
    final statsAsync = ref.watch(ringkasanPimpinanProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(ringkasanPimpinanProvider);
          ref.invalidate(userProfileProvider);
          ref.invalidate(latestAnnouncementsProvider);
        },
        child: CustomScrollView(
          slivers: [
            _buildSliverHeader(context, ref, profile),
            SliverPadding(
              padding: const EdgeInsets.all(16.0),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const Text(
                    'Statistik Unit Kerja',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                  const SizedBox(height: 12),
                  statsAsync.when(
                    data: (stats) => GridView.count(
                      crossAxisCount: 2,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.4,
                      children: [
                        _buildSummaryCard('Hadir', stats['hadir'].toString(), Icons.people, Colors.green),
                        _buildSummaryCard('Terlambat', stats['terlambat'].toString(), Icons.warning, Colors.red),
                        _buildSummaryCard('Dinas Luar', stats['dl'].toString(), Icons.business_center, Colors.blue),
                        _buildSummaryCard('Izin/Sakit', stats['izin'].toString(), Icons.event_note, Colors.orange),
                      ],
                    ),
                    loading: () => _buildGridShimmer(),
                    error: (e, st) => Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(12)),
                      child: Text('Gagal memuat statistik: $e', style: const TextStyle(color: Colors.red)),
                    ),
                  ),
                  const SizedBox(height: 28),
                  _buildAnnouncementWidget(context, ref),
                  const SizedBox(height: 28),
                  const Text(
                    'Menu Utama',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildQuickAction(context, 'Persetujuan', Icons.fact_check, Colors.orange, () => context.push('/persetujuan-dl')),
                      _buildQuickAction(context, 'Pantauan DL', Icons.map, Colors.blue, () => context.push('/peta-pantauan')),
                      _buildQuickAction(context, 'Rekap Tim', Icons.analytics, Colors.teal, () => context.push('/rekap-tim')),
                      _buildQuickAction(context, 'Laporan', Icons.description, Colors.indigo, () => context.push('/laporan-dinas')),
                    ],
                  ),
                  const SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPegawaiDashboard(BuildContext context, WidgetRef ref, dynamic profile) {
    final now = DateTime.now();
    final rekapAsync = ref.watch(ringkasanPegawaiProvider((bulan: now.month, tahun: now.year)));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(userProfileProvider);
          ref.invalidate(ringkasanPegawaiProvider((bulan: now.month, tahun: now.year)));
          ref.invalidate(latestAnnouncementsProvider);
        },
        child: CustomScrollView(
          slivers: [
            _buildSliverHeader(context, ref, profile),
            SliverPadding(
              padding: const EdgeInsets.all(16.0),
              sliver: SliverList(
                delegate: SliverChildListDelegate([
                  const Text(
                    'Kehadiran Saya (Bulan Ini)',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                  const SizedBox(height: 12),
                  rekapAsync.when(
                    data: (data) {
                        final totalHari = data['total_hari'] ?? 1;
                        final hadir = data['hadir'] ?? 0;
                        final persentase = ((hadir / totalHari) * 100).round();
                        return Column(
                          children: [
                            Row(
                                children: [
                                    _buildSummaryCard('Kehadiran', '$persentase%', Icons.trending_up, Colors.green),
                                    const SizedBox(width: 12),
                                    _buildSummaryCard('Sisa Cuti', '${data['sisa_cuti'] ?? 12} hari', Icons.event_available, Colors.purple),
                                ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                                children: [
                                    _buildSummaryCard('Terlambat', '${data['terlambat'] ?? 0} hari', Icons.warning_amber_rounded, Colors.red),
                                    const SizedBox(width: 12),
                                    _buildSummaryCard('Dinas Luar', '${data['dl'] ?? 0} kali', Icons.business_center, Colors.blue),
                                ],
                            ),
                          ],
                        );
                    },
                    loading: () => _buildRowShimmer(),
                    error: (e, st) => Text('Error: $e'),
                  ),
                  const SizedBox(height: 28),
                  _buildAnnouncementWidget(context, ref),
                  const SizedBox(height: 28),
                  const Text(
                    'Layanan Mandiri',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      _buildQuickAction(context, 'Absensi', Icons.fingerprint, Colors.green, () => context.push('/clock-in-out', extra: 'jam_masuk')),
                      _buildQuickAction(context, 'Dinas Luar', Icons.business_center, Colors.blue, () => context.push('/riwayat-dl')),
                      _buildQuickAction(context, 'Cuti', Icons.event_busy, Colors.orange, () => context.push('/riwayat-cuti')),
                      _buildQuickAction(context, 'LHKP', Icons.assignment_turned_in, Colors.teal, () => context.push('/laporan-dinas')),
                    ],
                  ),
                  const SizedBox(height: 40),
                ]),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSliverHeader(BuildContext context, WidgetRef ref, dynamic profile) {
    return SliverAppBar(
      expandedHeight: 180.0,
      floating: false,
      pinned: true,
      backgroundColor: const Color(0xFF1565C0),
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF1565C0), Color(0xFF1E88E5)],
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                right: -20,
                top: -20,
                child: CircleAvatar(
                  radius: 80,
                  backgroundColor: Colors.white.withOpacity(0.05),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 80, 20, 0),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(2),
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                      ),
                      child: CircleAvatar(
                        radius: 35,
                        backgroundColor: Colors.blue.shade50,
                        child: profile['url_foto'] != null 
                          ? ClipOval(child: Image.network(profile['url_foto'], fit: BoxFit.cover, width: 70, height: 70))
                          : const Icon(Icons.person, size: 45, color: Colors.blue),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            profile['nama_lengkap'] ?? 'User Mahesa',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 18, 
                              fontWeight: FontWeight.bold, 
                              color: Colors.white
                            ),
                          ),
                          Text(
                            'NIP: ${profile['nip'] ?? '-'}',
                            style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 11),
                          ),
                          const SizedBox(height: 2),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              profile['peran'].toString().toUpperCase(),
                              style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            profile['nama_unit'] ?? '-',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.notifications_none, color: Colors.white),
          onPressed: () => context.push('/pengumuman'),
        ),
        IconButton(
          icon: const Icon(Icons.logout, color: Colors.white),
          onPressed: () => _handleLogout(context, ref),
        ),
      ],
    );
  }

  void _handleLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Keluar'),
        content: const Text('Apakah Anda yakin ingin keluar?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Batal')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Keluar', style: TextStyle(color: Colors.red))),
        ],
      ),
    );

    if (confirmed == true) {
      await ref.read(authControllerProvider.notifier).logout();
      if (context.mounted) {
        context.go('/login');
      }
    }
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 24),
                Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(color: color.withOpacity(0.3), shape: BoxShape.circle),
                )
              ],
            ),
            const SizedBox(height: 16),
            Text(
              value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(color: Colors.grey.shade500, fontSize: 12, fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickAction(BuildContext context, String title, IconData icon, Color color, VoidCallback onTap) {
    return SizedBox(
      width: (MediaQuery.of(context).size.width - 44) / 3,
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, color: color, size: 26),
                ),
                const SizedBox(height: 10),
                Text(
                  title, 
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF475569))
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGridShimmer() {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.4,
      children: List.generate(4, (index) => Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)))),
    );
  }

  Widget _buildRowShimmer() {
    return Row(
      children: [
        Expanded(child: Container(height: 100, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)))),
        const SizedBox(width: 12),
        Expanded(child: Container(height: 100, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)))),
      ],
    );
  }

  Widget _buildAnnouncementWidget(BuildContext context, WidgetRef ref) {
    final latestAsync = ref.watch(latestAnnouncementsProvider);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Pengumuman Terbaru',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
            ),
            TextButton(
              onPressed: () => context.push('/pengumuman'),
              child: const Text('Lihat Semua'),
            ),
          ],
        ),
        const SizedBox(height: 4),
        latestAsync.when(
          data: (list) {
            if (list.isEmpty) {
              return Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.grey.shade100),
                ),
                child: const Text('Tidak ada pengumuman baru', style: TextStyle(color: Colors.grey)),
              );
            }
            return SizedBox(
              height: 120,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: list.length,
                itemBuilder: (context, index) {
                  final item = list[index];
                  return Container(
                    width: 280,
                    margin: const EdgeInsets.only(right: 12),
                    child: Material(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      child: InkWell(
                        onTap: () => context.push('/pengumuman/${item.id}'),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(16.0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFF1F5F9)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.judul,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF1E293B)),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                item.konten,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade600, height: 1.4),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            );
          },
          loading: () => Container(height: 120, width: double.infinity, decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16))),
          error: (e, st) => Text('Error: $e'),
        ),
      ],
    );
  }
}
