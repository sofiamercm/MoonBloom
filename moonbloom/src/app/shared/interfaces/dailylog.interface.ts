export interface DailyLog {
  _id?: string;
  date: string;
  mood?: string;
  symptoms?: string[];
  flow?: number;
  notes?: string;
}