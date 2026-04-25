import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../providers/dinas_luar_provider.dart';

class CheckpointDLPage extends ConsumerStatefulWidget {
  final Map<String, dynamic> pengajuan;
  
  const CheckpointDLPage({super.key, required this.pengajuan});

  @override
  ConsumerState<CheckpointDLPage> createState() => _CheckpointDLPageState();
}

class _CheckpointDLPageState extends ConsumerState<CheckpointDLPage> {
  bool _isLoading = false;
  Position? _currentPosition;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _getLocation();
  }

  Future<void> _getLocation() async {
    setState(() => _isLoading = true);
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.always || permission == LocationPermission.whileInUse) {
        final position = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
        );
        setState(() {
          _currentPosition = position;
          _errorMessage = null;
        });
      } else {
        setState(() => _errorMessage = "Izin lokasi ditolak.");
      }
    } catch (e) {
      setState(() => _errorMessage = "Gagal mengambil lokasi: $e");
    } finally {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _pingLokasi() async {
    if (_currentPosition == null) {
      await _getLocation();
      if (_currentPosition == null) return;
    }

    setState(() => _isLoading = true);
    try {
      await ref.read(dinasLuarServiceProvider).pingLokasi(
        idPengajuanDL: widget.pengajuan['id'],
        latitude: _currentPosition!.latitude,
        longitude: _currentPosition!.longitude,
      );
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Lokasi berhasil dilaporkan!'), backgroundColor: Colors.green),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Absensi Dinas Luar')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: Colors.blue.shade50,
                  border: Border.all(color: Colors.blue.shade200),
                ),
                child: Column(
                  children: [
                    const Icon(Icons.business_center, size: 48, color: Colors.blue),
                    const SizedBox(height: 16),
                    Text(
                      widget.pengajuan['tujuan'] ?? 'Tujuan DL',
                      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Aktif pada: ${widget.pengajuan['tanggal_mulai']} s.d ${widget.pengajuan['tanggal_selesai']}',
                      style: TextStyle(color: Colors.grey.shade700),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),
            
            if (_isLoading)
              const CircularProgressIndicator()
            else if (_errorMessage != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red),
                    const SizedBox(width: 12),
                    Expanded(child: Text(_errorMessage!, style: const TextStyle(color: Colors.red))),
                  ],
                ),
              )
            else if (_currentPosition != null) ...[
              const Icon(Icons.location_on, color: Colors.green, size: 48),
              const SizedBox(height: 8),
              Text(
                'Lokasi Terdeteksi',
                style: TextStyle(fontSize: 18, color: Colors.green.shade700, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text('${_currentPosition!.latitude}, ${_currentPosition!.longitude}'),
              const SizedBox(height: 32),
              
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton.icon(
                  onPressed: _pingLokasi,
                  icon: const Icon(Icons.share_location),
                  label: const Text('LAPOR LOKASI (CHECKPOINT)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
            ],
            
            const SizedBox(height: 24),
            TextButton.icon(
              onPressed: _getLocation,
              icon: const Icon(Icons.refresh),
              label: const Text('Perbarui Lokasi GPS'),
            )
          ],
        ),
      ),
    );
  }
}
