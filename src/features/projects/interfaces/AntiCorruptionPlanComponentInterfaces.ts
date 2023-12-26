import { DateTime } from "luxon";

export interface IAntiCorruptionPlanComponent {
  id: number,
  description: string,
}

export interface IAntiCorruptionPlanComponentTemp {
  id: number,
  description?: string,
  pac_id?: number,
}