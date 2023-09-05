import { IAdditionalField, IGenericList } from "../interfaces/global.interface";
import { ApiResponse } from "../utils/api-response";
import useCrudService from "./crud-service.hook";

export function useGenericListService() {
  const baseURL: string = process.env.urlApiCore;
  const listUrl: string = "/api/v1/generic-list";
  const { get } = useCrudService(baseURL);

  async function getListByGrouper(
    grouper: string
  ): Promise<ApiResponse<IGenericList[]>> {
    const endpoint: string = `/get-by-grouper/${grouper}`;
    return await get(`${listUrl}${endpoint}`);
  }

  async function getListByGroupers(
    groupers: string[]
  ): Promise<ApiResponse<IGenericList[]>> {
    const params = { groupers };
    const endpoint: string = `/get-by-groupers/`;
    return await get(`${listUrl}${endpoint}`, params);
  }

  async function getListByParent(
    params: IAdditionalField
  ): Promise<ApiResponse<IGenericList[]>> {
    const endpoint: string = `/get-by-parent/`;
    return await get(`${listUrl}${endpoint}`, params);
  }

  return {
    getListByParent,
    getListByGrouper,
    getListByGroupers,
  };
}
