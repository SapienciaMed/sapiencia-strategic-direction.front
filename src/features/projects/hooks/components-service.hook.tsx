import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IComponents } from "../interfaces/ComponentInterfaces";

export function useComponentsService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const roleUrl: string = "/api/v1/components";
    const { get } = useCrudService( baseURL);

    async function GetComponents(): Promise<ApiResponse<IComponents[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetComponents }
}