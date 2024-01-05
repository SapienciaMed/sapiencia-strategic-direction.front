import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import { IAntiCorruptionPlanComponent, IAntiCorruptionPlanComponentTemp, IStore } from "../../projects/interfaces/AntiCorruptionPlanComponentInterfaces";
import { IActivity, IAntiCorruptionPlan, IAntiCorruptionPlanTemp, IComponent, IIndicator, IResponsible } from "../../projects/interfaces/AntiCorruptionPlanInterfaces";

export function useAntiCorruptionPlanService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const anticorruptionPlanUrl: string = "/api/v1/anti-corruption-plan";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function getById(plan_id: string): Promise<ApiResponse<IAntiCorruptionPlan>> {
        const endpoint: string = `/get-by-id/${plan_id}`;
        return get(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function create(data: IAntiCorruptionPlanTemp): Promise<ApiResponse<IAntiCorruptionPlan>> {
        const endpoint: string = "/create";
        return post(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    async function update(id: string, year: string): Promise<ApiResponse<any[]>>{
        const endpoint: string = `/update/${id}`;
        return put(`${anticorruptionPlanUrl}${endpoint}`, { year });
    }
    
    return { update, create, getById }
}

export function useAntiCorruptionPlanComponentService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanComponentUrl: string = "/api/v1/anti-corruption-plan-component";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function getByPlanId(plan_id: string): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-by-plan-id/${plan_id}`;
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}`);
    }

    async function deleteAllByIds(ids: string[]): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/delete-all-by-ids";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, ids);
    }

    async function store(data: { components: IComponent[], plan_id: number, plan_uuid: string }): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/store";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, data);
    }

    return { deleteAllByIds, store, getByPlanId }
}

export function useAntiCorruptionPlanActivityService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanComponentUrl: string = "/api/v1/anti-corruption-plan-activity";
    const { post, get} = useCrudService(baseURL);

    async function getByPlanId(plan_id: string): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-by-plan-id/${plan_id}`;
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}`);
    }


    async function deleteAllByIds(ids: string[]): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/delete-all-by-ids";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, ids);
    }

    async function store(data: { activities: IActivity[], plan_id: number }): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/store";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, data);
    }

    return { deleteAllByIds, store, getByPlanId }
}

export function useAntiCorruptionPlanIndicatorService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanComponentUrl: string = "/api/v1/anti-corruption-plan-indicator";
    const { post, get } = useCrudService(baseURL);

    async function getByPlanId(plan_id: string): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-by-plan-id/${plan_id}`;
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}`);
    }

    async function deleteAllByIds(ids: string[]): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/delete-all-by-ids";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, ids);
    }

    async function store(data: { indicators: IIndicator[], plan_id: number }): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/store";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, data);
    }

    return { deleteAllByIds, store, getByPlanId }
}

export function useAntiCorruptionPlanResponsibleService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const antiCorruptionPlanComponentUrl: string = "/api/v1/anti-corruption-plan-responsible";
    const { post, get } = useCrudService(baseURL);

    async function getByPlanId(plan_id: string): Promise<ApiResponse<any>> {
        const endpoint: string = `/get-by-plan-id/${plan_id}`;
        return get(`${antiCorruptionPlanComponentUrl}${endpoint}`);
    }


    async function deleteAllByIds(ids: string[]): Promise<ApiResponse<IAntiCorruptionPlanComponent[]>> {
        const endpoint: string = "/delete-all-by-ids";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, ids);
    }

    async function store(data: { responsibles: IResponsible[], plan_id: number }): Promise<ApiResponse<any[]>> {
        const endpoint: string = "/store";
        return post(`${antiCorruptionPlanComponentUrl}${endpoint}`, data);
    }

    return { deleteAllByIds, store, getByPlanId }
}

