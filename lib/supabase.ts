import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 延迟初始化Supabase客户端，避免构建时错误
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase环境变量未配置，请检查 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}

// 数据库操作函数
export const db = {
  // Cities 表操作
  async getCities() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cities')
      .select('*')
      .order('city_name');
    return { data, error };
  },

  async getCityByName(cityName: string) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cities')
      .select('*')
      .eq('city_name', cityName)
      .single();
    return { data, error };
  },

  async insertCity(city: any) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cities')
      .insert(city)
      .select();
    return { data, error };
  },

  async insertCities(cities: any[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('cities')
      .insert(cities as any);
    return { data, error };
  },

  async clearCities() {
    const client = getSupabaseClient();
    const { error } = await client
      .from('cities')
      .delete()
      .neq('id', 0);
    return { error };
  },

  // Salaries 表操作
  async getSalaries() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('salaries')
      .select('*')
      .order('employee_name');
    return { data, error };
  },

  async insertSalary(salary: any) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('salaries')
      .insert(salary)
      .select();
    return { data, error };
  },

  async insertSalaries(salaries: any[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('salaries')
      .insert(salaries as any);
    return { data, error };
  },

  async clearSalaries() {
    const client = getSupabaseClient();
    const { error } = await client
      .from('salaries')
      .delete()
      .neq('id', 0);
    return { error };
  },

  // Results 表操作
  async getResults() {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('results')
      .select('*')
      .order('employee_name');
    return { data, error };
  },

  async insertResult(result: any) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('results')
      .insert(result)
      .select();
    return { data, error };
  },

  async insertResults(results: any[]) {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from('results')
      .insert(results as any);
    return { data, error };
  },

  async clearResults() {
    const client = getSupabaseClient();
    const { error } = await client
      .from('results')
      .delete()
      .neq('id', 0);
    return { error };
  },
};
