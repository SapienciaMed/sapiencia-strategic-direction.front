import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import { IAntiCorruptionPlan, IAntiCorruptionPlanTemp } from "../../projects/interfaces/AntiCorruptionPlanInterfaces";

export function useAntiCorruptionPlanService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const anticorruptionPlanUrl: string = "/api/v1/anti-corruption-plan";
    const { get, post, put, deleted } = useCrudService(baseURL);


    async function create(data: IAntiCorruptionPlanTemp): Promise<ApiResponse<IAntiCorruptionPlan>> {
        const endpoint: string = "/create";
        return post(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    async function update(data: IAntiCorruptionPlan): Promise<ApiResponse<any[]>>{
        const endpoint: string = `/update/${data.id}`;
        return put(`${anticorruptionPlanUrl}${endpoint}`, data);
    }
    
    return { update, create }
}