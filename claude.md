# 五险一金计算器 - 项目上下文文档

## 项目概述

**目标**: 构建一个迷你"五险一金"计算器Web应用，根据员工工资数据和城市社保标准，计算公司应缴纳的社保公积金费用。

**技术栈**:
- 前端框架: Next.js (App Router)
- UI样式: Tailwind CSS
- 后端/数据库: Supabase
- 文件处理: xlsx 库 (解析Excel)

---

## 数据库结构 (Supabase PostgreSQL)

### 1. cities (城市标准表)
```sql
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,           -- 城市名 (注意: Excel源文件列名拼写为 "city_namte")
  year TEXT NOT NULL,                 -- 年份 (如 "2024")
  base_min INTEGER NOT NULL,          -- 社保基数下限
  base_max INTEGER NOT NULL,          -- 社保基数上限
  rate FLOAT NOT NULL                 -- 综合缴纳比例 (如 0.14)
);
```

### 2. salaries (员工工资表)
```sql
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,          -- 员工工号
  employee_name TEXT NOT NULL,        -- 员工姓名
  month TEXT NOT NULL,                -- 年份月份 (YYYYMM格式, 如 "202401")
  salary_amount INTEGER NOT NULL      -- 该月工资金额
);
```

### 3. results (计算结果表)
```sql
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,        -- 员工姓名
  city_name TEXT NOT NULL,            -- 城市名
  avg_salary FLOAT NOT NULL,          -- 年度月平均工资
  contribution_base FLOAT NOT NULL,   -- 最终缴费基数
  company_fee FLOAT NOT NULL,         -- 公司缴纳金额
  calculated_at TIMESTAMP DEFAULT NOW() -- 计算时间
);
```

---

## 核心业务逻辑

### 计算函数 (Server Action)

```typescript
// 伪代码描述
async function calculateContributions(selectedCity: string) {
  // 1. 从 salaries 表读取所有数据
  const salaries = await supabase.from('salaries').select('*');

  // 2. 按员工分组，计算年度月平均工资
  const grouped = groupBy(salaries, 'employee_name');
  for (employee in grouped) {
    avgSalary = sum(monthly_salaries) / count(months);

    // 3. 从 cities 表获取所选城市标准
    const city = await getCity(selectedCity);

    // 4. 确定最终缴费基数
    let base;
    if (avgSalary < city.base_min) {
      base = city.base_min;
    } else if (avgSalary > city.base_max) {
      base = city.base_max;
    } else {
      base = avgSalary;
    }

    // 5. 计算公司缴纳金额
    const companyFee = base * city.rate;

    // 6. 存入 results 表
    await supabase.from('results').insert({
      employee_name: employee,
      city_name: city.city_name,
      avg_salary: avgSalary,
      contribution_base: base,
      company_fee: companyFee
    });
  }
}
```

### 缴费基数规则
| 平均工资范围 | 最终缴费基数 |
|-------------|-------------|
| < base_min  | base_min    |
| base_min ~ base_max | 平均工资本身 |
| > base_max  | base_max    |

---

## 前端页面结构

### 路由结构
```
├── app/
│   ├── page.tsx              # 主页 (/)
│   ├── upload/
│   │   └── page.tsx          # 上传页 (/upload)
│   └── results/
│       └── page.tsx          # 结果页 (/results)
```

### 页面1: 主页 `/`
**布局**: 两个功能卡片（Card），水平并排（大屏）或垂直排列（小屏）

```
┌─────────────────────────────────────────┐
│          五险一金计算器                  │
├─────────────────┬───────────────────────┤
│   数据上传       │    结果查询            │
│                 │                       │
│   上传Excel数据  │    查看计算结果        │
│   触发计算       │    导出报表            │
│                 │                       │
│     [点击进入]   │      [点击进入]        │
└─────────────────┴───────────────────────┘
```

**功能**: 每个卡片可点击，分别跳转到 `/upload` 和 `/results`

### 页面2: 数据上传 `/upload`
**功能组件**:
1. **城市选择器**: 下拉选择城市（从cities表读取）
2. **上传salaries.xlsx**: 文件上传按钮，解析后插入salaries表
3. **上传cities.xlsx**: 文件上传按钮，解析后插入cities表
4. **执行计算按钮**: 触发计算逻辑，结果存入results表
5. **操作反馈**: 显示上传进度、计算状态、错误提示

### 页面3: 结果查询 `/results`
**功能**:
- 页面加载时自动从results表获取数据
- 使用Tailwind CSS展示表格
- 表格列: 员工姓名、城市、平均工资、缴费基数、公司缴纳金额、计算时间

---

## Excel文件格式

### salaries.xlsx
| 列名 | 类型 | 说明 |
|------|------|------|
| id | int | 主键ID |
| employee_id | str | 员工工号 |
| employee_name | str | 员工姓名 |
| month | str | 年份月份 (YYYYMM) |
| salary_amount | int | 工资金额 |

