// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'lhkp_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$LhkpModel {

 String get id;@JsonKey(name: 'id_pegawai') String get idPegawai; DateTime get tanggal; String get status;@JsonKey(name: 'catatan_pimpinan') String? get catatanPimpinan;@JsonKey(name: 'nama_pegawai') String? get namaPegawai;@JsonKey(name: 'details') List<LhkpDetailModel>? get details;@JsonKey(name: 'jumlah_kegiatan') int? get jumlahKegiatan;
/// Create a copy of LhkpModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LhkpModelCopyWith<LhkpModel> get copyWith => _$LhkpModelCopyWithImpl<LhkpModel>(this as LhkpModel, _$identity);

  /// Serializes this LhkpModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LhkpModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idPegawai, idPegawai) || other.idPegawai == idPegawai)&&(identical(other.tanggal, tanggal) || other.tanggal == tanggal)&&(identical(other.status, status) || other.status == status)&&(identical(other.catatanPimpinan, catatanPimpinan) || other.catatanPimpinan == catatanPimpinan)&&(identical(other.namaPegawai, namaPegawai) || other.namaPegawai == namaPegawai)&&const DeepCollectionEquality().equals(other.details, details)&&(identical(other.jumlahKegiatan, jumlahKegiatan) || other.jumlahKegiatan == jumlahKegiatan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idPegawai,tanggal,status,catatanPimpinan,namaPegawai,const DeepCollectionEquality().hash(details),jumlahKegiatan);

@override
String toString() {
  return 'LhkpModel(id: $id, idPegawai: $idPegawai, tanggal: $tanggal, status: $status, catatanPimpinan: $catatanPimpinan, namaPegawai: $namaPegawai, details: $details, jumlahKegiatan: $jumlahKegiatan)';
}


}

/// @nodoc
abstract mixin class $LhkpModelCopyWith<$Res>  {
  factory $LhkpModelCopyWith(LhkpModel value, $Res Function(LhkpModel) _then) = _$LhkpModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'id_pegawai') String idPegawai, DateTime tanggal, String status,@JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,@JsonKey(name: 'nama_pegawai') String? namaPegawai,@JsonKey(name: 'details') List<LhkpDetailModel>? details,@JsonKey(name: 'jumlah_kegiatan') int? jumlahKegiatan
});




}
/// @nodoc
class _$LhkpModelCopyWithImpl<$Res>
    implements $LhkpModelCopyWith<$Res> {
  _$LhkpModelCopyWithImpl(this._self, this._then);

  final LhkpModel _self;
  final $Res Function(LhkpModel) _then;

/// Create a copy of LhkpModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? idPegawai = null,Object? tanggal = null,Object? status = null,Object? catatanPimpinan = freezed,Object? namaPegawai = freezed,Object? details = freezed,Object? jumlahKegiatan = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idPegawai: null == idPegawai ? _self.idPegawai : idPegawai // ignore: cast_nullable_to_non_nullable
as String,tanggal: null == tanggal ? _self.tanggal : tanggal // ignore: cast_nullable_to_non_nullable
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,catatanPimpinan: freezed == catatanPimpinan ? _self.catatanPimpinan : catatanPimpinan // ignore: cast_nullable_to_non_nullable
as String?,namaPegawai: freezed == namaPegawai ? _self.namaPegawai : namaPegawai // ignore: cast_nullable_to_non_nullable
as String?,details: freezed == details ? _self.details : details // ignore: cast_nullable_to_non_nullable
as List<LhkpDetailModel>?,jumlahKegiatan: freezed == jumlahKegiatan ? _self.jumlahKegiatan : jumlahKegiatan // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}

}


