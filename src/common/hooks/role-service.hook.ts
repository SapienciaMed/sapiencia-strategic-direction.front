import { IMenuAccess } from "../interfaces/menuaccess.interface";
import { IRole } from "../interfaces/role.interface";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "../hooks/crud-service.hook";
import { IOption } from "../interfaces/options.interface";

export default function useRoleService() {
  const baseURL: string = process.env.urlApiAuth;
  const roleUrl: string = "/api/v1/role";
  const { get } = useCrudService(baseURL);

  async function getApplications(): Promise<ApiResponse<IMenuAccess[]>> {
    return get(`/api/v1/access-elements/aplication/get-all`);
  }

  async function getRole(id: number): Promise<ApiResponse<IRole>> {
    const endpoint: string = `/get-by-id/${id}`;
    return get(`${roleUrl}${endpoint}`);
  }

  async function getRolesByAplication(
    id: number
  ): Promise<ApiResponse<IRole[]>> {
    const endpoint: string = `/get-by-aplication/${id}`;
    return get(`${roleUrl}${endpoint}`);
  }

  async function getOptions(
    application: number
  ): Promise<ApiResponse<IOption[]>> {
    return get(
      `/api/v1/access-elements/option/get-by-aplication/${application}`
    );
  }

  return {
    getApplications,
    getRole,
    getRolesByAplication,
    getOptions,
  };
}
