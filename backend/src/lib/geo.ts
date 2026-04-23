function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Hitung jarak antara dua koordinat (dalam meter)
export function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
    * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cek apakah posisi pegawai dalam radius yang diizinkan
export function isWithinRadius(
  empLat: number, empLng: number,
  targetLat: number, targetLng: number,
  radiusMeters: number
): boolean {
  return haversineDistance(empLat, empLng, targetLat, targetLng) <= radiusMeters;
}
