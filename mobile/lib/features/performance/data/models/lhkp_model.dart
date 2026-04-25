import 'package:freezed_annotation/freezed_annotation.dart';

part 'lhkp_model.freezed.dart';
part 'lhkp_model.g.dart';

@freezed
abstract class LhkpModel with _$LhkpModel {
  factory LhkpModel({
    required String id,
    @JsonKey(name: 'id_pegawai') required String idPegawai,
    required DateTime tanggal,
    required String status,
    @JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,
    @JsonKey(name: 'nama_pegawai') String? namaPegawai,
    @JsonKey(name: 'details') List<LhkpDetailModel>? details,
    @JsonKey(name: 'jumlah_kegiatan') int? jumlahKegiatan,
  }) = _LhkpModel;

  factory LhkpModel.fromJson(Map<String, dynamic> json) => _$LhkpModelFromJson(json);
}

@freezed
abstract class LhkpDetailModel with _$LhkpDetailModel {
  factory LhkpDetailModel({
    String? id,
    @JsonKey(name: 'id_jenis_kegiatan') required String idJenisKegiatan,
    @JsonKey(name: 'nama_jenis_kegiatan') String? namaJenisKegiatan,
    @JsonKey(name: 'jam_mulai') required String jamMulai,
    @JsonKey(name: 'jam_selesai') required String jamSelesai,
    required String uraian,
  }) = _LhkpDetailModel;

  factory LhkpDetailModel.fromJson(Map<String, dynamic> json) => _$LhkpDetailModelFromJson(json);
}

@freezed
abstract class JenisKegiatanModel with _$JenisKegiatanModel {
  factory JenisKegiatanModel({
    required String id,
    required String nama,
    String? keterangan,
  }) = _JenisKegiatanModel;

  factory JenisKegiatanModel.fromJson(Map<String, dynamic> json) => _$JenisKegiatanModelFromJson(json);
}
