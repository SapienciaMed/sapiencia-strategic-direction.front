import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IAntiCorruptionPlanStatus } from "../../projects/interfaces/AntiCorruptionPlanStatusInterfaces";

export function useAntiCorruptionPlanStatusService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanStatusUrl: string = "/api/v1/anti-corruption-plan-status";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function getAll(): Promise<ApiResponse<IAntiCorruptionPlanStatus[]>> {
        const endpoint: string = "/";
        return get(`${antiCorruptionPlanStatusUrl}${endpoint}`);
    }


    return { getAll }
}