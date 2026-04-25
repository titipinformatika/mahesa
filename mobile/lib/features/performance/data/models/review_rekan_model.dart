import 'package:freezed_annotation/freezed_annotation.dart';

part 'review_rekan_model.freezed.dart';
part 'review_rekan_model.g.dart';

@freezed
abstract class TargetReviewModel with _$TargetReviewModel {
  factory TargetReviewModel({
    required String id,
    @JsonKey(name: 'nama_lengkap') required String namaLengkap,
    required String jabatan,
    @JsonKey(name: 'sudah_direview') required bool sudahDireview,
  }) = _TargetReviewModel;

  factory TargetReviewModel.fromJson(Map<String, dynamic> json) => _$TargetReviewModelFromJson(json);
}

@freezed
abstract class ReviewRekanModel with _$ReviewRekanModel {
  factory ReviewRekanModel({
    required String id,
    @JsonKey(name: 'id_reviewer') required String idReviewer,
    @JsonKey(name: 'id_target') required String idTarget,
    required int bulan,
    required int tahun,
    required int skor,
    required String komentar,
    @JsonKey(name: 'nama_target') String? namaTarget,
  }) = _ReviewRekanModel;

  factory ReviewRekanModel.fromJson(Map<String, dynamic> json) => _$ReviewRekanModelFromJson(json);
}
