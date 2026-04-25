import 'package:freezed_annotation/freezed_annotation.dart';

part 'cuti_model.freezed.dart';
part 'cuti_model.g.dart';

@freezed
abstract class CutiModel with _$CutiModel {
  factory CutiModel({
    required String id,
    @JsonKey(name: 'id_pegawai') required String idPegawai,
    @JsonKey(name: 'id_jenis_cuti') required String idJenisCuti,
    @JsonKey(name: 'nama_jenis_cuti') String? namaJenisCuti,
    @JsonKey(name: 'tanggal_mulai') required DateTime tanggalMulai,
    @JsonKey(name: 'tanggal_selesai') required DateTime tanggalSelesai,
    @JsonKey(name: 'total_hari') required int totalHari,
    required String alasan,
    required String status,
    @JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,
    @JsonKey(name: 'dokumen_url') String? dokumenUrl,
    @JsonKey(name: 'created_at') DateTime? createdAt,
  }) = _CutiModel;

  factory CutiModel.fromJson(Map<String, dynamic> json) => _$CutiModelFromJson(json);
}

@freezed
abstract class JenisCutiModel with _$JenisCutiModel {
  factory JenisCutiModel({
    required String id,
    required String nama,
    String? keterangan,
  }) = _JenisCutiModel;

  factory JenisCutiModel.fromJson(Map<String, dynamic> json) => _$JenisCutiModelFromJson(json);
}
