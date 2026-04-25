// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'lhkp_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_LhkpModel _$LhkpModelFromJson(Map<String, dynamic> json) => _LhkpModel(
  id: json['id'] as String,
  idPegawai: json['id_pegawai'] as String,
  tanggal: DateTime.parse(json['tanggal'] as String),
  status: json['status'] as String,
  catatanPimpinan: json['catatan_pimpinan'] as String?,
  namaPegawai: json['nama_pegawai'] as String?,
  details: (json['details'] as List<dynamic>?)
      ?.map((e) => LhkpDetailModel.fromJson(e as Map<String, dynamic>))
      .toList(),
  jumlahKegiatan: (json['jumlah_kegiatan'] as num?)?.toInt(),
);

Map<String, dynamic> _$LhkpModelToJson(_LhkpModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'id_pegawai': instance.idPegawai,
      'tanggal': instance.tanggal.toIso8601String(),
      'status': instance.status,
      'catatan_pimpinan': instance.catatanPimpinan,
      'nama_pegawai': instance.namaPegawai,
      'details': instance.details,
      'jumlah_kegiatan': instance.jumlahKegiatan,
    };

_LhkpDetailModel _$LhkpDetailModelFromJson(Map<String, dynamic> json) =>
    _LhkpDetailModel(
      id: json['id'] as String?,
      idJenisKegiatan: json['id_jenis_kegiatan'] as String,
      namaJenisKegiatan: json['nama_jenis_kegiatan'] as String?,
      jamMulai: json['jam_mulai'] as String,
      jamSelesai: json['jam_selesai'] as String,
      uraian: json['uraian'] as String,
    );

Map<String, dynamic> _$LhkpDetailModelToJson(_LhkpDetailModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'id_jenis_kegiatan': instance.idJenisKegiatan,
      'nama_jenis_kegiatan': instance.namaJenisKegiatan,
      'jam_mulai': instance.jamMulai,
      'jam_selesai': instance.jamSelesai,
      'uraian': instance.uraian,
    };

_JenisKegiatanModel _$JenisKegiatanModelFromJson(Map<String, dynamic> json) =>
    _JenisKegiatanModel(
      id: json['id'] as String,
      nama: json['nama'] as String,
      keterangan: json['keterangan'] as String?,
    );

Map<String, dynamic> _$JenisKegiatanModelToJson(_JenisKegiatanModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'nama': instance.nama,
      'keterangan': instance.keterangan,
    };
