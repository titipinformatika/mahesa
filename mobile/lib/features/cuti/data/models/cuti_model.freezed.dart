// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'cuti_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$CutiModel {

 String get id;@JsonKey(name: 'id_pegawai') String get idPegawai;@JsonKey(name: 'id_jenis_cuti') String get idJenisCuti;@JsonKey(name: 'nama_jenis_cuti') String? get namaJenisCuti;@JsonKey(name: 'tanggal_mulai') DateTime get tanggalMulai;@JsonKey(name: 'tanggal_selesai') DateTime get tanggalSelesai;@JsonKey(name: 'total_hari') int get totalHari; String get alasan; String get status;@JsonKey(name: 'catatan_pimpinan') String? get catatanPimpinan;@JsonKey(name: 'dokumen_url') String? get dokumenUrl;@JsonKey(name: 'created_at') DateTime? get createdAt;
/// Create a copy of CutiModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$CutiModelCopyWith<CutiModel> get copyWith => _$CutiModelCopyWithImpl<CutiModel>(this as CutiModel, _$identity);

  /// Serializes this CutiModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is CutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idPegawai, idPegawai) || other.idPegawai == idPegawai)&&(identical(other.idJenisCuti, idJenisCuti) || other.idJenisCuti == idJenisCuti)&&(identical(other.namaJenisCuti, namaJenisCuti) || other.namaJenisCuti == namaJenisCuti)&&(identical(other.tanggalMulai, tanggalMulai) || other.tanggalMulai == tanggalMulai)&&(identical(other.tanggalSelesai, tanggalSelesai) || other.tanggalSelesai == tanggalSelesai)&&(identical(other.totalHari, totalHari) || other.totalHari == totalHari)&&(identical(other.alasan, alasan) || other.alasan == alasan)&&(identical(other.status, status) || other.status == status)&&(identical(other.catatanPimpinan, catatanPimpinan) || other.catatanPimpinan == catatanPimpinan)&&(identical(other.dokumenUrl, dokumenUrl) || other.dokumenUrl == dokumenUrl)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idPegawai,idJenisCuti,namaJenisCuti,tanggalMulai,tanggalSelesai,totalHari,alasan,status,catatanPimpinan,dokumenUrl,createdAt);

