// backend/src/lib/skemaAbsensiTemplates.ts

export interface TitikSkema {
  urutan: number;
  jenis: string;
  label: string;
  aturan_lokasi: 'kantor' | 'tujuan_dl' | 'dimana_saja';
}

export const TEMPLATE_SKEMA = {
  // Skema 1: Dinas Luar Full
  // Masuk dari mana saja → tiba di lokasi DL → pulang dari mana saja
  dl_penuh: [
    { urutan: 1, jenis: 'jam_masuk',   label: 'Jam Masuk (Berangkat DL)',  aturan_lokasi: 'dimana_saja' },
    { urutan: 2, jenis: 'sampai_dl',   label: 'Sampai Lokasi Dinas Luar', aturan_lokasi: 'tujuan_dl'  },
    { urutan: 3, jenis: 'jam_pulang',  label: 'Pulang',                   aturan_lokasi: 'dimana_saja' },
  ],
  // Skema 2: Masuk Kerja → Dinas Luar → Pulang
  // Masuk di kantor → tiba di lokasi DL → pulang dari mana saja
  kantor_dl_pulang: [
    { urutan: 1, jenis: 'jam_masuk',   label: 'Masuk Kerja (di Kantor)',  aturan_lokasi: 'kantor'     },
    { urutan: 2, jenis: 'sampai_dl',   label: 'Sampai Lokasi Dinas Luar', aturan_lokasi: 'tujuan_dl'  },
    { urutan: 3, jenis: 'jam_pulang',  label: 'Pulang',                   aturan_lokasi: 'dimana_saja' },
  ],
  // Skema 3: Dinas Luar → Masuk Kerja
  // Masuk dari mana saja → tiba di lokasi DL → tiba di kantor → pulang dari kantor
  dl_kantor: [
    { urutan: 1, jenis: 'jam_masuk',    label: 'Jam Masuk (Sebelum DL)',   aturan_lokasi: 'dimana_saja' },
    { urutan: 2, jenis: 'sampai_dl',    label: 'Sampai Lokasi Dinas Luar', aturan_lokasi: 'tujuan_dl'  },
    { urutan: 3, jenis: 'sampai_kantor',label: 'Sampai Kantor',            aturan_lokasi: 'kantor'     },
    { urutan: 4, jenis: 'jam_pulang',   label: 'Pulang Kantor',            aturan_lokasi: 'kantor'     },
  ],
};
