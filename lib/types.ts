// 城市标准表
export interface City {
  id?: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

// 员工工资表
export interface Salary {
  id?: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

// 计算结果表
export interface Result {
  id?: number;
  employee_name: string;
  city_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
  calculated_at?: string;
}

// Excel解析用的原始数据类型
export interface ExcelCityRow {
  id?: number;
  city_namte: string;  // 注意：Excel源文件列名拼写错误
  year: string;
  rate: number;
  base_min: number;
  base_max: number;
}
