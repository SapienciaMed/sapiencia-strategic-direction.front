import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import { IAntiCorruptionPlan } from "../../projects/interfaces/AntiCorruptionPlanInterfaces";
import { IHistoricalProject } from "../../projects/interfaces/HistoricProjectsInterfaces";
import { IFinishProjectForm, IProject, IProjectFiltersHistorical, IProjectTemp } from "../../projects/interfaces/ProjectsInterfaces";

export function useAntiCorruptionPlanService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const anticorruptionPlanUrl: string = "/api/v1/anti-corruption-plan";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function GetProjectByUser(user: string): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/get-by-user/${user}`;
        return get(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function GetProjectById(idProject: string): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/get-by-id/${idProject}`;
        return get(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function GetProjectFiles(idProject: string): Promise<ApiResponse<IFiles[]>> {
        const endpoint: string = `/files/get-by-project/${idProject}`;
        return get(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function CreateProject(data: IProjectTemp): Promise<ApiResponse<IProject>> {
        const endpoint: string = "/create";
        return post(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    async function UpdateProject(
        id: number,
        data: IProjectTemp
    ): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/update/${id}`;
        return put(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    async function DeleteProject(id: number): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/delete/${id}`;
        return deleted(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function GetAllStatus(): Promise<ApiResponse<MasterTable[]>>{
        const endpoint: string = `/status/get-all`;
        return get(`${anticorruptionPlanUrl}${endpoint}`);
    }

    async function DeleteFileProject(fileName: string[]): Promise<ApiResponse<boolean>>{
        const endpoint: string = `/files/delete-file`;
        return post(`${anticorruptionPlanUrl}${endpoint}`, {fileName: JSON.stringify(fileName)});
    }

    async function FinishProject(
        id: string,
        data: IFinishProjectForm
    ): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/finish-project/${id}`;
        return put(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    async function GetAllHistorical(data: IProjectFiltersHistorical): Promise<ApiResponse<IHistoricalProject[]>>{
        const endpoint: string = `/get-all-historical`;
        return post(`${anticorruptionPlanUrl}${endpoint}`, data);
    }


    async function update(data: IAntiCorruptionPlan): Promise<ApiResponse<any[]>>{
        const endpoint: string = `/update/1`;
        return put(`${anticorruptionPlanUrl}${endpoint}`, data);
    }

    

    return { update, GetProjectByUser, GetProjectById, GetProjectFiles, CreateProject, UpdateProject, DeleteProject, GetAllStatus, DeleteFileProject, FinishProject, GetAllHistorical }
}