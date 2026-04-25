// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'team_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_TeamMemberSummaryModel _$TeamMemberSummaryModelFromJson(
  Map<String, dynamic> json,
) => _TeamMemberSummaryModel(
  id: json['id'] as String,
  namaLengkap: json['nama_lengkap'] as String,
  jabatan: json['jabatan'] as String,
  sisaCuti: (json['sisa_cuti'] as num).toInt(),
  skorReview: (json['skor_review'] as num?)?.toDouble(),
);

Map<String, dynamic> _$TeamMemberSummaryModelToJson(
  _TeamMemberSummaryModel instance,
) => <String, dynamic>{
  'id': instance.id,
  'nama_lengkap': instance.namaLengkap,
  'jabatan': instance.jabatan,
  'sisa_cuti': instance.sisaCuti,
  'skor_review': instance.skorReview,
};
