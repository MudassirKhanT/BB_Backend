/**
 * Seed SQL practice problems.
 * Run: npx ts-node seed-sql-problems.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "./models/problem.model.ts";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/beyondbasic";

// ─── Reusable Schema Setup (included in every starter template) ──────────────
const EMP_SETUP = `-- ============================================================
-- TABLE SETUP (read-only — do not modify)
-- ============================================================
CREATE TABLE employees (
  id         INT PRIMARY KEY,
  name       VARCHAR(50),
  salary     DECIMAL(10,2),
  department VARCHAR(50),
  manager_id INT
);

INSERT INTO employees VALUES
  (1,  'Alice',   95000, 'Engineering', NULL),
  (2,  'Bob',     72000, 'Engineering', 1),
  (3,  'Carol',   68000, 'Marketing',   NULL),
  (4,  'Dave',    55000, 'Marketing',   3),
  (5,  'Eve',     81000, 'Engineering', 1),
  (6,  'Frank',   49000, 'HR',          NULL),
  (7,  'Grace',   90000, 'Engineering', 1),
  (8,  'Hank',    61000, 'HR',          6),
  (9,  'Iris',    73000, 'Marketing',   3),
  (10, 'Jack',    58000, 'Engineering', 2);

-- ============================================================
-- Write your solution below this line:
-- ============================================================
`;

const ORDERS_SETUP = `-- ============================================================
-- TABLE SETUP (read-only — do not modify)
-- ============================================================
CREATE TABLE customers (
  id      INT PRIMARY KEY,
  name    VARCHAR(50),
  country VARCHAR(30)
);
CREATE TABLE orders (
  id          INT PRIMARY KEY,
  customer_id INT,
  amount      DECIMAL(10,2),
  order_date  DATE
);

INSERT INTO customers VALUES
  (1, 'Alice',   'India'),
  (2, 'Bob',     'USA'),
  (3, 'Carol',   'India'),
  (4, 'Dave',    'UK'),
  (5, 'Eve',     'USA');

INSERT INTO orders VALUES
  (1, 1, 2500.00, '2024-01-15'),
  (2, 1, 1800.00, '2024-02-10'),
  (3, 2, 3200.00, '2024-01-20'),
  (4, 3, 900.00,  '2024-03-05'),
  (5, 2, 1500.00, '2024-03-18'),
  (6, 4, 4100.00, '2024-02-28'),
  (7, 5, 750.00,  '2024-04-01'),
  (8, 1, 3300.00, '2024-04-15');

-- ============================================================
-- Write your solution below this line:
-- ============================================================
`;

// ─── SQL Problems ─────────────────────────────────────────────────────────────
const SQL_PROBLEMS = [
  // ── 1 ──
  {
    title:      "Select All Employees",
    slug:       "select-all-employees",
    type:       "sql",
    difficulty: "Easy",
    frequency:  5,
    topicTag:   "SQL Basics",
    order:      1,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to retrieve **all columns** from the \`employees\` table.

**Expected columns:** \`id\`, \`name\`, \`salary\`, \`department\`, \`manager_id\`

**Constraints:**
- Return all rows ordered by \`id\` ascending.`,
    examples: [
      {
        input:       "employees table",
        output:      "All 10 rows",
        explanation: "Use SELECT * with ORDER BY id.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "1\tAlice\t95000.00\tEngineering\tNULL", isHidden: false },
      { input: "", expectedOutput: "10 rows returned",                       isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT *\nFROM employees\nORDER BY id;\n`,
    },
  },

  // ── 2 ──
  {
    title:      "High Salary Employees",
    slug:       "high-salary-employees",
    type:       "sql",
    difficulty: "Easy",
    frequency:  5,
    topicTag:   "SQL Basics",
    order:      2,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to find all employees whose salary is **greater than 70,000**.

Return \`name\` and \`salary\`, ordered by \`salary\` descending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Alice 95000, Grace 90000, Eve 81000, Bob 72000, Iris 73000",
        explanation: "Filter with WHERE salary > 70000.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\t95000.00", isHidden: false },
      { input: "", expectedOutput: "5 rows",          isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT name, salary\nFROM employees\nWHERE salary > 70000\nORDER BY salary DESC;\n`,
    },
  },

  // ── 3 ──
  {
    title:      "Employee Count by Department",
    slug:       "employee-count-by-department",
    type:       "sql",
    difficulty: "Easy",
    frequency:  5,
    topicTag:   "Aggregation",
    order:      3,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query that returns the **number of employees in each department**.

Return \`department\` and \`employee_count\`, ordered by \`employee_count\` descending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Engineering 5, Marketing 3, HR 2",
        explanation: "Use GROUP BY department with COUNT(*).",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Engineering\t5", isHidden: false },
      { input: "", expectedOutput: "HR\t2",          isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT department, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department\nORDER BY employee_count DESC;\n`,
    },
  },

  // ── 4 ──
  {
    title:      "Top 3 Highest Paid Employees",
    slug:       "top-3-highest-paid-employees",
    type:       "sql",
    difficulty: "Easy",
    frequency:  4,
    topicTag:   "Sorting & Filtering",
    order:      4,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to find the **top 3 highest paid employees**.

Return \`name\`, \`salary\`, and \`department\`, ordered by \`salary\` descending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Alice 95000, Grace 90000, Eve 81000",
        explanation: "ORDER BY salary DESC LIMIT 3.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\t95000.00\tEngineering", isHidden: false },
      { input: "", expectedOutput: "3 rows",                       isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT name, salary, department\nFROM employees\nORDER BY salary DESC\nLIMIT 3;\n`,
    },
  },

  // ── 5 ──
  {
    title:      "Average Salary by Department",
    slug:       "average-salary-by-department",
    type:       "sql",
    difficulty: "Medium",
    frequency:  5,
    topicTag:   "Aggregation",
    order:      5,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to find the **average salary per department**, but only include departments where the average salary exceeds **65,000**.

Return \`department\` and \`avg_salary\` (rounded to 2 decimal places), ordered by \`avg_salary\` descending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Engineering 79200.00, Marketing 66333.33",
        explanation: "Use GROUP BY + HAVING AVG(salary) > 65000.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Engineering\t79200.00", isHidden: false },
      { input: "", expectedOutput: "HR excluded",           isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT department, ROUND(AVG(salary), 2) AS avg_salary\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 65000\nORDER BY avg_salary DESC;\n`,
    },
  },

  // ── 6 ──
  {
    title:      "Employees and Their Managers",
    slug:       "employees-and-their-managers",
    type:       "sql",
    difficulty: "Medium",
    frequency:  4,
    topicTag:   "Joins",
    order:      6,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to list each employee along with their **manager's name**.

Return \`employee_name\` and \`manager_name\`. Employees with no manager (manager_id IS NULL) should show \`'No Manager'\` in the \`manager_name\` column.

Order by \`employee_name\` ascending.`,
    examples: [
      {
        input:       "employees table (self-join)",
        output:      "Alice | No Manager, Bob | Alice, ...",
        explanation: "Use a LEFT JOIN on the same table: e LEFT JOIN employees m ON e.manager_id = m.id.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\tNo Manager", isHidden: false },
      { input: "", expectedOutput: "Bob\tAlice",        isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT e.name AS employee_name,\n       COALESCE(m.name, 'No Manager') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY employee_name;\n`,
    },
  },

  // ── 7 ──
  {
    title:      "Second Highest Salary",
    slug:       "second-highest-salary-sql",
    type:       "sql",
    difficulty: "Medium",
    frequency:  5,
    topicTag:   "Subqueries",
    order:      7,
    leetcodeUrl: "https://leetcode.com/problems/second-highest-salary/",
    description: `## Problem
Write a SQL query to find the **second highest salary** from the \`employees\` table.

- If there is no second highest salary, return \`NULL\`.
- Return the result in a column named \`SecondHighestSalary\`.`,
    examples: [
      {
        input:       "employees table",
        output:      "90000.00",
        explanation: "Use a subquery: SELECT MAX(salary) WHERE salary < (SELECT MAX(salary)).",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "90000.00", isHidden: false },
      { input: "", expectedOutput: "SecondHighestSalary column", isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT MAX(salary) AS SecondHighestSalary\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n`,
    },
  },

  // ── 8 ──
  {
    title:      "Customers with Total Orders Above 5000",
    slug:       "customers-total-orders-above-5000",
    type:       "sql",
    difficulty: "Medium",
    frequency:  4,
    topicTag:   "Joins",
    order:      8,
    leetcodeUrl: "",
    description: `## Problem
Using the \`customers\` and \`orders\` tables, find customers whose **total order amount exceeds 5,000**.

Return \`customer_name\` and \`total_amount\` (sum of all their orders), ordered by \`total_amount\` descending.`,
    examples: [
      {
        input:       "customers + orders tables",
        output:      "Alice 7600.00, Bob 4700.00 (filtered out), Dave 4100.00 (filtered out)",
        explanation: "JOIN customers with orders, GROUP BY customer, HAVING SUM > 5000.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\t7600.00", isHidden: false },
      { input: "", expectedOutput: "1 row returned",  isHidden: true },
    ],
    starterCode: {
      sql: ORDERS_SETUP + `SELECT c.name AS customer_name, SUM(o.amount) AS total_amount\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name\nHAVING SUM(o.amount) > 5000\nORDER BY total_amount DESC;\n`,
    },
  },

  // ── 9 ──
  {
    title:      "Employees Without Managers",
    slug:       "employees-without-managers",
    type:       "sql",
    difficulty: "Easy",
    frequency:  3,
    topicTag:   "SQL Basics",
    order:      9,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to find all employees who **do not have a manager** (i.e., \`manager_id IS NULL\`).

Return \`name\` and \`department\`, ordered by \`name\` ascending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Alice Engineering, Carol Marketing, Frank HR",
        explanation: "Use WHERE manager_id IS NULL.",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\tEngineering", isHidden: false },
      { input: "", expectedOutput: "3 rows",             isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT name, department\nFROM employees\nWHERE manager_id IS NULL\nORDER BY name;\n`,
    },
  },

  // ── 10 ──
  {
    title:      "Rank Employees by Salary",
    slug:       "rank-employees-by-salary",
    type:       "sql",
    difficulty: "Hard",
    frequency:  4,
    topicTag:   "Window Functions",
    order:      10,
    leetcodeUrl: "",
    description: `## Problem
Write a SQL query to **rank employees by salary** within each department using the \`RANK()\` window function.

Return \`name\`, \`department\`, \`salary\`, and \`salary_rank\` (1 = highest in that department).

Order by \`department\` ascending, then \`salary_rank\` ascending.`,
    examples: [
      {
        input:       "employees table",
        output:      "Alice Engineering 95000 1, Grace Engineering 90000 2, ...",
        explanation: "Use RANK() OVER (PARTITION BY department ORDER BY salary DESC).",
      },
    ],
    testCases: [
      { input: "", expectedOutput: "Alice\tEngineering\t95000.00\t1", isHidden: false },
      { input: "", expectedOutput: "Frank\tHR\t49000.00\t2",          isHidden: true },
    ],
    starterCode: {
      sql: EMP_SETUP + `SELECT name, department, salary,\n       RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS salary_rank\nFROM employees\nORDER BY department, salary_rank;\n`,
    },
  },
];

// ─── Seed runner ──────────────────────────────────────────────────────────────
async function seedSqlProblems() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  let created = 0;
  let skipped = 0;

  for (const p of SQL_PROBLEMS) {
    const exists = await Problem.findOne({ slug: p.slug });
    if (exists) {
      console.log(`  ⏭  Skipped (exists): ${p.title}`);
      skipped++;
      continue;
    }
    await Problem.create({
      ...p,
      isPublished: true,
      starterCode: {
        python:     "",
        javascript: "",
        cpp:        "",
        java:       "",
        sql:        p.starterCode.sql,
      },
    });
    console.log(`  ✅ Created: ${p.title}`);
    created++;
  }

  console.log(`\n🎉 Done — ${created} created, ${skipped} skipped`);
  await mongoose.disconnect();
}

seedSqlProblems().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
