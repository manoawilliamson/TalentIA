export interface Projet {
  id: number;
  name: string;
  description?: string;
  datebegin?: string;    // format: YYYY-MM-DD
  dateend?: string;      // format: YYYY-MM-DD
  nbrperson?: number;
  remark?: string;
  file?: string;
  created_at?: string;
  updated_at?: string;
}