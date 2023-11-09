import useCrudService from "../../../common/hooks/crud-service.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IFiles } from "../../../common/interfaces/storage.interfaces";
import { ApiResponse } from "../../../common/utils/api-response";
import { IFinishProjectForm, IProject, IProjectFiltersHistorical, IProjectTemp } from "../interfaces/ProjectsInterfaces";

export function useProjectsService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const projectsUrl: string = "/api/v1/project";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function GetProjectByUser(user: string): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/get-by-user/${user}`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function GetProjectById(idProject: string): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/get-by-id/${idProject}`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function GetProjectFiles(idProject: string): Promise<ApiResponse<IFiles[]>> {
        const endpoint: string = `/files/get-by-project/${idProject}`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function CreateProject(data: IProjectTemp): Promise<ApiResponse<IProject>> {
        const endpoint: string = "/create";
        return post(`${projectsUrl}${endpoint}`, data);
    }

    async function UpdateProject(
        id: number,
        data: IProjectTemp
    ): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/update/${id}`;
        return put(`${projectsUrl}${endpoint}`, data);
    }

    async function DeleteProject(id: number): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/delete/${id}`;
        return deleted(`${projectsUrl}${endpoint}`);
    }

    async function GetAllStatus(): Promise<ApiResponse<MasterTable[]>>{
        const endpoint: string = `/status/get-all`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function DeleteFileProject(fileName: string[]): Promise<ApiResponse<boolean>>{
        const endpoint: string = `/files/delete-file`;
        return post(`${projectsUrl}${endpoint}`, {fileName: JSON.stringify(fileName)});
    }

    async function FinishProject(
        id: string,
        data: IFinishProjectForm
    ): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/finish-project/${id}`;
        return put(`${projectsUrl}${endpoint}`, data);
    }

    async function GetAllHistorical(data: IProjectFiltersHistorical): Promise<ApiResponse<IProject[]>>{
        const endpoint: string = `/get-all-historical`;
        return post(`${projectsUrl}${endpoint}`, data);
    }

    return { GetProjectByUser, GetProjectById, GetProjectFiles, CreateProject, UpdateProject, DeleteProject, GetAllStatus, DeleteFileProject, FinishProject, GetAllHistorical }
}