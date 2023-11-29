import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IEntities } from "../interfaces/Entities";
import { IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { IIndicatorAction } from "../interfaces/ProjectsInterfaces";

export function useEntitiesService() {
    const baseURL: string =process.env.urlApiStrategicDirection;
    const roleUrl: string = "/api/v1/entities";
    const indicatorsUrl: string = "/api/v1/indicators";
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

    async function getRiskPAI(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-risk-pai";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getProcessPAI(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-process-pai";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getObjectivesPAI(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-objective-pai";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getProjectsPAI(): Promise<ApiResponse<IEntities[]>> {
        const endpoint: string = "/get-all-projects";
        return get(`${roleUrl}${endpoint}`);
    }

    async function getIndicatorsType(): Promise<ApiResponse<IPAIIndicatorType[]>> {
        const endpoint: string = "/pai/get-all";
        return get(`${indicatorsUrl}${endpoint}`);
    }

    async function getProjectIndicators(projectId:number): Promise<ApiResponse<IIndicatorAction[]>> {
        const endpoint: string = `/project/${projectId}`;
        return get(`${indicatorsUrl}${endpoint}`);
    }

    return { GetEntities, 
             GetEntitiesDependency , 
             getRiskPAI, 
             getObjectivesPAI , 
             getProcessPAI,  
             GetEntitiesPosition, 
             getEntitiesTypesRisks, 
             getEntitiesProbability,
             getEntitiesImpact,
             getEntity,
             getResource,
             getIndicatorsType,
             getProjectIndicators}
}