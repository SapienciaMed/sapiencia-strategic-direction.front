import { DateTime } from "luxon";

export interface ISchedulesPAI {
    id?: number;
    idRol: number;
    idStatus: number;
    bimester: number;
    startDate: DateTime;
    endDate: DateTime;
    userCreate?: string;
    dateCreate?: DateTime;
    dateModified?: DateTime;
    delete?: boolean;
}