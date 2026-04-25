// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'saldo_cuti_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$SaldoCutiModel {

 String get id;@JsonKey(name: 'id_jenis_cuti') String get idJenisCuti;@JsonKey(name: 'nama_jenis_cuti') String get namaJenisCuti; int get total; int get terpakai; int get sisa;
/// Create a copy of SaldoCutiModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$SaldoCutiModelCopyWith<SaldoCutiModel> get copyWith => _$SaldoCutiModelCopyWithImpl<SaldoCutiModel>(this as SaldoCutiModel, _$identity);

  /// Serializes this SaldoCutiModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is SaldoCutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idJenisCuti, idJenisCuti) || other.idJenisCuti == idJenisCuti)&&(identical(other.namaJenisCuti, namaJenisCuti) || other.namaJenisCuti == namaJenisCuti)&&(identical(other.total, total) || other.total == total)&&(identical(other.terpakai, terpakai) || other.terpakai == terpakai)&&(identical(other.sisa, sisa) || other.sisa == sisa));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idJenisCuti,namaJenisCuti,total,terpakai,sisa);

@override
String toString() {
  return 'SaldoCutiModel(id: $id, idJenisCuti: $idJenisCuti, namaJenisCuti: $namaJenisCuti, total: $total, terpakai: $terpakai, sisa: $sisa)';
}


}

/// @nodoc
abstract mixin class $SaldoCutiModelCopyWith<$Res>  {
  factory $SaldoCutiModelCopyWith(SaldoCutiModel value, $Res Function(SaldoCutiModel) _then) = _$SaldoCutiModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'id_jenis_cuti') String idJenisCuti,@JsonKey(name: 'nama_jenis_cuti') String namaJenisCuti, int total, int terpakai, int sisa
});




}
/// @nodoc
class _$SaldoCutiModelCopyWithImpl<$Res>
    implements $SaldoCutiModelCopyWith<$Res> {
  _$SaldoCutiModelCopyWithImpl(this._self, this._then);

  final SaldoCutiModel _self;
  final $Res Function(SaldoCutiModel) _then;

/// Create a copy of SaldoCutiModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? idJenisCuti = null,Object? namaJenisCuti = null,Object? total = null,Object? terpakai = null,Object? sisa = null,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idJenisCuti: null == idJenisCuti ? _self.idJenisCuti : idJenisCuti // ignore: cast_nullable_to_non_nullable
as String,namaJenisCuti: null == namaJenisCuti ? _self.namaJenisCuti : namaJenisCuti // ignore: cast_nullable_to_non_nullable
as String,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,terpakai: null == terpakai ? _self.terpakai : terpakai // ignore: cast_nullable_to_non_nullable
as int,sisa: null == sisa ? _self.sisa : sisa // ignore: cast_nullable_to_non_nullable
as int,
  ));
}

}


/// Adds pattern-matching-related methods to [SaldoCutiModel].
extension SaldoCutiModelPatterns on SaldoCutiModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _SaldoCutiModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _SaldoCutiModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _SaldoCutiModel value)  $default,){
final _that = this;
switch (_that) {
case _SaldoCutiModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _SaldoCutiModel value)?  $default,){
final _that = this;
switch (_that) {
case _SaldoCutiModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String namaJenisCuti,  int total,  int terpakai,  int sisa)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _SaldoCutiModel() when $default != null:
return $default(_that.id,_that.idJenisCuti,_that.namaJenisCuti,_that.total,_that.terpakai,_that.sisa);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String namaJenisCuti,  int total,  int terpakai,  int sisa)  $default,) {final _that = this;
switch (_that) {
case _SaldoCutiModel():
return $default(_that.id,_that.idJenisCuti,_that.namaJenisCuti,_that.total,_that.terpakai,_that.sisa);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String namaJenisCuti,  int total,  int terpakai,  int sisa)?  $default,) {final _that = this;
switch (_that) {
case _SaldoCutiModel() when $default != null:
return $default(_that.id,_that.idJenisCuti,_that.namaJenisCuti,_that.total,_that.terpakai,_that.sisa);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _SaldoCutiModel implements SaldoCutiModel {
   _SaldoCutiModel({required this.id, @JsonKey(name: 'id_jenis_cuti') required this.idJenisCuti, @JsonKey(name: 'nama_jenis_cuti') required this.namaJenisCuti, required this.total, required this.terpakai, required this.sisa});
  factory _SaldoCutiModel.fromJson(Map<String, dynamic> json) => _$SaldoCutiModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'id_jenis_cuti') final  String idJenisCuti;
@override@JsonKey(name: 'nama_jenis_cuti') final  String namaJenisCuti;
@override final  int total;
@override final  int terpakai;
@override final  int sisa;

/// Create a copy of SaldoCutiModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$SaldoCutiModelCopyWith<_SaldoCutiModel> get copyWith => __$SaldoCutiModelCopyWithImpl<_SaldoCutiModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$SaldoCutiModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _SaldoCutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idJenisCuti, idJenisCuti) || other.idJenisCuti == idJenisCuti)&&(identical(other.namaJenisCuti, namaJenisCuti) || other.namaJenisCuti == namaJenisCuti)&&(identical(other.total, total) || other.total == total)&&(identical(other.terpakai, terpakai) || other.terpakai == terpakai)&&(identical(other.sisa, sisa) || other.sisa == sisa));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idJenisCuti,namaJenisCuti,total,terpakai,sisa);

@override
String toString() {
  return 'SaldoCutiModel(id: $id, idJenisCuti: $idJenisCuti, namaJenisCuti: $namaJenisCuti, total: $total, terpakai: $terpakai, sisa: $sisa)';
}


}

/// @nodoc
abstract mixin class _$SaldoCutiModelCopyWith<$Res> implements $SaldoCutiModelCopyWith<$Res> {
  factory _$SaldoCutiModelCopyWith(_SaldoCutiModel value, $Res Function(_SaldoCutiModel) _then) = __$SaldoCutiModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'id_jenis_cuti') String idJenisCuti,@JsonKey(name: 'nama_jenis_cuti') String namaJenisCuti, int total, int terpakai, int sisa
});




}
/// @nodoc
class __$SaldoCutiModelCopyWithImpl<$Res>
    implements _$SaldoCutiModelCopyWith<$Res> {
  __$SaldoCutiModelCopyWithImpl(this._self, this._then);

  final _SaldoCutiModel _self;
  final $Res Function(_SaldoCutiModel) _then;

/// Create a copy of SaldoCutiModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? idJenisCuti = null,Object? namaJenisCuti = null,Object? total = null,Object? terpakai = null,Object? sisa = null,}) {
  return _then(_SaldoCutiModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idJenisCuti: null == idJenisCuti ? _self.idJenisCuti : idJenisCuti // ignore: cast_nullable_to_non_nullable
as String,namaJenisCuti: null == namaJenisCuti ? _self.namaJenisCuti : namaJenisCuti // ignore: cast_nullable_to_non_nullable
as String,total: null == total ? _self.total : total // ignore: cast_nullable_to_non_nullable
as int,terpakai: null == terpakai ? _self.terpakai : terpakai // ignore: cast_nullable_to_non_nullable
as int,sisa: null == sisa ? _self.sisa : sisa // ignore: cast_nullable_to_non_nullable
as int,
  ));
}


}

// dart format on
