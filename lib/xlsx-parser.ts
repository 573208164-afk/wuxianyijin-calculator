import * as XLSX from 'xlsx';
import { City, Salary, ExcelCityRow } from './types';

/**
 * 解析salaries.xlsx文件
 */
export function parseSalariesExcel(buffer: ArrayBuffer): Salary[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet) as any[];

  return data
    .filter((row: any) => row.employee_name && row.employee_name.toString().trim() !== '') // 过滤空行
    .map((row: any) => ({
      // 不指定 id，让数据库自动生成主键
      employee_id: String(row.employee_id || ''),
      employee_name: String(row.employee_name),
      month: String(row.month || ''),
      salary_amount: Number(row.salary_amount) || 0,
    }));
}

/**
 * 解析cities.xlsx文件
 * 注意：Excel源文件列名有拼写错误 (city_namte)，需要特殊处理
 */
export function parseCitiesExcel(buffer: ArrayBuffer): City[] {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: null }) as any[];

  return data
    .filter((row: any) => {
      // 处理多种可能的列名格式（有无空格）
      const cityName = row['city_namte'] || row['city_namte '] || row['city_name'] || row['city_name '];
      return cityName && String(cityName).trim() !== '';
    })
    .map((row: any) => {
      // 处理多种可能的列名格式
      const cityName = row['city_namte'] || row['city_namte '] || row['city_name'] || row['city_name '];
      return {
        // 不指定 id，让数据库自动生成主键
        city_name: String(cityName).trim(),
        year: String(row.year),
        rate: Number(row.rate),
        base_min: Number(row.base_min),
        base_max: Number(row.base_max),
      };
    });
}

/**
 * 读取上传的Excel文件并返回ArrayBuffer
 */
export async function readExcelFile(file: File): Promise<ArrayBuffer> {
  return await file.arrayBuffer();
}