/// Adds pattern-matching-related methods to [LhkpModel].
extension LhkpModelPatterns on LhkpModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LhkpModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LhkpModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LhkpModel value)  $default,){
final _that = this;
switch (_that) {
case _LhkpModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LhkpModel value)?  $default,){
final _that = this;
switch (_that) {
case _LhkpModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai,  DateTime tanggal,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'nama_pegawai')  String? namaPegawai, @JsonKey(name: 'details')  List<LhkpDetailModel>? details, @JsonKey(name: 'jumlah_kegiatan')  int? jumlahKegiatan)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LhkpModel() when $default != null:
return $default(_that.id,_that.idPegawai,_that.tanggal,_that.status,_that.catatanPimpinan,_that.namaPegawai,_that.details,_that.jumlahKegiatan);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai,  DateTime tanggal,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'nama_pegawai')  String? namaPegawai, @JsonKey(name: 'details')  List<LhkpDetailModel>? details, @JsonKey(name: 'jumlah_kegiatan')  int? jumlahKegiatan)  $default,) {final _that = this;
switch (_that) {
case _LhkpModel():
return $default(_that.id,_that.idPegawai,_that.tanggal,_that.status,_that.catatanPimpinan,_that.namaPegawai,_that.details,_that.jumlahKegiatan);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai,  DateTime tanggal,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'nama_pegawai')  String? namaPegawai, @JsonKey(name: 'details')  List<LhkpDetailModel>? details, @JsonKey(name: 'jumlah_kegiatan')  int? jumlahKegiatan)?  $default,) {final _that = this;
switch (_that) {
case _LhkpModel() when $default != null:
return $default(_that.id,_that.idPegawai,_that.tanggal,_that.status,_that.catatanPimpinan,_that.namaPegawai,_that.details,_that.jumlahKegiatan);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LhkpModel implements LhkpModel {
   _LhkpModel({required this.id, @JsonKey(name: 'id_pegawai') required this.idPegawai, required this.tanggal, required this.status, @JsonKey(name: 'catatan_pimpinan') this.catatanPimpinan, @JsonKey(name: 'nama_pegawai') this.namaPegawai, @JsonKey(name: 'details') final  List<LhkpDetailModel>? details, @JsonKey(name: 'jumlah_kegiatan') this.jumlahKegiatan}): _details = details;
  factory _LhkpModel.fromJson(Map<String, dynamic> json) => _$LhkpModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'id_pegawai') final  String idPegawai;
@override final  DateTime tanggal;
@override final  String status;
@override@JsonKey(name: 'catatan_pimpinan') final  String? catatanPimpinan;
@override@JsonKey(name: 'nama_pegawai') final  String? namaPegawai;
 final  List<LhkpDetailModel>? _details;
@override@JsonKey(name: 'details') List<LhkpDetailModel>? get details {
  final value = _details;
  if (value == null) return null;
  if (_details is EqualUnmodifiableListView) return _details;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(value);
}

@override@JsonKey(name: 'jumlah_kegiatan') final  int? jumlahKegiatan;

/// Create a copy of LhkpModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LhkpModelCopyWith<_LhkpModel> get copyWith => __$LhkpModelCopyWithImpl<_LhkpModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LhkpModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LhkpModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idPegawai, idPegawai) || other.idPegawai == idPegawai)&&(identical(other.tanggal, tanggal) || other.tanggal == tanggal)&&(identical(other.status, status) || other.status == status)&&(identical(other.catatanPimpinan, catatanPimpinan) || other.catatanPimpinan == catatanPimpinan)&&(identical(other.namaPegawai, namaPegawai) || other.namaPegawai == namaPegawai)&&const DeepCollectionEquality().equals(other._details, _details)&&(identical(other.jumlahKegiatan, jumlahKegiatan) || other.jumlahKegiatan == jumlahKegiatan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idPegawai,tanggal,status,catatanPimpinan,namaPegawai,const DeepCollectionEquality().hash(_details),jumlahKegiatan);

@override
String toString() {
  return 'LhkpModel(id: $id, idPegawai: $idPegawai, tanggal: $tanggal, status: $status, catatanPimpinan: $catatanPimpinan, namaPegawai: $namaPegawai, details: $details, jumlahKegiatan: $jumlahKegiatan)';
}


}

/// @nodoc
abstract mixin class _$LhkpModelCopyWith<$Res> implements $LhkpModelCopyWith<$Res> {
  factory _$LhkpModelCopyWith(_LhkpModel value, $Res Function(_LhkpModel) _then) = __$LhkpModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'id_pegawai') String idPegawai, DateTime tanggal, String status,@JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,@JsonKey(name: 'nama_pegawai') String? namaPegawai,@JsonKey(name: 'details') List<LhkpDetailModel>? details,@JsonKey(name: 'jumlah_kegiatan') int? jumlahKegiatan
});




}
/// @nodoc
class __$LhkpModelCopyWithImpl<$Res>
    implements _$LhkpModelCopyWith<$Res> {
  __$LhkpModelCopyWithImpl(this._self, this._then);

  final _LhkpModel _self;
  final $Res Function(_LhkpModel) _then;

/// Create a copy of LhkpModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? idPegawai = null,Object? tanggal = null,Object? status = null,Object? catatanPimpinan = freezed,Object? namaPegawai = freezed,Object? details = freezed,Object? jumlahKegiatan = freezed,}) {
  return _then(_LhkpModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idPegawai: null == idPegawai ? _self.idPegawai : idPegawai // ignore: cast_nullable_to_non_nullable
as String,tanggal: null == tanggal ? _self.tanggal : tanggal // ignore: cast_nullable_to_non_nullable
as DateTime,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,catatanPimpinan: freezed == catatanPimpinan ? _self.catatanPimpinan : catatanPimpinan // ignore: cast_nullable_to_non_nullable
as String?,namaPegawai: freezed == namaPegawai ? _self.namaPegawai : namaPegawai // ignore: cast_nullable_to_non_nullable
as String?,details: freezed == details ? _self._details : details // ignore: cast_nullable_to_non_nullable
as List<LhkpDetailModel>?,jumlahKegiatan: freezed == jumlahKegiatan ? _self.jumlahKegiatan : jumlahKegiatan // ignore: cast_nullable_to_non_nullable
as int?,
  ));
}


}


