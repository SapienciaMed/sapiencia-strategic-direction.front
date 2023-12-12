import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import {  ICreatePlanAction, IRevisionPAI } from "../interfaces/PAIInterfaces";

export function usePaiService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const paiUrl: string = "/api/v1/pai";
    const { get, post, put } = useCrudService(baseURL);

    async function CreatePAI(data: ICreatePlanAction): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = "/create";
        return post(`${paiUrl}${endpoint}`, data);
    }

    async function UpdatePAI(
        id: number,
        data: ICreatePlanAction
    ): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = `/update/${id}`;
        return put(`${paiUrl}${endpoint}`, data);
    }

    async function GetPAIById(
        id: number
    ): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function CreateRevisionPAI(data: IRevisionPAI): Promise<ApiResponse<IRevisionPAI>> {
        const endpoint: string = "/revision/create";
        return post(`${paiUrl}${endpoint}`, data);
    }

    async function UpdateRevisionPAI(
        id: number,
        data: IRevisionPAI
    ): Promise<ApiResponse<IRevisionPAI>> {
        const endpoint: string = `/revision/update/${id}`;
        return put(`${paiUrl}${endpoint}`, data);
    }

    return { CreatePAI, UpdatePAI, GetPAIById, CreateRevisionPAI, UpdateRevisionPAI } 
}