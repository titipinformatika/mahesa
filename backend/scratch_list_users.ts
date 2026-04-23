import { db } from './src/db';
import { pengguna, pegawai } from './src/db/schema/pegawai';

async function findTestUser() {
  try {
    const users = await db.select().from(pengguna).limit(5);
    console.log("Daftar Pengguna:", JSON.stringify(users, null, 2));

    const employees = await db.select().from(pegawai).limit(5);
    console.log("Daftar Pegawai:", JSON.stringify(employees, null, 2));

  } catch (error) {
    console.error("Error:", error);
  }
}

findTestUser();
