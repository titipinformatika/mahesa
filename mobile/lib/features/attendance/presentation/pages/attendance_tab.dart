import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/attendance_provider.dart';
import 'package:go_router/go_router.dart';

class AttendanceTab extends ConsumerStatefulWidget {
  const AttendanceTab({super.key});

  @override
  ConsumerState<AttendanceTab> createState() => _AttendanceTabState();
}

class _AttendanceTabState extends ConsumerState<AttendanceTab> {
  late Timer _timer;
  DateTime _now = DateTime.now();

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _now = DateTime.now();
        });
      }
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final statusAsync = ref.watch(attendanceStatusProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Absensi Kehadiran'),
        actions: [
          IconButton(
            icon: const Icon(Icons.history),
            onPressed: () => context.push('/attendance-history'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(attendanceStatusProvider.future),
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              _buildClockCard(),
              const SizedBox(height: 24),
              statusAsync.when(
                data: (data) => _buildStatusSection(data),
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => Center(child: Text('Error: $err')),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildClockCard() {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 32),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            colors: [Colors.blue.shade700, Colors.blue.shade500],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          children: [
            Text(
              DateFormat('EEEE, dd MMMM yyyy').format(_now),
              style: const TextStyle(color: Colors.white, fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              DateFormat('HH:mm:ss').format(_now),
              style: const TextStyle(
                color: Colors.white,
                fontSize: 48,
                fontWeight: FontWeight.bold,
                letterSpacing: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusSection(dynamic data) {
    final bool hasAbsen = data != null && data['status'] == 'success' && data['data'] != null;
    final Map<String, dynamic>? absenData = hasAbsen ? data['data'] : null;
    final List<dynamic> titik = absenData?['titik'] ?? [];

    final bool isMasuk = titik.any((t) => t['jenis_titik'] == 'jam_masuk');
    final bool isPulang = titik.any((t) => t['jenis_titik'] == 'jam_pulang');

    return Column(
      children: [
        Row(
          children: [
            _buildInfoCard(
              title: 'Jam Masuk',
              time: isMasuk 
                ? DateFormat('HH:mm').format(DateTime.parse(titik.firstWhere((t) => t['jenis_titik'] == 'jam_masuk')['waktu']))
                : '--:--',
              icon: Icons.login,
              color: Colors.green,
            ),
            const SizedBox(width: 16),
            _buildInfoCard(
              title: 'Jam Pulang',
              time: isPulang
                ? DateFormat('HH:mm').format(DateTime.parse(titik.firstWhere((t) => t['jenis_titik'] == 'jam_pulang')['waktu']))
                : '--:--',
              icon: Icons.logout,
              color: Colors.orange,
            ),
          ],
        ),
        const SizedBox(height: 40),
        if (!isPulang)
          SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              onPressed: () {
                final String type = !isMasuk ? 'jam_masuk' : 'jam_pulang';
                context.push('/clock-in-out', extra: type);
              },
              icon: Icon(!isMasuk ? Icons.camera_alt : Icons.exit_to_app),
              label: Text(
                !isMasuk ? 'ABSEN MASUK' : 'ABSEN PULANG',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: !isMasuk ? Colors.blue : Colors.orange,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          )
        else
          const Card(
            color: Colors.green,
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle, color: Colors.white),
                  SizedBox(width: 8),
                  Text(
                    'Anda sudah menyelesaikan absensi hari ini',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildInfoCard({required String title, required String time, required IconData icon, required Color color}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          children: [
            Icon(icon, color: color),
            const SizedBox(height: 8),
            Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 4),
            Text(
              time,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}
