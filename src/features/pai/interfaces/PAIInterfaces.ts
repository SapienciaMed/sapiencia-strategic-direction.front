import { DateTime } from "luxon";
import { IIndicatorsPAI } from "./IndicatorsPAIInterfaces";

export interface ICreatePlanAction {
  id?: number;
  yearPAI: number;
  budgetPAI: number;
  typePAI: number;
  namePAI: number;
  objectivePAI: string;
  articulationPAI: string;
  linePAI: ILine[];
  risksPAI: IRisks[];
  selectedRisk: number;
  actionsPAi: IAddAction[];
  indicators?: IIndicatorsPAI[];
  dateCreate?: DateTime | null;
  dateModify?: Date | null;
  version?: string | null;
  status:number;
}

export interface IAddAction {
  id?: number;
  action: number;
  description: string;
}

export interface ILine {
  id?: number;
  line: string;
}

export interface IRisks {
  id?: number;
  risk: string;
}

export interface IRevisionPAI {
  field: number;
  observations: string;
  test: string[];
}