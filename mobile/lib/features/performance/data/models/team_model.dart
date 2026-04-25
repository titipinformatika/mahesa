import 'package:freezed_annotation/freezed_annotation.dart';

part 'team_model.freezed.dart';
part 'team_model.g.dart';

@freezed
abstract class TeamMemberSummaryModel with _$TeamMemberSummaryModel {
  factory TeamMemberSummaryModel({
    required String id,
    @JsonKey(name: 'nama_lengkap') required String namaLengkap,
    required String jabatan,
    @JsonKey(name: 'sisa_cuti') required int sisaCuti,
    @JsonKey(name: 'skor_review') double? skorReview,
  }) = _TeamMemberSummaryModel;

  factory TeamMemberSummaryModel.fromJson(Map<String, dynamic> json) => _$TeamMemberSummaryModelFromJson(json);
}
