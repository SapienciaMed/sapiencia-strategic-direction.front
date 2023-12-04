import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import {  ICreatePlanAction } from "../interfaces/PAIInterfaces";

export function usePaiService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const paiUrl: string = "/api/v1/pai";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function GetProjectByUser(user: string): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = `/get-by-user/${user}`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function GetProjectById(idProject: string): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = `/get-by-id/${idProject}`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function GetProjectFiles(idProject: string): Promise<ApiResponse<IFiles[]>> {
        const endpoint: string = `/files/get-by-project/${idProject}`;
        return get(`${paiUrl}${endpoint}`);
    }

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

    async function DeleteProject(id: number): Promise<ApiResponse<ICreatePlanAction>> {
        const endpoint: string = `/delete/${id}`;
        return deleted(`${paiUrl}${endpoint}`);
    }

    async function GetAllStatus(): Promise<ApiResponse<MasterTable[]>>{
        const endpoint: string = `/status/get-all`;
        return get(`${paiUrl}${endpoint}`);
    }

    async function DeleteFileProject(fileName: string[]): Promise<ApiResponse<boolean>>{
        const endpoint: string = `/files/delete-file`;
        return post(`${paiUrl}${endpoint}`, {fileName: JSON.stringify(fileName)});
    }

    async function getProjectsByFilters(status: number): Promise<ApiResponse<ICreatePlanAction[]>> {
        const endpoint: string = `/get-by-filters?status=${status}`;
        return post(`${paiUrl}${endpoint}`);
    }

    return { CreatePAI, UpdatePAI } 
}