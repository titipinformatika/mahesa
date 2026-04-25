// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'review_rekan_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$TargetReviewModel {

 String get id;@JsonKey(name: 'nama_lengkap') String get namaLengkap; String get jabatan;@JsonKey(name: 'sudah_direview') bool get sudahDireview;
/// Create a copy of TargetReviewModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$TargetReviewModelCopyWith<TargetReviewModel> get copyWith => _$TargetReviewModelCopyWithImpl<TargetReviewModel>(this as TargetReviewModel, _$identity);

  /// Serializes this TargetReviewModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is TargetReviewModel&&(identical(other.id, id) || other.id == id)&&(identical(other.namaLengkap, namaLengkap) || other.namaLengkap == namaLengkap)&&(identical(other.jabatan, jabatan) || other.jabatan == jabatan)&&(identical(other.sudahDireview, sudahDireview) || other.sudahDireview == sudahDireview));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,namaLengkap,jabatan,sudahDireview);

@override
String toString() {
  return 'TargetReviewModel(id: $id, namaLengkap: $namaLengkap, jabatan: $jabatan, sudahDireview: $sudahDireview)';
}


}

/// @nodoc
abstract mixin class $TargetReviewModelCopyWith<$Res>  {
  factory $TargetReviewModelCopyWith(TargetReviewModel value, $Res Function(TargetReviewModel) _then) = _$TargetReviewModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'nama_lengkap') String namaLengkap, String jabatan,@JsonKey(name: 'sudah_direview') bool sudahDireview
});




}
/// @nodoc
class _$TargetReviewModelCopyWithImpl<$Res>
    implements $TargetReviewModelCopyWith<$Res> {
  _$TargetReviewModelCopyWithImpl(this._self, this._then);

  final TargetReviewModel _self;
  final $Res Function(TargetReviewModel) _then;

/// Create a copy of TargetReviewModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? namaLengkap = null,Object? jabatan = null,Object? sudahDireview = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,namaLengkap: null == namaLengkap ? _self.namaLengkap : namaLengkap // ignore: cast_nullable_to_non_nullable
as String,jabatan: null == jabatan ? _self.jabatan : jabatan // ignore: cast_nullable_to_non_nullable
as String,sudahDireview: null == sudahDireview ? _self.sudahDireview : sudahDireview // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}

}


/// Adds pattern-matching-related methods to [TargetReviewModel].
extension TargetReviewModelPatterns on TargetReviewModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _TargetReviewModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _TargetReviewModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _TargetReviewModel value)  $default,){
final _that = this;
switch (_that) {
case _TargetReviewModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _TargetReviewModel value)?  $default,){
final _that = this;
switch (_that) {
case _TargetReviewModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sudah_direview')  bool sudahDireview)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _TargetReviewModel() when $default != null:
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sudahDireview);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sudah_direview')  bool sudahDireview)  $default,) {final _that = this;
switch (_that) {
case _TargetReviewModel():
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sudahDireview);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'nama_lengkap')  String namaLengkap,  String jabatan, @JsonKey(name: 'sudah_direview')  bool sudahDireview)?  $default,) {final _that = this;
switch (_that) {
case _TargetReviewModel() when $default != null:
return $default(_that.id,_that.namaLengkap,_that.jabatan,_that.sudahDireview);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _TargetReviewModel implements TargetReviewModel {
   _TargetReviewModel({required this.id, @JsonKey(name: 'nama_lengkap') required this.namaLengkap, required this.jabatan, @JsonKey(name: 'sudah_direview') required this.sudahDireview});
  factory _TargetReviewModel.fromJson(Map<String, dynamic> json) => _$TargetReviewModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'nama_lengkap') final  String namaLengkap;
@override final  String jabatan;
@override@JsonKey(name: 'sudah_direview') final  bool sudahDireview;

/// Create a copy of TargetReviewModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$TargetReviewModelCopyWith<_TargetReviewModel> get copyWith => __$TargetReviewModelCopyWithImpl<_TargetReviewModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$TargetReviewModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _TargetReviewModel&&(identical(other.id, id) || other.id == id)&&(identical(other.namaLengkap, namaLengkap) || other.namaLengkap == namaLengkap)&&(identical(other.jabatan, jabatan) || other.jabatan == jabatan)&&(identical(other.sudahDireview, sudahDireview) || other.sudahDireview == sudahDireview));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,namaLengkap,jabatan,sudahDireview);

@override
String toString() {
  return 'TargetReviewModel(id: $id, namaLengkap: $namaLengkap, jabatan: $jabatan, sudahDireview: $sudahDireview)';
}


}

/// @nodoc
abstract mixin class _$TargetReviewModelCopyWith<$Res> implements $TargetReviewModelCopyWith<$Res> {
  factory _$TargetReviewModelCopyWith(_TargetReviewModel value, $Res Function(_TargetReviewModel) _then) = __$TargetReviewModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'nama_lengkap') String namaLengkap, String jabatan,@JsonKey(name: 'sudah_direview') bool sudahDireview
});




}
/// @nodoc
class __$TargetReviewModelCopyWithImpl<$Res>
    implements _$TargetReviewModelCopyWith<$Res> {
  __$TargetReviewModelCopyWithImpl(this._self, this._then);

  final _TargetReviewModel _self;
  final $Res Function(_TargetReviewModel) _then;

/// Create a copy of TargetReviewModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? namaLengkap = null,Object? jabatan = null,Object? sudahDireview = null,}) {
  return _then(_TargetReviewModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,namaLengkap: null == namaLengkap ? _self.namaLengkap : namaLengkap // ignore: cast_nullable_to_non_nullable
as String,jabatan: null == jabatan ? _self.jabatan : jabatan // ignore: cast_nullable_to_non_nullable
as String,sudahDireview: null == sudahDireview ? _self.sudahDireview : sudahDireview // ignore: cast_nullable_to_non_nullable
as bool,
  ));
}


}


