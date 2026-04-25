// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cuti_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_CutiModel _$CutiModelFromJson(Map<String, dynamic> json) => _CutiModel(
  id: json['id'] as String,
  idPegawai: json['id_pegawai'] as String,
  idJenisCuti: json['id_jenis_cuti'] as String,
  namaJenisCuti: json['nama_jenis_cuti'] as String?,
  tanggalMulai: DateTime.parse(json['tanggal_mulai'] as String),
  tanggalSelesai: DateTime.parse(json['tanggal_selesai'] as String),
  totalHari: (json['total_hari'] as num).toInt(),
  alasan: json['alasan'] as String,
  status: json['status'] as String,
  catatanPimpinan: json['catatan_pimpinan'] as String?,
  dokumenUrl: json['dokumen_url'] as String?,
  createdAt: json['created_at'] == null
      ? null
      : DateTime.parse(json['created_at'] as String),
);

Map<String, dynamic> _$CutiModelToJson(_CutiModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'id_pegawai': instance.idPegawai,
      'id_jenis_cuti': instance.idJenisCuti,
      'nama_jenis_cuti': instance.namaJenisCuti,
      'tanggal_mulai': instance.tanggalMulai.toIso8601String(),
      'tanggal_selesai': instance.tanggalSelesai.toIso8601String(),
      'total_hari': instance.totalHari,
      'alasan': instance.alasan,
      'status': instance.status,
      'catatan_pimpinan': instance.catatanPimpinan,
      'dokumen_url': instance.dokumenUrl,
      'created_at': instance.createdAt?.toIso8601String(),
    };

_JenisCutiModel _$JenisCutiModelFromJson(Map<String, dynamic> json) =>
    _JenisCutiModel(
      id: json['id'] as String,
      nama: json['nama'] as String,
      keterangan: json['keterangan'] as String?,
    );

Map<String, dynamic> _$JenisCutiModelToJson(_JenisCutiModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'nama': instance.nama,
      'keterangan': instance.keterangan,
    };
