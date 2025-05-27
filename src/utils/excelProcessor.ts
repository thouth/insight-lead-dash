
import * as XLSX from 'xlsx';
import { Lead } from '@/hooks/useLeads';

export interface ExcelProcessingResult {
  validLeads: Lead[];
  errors: string[];
  totalRows: number;
  skippedRows: number;
}

// Column mapping with possible variations
const COLUMN_MAPPINGS = {
  date: ['Dato', 'Date', 'dato'],
  company: ['Firmanavn', 'Company', 'firmanavn', 'Firma'],
  org_number: ['Org.nr', 'Org nr', 'Organization Number', 'org.nr', 'org nr', 'Orgnr', 'orgnr'],
  status: ['Status', 'status'],
  source: ['Kanal', 'Channel', 'Source', 'kanal', 'channel', 'source'],
  seller: ['Ansvarlig selger', 'Responsible Seller', 'Seller', 'ansvarlig selger', 'seller'],
  contact: ['Kontaktperson', 'Contact Person', 'Contact', 'kontaktperson', 'contact'],
  existing_customer: ['Eksisterende kunde', 'Existing Customer', 'eksisterende kunde', 'existing customer'],
  kwp: ['kWp', 'KWP', 'kwp'],
  ppa_price: ['PPA pris', 'PPA Price', 'ppa pris', 'ppa price']
};

const findColumnValue = (row: any, possibleNames: string[]): any => {
  for (const name of possibleNames) {
    if (row.hasOwnProperty(name) && row[name] !== undefined && row[name] !== null && String(row[name]).trim() !== '') {
      return row[name];
    }
  }
  return null;
};

const isRowEmpty = (row: any): boolean => {
  const company = findColumnValue(row, COLUMN_MAPPINGS.company);
  const orgNumber = findColumnValue(row, COLUMN_MAPPINGS.org_number);
  const status = findColumnValue(row, COLUMN_MAPPINGS.status);
  
  return !company && !orgNumber && !status;
};

const hasRequiredFields = (row: any): boolean => {
  const company = findColumnValue(row, COLUMN_MAPPINGS.company);
  const orgNumber = findColumnValue(row, COLUMN_MAPPINGS.org_number);
  const status = findColumnValue(row, COLUMN_MAPPINGS.status);
  
  return Boolean(company && String(company).trim()) &&
         Boolean(orgNumber && String(orgNumber).trim()) &&
         Boolean(status && String(status).trim());
};

const mapExcelRowToLead = (row: any, rowIndex: number): { lead?: Lead; error?: string } => {
  try {
    // Skip completely empty rows
    if (isRowEmpty(row)) {
      return {};
    }

    // Check if row has required fields
    if (!hasRequiredFields(row)) {
      const company = findColumnValue(row, COLUMN_MAPPINGS.company);
      const orgNumber = findColumnValue(row, COLUMN_MAPPINGS.org_number);
      const status = findColumnValue(row, COLUMN_MAPPINGS.status);
      
      const missing = [];
      if (!company || !String(company).trim()) missing.push('Company/Firmanavn');
      if (!orgNumber || !String(orgNumber).trim()) missing.push('Org.nr');
      if (!status || !String(status).trim()) missing.push('Status');
      
      return { error: `Row ${rowIndex + 2}: Missing required fields: ${missing.join(', ')}` };
    }

    // Extract values using flexible column mapping
    const dateValue = findColumnValue(row, COLUMN_MAPPINGS.date);
    const existingCustomerValue = findColumnValue(row, COLUMN_MAPPINGS.existing_customer);
    const kwpValue = findColumnValue(row, COLUMN_MAPPINGS.kwp);
    const ppaPriceValue = findColumnValue(row, COLUMN_MAPPINGS.ppa_price);

    // Map Excel columns to database fields
    const lead: Lead = {
      date: dateValue ? new Date(dateValue).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      company: String(findColumnValue(row, COLUMN_MAPPINGS.company)).trim(),
      org_number: String(findColumnValue(row, COLUMN_MAPPINGS.org_number)).trim(),
      status: String(findColumnValue(row, COLUMN_MAPPINGS.status)).trim(),
      source: findColumnValue(row, COLUMN_MAPPINGS.source) ? String(findColumnValue(row, COLUMN_MAPPINGS.source)).trim() : 'Nettside',
      seller: findColumnValue(row, COLUMN_MAPPINGS.seller) ? String(findColumnValue(row, COLUMN_MAPPINGS.seller)).trim() : 'Unknown',
      contact: findColumnValue(row, COLUMN_MAPPINGS.contact) ? String(findColumnValue(row, COLUMN_MAPPINGS.contact)).trim() : undefined,
      is_existing_customer: existingCustomerValue ? String(existingCustomerValue).toLowerCase().trim() === 'ja' : false,
      kwp: kwpValue ? parseFloat(String(kwpValue)) : undefined,
      ppa_price: ppaPriceValue ? parseFloat(String(ppaPriceValue)) : undefined,
    };

    return { lead };
  } catch (error) {
    return { error: `Row ${rowIndex + 2}: Error processing data - ${error}` };
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
