'use server';

import { db } from '../lib/supabase';
import { City, Salary, Result } from '../lib/types';
import { parseSalariesExcel, parseCitiesExcel } from '../lib/xlsx-parser';

/**
 * 上传salaries数据
 */
export async function uploadSalaries(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: '请选择文件' };
    }

    const buffer = await file.arrayBuffer();
    const salaries = parseSalariesExcel(buffer);

    // 先清空旧数据，再插入新数据
    await db.clearSalaries();
    const { data, error } = await db.insertSalaries(salaries);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: salaries.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * 上传cities数据
 */
export async function uploadCities(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: '请选择文件' };
    }

    const buffer = await file.arrayBuffer();
    const cities = parseCitiesExcel(buffer);

    // 先清空旧数据，再插入新数据
    await db.clearCities();
    const { data, error } = await db.insertCities(cities);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, count: cities.length };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * 执行计算
 */
export async function calculateContributions(cityName: string) {
  try {
    // 1. 获取所有工资数据
    const { data: salaries, error: salariesError } = await db.getSalaries();
    if (salariesError) {
      return { success: false, error: salariesError.message };
    }

    // 2. 获取城市标准
    const { data: city, error: cityError } = await db.getCityByName(cityName);
    if (cityError || !city) {
      return { success: false, error: '未找到该城市的社保标准' };
    }

    // 明确指定 city 类型，避免 TypeScript 推断问题
    const cityData: City = city as any;

    // 3. 按员工分组计算平均工资
    const employeeGroups = new Map<string, number[]>();
    salaries?.forEach((salary: Salary) => {
      if (!employeeGroups.has(salary.employee_name)) {
        employeeGroups.set(salary.employee_name, []);
      }
      employeeGroups.get(salary.employee_name)!.push(salary.salary_amount);
    });

    // 4. 计算每位员工的缴费基数和公司缴纳金额
    const results: Omit<Result, 'id' | 'calculated_at'>[] = [];

    for (const [employeeName, salaryList] of employeeGroups.entries()) {
      // 计算月平均工资
      const avgSalary = salaryList.reduce((a, b) => a + b, 0) / salaryList.length;

      // 确定缴费基数
      let contributionBase: number;
      if (avgSalary < cityData.base_min) {
        contributionBase = cityData.base_min;
      } else if (avgSalary > cityData.base_max) {
        contributionBase = cityData.base_max;
      } else {
        contributionBase = avgSalary;
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * cityData.rate;

      results.push({
        employee_name: employeeName,
        city_name: cityData.city_name,
        avg_salary: Number(avgSalary.toFixed(2)),
        contribution_base: Number(contributionBase.toFixed(2)),
        company_fee: Number(companyFee.toFixed(2)),
      });
    }

    // 5. 存入结果表（先清空旧结果）
    await db.clearResults();
    const { data: insertData, error: insertError } = await db.insertResults(results);

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    return { success: true, count: results.length, results };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

/**
 * 获取所有城市列表
 */
export async function getCities() {
  const { data, error } = await db.getCities();
  return { cities: data, error };
}