/// @nodoc
mixin _$ReviewRekanModel {

 String get id;@JsonKey(name: 'id_reviewer') String get idReviewer;@JsonKey(name: 'id_target') String get idTarget; int get bulan; int get tahun; int get skor; String get komentar;@JsonKey(name: 'nama_target') String? get namaTarget;
/// Create a copy of ReviewRekanModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$ReviewRekanModelCopyWith<ReviewRekanModel> get copyWith => _$ReviewRekanModelCopyWithImpl<ReviewRekanModel>(this as ReviewRekanModel, _$identity);

  /// Serializes this ReviewRekanModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is ReviewRekanModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idReviewer, idReviewer) || other.idReviewer == idReviewer)&&(identical(other.idTarget, idTarget) || other.idTarget == idTarget)&&(identical(other.bulan, bulan) || other.bulan == bulan)&&(identical(other.tahun, tahun) || other.tahun == tahun)&&(identical(other.skor, skor) || other.skor == skor)&&(identical(other.komentar, komentar) || other.komentar == komentar)&&(identical(other.namaTarget, namaTarget) || other.namaTarget == namaTarget));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idReviewer,idTarget,bulan,tahun,skor,komentar,namaTarget);

@override
String toString() {
  return 'ReviewRekanModel(id: $id, idReviewer: $idReviewer, idTarget: $idTarget, bulan: $bulan, tahun: $tahun, skor: $skor, komentar: $komentar, namaTarget: $namaTarget)';
}


}

