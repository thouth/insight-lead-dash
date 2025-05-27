
import * as XLSX from 'xlsx';
import { Lead } from '@/hooks/useLeads';

export interface ExcelProcessingResult {
  validLeads: Lead[];
  errors: string[];
  totalRows: number;
  skippedRows: number;
}

// Enhanced column mapping with Norwegian variations and more flexible matching
const COLUMN_MAPPINGS = {
  date: ['Dato', 'Date', 'dato', 'DATO'],
  company: ['Firmanavn', 'Company', 'firmanavn', 'Firma', 'FIRMANAVN', 'company'],
  org_number: ['Org.nr', 'Org nr', 'Organization Number', 'org.nr', 'org nr', 'Orgnr', 'orgnr', 'ORG.NR', 'ORG NR'],
  status: ['Status', 'status', 'STATUS'],
  source: ['Kanal', 'Channel', 'Source', 'kanal', 'channel', 'source', 'KANAL'],
  seller: ['Ansvarlig selger', 'Responsible Seller', 'Seller', 'ansvarlig selger', 'seller', 'ANSVARLIG SELGER'],
  contact: ['Kontaktperson', 'Contact Person', 'Contact', 'kontaktperson', 'contact', 'KONTAKTPERSON', 'Kundekontakt'],
  existing_customer: ['Eksisterende kunde', 'Existing Customer', 'eksisterende kunde', 'existing customer', 'EKSISTERENDE KUNDE'],
  kwp: ['kWp', 'KWP', 'kwp', 'KWP', 'kw'],
  ppa_price: ['PPA pris', 'PPA Price', 'ppa pris', 'ppa price', 'PPA PRIS']
};

const findColumnValue = (row: any, possibleNames: string[]): any => {
  // First try exact matches
  for (const name of possibleNames) {
    if (row.hasOwnProperty(name) && row[name] !== undefined && row[name] !== null && String(row[name]).trim() !== '') {
      return row[name];
    }
  }
  
  // Then try case-insensitive matches and partial matches
  const rowKeys = Object.keys(row);
  for (const name of possibleNames) {
    for (const key of rowKeys) {
      if (key.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(key.toLowerCase())) {
        if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
          return row[key];
        }
      }
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
    console.log(`Processing row ${rowIndex + 2}:`, row);
    
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
      if (!company || !String(company).trim()) missing.push('Firmanavn');
      if (!orgNumber || !String(orgNumber).trim()) missing.push('Org.nr');
      if (!status || !String(status).trim()) missing.push('Status');
      
      console.log(`Row ${rowIndex + 2} missing fields:`, missing, 'Available keys:', Object.keys(row));
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

    console.log(`Successfully mapped row ${rowIndex + 2}:`, lead);
    return { lead };
  } catch (error) {
    console.error(`Error processing row ${rowIndex + 2}:`, error);
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
        
        console.log('Processing worksheet:', sheetName);
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Excel data loaded:', jsonData.length, 'rows');
        console.log('First row sample:', jsonData[0]);
        
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
        
        console.log('Processing complete:', {
          validLeads: validLeads.length,
          errors: errors.length,
          skippedRows,
          totalRows: jsonData.length
        });
        
        resolve({
          validLeads,
          errors,
          totalRows: jsonData.length,
          skippedRows,
        });
      } catch (error) {
        console.error('Excel processing error:', error);
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
