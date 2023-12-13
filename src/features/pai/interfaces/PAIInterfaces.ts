import { DateTime } from "luxon";
import { IIndicatorsPAI, IIndicatorsPAITemp, IDisaggregate } from "./IndicatorsPAIInterfaces";

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
  dateCreate?: DateTime | null;
  dateModify?: Date | null;
  version?: string | null;
  status: number;
  revision?: IRevisionPAI;
  disaggregate?: IDisaggregate[];
}

export interface IAddAction {
  id?: number;
  action: number;
  description: string;
  indicators?: IIndicatorsPAITemp[];
}

export interface ILine {
  id?: number;
  line: string;
}

export interface IRisks {
  id?: number;
  risk: string;
}

export interface IRevisionFormPAI {
  idIndicator?: number;
  field: string;
  observations: string;
}

export interface IRevisionPAI {
  id?: number;
  idPai: number;
  json?: string;
  completed: boolean;
  version: number;
  userCreate: string;
  dateCreate?: DateTime;
}