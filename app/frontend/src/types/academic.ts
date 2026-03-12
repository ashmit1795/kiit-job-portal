export interface Program {
  id: string;
  name: string;
  level: "UG" | "PG";
  duration_years: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  program?: Program;
}

export interface Batch {
  id: string;
  year: number;
}
