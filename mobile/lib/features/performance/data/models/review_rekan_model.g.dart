// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_rekan_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_TargetReviewModel _$TargetReviewModelFromJson(Map<String, dynamic> json) =>
    _TargetReviewModel(
      id: json['id'] as String,
      namaLengkap: json['nama_lengkap'] as String,
      jabatan: json['jabatan'] as String,
      sudahDireview: json['sudah_direview'] as bool,
    );

Map<String, dynamic> _$TargetReviewModelToJson(_TargetReviewModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'nama_lengkap': instance.namaLengkap,
      'jabatan': instance.jabatan,
      'sudah_direview': instance.sudahDireview,
    };

_ReviewRekanModel _$ReviewRekanModelFromJson(Map<String, dynamic> json) =>
    _ReviewRekanModel(
      id: json['id'] as String,
      idReviewer: json['id_reviewer'] as String,
      idTarget: json['id_target'] as String,
      bulan: (json['bulan'] as num).toInt(),
      tahun: (json['tahun'] as num).toInt(),
      skor: (json['skor'] as num).toInt(),
      komentar: json['komentar'] as String,
      namaTarget: json['nama_target'] as String?,
    );

Map<String, dynamic> _$ReviewRekanModelToJson(_ReviewRekanModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'id_reviewer': instance.idReviewer,
      'id_target': instance.idTarget,
      'bulan': instance.bulan,
      'tahun': instance.tahun,
      'skor': instance.skor,
      'komentar': instance.komentar,
      'nama_target': instance.namaTarget,
    };