/// @nodoc
mixin _$LhkpDetailModel {

 String? get id;@JsonKey(name: 'id_jenis_kegiatan') String get idJenisKegiatan;@JsonKey(name: 'nama_jenis_kegiatan') String? get namaJenisKegiatan;@JsonKey(name: 'jam_mulai') String get jamMulai;@JsonKey(name: 'jam_selesai') String get jamSelesai; String get uraian;
/// Create a copy of LhkpDetailModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$LhkpDetailModelCopyWith<LhkpDetailModel> get copyWith => _$LhkpDetailModelCopyWithImpl<LhkpDetailModel>(this as LhkpDetailModel, _$identity);

  /// Serializes this LhkpDetailModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is LhkpDetailModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idJenisKegiatan, idJenisKegiatan) || other.idJenisKegiatan == idJenisKegiatan)&&(identical(other.namaJenisKegiatan, namaJenisKegiatan) || other.namaJenisKegiatan == namaJenisKegiatan)&&(identical(other.jamMulai, jamMulai) || other.jamMulai == jamMulai)&&(identical(other.jamSelesai, jamSelesai) || other.jamSelesai == jamSelesai)&&(identical(other.uraian, uraian) || other.uraian == uraian));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idJenisKegiatan,namaJenisKegiatan,jamMulai,jamSelesai,uraian);

@override
String toString() {
  return 'LhkpDetailModel(id: $id, idJenisKegiatan: $idJenisKegiatan, namaJenisKegiatan: $namaJenisKegiatan, jamMulai: $jamMulai, jamSelesai: $jamSelesai, uraian: $uraian)';
}


}

