import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:slide_to_act/slide_to_act.dart';
import '../providers/attendance_provider.dart';
import 'package:mahesa_mobile/features/auth/presentation/providers/auth_provider.dart';
import 'package:mahesa_mobile/core/utils/location_validator.dart';

class ClockInOutPage extends ConsumerStatefulWidget {
  final String type; // 'jam_masuk' or 'jam_pulang'
  const ClockInOutPage({super.key, required this.type});

  @override
  ConsumerState<ClockInOutPage> createState() => _ClockInOutPageState();
}

class _ClockInOutPageState extends ConsumerState<ClockInOutPage> {
  File? _image;
  Position? _currentPosition;
  bool _isLoading = false;
  String? _errorMessage;
  double? _distanceToOffice;
  dynamic _unitData;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    setState(() => _isLoading = true);
    try {
      // 1. Get current location
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      
      if (permission == LocationPermission.always || permission == LocationPermission.whileInUse) {
        final position = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(accuracy: LocationAccuracy.high),
        );
        _currentPosition = position;
        if (LocationValidator.isMockLocation(position)) {
          _errorMessage = "Terdeteksi Fake GPS! Silakan matikan aplikasi mock location.";
        }
      } else {
        _errorMessage = "Izin lokasi diperlukan.";
      }

      // 2. Get Unit Office Location
      final profileResponse = await ref.read(userProfileProvider.future);
      final profileData = profileResponse['data'] as Map<String, dynamic>?;
      final String? unitId = profileData?['id_unit_kerja'] ?? profileResponse['id_unit_kerja'];
      
      if (unitId != null) {
        final unitResponse = await ref.read(unitDetailProvider(unitId).future);
        _unitData = unitResponse['data'];
        
        if (_unitData != null && _currentPosition != null) {
          final double officeLat = double.parse(_unitData['latitude']);
          final double officeLng = double.parse(_unitData['longitude']);
          
          _distanceToOffice = Geolocator.distanceBetween(
            _currentPosition!.latitude,
            _currentPosition!.longitude,
            officeLat,
            officeLng,
          );
        }
      }
      
      setState(() => _isLoading = false);
    } catch (e) {
      setState(() {
        _errorMessage = "Gagal memuat data: $e";
        _isLoading = false;
      });
    }
  }

  Future<void> _takePicture() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(
      source: ImageSource.camera,
      preferredCameraDevice: CameraDevice.front,
      maxWidth: 1000,
      imageQuality: 80,
    );

    if (pickedFile != null) {
      setState(() {
        _image = File(pickedFile.path);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final String label = widget.type == 'jam_masuk' ? 'Masuk' : 'Pulang';
    final double radius = _unitData != null ? (_unitData['radius_absensi_meter']?.toDouble() ?? 100.0) : 100.0;
    final bool isOutside = _distanceToOffice != null && _distanceToOffice! > radius;

    return Scaffold(
      appBar: AppBar(title: Text('Absen $label')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _buildImagePicker(),
            const SizedBox(height: 32),
            _buildLocationInfo(radius),
            const SizedBox(height: 48),
            if (isOutside)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.red.shade50, borderRadius: BorderRadius.circular(12)),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Anda berada di luar radius (${_distanceToOffice!.toStringAsFixed(0)}m). Jarak maksimal: ${radius.toStringAsFixed(0)}m',
                        style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              )
            else if (_image != null && _currentPosition != null && _unitData != null)
              _buildSlider()
            else if (_errorMessage != null)
              Text(_errorMessage!, style: const TextStyle(color: Colors.red))
            else
              Text(
                _image == null ? 'Silakan ambil foto selfie' : 'Menyiapkan data...',
                style: const TextStyle(fontStyle: FontStyle.italic, color: Colors.grey),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePicker() {
    return GestureDetector(
      onTap: _takePicture,
      child: Container(
        width: 200,
        height: 200,
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(100),
          border: Border.all(color: Colors.blue.shade200, width: 2),
          image: _image != null ? DecorationImage(image: FileImage(_image!), fit: BoxFit.cover) : null,
        ),
        child: _image == null
            ? const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.camera_alt, size: 48, color: Colors.blue),
                  SizedBox(height: 8),
                  Text('Ambil Selfie', style: TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
                ],
              )
            : null,
      ),
    );
  }

  Widget _buildLocationInfo(double radius) {
    if (_isLoading) return const CircularProgressIndicator();
    if (_currentPosition == null) return const Icon(Icons.location_off, color: Colors.red);

    return Column(
      children: [
        Icon(
          Icons.location_on, 
          color: (_distanceToOffice != null && _distanceToOffice! <= radius) ? Colors.green : Colors.red, 
          size: 32
        ),
        const SizedBox(height: 8),
        Text(
          'Jarak ke Kantor:',
          style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
        ),
        Text(
          _distanceToOffice != null 
            ? '${_distanceToOffice!.toStringAsFixed(1)} meter'
            : 'Menghitung...',
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
      ],
    );
  }

  Widget _buildSlider() {
    final String submitLabel = widget.type == 'jam_masuk' ? 'Masuk' : 'Pulang';
    return SlideAction(
      text: 'Geser untuk $submitLabel',
      innerColor: Colors.white,
      outerColor: widget.type == 'jam_masuk' ? Colors.blue : Colors.orange,
      onSubmit: () async {
        await _submit();
      },
    );
  }

  Future<void> _submit() async {
    try {
      await ref.read(attendanceServiceProvider).submitAbsensi(
        jenisTitik: widget.type,
        latitude: _currentPosition!.latitude,
        longitude: _currentPosition!.longitude,
        foto: _image,
        isMockLocation: LocationValidator.isMockLocation(_currentPosition!),
      );
      
      if (mounted) {
        final label = widget.type == 'jam_masuk' ? 'Masuk' : 'Pulang';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Absen $label berhasil!')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Gagal: $e'), backgroundColor: Colors.red),
        );
      }
    }
  }
}
