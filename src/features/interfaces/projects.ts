import { DateTime } from "luxon";


export interface IProjects{
  id?: number;
  bpin: number;
  project: string;
  dateFrom: string;
  dateTo: string;
  process: string;
  localitation: string;
  dependency: string;
  Object: string;
}