/// @nodoc
abstract mixin class $LhkpDetailModelCopyWith<$Res>  {
  factory $LhkpDetailModelCopyWith(LhkpDetailModel value, $Res Function(LhkpDetailModel) _then) = _$LhkpDetailModelCopyWithImpl;
@useResult
$Res call({
 String? id,@JsonKey(name: 'id_jenis_kegiatan') String idJenisKegiatan,@JsonKey(name: 'nama_jenis_kegiatan') String? namaJenisKegiatan,@JsonKey(name: 'jam_mulai') String jamMulai,@JsonKey(name: 'jam_selesai') String jamSelesai, String uraian
});




}
/// @nodoc
class _$LhkpDetailModelCopyWithImpl<$Res>
    implements $LhkpDetailModelCopyWith<$Res> {
  _$LhkpDetailModelCopyWithImpl(this._self, this._then);

  final LhkpDetailModel _self;
  final $Res Function(LhkpDetailModel) _then;

/// Create a copy of LhkpDetailModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = freezed,Object? idJenisKegiatan = null,Object? namaJenisKegiatan = freezed,Object? jamMulai = null,Object? jamSelesai = null,Object? uraian = null,}) {
  return _then(_self.copyWith(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,idJenisKegiatan: null == idJenisKegiatan ? _self.idJenisKegiatan : idJenisKegiatan // ignore: cast_nullable_to_non_nullable
as String,namaJenisKegiatan: freezed == namaJenisKegiatan ? _self.namaJenisKegiatan : namaJenisKegiatan // ignore: cast_nullable_to_non_nullable
as String?,jamMulai: null == jamMulai ? _self.jamMulai : jamMulai // ignore: cast_nullable_to_non_nullable
as String,jamSelesai: null == jamSelesai ? _self.jamSelesai : jamSelesai // ignore: cast_nullable_to_non_nullable
as String,uraian: null == uraian ? _self.uraian : uraian // ignore: cast_nullable_to_non_nullable
as String,
  ));
}

}


