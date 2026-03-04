'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../lib/supabase';
import { Result } from '../../lib/types';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const loadResults = async () => {
    setLoading(true);
    const { data, error } = await db.getResults();
    if (data) {
      setResults(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadResults();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回首页
        </Link>

        {/* 标题 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">计算结果</h1>
              <p className="text-gray-600">
                {results.length > 0 ? `共 ${results.length} 位员工的计算结果` : '暂无计算结果'}
              </p>
            </div>
            <button
              onClick={loadResults}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>

        {/* 结果表格 */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-600">暂无计算结果，请先上传数据并执行计算</p>
            <Link href="/upload" className="inline-block mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
              前往上传页面 →
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">员工姓名</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">城市</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">年度月平均工资</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">缴费基数</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">公司缴纳金额</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">计算时间</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={result.id || index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{result.employee_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{result.city_name}</td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        ¥{result.avg_salary.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-right text-gray-900">
                        ¥{result.contribution_base.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-semibold text-indigo-600">
                        ¥{result.company_fee.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {result.calculated_at ? new Date(result.calculated_at).toLocaleString('zh-CN') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* 合计行 */}
                <tfoot className="bg-indigo-50">
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-sm font-bold text-gray-700">合计</td>
                    <td className="px-6 py-4 text-sm text-right font-bold text-indigo-700">
                      ¥{results.reduce((sum, r) => sum + r.company_fee, 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