**注意**: Excel源文件的列名是规范的，可直接映射

### cities.xlsx
| 列名 | 类型 | 说明 |
|------|------|------|
| id | int | 主键ID |
| city_namte | str | **城市名 (注意: 列名有拼写错误，需处理)** |
| year | str | 年份 |
| rate | float | 综合缴纳比例 |
| base_min | int | 基数下限 |
| base_max | int | 基数上限 |

**注意**: Excel源文件列名 `city_namte` 有拼写错误，需在代码中特殊处理，映射到 `city_name`

---

## 环境配置

### 依赖包
```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "@supabase/supabase-js": "^2.x",
    "xlsx": "^0.18.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.x",
    "autoprefixer": "^12.x",
    "postcss": "^8.x"
  }
}
```

### 环境变量 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 项目TodoList (详细开发步骤)

### 阶段一: 项目初始化
- [ ] 1.1 创建Next.js项目 (`npx create-next-app@latest`)
- [ ] 1.2 安装依赖包 (supabase-js, xlsx)
- [ ] 1.3 配置Tailwind CSS
- [ ] 1.4 创建 `.env.local` 文件，配置Supabase凭证

### 阶段二: Supabase配置
- [ ] 2.1 在Supabase创建新项目
- [ ] 2.2 在SQL Editor中创建三张表 (cities, salaries, results)
- [ ] 2.3 设置RLS (Row Level Security) 策略为公开访问
- [ ] 2.4 测试数据库连接

### 阶段三: 工具函数与配置
- [ ] 3.1 创建 `lib/supabase.ts` - Supabase客户端初始化
- [ ] 3.2 创建 `lib/types.ts` - TypeScript类型定义
- [ ] 3.3 创建 `lib/xlsx-parser.ts` - Excel解析工具函数

### 阶段四: 主页开发
- [ ] 4.1 创建 `app/page.tsx` - 主页组件
- [ ] 4.2 使用Tailwind实现响应式卡片布局
- [ ] 4.3 添加路由跳转功能
- [ ] 4.4 美化UI样式

### 阶段五: 上传页面开发
- [ ] 5.1 创建 `app/upload/page.tsx`
- [ ] 5.2 创建城市选择下拉组件 (从cities表读取)
- [ ] 5.3 创建salaries.xlsx上传功能
  - [ ] 5.3.1 文件选择组件
  - [ ] 5.3.2 解析Excel并插入salaries表
  - [ ] 5.3.3 处理cities.xlsx列名拼写错误 (city_namte -> city_name)
- [ ] 5.4 创建cities.xlsx上传功能
- [ ] 5.5 创建"执行计算"按钮和Server Action
- [ ] 5.6 实现计算核心逻辑
- [ ] 5.7 添加操作反馈和错误处理

### 阶段六: 结果页面开发
- [ ] 6.1 创建 `app/results/page.tsx`
- [ ] 6.2 从results表获取数据
- [ ] 6.3 使用Tailwind创建响应式表格
- [ ] 6.4 添加数据为空时的提示
- [ ] 6.5 添加刷新功能

### 阶段七: 测试与优化
- [ ] 7.1 使用提供的测试数据 (salaries.xlsx, cities.xlsx) 进行端到端测试
- [ ] 7.2 验证计算结果正确性
  - [ ] 张三: 月薪约30000, 基数应取上限26421, 缴纳额 = 26421 * 0.14 = 3698.94
  - [ ] 李四: 月薪约20000, 基数取20000, 缴纳额 = 20000 * 0.14 = 2800
  - [ ] 王五: 月薪约4000, 基数应取下限4546, 缴纳额 = 4546 * 0.14 = 636.44
- [ ] 7.3 修复发现的bug
- [ ] 7.4 UI细节优化
- [ ] 7.5 添加加载状态和动画

### 阶段八: 部署准备 (可选)
- [ ] 8.1 配置生产环境变量
- [ ] 8.2 部署到Vercel
- [ ] 8.3 验证线上功能

---

## 验证计算结果的示例数据

根据提供的测试数据，预期计算结果 (佛山, rate=0.14):

| 员工 | 平均工资 | 缴费基数 | 公司缴纳金额 |
|------|----------|----------|--------------|
| 张三 | ~30000 | 26421 (上限) | 3698.94 |
| 李四 | ~20000 | 20000 | 2800.00 |
| 王五 | ~4000 | 4546 (下限) | 636.44 |

---

## 重要注意事项

1. **cities.xlsx列名拼写错误**: Excel源文件中列名为 `city_namte`（多了一个空格和拼写错误），需要在解析时特殊处理
2. **城市选择功能**: UI需要提供城市下拉选择，计算时使用选中城市的标准
3. **计算结果覆盖**: 每次执行计算时，可选择清空旧结果或追加新结果
4. **无需鉴权**: 应用公开访问，Supabase RLS需设置为允许公开读写
