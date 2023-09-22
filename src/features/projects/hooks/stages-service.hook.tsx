import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IStage } from "../interfaces/StagesInterfaces";

export function useStagesService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const roleUrl: string = "/api/v1/stages";
    const { get } = useCrudService( baseURL);

    async function GetStages(): Promise<ApiResponse<IStage[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetStages }
}