export interface DailyLog {
  _id?: string;
  cycleId?: {
    _id?: string;
    startDate?: string;
    endDate?: string;
    durationDays?: number;
  } | string;
  date: string;
  mood?: string;
  symptoms?: string[];
  flow?: number;
  notes?: string;
}
