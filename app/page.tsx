import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            五险一金计算器
          </h1>
          <p className="text-gray-600">
            根据员工工资和城市社保标准计算公司应缴纳的社保公积金费用
          </p>
        </div>

        {/* 两个功能卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 数据上传卡片 */}
          <Link href="/upload" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">数据上传</h2>
                <p className="text-gray-600 mb-4">上传Excel数据并执行计算</p>
                <span className="text-blue-600 font-medium group-hover:text-blue-700">
                  点击进入 →
                </span>
              </div>
            </div>
          </Link>

          {/* 结果查询卡片 */}
          <Link href="/results" className="group">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-2 border-transparent hover:border-indigo-500">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">结果查询</h2>
                <p className="text-gray-600 mb-4">查看计算结果和报表</p>
                <span className="text-indigo-600 font-medium group-hover:text-indigo-700">
                  点击进入 →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
