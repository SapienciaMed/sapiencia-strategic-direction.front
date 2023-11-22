import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import { ISchedulesPAI } from "../interfaces/SchedulesPAIInterfaces";

export function useSchedulesService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const paiUrl: string = "/api/v1/pai/schedules";
    const { get, post } = useCrudService(baseURL);

    async function getScheduleStatuses(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = `/get-statuses`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function getSchedules(): Promise<ApiResponse<ISchedulesPAI[]>> {
        const endpoint: string = `/get-all`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function crudSchedules(data: ISchedulesPAI[]): Promise<ApiResponse<ISchedulesPAI[]>> {
        const endpoint: string = `/crud`;
        return post(`${paiUrl}${endpoint}`, {
            data: data
        });
    }

    return { getScheduleStatuses, getSchedules, crudSchedules }
}