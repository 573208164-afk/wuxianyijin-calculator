'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { uploadSalaries, uploadCities, calculateContributions, getCities } from '../actions';

export default function UploadPage() {
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const { cities: citiesData } = await getCities();
    if (citiesData && citiesData.length > 0) {
      setCities(citiesData as any[]);
      setSelectedCity((citiesData[0] as any).city_name);
    }
  };

  const handleSalariesUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadSalaries(formData);

    if (result.success) {
      setMessage({ type: 'success', text: `成功上传 ${result.count} 条工资数据` });
    } else {
      setMessage({ type: 'error', text: result.error || '上传失败' });
    }

    setLoading(false);
  };

  const handleCitiesUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await uploadCities(formData);

    if (result.success) {
      setMessage({ type: 'success', text: `成功上传 ${result.count} 条城市数据` });
      await loadCities(); // 重新加载城市列表
    } else {
      setMessage({ type: 'error', text: result.error || '上传失败' });
    }

    setLoading(false);
  };

  const handleCalculate = async () => {
    if (!selectedCity) {
      setMessage({ type: 'error', text: '请先选择城市' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await calculateContributions(selectedCity);

    if (result.success) {
      setMessage({ type: 'success', text: `计算完成！共处理 ${result.count} 位员工` });
    } else {
      setMessage({ type: 'error', text: result.error || '计算失败' });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        {/* 标题 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">数据上传与计算</h1>
          <p className="text-gray-600">上传Excel数据并执行计算</p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* 上传 salaries.xlsx */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">上传员工工资数据</h2>
          <form onSubmit={handleSalariesUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择 salaries.xlsx 文件
              </label>
              <input
                type="file"
                name="file"
                accept=".xlsx,.xls"
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '上传中...' : '上传工资数据'}
            </button>
          </form>
        </div>

        {/* 上传 cities.xlsx */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">上传城市标准数据</h2>
          <form onSubmit={handleCitiesUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择 cities.xlsx 文件
              </label>
              <input
                type="file"
                name="file"
                accept=".xlsx,.xls"
                required
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '上传中...' : '上传城市数据'}
            </button>
          </form>
        </div>

        {/* 城市选择与计算 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">执行计算</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择城市
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {cities.length === 0 ? (
                  <option value="">请先上传城市数据</option>
                ) : (
                  cities.map((city) => (
                    <option key={city.id} value={city.city_name}>
                      {city.city_name} ({city.year}) - 缴纳比例 {(city.rate * 100).toFixed(0)}%
                    </option>
                  ))
                )}
              </select>
            </div>
            <button
              onClick={handleCalculate}
              disabled={loading || !selectedCity}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
            >
              {loading ? '计算中...' : '执行计算并存储结果'}
            </button>
          </div>

          {/* 城市信息展示 */}
          {selectedCity && cities.find(c => c.city_name === selectedCity) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-2">当前城市标准</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">基数下限:</span>
                  <span className="ml-2 font-semibold">¥{cities.find(c => c.city_name === selectedCity)?.base_min.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">基数上限:</span>
                  <span className="ml-2 font-semibold">¥{cities.find(c => c.city_name === selectedCity)?.base_max.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">缴纳比例:</span>
                  <span className="ml-2 font-semibold">{(cities.find(c => c.city_name === selectedCity)?.rate! * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
