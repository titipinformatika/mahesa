// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'saldo_cuti_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SaldoCutiModel _$SaldoCutiModelFromJson(Map<String, dynamic> json) =>
    _SaldoCutiModel(
      id: json['id'] as String,
      idJenisCuti: json['id_jenis_cuti'] as String,
      namaJenisCuti: json['nama_jenis_cuti'] as String,
      total: (json['total'] as num).toInt(),
      terpakai: (json['terpakai'] as num).toInt(),
      sisa: (json['sisa'] as num).toInt(),
    );

Map<String, dynamic> _$SaldoCutiModelToJson(_SaldoCutiModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'id_jenis_cuti': instance.idJenisCuti,
      'nama_jenis_cuti': instance.namaJenisCuti,
      'total': instance.total,
      'terpakai': instance.terpakai,
      'sisa': instance.sisa,
    };
