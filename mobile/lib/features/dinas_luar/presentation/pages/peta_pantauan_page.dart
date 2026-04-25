import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:latlong2/latlong.dart';
import '../providers/dinas_luar_provider.dart';

class PetaPantauanPage extends ConsumerWidget {
  const PetaPantauanPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final petaAsync = ref.watch(petaPantauanProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Pantauan Lokasi DL'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.refresh(petaPantauanProvider),
          ),
        ],
      ),
      body: petaAsync.when(
        data: (data) {
          final markers = data.map((item) {
            final lat = double.tryParse(item['latitude'].toString()) ?? 0.0;
            final lng = double.tryParse(item['longitude'].toString()) ?? 0.0;
            return Marker(
              point: LatLng(lat, lng),
              width: 80,
              height: 80,
              child: GestureDetector(
                onTap: () => _showInfo(context, item),
                child: const Column(
                  children: [
                    Icon(Icons.person_pin_circle, color: Colors.red, size: 40),
                  ],
                ),
              ),
            );
          }).toList();

          return FlutterMap(
            options: MapOptions(
              initialCenter: markers.isNotEmpty ? markers.first.point : const LatLng(-6.1754, 106.8272),
              initialZoom: 13,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.mahesa.mobile',
              ),
              MarkerLayer(markers: markers),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Gagal memuat peta: $e')),
      ),
    );
  }

  void _showInfo(BuildContext context, dynamic item) {
    showModalBottomSheet(
      context: context,
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              item['nama_lengkap'] ?? 'Pegawai',
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Tujuan: ${item['tujuan'] ?? '-'}'),
            Text('Lokasi: ${item['latitude']}, ${item['longitude']}'),
            Text('Waktu Log: ${item['waktu_log'] ?? '-'}'),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('TUTUP'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
