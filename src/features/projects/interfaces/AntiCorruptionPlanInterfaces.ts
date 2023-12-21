import { DateTime } from "luxon";


export interface IAntiCorruptionPlan {
  id: number;
  name: string;
  date: string;
  status: number;
}