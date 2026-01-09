import Papa from 'papaparse';
import * as XLSX from "xlsx";
import { Contact } from "@/types/contact";

// CSV
function parseCSV(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as any[]);
      },
    });
  });
}

// Excel
function parseExcel(file: File): Promise<any[]> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      resolve(json as any[]);
    };

    reader.readAsArrayBuffer(file);
  });
}

function mapToContact(row: any): Contact {
  return {
    name: `${row["First Name"] ?? ""} ${row["Last Name"] ?? ""}`.trim(),
    emails: row["Email"] ?? "",
    phones: row["Phone"] ?? "",
    company: row["Company"] ?? "",
    lastUpdated: new Date().toISOString(),
  };
}

export async function fileParser(
  file: File
): Promise<Contact[]> {
  const isCSV = file.name.endsWith(".csv");

  const rows = isCSV
    ? await parseCSV(file)
    : await parseExcel(file);

  return rows.map(mapToContact);
}
