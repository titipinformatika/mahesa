class LaporanDinasModel {
  final String id;
  final String idUnitKerja;
  final String idPimpinan;
  final int bulan;
  final int tahun;
  final int totalPegawai;
  final int totalHadir;
  final int totalCuti;
  final int totalDl;
  final String? catatanPimpinan;
  final String status;
  final DateTime dibuatPada;

  LaporanDinasModel({
    required this.id,
    required this.idUnitKerja,
    required this.idPimpinan,
    required this.bulan,
    required this.tahun,
    required this.totalPegawai,
    required this.totalHadir,
    required this.totalCuti,
    required this.totalDl,
    this.catatanPimpinan,
    required this.status,
    required this.dibuatPada,
  });

  factory LaporanDinasModel.fromJson(Map<String, dynamic> json) {
    return LaporanDinasModel(
      id: json['id'],
      idUnitKerja: json['idUnitKerja'],
      idPimpinan: json['idPimpinan'],
      bulan: json['bulan'],
      tahun: json['tahun'],
      totalPegawai: json['totalPegawai'],
      totalHadir: json['totalHadir'],
      totalCuti: json['totalCuti'],
      totalDl: json['totalDl'],
      catatanPimpinan: json['catatanPimpinan'],
      status: json['status'],
      dibuatPada: DateTime.parse(json['dibuatPada']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'idUnitKerja': idUnitKerja,
      'idPimpinan': idPimpinan,
      'bulan': bulan,
      'tahun': tahun,
      'totalPegawai': totalPegawai,
      'totalHadir': totalHadir,
      'totalCuti': totalCuti,
      'totalDl': totalDl,
      'catatanPimpinan': catatanPimpinan,
      'status': status,
      'dibuatPada': dibuatPada.toIso8601String(),
    };
  }
}

class LaporanSummaryModel {
    final String periode;
    final int totalPegawai;
    final int totalHadir;
    final int totalCuti;
    final int totalDl;

    LaporanSummaryModel({
        required this.periode,
        required this.totalPegawai,
        required this.totalHadir,
        required this.totalCuti,
        required this.totalDl,
    });

    factory LaporanSummaryModel.fromJson(Map<String, dynamic> json) {
        final summary = json['summary'];
        return LaporanSummaryModel(
            periode: json['periode'],
            totalPegawai: summary['total_pegawai'] ?? 0,
            totalHadir: summary['total_hadir'] ?? 0,
            totalCuti: summary['total_cuti'] ?? 0,
            totalDl: summary['total_dl'] ?? 0,
        );
    }
}
