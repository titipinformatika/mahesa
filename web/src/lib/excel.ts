import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export async function exportToExcel(data: Record<string, unknown>[], columns: ExcelColumn[], fileName: string) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  worksheet.columns = columns;

  data.forEach((item) => {
    worksheet.addRow(item);
  });

  // Style header
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  const buffer = await workbook.xlsx.writeBuffer();
  const bufferArray = buffer instanceof ArrayBuffer ? buffer : (buffer as any).buffer || buffer;
  const blob = new Blob([bufferArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
}

export interface DapodikExcelRow {
    nip: string;
    nama: string;
    jabatan: string;
    idUnit: string;
}

export async function readExcel(file: File): Promise<DapodikExcelRow[]> {
  const workbook = new ExcelJS.Workbook();
  const arrayBuffer = await file.arrayBuffer();
  await workbook.xlsx.load(arrayBuffer);
  
  const worksheet = workbook.getWorksheet(1);
  const data: DapodikExcelRow[] = [];
  
  if (!worksheet) return [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Skip header
      const values = row.values as (string | number | boolean | null | undefined)[];
      data.push({
        nip: values[1]?.toString() || "",
        nama: values[2]?.toString() || "",
        jabatan: values[3]?.toString() || "",
        idUnit: values[4]?.toString() || "",
      });
    }
  });
  
  return data;
}
