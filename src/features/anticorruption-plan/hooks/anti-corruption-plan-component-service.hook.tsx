import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IAntiCorruptionPlanComponent, IAntiCorruptionPlanComponentTemp, IStore } from "../../projects/interfaces/AntiCorruptionPlanComponentInterfaces";

export function useAntiCorruptionPlanComponentService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanComponentUrl: string = "/api/v1/anti-corruption-plan-component";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function getAll(): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/";
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}`);
    }


    async function getAllByPlanId(id: string): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/get-by-plan-id";
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}/${id}`);
    }

    async function deleteAllByIds(ids: string[]): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/delete-all-by-ids";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, ids);
    }

    async function store(data: IStore): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/store";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, data);
    }


    return { getAll, getAllByPlanId, deleteAllByIds, store }
}