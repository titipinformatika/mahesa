// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'team_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$TeamMemberSummaryModel {

 String get id;@JsonKey(name: 'nama_lengkap') String get namaLengkap; String get jabatan;@JsonKey(name: 'sisa_cuti') int get sisaCuti;@JsonKey(name: 'skor_review') double? get skorReview;
/// Create a copy of TeamMemberSummaryModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TeamMemberSummaryModelCopyWith<TeamMemberSummaryModel> get copyWith => _$TeamMemberSummaryModelCopyWithImpl<TeamMemberSummaryModel>(this as TeamMemberSummaryModel, _$identity);

  /// Serializes this TeamMemberSummaryModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TeamMemberSummaryModel&&(identical(other.id, id) || other.id == id)&&(identical(other.namaLengkap, namaLengkap) || other.namaLengkap == namaLengkap)&&(identical(other.jabatan, jabatan) || other.jabatan == jabatan)&&(identical(other.sisaCuti, sisaCuti) || other.sisaCuti == sisaCuti)&&(identical(other.skorReview, skorReview) || other.skorReview == skorReview));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,namaLengkap,jabatan,sisaCuti,skorReview);

@override
String toString() {
  return 'TeamMemberSummaryModel(id: $id, namaLengkap: $namaLengkap, jabatan: $jabatan, sisaCuti: $sisaCuti, skorReview: $skorReview)';
}


}

/// @nodoc
abstract mixin class $TeamMemberSummaryModelCopyWith<$Res>  {
  factory $TeamMemberSummaryModelCopyWith(TeamMemberSummaryModel value, $Res Function(TeamMemberSummaryModel) _then) = _$TeamMemberSummaryModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'nama_lengkap') String namaLengkap, String jabatan,@JsonKey(name: 'sisa_cuti') int sisaCuti,@JsonKey(name: 'skor_review') double? skorReview
});




}
/// @nodoc
class _$TeamMemberSummaryModelCopyWithImpl<$Res>
    implements $TeamMemberSummaryModelCopyWith<$Res> {
  _$TeamMemberSummaryModelCopyWithImpl(this._self, this._then);

  final TeamMemberSummaryModel _self;
  final $Res Function(TeamMemberSummaryModel) _then;

/// Create a copy of TeamMemberSummaryModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? namaLengkap = null,Object? jabatan = null,Object? sisaCuti = null,Object? skorReview = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,namaLengkap: null == namaLengkap ? _self.namaLengkap : namaLengkap // ignore: cast_nullable_to_non_nullable
as String,jabatan: null == jabatan ? _self.jabatan : jabatan // ignore: cast_nullable_to_non_nullable
as String,sisaCuti: null == sisaCuti ? _self.sisaCuti : sisaCuti // ignore: cast_nullable_to_non_nullable
as int,skorReview: freezed == skorReview ? _self.skorReview : skorReview // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}

}


/// Adds pattern-matching-related methods to [TeamMemberSummaryModel].
extension TeamMemberSummaryModelPatterns on TeamMemberSummaryModel {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TeamMemberSummaryModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TeamMemberSummaryModel() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TeamMemberSummaryModel value)  $default,){
final _that = this;
switch (_that) {
case _TeamMemberSummaryModel():
return $default(_that);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TeamMemberSummaryModel value)?  $default,){
final _that = this;
switch (_that) {
case _TeamMemberSummaryModel() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sisa_cuti')  int sisaCuti, @JsonKey(name: 'skor_review')  double? skorReview)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TeamMemberSummaryModel() when $default != null:
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sisaCuti,_that.skorReview);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sisa_cuti')  int sisaCuti, @JsonKey(name: 'skor_review')  double? skorReview)  $default,) {final _that = this;
switch (_that) {
case _TeamMemberSummaryModel():
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sisaCuti,_that.skorReview);case _:
  throw StateError('Unexpected subclass');

}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sisa_cuti')  int sisaCuti, @JsonKey(name: 'skor_review')  double? skorReview)?  $default,) {final _that = this;
switch (_that) {
case _TeamMemberSummaryModel() when $default != null:
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sisaCuti,_that.skorReview);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TeamMemberSummaryModel implements TeamMemberSummaryModel {
   _TeamMemberSummaryModel({required this.id, @JsonKey(name: 'nama_lengkap') required this.namaLengkap, required this.jabatan, @JsonKey(name: 'sisa_cuti') required this.sisaCuti, @JsonKey(name: 'skor_review') this.skorReview});
  factory _TeamMemberSummaryModel.fromJson(Map<String, dynamic> json) => _$TeamMemberSummaryModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'nama_lengkap') final  String namaLengkap;
@override final  String jabatan;
@override@JsonKey(name: 'sisa_cuti') final  int sisaCuti;
@override@JsonKey(name: 'skor_review') final  double? skorReview;

/// Create a copy of TeamMemberSummaryModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TeamMemberSummaryModelCopyWith<_TeamMemberSummaryModel> get copyWith => __$TeamMemberSummaryModelCopyWithImpl<_TeamMemberSummaryModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TeamMemberSummaryModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _TeamMemberSummaryModel&&(identical(other.id, id) || other.id == id)&&(identical(other.namaLengkap, namaLengkap) || other.namaLengkap == namaLengkap)&&(identical(other.jabatan, jabatan) || other.jabatan == jabatan)&&(identical(other.sisaCuti, sisaCuti) || other.sisaCuti == sisaCuti)&&(identical(other.skorReview, skorReview) || other.skorReview == skorReview));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,namaLengkap,jabatan,sisaCuti,skorReview);

@override
String toString() {
  return 'TeamMemberSummaryModel(id: $id, namaLengkap: $namaLengkap, jabatan: $jabatan, sisaCuti: $sisaCuti, skorReview: $skorReview)';
}


}

/// @nodoc
abstract mixin class _$TeamMemberSummaryModelCopyWith<$Res> implements $TeamMemberSummaryModelCopyWith<$Res> {
  factory _$TeamMemberSummaryModelCopyWith(_TeamMemberSummaryModel value, $Res Function(_TeamMemberSummaryModel) _then) = __$TeamMemberSummaryModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'nama_lengkap') String namaLengkap, String jabatan,@JsonKey(name: 'sisa_cuti') int sisaCuti,@JsonKey(name: 'skor_review') double? skorReview
});




}
/// @nodoc
class __$TeamMemberSummaryModelCopyWithImpl<$Res>
    implements _$TeamMemberSummaryModelCopyWith<$Res> {
  __$TeamMemberSummaryModelCopyWithImpl(this._self, this._then);

  final _TeamMemberSummaryModel _self;
  final $Res Function(_TeamMemberSummaryModel) _then;

/// Create a copy of TeamMemberSummaryModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? namaLengkap = null,Object? jabatan = null,Object? sisaCuti = null,Object? skorReview = freezed,}) {
  return _then(_TeamMemberSummaryModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,namaLengkap: null == namaLengkap ? _self.namaLengkap : namaLengkap // ignore: cast_nullable_to_non_nullable
as String,jabatan: null == jabatan ? _self.jabatan : jabatan // ignore: cast_nullable_to_non_nullable
as String,sisaCuti: null == sisaCuti ? _self.sisaCuti : sisaCuti // ignore: cast_nullable_to_non_nullable
as int,skorReview: freezed == skorReview ? _self.skorReview : skorReview // ignore: cast_nullable_to_non_nullable
as double?,
  ));
}


}

// dart format on