/// @nodoc
abstract mixin class $ReviewRekanModelCopyWith<$Res>  {
  factory $ReviewRekanModelCopyWith(ReviewRekanModel value, $Res Function(ReviewRekanModel) _then) = _$ReviewRekanModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'id_reviewer') String idReviewer,@JsonKey(name: 'id_target') String idTarget, int bulan, int tahun, int skor, String komentar,@JsonKey(name: 'nama_target') String? namaTarget
});




}
/// @nodoc
class _$ReviewRekanModelCopyWithImpl<$Res>
    implements $ReviewRekanModelCopyWith<$Res> {
  _$ReviewRekanModelCopyWithImpl(this._self, this._then);

  final ReviewRekanModel _self;
  final $Res Function(ReviewRekanModel) _then;

/// Create a copy of ReviewRekanModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? idReviewer = null,Object? idTarget = null,Object? bulan = null,Object? tahun = null,Object? skor = null,Object? komentar = null,Object? namaTarget = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idReviewer: null == idReviewer ? _self.idReviewer : idReviewer // ignore: cast_nullable_to_non_nullable
as String,idTarget: null == idTarget ? _self.idTarget : idTarget // ignore: cast_nullable_to_non_nullable
as String,bulan: null == bulan ? _self.bulan : bulan // ignore: cast_nullable_to_non_nullable
as int,tahun: null == tahun ? _self.tahun : tahun // ignore: cast_nullable_to_non_nullable
as int,skor: null == skor ? _self.skor : skor // ignore: cast_nullable_to_non_nullable
as int,komentar: null == komentar ? _self.komentar : komentar // ignore: cast_nullable_to_non_nullable
as String,namaTarget: freezed == namaTarget ? _self.namaTarget : namaTarget // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [ReviewRekanModel].
extension ReviewRekanModelPatterns on ReviewRekanModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _ReviewRekanModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _ReviewRekanModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _ReviewRekanModel value)  $default,){
final _that = this;
switch (_that) {
case _ReviewRekanModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _ReviewRekanModel value)?  $default,){
final _that = this;
switch (_that) {
case _ReviewRekanModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_reviewer')  String idReviewer, @JsonKey(name: 'id_target')  String idTarget,  int bulan,  int tahun,  int skor,  String komentar, @JsonKey(name: 'nama_target')  String? namaTarget)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _ReviewRekanModel() when $default != null:
return $default(_that.id,_that.idReviewer,_that.idTarget,_that.bulan,_that.tahun,_that.skor,_that.komentar,_that.namaTarget);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_reviewer')  String idReviewer, @JsonKey(name: 'id_target')  String idTarget,  int bulan,  int tahun,  int skor,  String komentar, @JsonKey(name: 'nama_target')  String? namaTarget)  $default,) {final _that = this;
switch (_that) {
case _ReviewRekanModel():
return $default(_that.id,_that.idReviewer,_that.idTarget,_that.bulan,_that.tahun,_that.skor,_that.komentar,_that.namaTarget);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'id_reviewer')  String idReviewer, @JsonKey(name: 'id_target')  String idTarget,  int bulan,  int tahun,  int skor,  String komentar, @JsonKey(name: 'nama_target')  String? namaTarget)?  $default,) {final _that = this;
switch (_that) {
case _ReviewRekanModel() when $default != null:
return $default(_that.id,_that.idReviewer,_that.idTarget,_that.bulan,_that.tahun,_that.skor,_that.komentar,_that.namaTarget);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _ReviewRekanModel implements ReviewRekanModel {
   _ReviewRekanModel({required this.id, @JsonKey(name: 'id_reviewer') required this.idReviewer, @JsonKey(name: 'id_target') required this.idTarget, required this.bulan, required this.tahun, required this.skor, required this.komentar, @JsonKey(name: 'nama_target') this.namaTarget});
  factory _ReviewRekanModel.fromJson(Map<String, dynamic> json) => _$ReviewRekanModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'id_reviewer') final  String idReviewer;
@override@JsonKey(name: 'id_target') final  String idTarget;
@override final  int bulan;
@override final  int tahun;
@override final  int skor;
@override final  String komentar;
@override@JsonKey(name: 'nama_target') final  String? namaTarget;

/// Create a copy of ReviewRekanModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$ReviewRekanModelCopyWith<_ReviewRekanModel> get copyWith => __$ReviewRekanModelCopyWithImpl<_ReviewRekanModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$ReviewRekanModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _ReviewRekanModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idReviewer, idReviewer) || other.idReviewer == idReviewer)&&(identical(other.idTarget, idTarget) || other.idTarget == idTarget)&&(identical(other.bulan, bulan) || other.bulan == bulan)&&(identical(other.tahun, tahun) || other.tahun == tahun)&&(identical(other.skor, skor) || other.skor == skor)&&(identical(other.komentar, komentar) || other.komentar == komentar)&&(identical(other.namaTarget, namaTarget) || other.namaTarget == namaTarget));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idReviewer,idTarget,bulan,tahun,skor,komentar,namaTarget);

@override
String toString() {
  return 'ReviewRekanModel(id: $id, idReviewer: $idReviewer, idTarget: $idTarget, bulan: $bulan, tahun: $tahun, skor: $skor, komentar: $komentar, namaTarget: $namaTarget)';
}


}

/// @nodoc
abstract mixin class _$ReviewRekanModelCopyWith<$Res> implements $ReviewRekanModelCopyWith<$Res> {
  factory _$ReviewRekanModelCopyWith(_ReviewRekanModel value, $Res Function(_ReviewRekanModel) _then) = __$ReviewRekanModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'id_reviewer') String idReviewer,@JsonKey(name: 'id_target') String idTarget, int bulan, int tahun, int skor, String komentar,@JsonKey(name: 'nama_target') String? namaTarget
});




}
/// @nodoc
class __$ReviewRekanModelCopyWithImpl<$Res>
    implements _$ReviewRekanModelCopyWith<$Res> {
  __$ReviewRekanModelCopyWithImpl(this._self, this._then);

  final _ReviewRekanModel _self;
  final $Res Function(_ReviewRekanModel) _then;

/// Create a copy of ReviewRekanModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? idReviewer = null,Object? idTarget = null,Object? bulan = null,Object? tahun = null,Object? skor = null,Object? komentar = null,Object? namaTarget = freezed,}) {
  return _then(_ReviewRekanModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idReviewer: null == idReviewer ? _self.idReviewer : idReviewer // ignore: cast_nullable_to_non_nullable
as String,idTarget: null == idTarget ? _self.idTarget : idTarget // ignore: cast_nullable_to_non_nullable
as String,bulan: null == bulan ? _self.bulan : bulan // ignore: cast_nullable_to_non_nullable
as int,tahun: null == tahun ? _self.tahun : tahun // ignore: cast_nullable_to_non_nullable
as int,skor: null == skor ? _self.skor : skor // ignore: cast_nullable_to_non_nullable
as int,komentar: null == komentar ? _self.komentar : komentar // ignore: cast_nullable_to_non_nullable
as String,namaTarget: freezed == namaTarget ? _self.namaTarget : namaTarget // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
