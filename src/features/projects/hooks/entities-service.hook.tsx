import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IEntities } from "../interfaces/Entities";

export function useEntitiesService() {
    const baseURL: string =process.env.urlApiStrategicDirection;
    const roleUrl: string = "/api/v1/entities";
    const { get } = useCrudService(baseURL);

    async function GetEntities(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetEntitiesDependency(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-dependency";
        return get(`${roleUrl}${endpoint}`);
    }

    async function GetEntitiesPosition(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-position";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getEntitiesTypesRisks(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-typesRisks";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getEntitiesProbability(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-probability";
        return get(`${roleUrl}${endpoint}`);
    }
    async function getEntitiesImpact(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-impact";
        return get(`${roleUrl}${endpoint}`);
    }
    async function getEntity(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-entity";
        return get(`${roleUrl}${endpoint}`);
    }
    async function getResource(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-resource";
        return get(`${roleUrl}${endpoint}`);
    }
   

    return { GetEntities, GetEntitiesDependency , GetEntitiesPosition, getEntitiesTypesRisks, getEntitiesProbability,getEntitiesImpact,getEntity,getResource}
}