/// Adds pattern-matching-related methods to [LhkpDetailModel].
extension LhkpDetailModelPatterns on LhkpDetailModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _LhkpDetailModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _LhkpDetailModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _LhkpDetailModel value)  $default,){
final _that = this;
switch (_that) {
case _LhkpDetailModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _LhkpDetailModel value)?  $default,){
final _that = this;
switch (_that) {
case _LhkpDetailModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String? id, @JsonKey(name: 'id_jenis_kegiatan')  String idJenisKegiatan, @JsonKey(name: 'nama_jenis_kegiatan')  String? namaJenisKegiatan, @JsonKey(name: 'jam_mulai')  String jamMulai, @JsonKey(name: 'jam_selesai')  String jamSelesai,  String uraian)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _LhkpDetailModel() when $default != null:
return $default(_that.id,_that.idJenisKegiatan,_that.namaJenisKegiatan,_that.jamMulai,_that.jamSelesai,_that.uraian);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String? id, @JsonKey(name: 'id_jenis_kegiatan')  String idJenisKegiatan, @JsonKey(name: 'nama_jenis_kegiatan')  String? namaJenisKegiatan, @JsonKey(name: 'jam_mulai')  String jamMulai, @JsonKey(name: 'jam_selesai')  String jamSelesai,  String uraian)  $default,) {final _that = this;
switch (_that) {
case _LhkpDetailModel():
return $default(_that.id,_that.idJenisKegiatan,_that.namaJenisKegiatan,_that.jamMulai,_that.jamSelesai,_that.uraian);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String? id, @JsonKey(name: 'id_jenis_kegiatan')  String idJenisKegiatan, @JsonKey(name: 'nama_jenis_kegiatan')  String? namaJenisKegiatan, @JsonKey(name: 'jam_mulai')  String jamMulai, @JsonKey(name: 'jam_selesai')  String jamSelesai,  String uraian)?  $default,) {final _that = this;
switch (_that) {
case _LhkpDetailModel() when $default != null:
return $default(_that.id,_that.idJenisKegiatan,_that.namaJenisKegiatan,_that.jamMulai,_that.jamSelesai,_that.uraian);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _LhkpDetailModel implements LhkpDetailModel {
   _LhkpDetailModel({this.id, @JsonKey(name: 'id_jenis_kegiatan') required this.idJenisKegiatan, @JsonKey(name: 'nama_jenis_kegiatan') this.namaJenisKegiatan, @JsonKey(name: 'jam_mulai') required this.jamMulai, @JsonKey(name: 'jam_selesai') required this.jamSelesai, required this.uraian});
  factory _LhkpDetailModel.fromJson(Map<String, dynamic> json) => _$LhkpDetailModelFromJson(json);

@override final  String? id;
@override@JsonKey(name: 'id_jenis_kegiatan') final  String idJenisKegiatan;
@override@JsonKey(name: 'nama_jenis_kegiatan') final  String? namaJenisKegiatan;
@override@JsonKey(name: 'jam_mulai') final  String jamMulai;
@override@JsonKey(name: 'jam_selesai') final  String jamSelesai;
@override final  String uraian;

/// Create a copy of LhkpDetailModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$LhkpDetailModelCopyWith<_LhkpDetailModel> get copyWith => __$LhkpDetailModelCopyWithImpl<_LhkpDetailModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$LhkpDetailModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _LhkpDetailModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idJenisKegiatan, idJenisKegiatan) || other.idJenisKegiatan == idJenisKegiatan)&&(identical(other.namaJenisKegiatan, namaJenisKegiatan) || other.namaJenisKegiatan == namaJenisKegiatan)&&(identical(other.jamMulai, jamMulai) || other.jamMulai == jamMulai)&&(identical(other.jamSelesai, jamSelesai) || other.jamSelesai == jamSelesai)&&(identical(other.uraian, uraian) || other.uraian == uraian));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idJenisKegiatan,namaJenisKegiatan,jamMulai,jamSelesai,uraian);

@override
String toString() {
  return 'LhkpDetailModel(id: $id, idJenisKegiatan: $idJenisKegiatan, namaJenisKegiatan: $namaJenisKegiatan, jamMulai: $jamMulai, jamSelesai: $jamSelesai, uraian: $uraian)';
}


}

/// @nodoc
abstract mixin class _$LhkpDetailModelCopyWith<$Res> implements $LhkpDetailModelCopyWith<$Res> {
  factory _$LhkpDetailModelCopyWith(_LhkpDetailModel value, $Res Function(_LhkpDetailModel) _then) = __$LhkpDetailModelCopyWithImpl;
@override @useResult
$Res call({
 String? id,@JsonKey(name: 'id_jenis_kegiatan') String idJenisKegiatan,@JsonKey(name: 'nama_jenis_kegiatan') String? namaJenisKegiatan,@JsonKey(name: 'jam_mulai') String jamMulai,@JsonKey(name: 'jam_selesai') String jamSelesai, String uraian
});




}
/// @nodoc
class __$LhkpDetailModelCopyWithImpl<$Res>
    implements _$LhkpDetailModelCopyWith<$Res> {
  __$LhkpDetailModelCopyWithImpl(this._self, this._then);

  final _LhkpDetailModel _self;
  final $Res Function(_LhkpDetailModel) _then;

/// Create a copy of LhkpDetailModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = freezed,Object? idJenisKegiatan = null,Object? namaJenisKegiatan = freezed,Object? jamMulai = null,Object? jamSelesai = null,Object? uraian = null,}) {
  return _then(_LhkpDetailModel(
id: freezed == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String?,idJenisKegiatan: null == idJenisKegiatan ? _self.idJenisKegiatan : idJenisKegiatan // ignore: cast_nullable_to_non_nullable
as String,namaJenisKegiatan: freezed == namaJenisKegiatan ? _self.namaJenisKegiatan : namaJenisKegiatan // ignore: cast_nullable_to_non_nullable
as String?,jamMulai: null == jamMulai ? _self.jamMulai : jamMulai // ignore: cast_nullable_to_non_nullable
as String,jamSelesai: null == jamSelesai ? _self.jamSelesai : jamSelesai // ignore: cast_nullable_to_non_nullable
as String,uraian: null == uraian ? _self.uraian : uraian // ignore: cast_nullable_to_non_nullable
as String,
  ));
}


}


/// @nodoc
mixin _$JenisKegiatanModel {

 String get id; String get nama; String? get keterangan;
/// Create a copy of JenisKegiatanModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$JenisKegiatanModelCopyWith<JenisKegiatanModel> get copyWith => _$JenisKegiatanModelCopyWithImpl<JenisKegiatanModel>(this as JenisKegiatanModel, _$identity);

  /// Serializes this JenisKegiatanModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is JenisKegiatanModel&&(identical(other.id, id) || other.id == id)&&(identical(other.nama, nama) || other.nama == nama)&&(identical(other.keterangan, keterangan) || other.keterangan == keterangan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,nama,keterangan);

@override
String toString() {
  return 'JenisKegiatanModel(id: $id, nama: $nama, keterangan: $keterangan)';
}


}

/// @nodoc
abstract mixin class $JenisKegiatanModelCopyWith<$Res>  {
  factory $JenisKegiatanModelCopyWith(JenisKegiatanModel value, $Res Function(JenisKegiatanModel) _then) = _$JenisKegiatanModelCopyWithImpl;
@useResult
$Res call({
 String id, String nama, String? keterangan
});




}
/// @nodoc
class _$JenisKegiatanModelCopyWithImpl<$Res>
    implements $JenisKegiatanModelCopyWith<$Res> {
  _$JenisKegiatanModelCopyWithImpl(this._self, this._then);

  final JenisKegiatanModel _self;
  final $Res Function(JenisKegiatanModel) _then;

/// Create a copy of JenisKegiatanModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? nama = null,Object? keterangan = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,nama: null == nama ? _self.nama : nama // ignore: cast_nullable_to_non_nullable
as String,keterangan: freezed == keterangan ? _self.keterangan : keterangan // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [JenisKegiatanModel].
extension JenisKegiatanModelPatterns on JenisKegiatanModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _JenisKegiatanModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _JenisKegiatanModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _JenisKegiatanModel value)  $default,){
final _that = this;
switch (_that) {
case _JenisKegiatanModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _JenisKegiatanModel value)?  $default,){
final _that = this;
switch (_that) {
case _JenisKegiatanModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id,  String nama,  String? keterangan)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _JenisKegiatanModel() when $default != null:
return $default(_that.id,_that.nama,_that.keterangan);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id,  String nama,  String? keterangan)  $default,) {final _that = this;
switch (_that) {
case _JenisKegiatanModel():
return $default(_that.id,_that.nama,_that.keterangan);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id,  String nama,  String? keterangan)?  $default,) {final _that = this;
switch (_that) {
case _JenisKegiatanModel() when $default != null:
return $default(_that.id,_that.nama,_that.keterangan);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _JenisKegiatanModel implements JenisKegiatanModel {
   _JenisKegiatanModel({required this.id, required this.nama, this.keterangan});
  factory _JenisKegiatanModel.fromJson(Map<String, dynamic> json) => _$JenisKegiatanModelFromJson(json);

@override final  String id;
@override final  String nama;
@override final  String? keterangan;

/// Create a copy of JenisKegiatanModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$JenisKegiatanModelCopyWith<_JenisKegiatanModel> get copyWith => __$JenisKegiatanModelCopyWithImpl<_JenisKegiatanModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$JenisKegiatanModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _JenisKegiatanModel&&(identical(other.id, id) || other.id == id)&&(identical(other.nama, nama) || other.nama == nama)&&(identical(other.keterangan, keterangan) || other.keterangan == keterangan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,nama,keterangan);

@override
String toString() {
  return 'JenisKegiatanModel(id: $id, nama: $nama, keterangan: $keterangan)';
}


}

/// @nodoc
abstract mixin class _$JenisKegiatanModelCopyWith<$Res> implements $JenisKegiatanModelCopyWith<$Res> {
  factory _$JenisKegiatanModelCopyWith(_JenisKegiatanModel value, $Res Function(_JenisKegiatanModel) _then) = __$JenisKegiatanModelCopyWithImpl;
@override @useResult
$Res call({
 String id, String nama, String? keterangan
});




}
/// @nodoc
class __$JenisKegiatanModelCopyWithImpl<$Res>
    implements _$JenisKegiatanModelCopyWith<$Res> {
  __$JenisKegiatanModelCopyWithImpl(this._self, this._then);

  final _JenisKegiatanModel _self;
  final $Res Function(_JenisKegiatanModel) _then;

/// Create a copy of JenisKegiatanModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? nama = null,Object? keterangan = freezed,}) {
  return _then(_JenisKegiatanModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,nama: null == nama ? _self.nama : nama // ignore: cast_nullable_to_non_nullable
as String,keterangan: freezed == keterangan ? _self.keterangan : keterangan // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
