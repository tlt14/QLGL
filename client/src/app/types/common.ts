export interface IStudent {
  baptism_day: string;
  birthDay: string;
  class: {
    id: string;
    name: string;
    grade: string | null;
  };
  father_name: string;
  full_name: string;
  holy_name: string;
  id: string;
  mother_name: string;
  phone: string;
  sex: number;
  scores?: IScore[];
}

export interface IGrade {
  id: string;
  name: string;
  classes: {
    id: string;
    name: string;
  }[];
  deletedAt: string | null;
}

export interface IClass {
  id: string;
  name: string;
  grade: {
    id: string;
    name: string;
    deletedAt: string | null;
  };
  students: any[];
}

export interface IScore {
  id: string;
  final: number;
  midterm: number;
}
