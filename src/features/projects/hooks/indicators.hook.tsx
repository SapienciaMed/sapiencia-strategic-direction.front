import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { ApiResponse } from "../../../common/utils/api-response";

export function useIndicatorsService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const indicatorsURL: string = "/api/v1/indicators";
    const { get } = useCrudService(baseURL);

    async function GetIndicatorDNP(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/dpn/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    async function GetIndicatorName(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/name/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    async function GetIndicatorType(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/type/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    async function GetIndicatorsComponent(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/component/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    async function GetProgramation(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/programation/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    async function GetStrategicLine(): Promise<ApiResponse<MasterTable[]>> {
        const endpoint: string = "/strategic-line/get-all";
        return get(`${indicatorsURL}${endpoint}`);
    }

    return { GetIndicatorDNP, GetIndicatorName, GetIndicatorType, GetIndicatorsComponent, GetProgramation, GetStrategicLine }
}