
import * as XLSX from 'xlsx';
import { Lead } from '@/hooks/useLeads';

export interface ExcelProcessingResult {
  validLeads: Lead[];
  errors: string[];
  totalRows: number;
  skippedRows: number;
}

const isRowEmpty = (row: any): boolean => {
  const requiredFields = ['Firmanavn', 'Org.nr', 'Status'];
  return !requiredFields.some(field => row[field] && String(row[field]).trim());
};

const hasRequiredFields = (row: any): boolean => {
  return row['Firmanavn'] && String(row['Firmanavn']).trim() &&
         row['Org.nr'] && String(row['Org.nr']).trim() &&
         row['Status'] && String(row['Status']).trim();
};

const mapExcelRowToLead = (row: any, rowIndex: number): { lead?: Lead; error?: string } => {
  try {
    // Skip completely empty rows
    if (isRowEmpty(row)) {
      return {};
    }

    // Check if row has required fields
    if (!hasRequiredFields(row)) {
      return { error: `Row ${rowIndex + 1}: Missing required fields (Firmanavn, Org.nr, or Status)` };
    }

    // Map Excel columns to database fields
    const lead: Lead = {
      date: row['Dato'] ? new Date(row['Dato']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      company: String(row['Firmanavn']).trim(),
      org_number: String(row['Org.nr']).trim(),
      status: String(row['Status']).trim(),
      source: row['Kanal'] ? String(row['Kanal']).trim() : 'Nettside',
      seller: row['Ansvarlig selger'] ? String(row['Ansvarlig selger']).trim() : 'Unknown',
      contact: row['Kontaktperson'] ? String(row['Kontaktperson']).trim() : undefined,
      is_existing_customer: row['Eksisterende kunde'] ? String(row['Eksisterende kunde']).toLowerCase() === 'ja' : false,
      kwp: row['kWp'] ? parseFloat(String(row['kWp'])) : undefined,
      ppa_price: row['PPA pris'] ? parseFloat(String(row['PPA pris'])) : undefined,
    };

    return { lead };
  } catch (error) {
    return { error: `Row ${rowIndex + 1}: Error processing data - ${error}` };
  }
};

export const processExcelFile = async (file: File): Promise<ExcelProcessingResult> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const validLeads: Lead[] = [];
        const errors: string[] = [];
        let skippedRows = 0;
        
        jsonData.forEach((row, index) => {
          const result = mapExcelRowToLead(row, index);
          
          if (result.lead) {
            validLeads.push(result.lead);
          } else if (result.error) {
            errors.push(result.error);
          } else {
            // Empty row was skipped
            skippedRows++;
          }
        });
        
        resolve({
          validLeads,
          errors,
          totalRows: jsonData.length,
          skippedRows,
        });
      } catch (error) {
        resolve({
          validLeads: [],
          errors: [`Failed to process Excel file: ${error}`],
          totalRows: 0,
          skippedRows: 0,
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        validLeads: [],
        errors: ['Failed to read file'],
        totalRows: 0,
        skippedRows: 0,
      });
    };
    
    reader.readAsArrayBuffer(file);
  });
};
