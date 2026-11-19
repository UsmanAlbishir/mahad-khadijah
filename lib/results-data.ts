export const EXAM_COLUMNS = Array.from({ length: 18 }, (_, index) =>
  String(index + 1),
);

export const RESULTS_SESSION = "2025/2026 Academic Session";
export const RESULTS_TERM = "First Term";

const studentNames = [
  "Aisha Bello",
  "Maryam Yusuf",
  "Safiyyah Ibrahim",
  "Hafsah Musa",
  "Khadijah Suleiman",
  "Zainab Abdullahi",
  "Ruqayyah Sani",
  "Aminah Usman",
  "Sumayyah Garba",
  "Halimah Aliyu",
  "Fatimah Hassan",
  "Asma'u Mohammed",
  "Mariam Isah",
  "Khadija Umar",
  "Sakina Lawal",
  "Nusaybah Ahmad",
  "Amina Shehu",
  "Rahmah Idris",
  "Jamila Adamu",
  "Safiya Mustapha",
  "Hauwa Abubakar",
  "Zahra Sule",
  "Bilqis Haruna",
];

const totals = [
  "1428", "1560", "1184", "1652", "1376", "1490", "1712", "1288",
  "1596", "1460", "1324", "1748", "1210", "1536", "1684", "1402",
  "1268", "1618", "1482", "1350", "1770", "1296", "1554",
];
const averages = [
  "79.3", "86.7", "65.8", "91.8", "76.4", "82.8", "95.1", "71.6",
  "88.7", "81.1", "73.6", "97.1", "67.2", "85.3", "93.6", "77.9",
  "70.4", "89.9", "82.3", "75.0", "98.3", "72.0", "86.3",
];

const absentEntries = new Set(["0:5", "3:11", "7:2", "12:16", "17:8", "22:13"]);

export interface ExaminationStudent {
  id: string;
  name: string;
  studentNumber: string;
  category: string;
  scores: string[];
  total: string;
  average: string;
  remark: "PASS" | "FAIL";
  resultStatus: "Prepared" | "In progress";
}

export const EXAMINATION_STUDENTS: ExaminationStudent[] = studentNames.map(
  (name, studentIndex) => ({
    id: `ah-student-${String(studentIndex + 1).padStart(3, "0")}`,
    name,
    studentNumber: `AH-2026-${String(studentIndex + 1).padStart(3, "0")}`,
    category: "AH",
    scores: EXAM_COLUMNS.map((_, columnIndex) =>
      absentEntries.has(`${studentIndex}:${columnIndex}`)
        ? "ABS"
        : String((studentIndex * 11 + columnIndex * 13 + 37) % 101),
    ),
    total: totals[studentIndex],
    average: averages[studentIndex],
    remark: [2, 12, 16].includes(studentIndex) ? "FAIL" : "PASS",
    resultStatus: studentIndex % 5 === 1 ? "In progress" : "Prepared",
  }),
);

export interface ExaminationRecord {
  id: string;
  title: string;
  session: string;
  term: string;
  category: string;
  studentCount: number;
  sittings: number;
  date: string;
  status: "Prepared" | "In progress" | "Draft";
}

export const EXAMINATION_RECORDS: ExaminationRecord[] = [
  {
    id: "exam-ah-term1",
    title: "End of Term Examination",
    session: RESULTS_SESSION,
    term: RESULTS_TERM,
    category: "AH",
    studentCount: 23,
    sittings: 18,
    date: "18 Nov 2026",
    status: "Prepared",
  },
  {
    id: "exam-ah-midterm",
    title: "Mid-Term Assessment",
    session: RESULTS_SESSION,
    term: RESULTS_TERM,
    category: "AH",
    studentCount: 23,
    sittings: 18,
    date: "29 Oct 2026",
    status: "In progress",
  },
  {
    id: "exam-a-term1",
    title: "End of Term Examination",
    session: RESULTS_SESSION,
    term: RESULTS_TERM,
    category: "A",
    studentCount: 18,
    sittings: 18,
    date: "17 Nov 2026",
    status: "Prepared",
  },
  {
    id: "exam-b-term1",
    title: "End of Term Examination",
    session: RESULTS_SESSION,
    term: RESULTS_TERM,
    category: "B",
    studentCount: 16,
    sittings: 18,
    date: "16 Nov 2026",
    status: "Draft",
  },
];

export const ASSIGNED_CATEGORIES = [
  { name: "AH", students: 23, session: RESULTS_SESSION, term: RESULTS_TERM, status: "In progress" },
  { name: "Category A", students: 18, session: RESULTS_SESSION, term: RESULTS_TERM, status: "Prepared" },
  { name: "Category B", students: 16, session: RESULTS_SESSION, term: RESULTS_TERM, status: "Not started" },
] as const;

export const EXAMINATION_TITLES = [
  "End of Term Examination",
  "Mid-Term Assessment",
  "Monthly Assessment",
];
