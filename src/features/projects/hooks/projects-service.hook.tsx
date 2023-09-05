import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IProject, IProjectTemp } from "../interfaces/ProjectsInterfaces";

export function useProjectsService() {
    const baseURL: string = process.env.urlApiStrategicDirection;
    const projectsUrl: string = "/api/v1/project";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function GetProjectByUser(user: string): Promise<ApiResponse<IProject>> {
        const endpoint: string = `/get-by-user/${user}`;
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

    return { GetProjectByUser, CreateProject, UpdateProject, DeleteProject }
}