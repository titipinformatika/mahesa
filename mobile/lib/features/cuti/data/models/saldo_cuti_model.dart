import 'package:freezed_annotation/freezed_annotation.dart';

part 'saldo_cuti_model.freezed.dart';
part 'saldo_cuti_model.g.dart';

@freezed
abstract class SaldoCutiModel with _$SaldoCutiModel {
  factory SaldoCutiModel({
    required String id,
    @JsonKey(name: 'id_jenis_cuti') required String idJenisCuti,
    @JsonKey(name: 'nama_jenis_cuti') required String namaJenisCuti,
    required int total,
    required int terpakai,
    required int sisa,
  }) = _SaldoCutiModel;

  factory SaldoCutiModel.fromJson(Map<String, dynamic> json) => _$SaldoCutiModelFromJson(json);
}