@override
String toString() {
  return 'CutiModel(id: $id, idPegawai: $idPegawai, idJenisCuti: $idJenisCuti, namaJenisCuti: $namaJenisCuti, tanggalMulai: $tanggalMulai, tanggalSelesai: $tanggalSelesai, totalHari: $totalHari, alasan: $alasan, status: $status, catatanPimpinan: $catatanPimpinan, dokumenUrl: $dokumenUrl, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class $CutiModelCopyWith<$Res>  {
  factory $CutiModelCopyWith(CutiModel value, $Res Function(CutiModel) _then) = _$CutiModelCopyWithImpl;
@useResult
$Res call({
 String id,@JsonKey(name: 'id_pegawai') String idPegawai,@JsonKey(name: 'id_jenis_cuti') String idJenisCuti,@JsonKey(name: 'nama_jenis_cuti') String? namaJenisCuti,@JsonKey(name: 'tanggal_mulai') DateTime tanggalMulai,@JsonKey(name: 'tanggal_selesai') DateTime tanggalSelesai,@JsonKey(name: 'total_hari') int totalHari, String alasan, String status,@JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,@JsonKey(name: 'dokumen_url') String? dokumenUrl,@JsonKey(name: 'created_at') DateTime? createdAt
});




}
/// @nodoc
class _$CutiModelCopyWithImpl<$Res>
    implements $CutiModelCopyWith<$Res> {
  _$CutiModelCopyWithImpl(this._self, this._then);

  final CutiModel _self;
  final $Res Function(CutiModel) _then;

/// Create a copy of CutiModel
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? id = null,Object? idPegawai = null,Object? idJenisCuti = null,Object? namaJenisCuti = freezed,Object? tanggalMulai = null,Object? tanggalSelesai = null,Object? totalHari = null,Object? alasan = null,Object? status = null,Object? catatanPimpinan = freezed,Object? dokumenUrl = freezed,Object? createdAt = freezed,}) {
  return _then(_self.copyWith(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idPegawai: null == idPegawai ? _self.idPegawai : idPegawai // ignore: cast_nullable_to_non_nullable
as String,idJenisCuti: null == idJenisCuti ? _self.idJenisCuti : idJenisCuti // ignore: cast_nullable_to_non_nullable
as String,namaJenisCuti: freezed == namaJenisCuti ? _self.namaJenisCuti : namaJenisCuti // ignore: cast_nullable_to_non_nullable
as String?,tanggalMulai: null == tanggalMulai ? _self.tanggalMulai : tanggalMulai // ignore: cast_nullable_to_non_nullable
as DateTime,tanggalSelesai: null == tanggalSelesai ? _self.tanggalSelesai : tanggalSelesai // ignore: cast_nullable_to_non_nullable
as DateTime,totalHari: null == totalHari ? _self.totalHari : totalHari // ignore: cast_nullable_to_non_nullable
as int,alasan: null == alasan ? _self.alasan : alasan // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,catatanPimpinan: freezed == catatanPimpinan ? _self.catatanPimpinan : catatanPimpinan // ignore: cast_nullable_to_non_nullable
as String?,dokumenUrl: freezed == dokumenUrl ? _self.dokumenUrl : dokumenUrl // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}

}


/// Adds pattern-matching-related methods to [CutiModel].
extension CutiModelPatterns on CutiModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _CutiModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _CutiModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _CutiModel value)  $default,){
final _that = this;
switch (_that) {
case _CutiModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _CutiModel value)?  $default,){
final _that = this;
switch (_that) {
case _CutiModel() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String? namaJenisCuti, @JsonKey(name: 'tanggal_mulai')  DateTime tanggalMulai, @JsonKey(name: 'tanggal_selesai')  DateTime tanggalSelesai, @JsonKey(name: 'total_hari')  int totalHari,  String alasan,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'dokumen_url')  String? dokumenUrl, @JsonKey(name: 'created_at')  DateTime? createdAt)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _CutiModel() when $default != null:
return $default(_that.id,_that.idPegawai,_that.idJenisCuti,_that.namaJenisCuti,_that.tanggalMulai,_that.tanggalSelesai,_that.totalHari,_that.alasan,_that.status,_that.catatanPimpinan,_that.dokumenUrl,_that.createdAt);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String? namaJenisCuti, @JsonKey(name: 'tanggal_mulai')  DateTime tanggalMulai, @JsonKey(name: 'tanggal_selesai')  DateTime tanggalSelesai, @JsonKey(name: 'total_hari')  int totalHari,  String alasan,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'dokumen_url')  String? dokumenUrl, @JsonKey(name: 'created_at')  DateTime? createdAt)  $default,) {final _that = this;
switch (_that) {
case _CutiModel():
return $default(_that.id,_that.idPegawai,_that.idJenisCuti,_that.namaJenisCuti,_that.tanggalMulai,_that.tanggalSelesai,_that.totalHari,_that.alasan,_that.status,_that.catatanPimpinan,_that.dokumenUrl,_that.createdAt);case _:
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String id, @JsonKey(name: 'id_pegawai')  String idPegawai, @JsonKey(name: 'id_jenis_cuti')  String idJenisCuti, @JsonKey(name: 'nama_jenis_cuti')  String? namaJenisCuti, @JsonKey(name: 'tanggal_mulai')  DateTime tanggalMulai, @JsonKey(name: 'tanggal_selesai')  DateTime tanggalSelesai, @JsonKey(name: 'total_hari')  int totalHari,  String alasan,  String status, @JsonKey(name: 'catatan_pimpinan')  String? catatanPimpinan, @JsonKey(name: 'dokumen_url')  String? dokumenUrl, @JsonKey(name: 'created_at')  DateTime? createdAt)?  $default,) {final _that = this;
switch (_that) {
case _CutiModel() when $default != null:
return $default(_that.id,_that.idPegawai,_that.idJenisCuti,_that.namaJenisCuti,_that.tanggalMulai,_that.tanggalSelesai,_that.totalHari,_that.alasan,_that.status,_that.catatanPimpinan,_that.dokumenUrl,_that.createdAt);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _CutiModel implements CutiModel {
   _CutiModel({required this.id, @JsonKey(name: 'id_pegawai') required this.idPegawai, @JsonKey(name: 'id_jenis_cuti') required this.idJenisCuti, @JsonKey(name: 'nama_jenis_cuti') this.namaJenisCuti, @JsonKey(name: 'tanggal_mulai') required this.tanggalMulai, @JsonKey(name: 'tanggal_selesai') required this.tanggalSelesai, @JsonKey(name: 'total_hari') required this.totalHari, required this.alasan, required this.status, @JsonKey(name: 'catatan_pimpinan') this.catatanPimpinan, @JsonKey(name: 'dokumen_url') this.dokumenUrl, @JsonKey(name: 'created_at') this.createdAt});
  factory _CutiModel.fromJson(Map<String, dynamic> json) => _$CutiModelFromJson(json);

@override final  String id;
@override@JsonKey(name: 'id_pegawai') final  String idPegawai;
@override@JsonKey(name: 'id_jenis_cuti') final  String idJenisCuti;
@override@JsonKey(name: 'nama_jenis_cuti') final  String? namaJenisCuti;
@override@JsonKey(name: 'tanggal_mulai') final  DateTime tanggalMulai;
@override@JsonKey(name: 'tanggal_selesai') final  DateTime tanggalSelesai;
@override@JsonKey(name: 'total_hari') final  int totalHari;
@override final  String alasan;
@override final  String status;
@override@JsonKey(name: 'catatan_pimpinan') final  String? catatanPimpinan;
@override@JsonKey(name: 'dokumen_url') final  String? dokumenUrl;
@override@JsonKey(name: 'created_at') final  DateTime? createdAt;

/// Create a copy of CutiModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$CutiModelCopyWith<_CutiModel> get copyWith => __$CutiModelCopyWithImpl<_CutiModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$CutiModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _CutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.idPegawai, idPegawai) || other.idPegawai == idPegawai)&&(identical(other.idJenisCuti, idJenisCuti) || other.idJenisCuti == idJenisCuti)&&(identical(other.namaJenisCuti, namaJenisCuti) || other.namaJenisCuti == namaJenisCuti)&&(identical(other.tanggalMulai, tanggalMulai) || other.tanggalMulai == tanggalMulai)&&(identical(other.tanggalSelesai, tanggalSelesai) || other.tanggalSelesai == tanggalSelesai)&&(identical(other.totalHari, totalHari) || other.totalHari == totalHari)&&(identical(other.alasan, alasan) || other.alasan == alasan)&&(identical(other.status, status) || other.status == status)&&(identical(other.catatanPimpinan, catatanPimpinan) || other.catatanPimpinan == catatanPimpinan)&&(identical(other.dokumenUrl, dokumenUrl) || other.dokumenUrl == dokumenUrl)&&(identical(other.createdAt, createdAt) || other.createdAt == createdAt));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,idPegawai,idJenisCuti,namaJenisCuti,tanggalMulai,tanggalSelesai,totalHari,alasan,status,catatanPimpinan,dokumenUrl,createdAt);

@override
String toString() {
  return 'CutiModel(id: $id, idPegawai: $idPegawai, idJenisCuti: $idJenisCuti, namaJenisCuti: $namaJenisCuti, tanggalMulai: $tanggalMulai, tanggalSelesai: $tanggalSelesai, totalHari: $totalHari, alasan: $alasan, status: $status, catatanPimpinan: $catatanPimpinan, dokumenUrl: $dokumenUrl, createdAt: $createdAt)';
}


}

/// @nodoc
abstract mixin class _$CutiModelCopyWith<$Res> implements $CutiModelCopyWith<$Res> {
  factory _$CutiModelCopyWith(_CutiModel value, $Res Function(_CutiModel) _then) = __$CutiModelCopyWithImpl;
@override @useResult
$Res call({
 String id,@JsonKey(name: 'id_pegawai') String idPegawai,@JsonKey(name: 'id_jenis_cuti') String idJenisCuti,@JsonKey(name: 'nama_jenis_cuti') String? namaJenisCuti,@JsonKey(name: 'tanggal_mulai') DateTime tanggalMulai,@JsonKey(name: 'tanggal_selesai') DateTime tanggalSelesai,@JsonKey(name: 'total_hari') int totalHari, String alasan, String status,@JsonKey(name: 'catatan_pimpinan') String? catatanPimpinan,@JsonKey(name: 'dokumen_url') String? dokumenUrl,@JsonKey(name: 'created_at') DateTime? createdAt
});




}
/// @nodoc
class __$CutiModelCopyWithImpl<$Res>
    implements _$CutiModelCopyWith<$Res> {
  __$CutiModelCopyWithImpl(this._self, this._then);

  final _CutiModel _self;
  final $Res Function(_CutiModel) _then;

/// Create a copy of CutiModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? idPegawai = null,Object? idJenisCuti = null,Object? namaJenisCuti = freezed,Object? tanggalMulai = null,Object? tanggalSelesai = null,Object? totalHari = null,Object? alasan = null,Object? status = null,Object? catatanPimpinan = freezed,Object? dokumenUrl = freezed,Object? createdAt = freezed,}) {
  return _then(_CutiModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,idPegawai: null == idPegawai ? _self.idPegawai : idPegawai // ignore: cast_nullable_to_non_nullable
as String,idJenisCuti: null == idJenisCuti ? _self.idJenisCuti : idJenisCuti // ignore: cast_nullable_to_non_nullable
as String,namaJenisCuti: freezed == namaJenisCuti ? _self.namaJenisCuti : namaJenisCuti // ignore: cast_nullable_to_non_nullable
as String?,tanggalMulai: null == tanggalMulai ? _self.tanggalMulai : tanggalMulai // ignore: cast_nullable_to_non_nullable
as DateTime,tanggalSelesai: null == tanggalSelesai ? _self.tanggalSelesai : tanggalSelesai // ignore: cast_nullable_to_non_nullable
as DateTime,totalHari: null == totalHari ? _self.totalHari : totalHari // ignore: cast_nullable_to_non_nullable
as int,alasan: null == alasan ? _self.alasan : alasan // ignore: cast_nullable_to_non_nullable
as String,status: null == status ? _self.status : status // ignore: cast_nullable_to_non_nullable
as String,catatanPimpinan: freezed == catatanPimpinan ? _self.catatanPimpinan : catatanPimpinan // ignore: cast_nullable_to_non_nullable
as String?,dokumenUrl: freezed == dokumenUrl ? _self.dokumenUrl : dokumenUrl // ignore: cast_nullable_to_non_nullable
as String?,createdAt: freezed == createdAt ? _self.createdAt : createdAt // ignore: cast_nullable_to_non_nullable
as DateTime?,
  ));
}


}


