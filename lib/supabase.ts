import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库操作函数
export const db = {
  // Cities 表操作
  async getCities() {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('city_name');
    return { data, error };
  },

  async getCityByName(cityName: string) {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', cityName)
      .single();
    return { data, error };
  },

  async insertCity(city: any) {
    const { data, error } = await supabase
      .from('cities')
      .insert(city)
      .select();
    return { data, error };
  },

  async insertCities(cities: any[]) {
    const { data, error } = await supabase
      .from('cities')
      .insert(cities)
      .select();
    return { data, error };
  },

  async clearCities() {
    const { error } = await supabase
      .from('cities')
      .delete()
      .neq('id', 0);
    return { error };
  },

  // Salaries 表操作
  async getSalaries() {
    const { data, error } = await supabase
      .from('salaries')
      .select('*')
      .order('employee_name');
    return { data, error };
  },

  async insertSalary(salary: any) {
    const { data, error } = await supabase
      .from('salaries')
      .insert(salary)
      .select();
    return { data, error };
  },

  async insertSalaries(salaries: any[]) {
    const { data, error } = await supabase
      .from('salaries')
      .insert(salaries)
      .select();
    return { data, error };
  },

  async clearSalaries() {
    const { error } = await supabase
      .from('salaries')
      .delete()
      .neq('id', 0);
    return { error };
  },

  // Results 表操作
  async getResults() {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('employee_name');
    return { data, error };
  },

  async insertResult(result: any) {
    const { data, error } = await supabase
      .from('results')
      .insert(result)
      .select();
    return { data, error };
  },

  async insertResults(results: any[]) {
    const { data, error } = await supabase
      .from('results')
      .insert(results)
      .select();
    return { data, error };
  },

  async clearResults() {
    const { error } = await supabase
      .from('results')
      .delete()
      .neq('id', 0);
    return { error };
  },
};
