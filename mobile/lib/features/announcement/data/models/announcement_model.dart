class AnnouncementModel {
  final String id;
  final String judul;
  final String konten;
  final DateTime tanggalBerlaku;
  final DateTime tanggalBerakhir;
  final String? idUnit;
  final String? peranTarget;
  final bool aktif;
  final DateTime dibuatPada;

  AnnouncementModel({
    required this.id,
    required this.judul,
    required this.konten,
    required this.tanggalBerlaku,
    required this.tanggalBerakhir,
    this.idUnit,
    this.peranTarget,
    required this.aktif,
    required this.dibuatPada,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementModel(
      id: json['id'],
      judul: json['judul'],
      konten: json['konten'],
      tanggalBerlaku: DateTime.parse(json['tanggalBerlaku']),
      tanggalBerakhir: DateTime.parse(json['tanggalBerakhir']),
      idUnit: json['idUnit'],
      peranTarget: json['peranTarget'],
      aktif: json['aktif'] ?? true,
      dibuatPada: DateTime.parse(json['dibuatPada']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'judul': judul,
      'konten': konten,
      'tanggalBerlaku': tanggalBerlaku.toIso8601String(),
      'tanggalBerakhir': tanggalBerakhir.toIso8601String(),
      'idUnit': idUnit,
      'peranTarget': peranTarget,
      'aktif': aktif,
      'dibuatPada': dibuatPada.toIso8601String(),
    };
  }
}