/// @nodoc
mixin _$JenisCutiModel {

 String get id; String get nama; String? get keterangan;
/// Create a copy of JenisCutiModel
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$JenisCutiModelCopyWith<JenisCutiModel> get copyWith => _$JenisCutiModelCopyWithImpl<JenisCutiModel>(this as JenisCutiModel, _$identity);

  /// Serializes this JenisCutiModel to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is JenisCutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.nama, nama) || other.nama == nama)&&(identical(other.keterangan, keterangan) || other.keterangan == keterangan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,nama,keterangan);

@override
String toString() {
  return 'JenisCutiModel(id: $id, nama: $nama, keterangan: $keterangan)';
}


}

/// @nodoc
abstract mixin class $JenisCutiModelCopyWith<$Res>  {
  factory $JenisCutiModelCopyWith(JenisCutiModel value, $Res Function(JenisCutiModel) _then) = _$JenisCutiModelCopyWithImpl;
@useResult
$Res call({
 String id, String nama, String? keterangan
});




}
/// @nodoc
class _$JenisCutiModelCopyWithImpl<$Res>
    implements $JenisCutiModelCopyWith<$Res> {
  _$JenisCutiModelCopyWithImpl(this._self, this._then);

  final JenisCutiModel _self;
  final $Res Function(JenisCutiModel) _then;

/// Create a copy of JenisCutiModel
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


/// Adds pattern-matching-related methods to [JenisCutiModel].
extension JenisCutiModelPatterns on JenisCutiModel {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _JenisCutiModel value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _JenisCutiModel() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _JenisCutiModel value)  $default,){
final _that = this;
switch (_that) {
case _JenisCutiModel():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _JenisCutiModel value)?  $default,){
final _that = this;
switch (_that) {
case _JenisCutiModel() when $default != null:
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
case _JenisCutiModel() when $default != null:
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
case _JenisCutiModel():
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
case _JenisCutiModel() when $default != null:
return $default(_that.id,_that.nama,_that.keterangan);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _JenisCutiModel implements JenisCutiModel {
   _JenisCutiModel({required this.id, required this.nama, this.keterangan});
  factory _JenisCutiModel.fromJson(Map<String, dynamic> json) => _$JenisCutiModelFromJson(json);

@override final  String id;
@override final  String nama;
@override final  String? keterangan;

/// Create a copy of JenisCutiModel
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$JenisCutiModelCopyWith<_JenisCutiModel> get copyWith => __$JenisCutiModelCopyWithImpl<_JenisCutiModel>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$JenisCutiModelToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _JenisCutiModel&&(identical(other.id, id) || other.id == id)&&(identical(other.nama, nama) || other.nama == nama)&&(identical(other.keterangan, keterangan) || other.keterangan == keterangan));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,id,nama,keterangan);

@override
String toString() {
  return 'JenisCutiModel(id: $id, nama: $nama, keterangan: $keterangan)';
}


}

/// @nodoc
abstract mixin class _$JenisCutiModelCopyWith<$Res> implements $JenisCutiModelCopyWith<$Res> {
  factory _$JenisCutiModelCopyWith(_JenisCutiModel value, $Res Function(_JenisCutiModel) _then) = __$JenisCutiModelCopyWithImpl;
@override @useResult
$Res call({
 String id, String nama, String? keterangan
});




}
/// @nodoc
class __$JenisCutiModelCopyWithImpl<$Res>
    implements _$JenisCutiModelCopyWith<$Res> {
  __$JenisCutiModelCopyWithImpl(this._self, this._then);

  final _JenisCutiModel _self;
  final $Res Function(_JenisCutiModel) _then;

/// Create a copy of JenisCutiModel
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? id = null,Object? nama = null,Object? keterangan = freezed,}) {
  return _then(_JenisCutiModel(
id: null == id ? _self.id : id // ignore: cast_nullable_to_non_nullable
as String,nama: null == nama ? _self.nama : nama // ignore: cast_nullable_to_non_nullable
as String,keterangan: freezed == keterangan ? _self.keterangan : keterangan // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
