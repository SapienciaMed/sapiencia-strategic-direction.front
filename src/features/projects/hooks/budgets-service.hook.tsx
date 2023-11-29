import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IBudgets } from "../interfaces/BudgetsInterfaces";

export function useBudgetsService() {
    const baseURL: string = process.env.urlApiFinancial;
    const roleUrl: string = "/api/v1/budgets";
    const { get } = useCrudService(baseURL);

    async function GetAllBudgets(): Promise<ApiResponse<IBudgets[]>> {
        const endpoint: string = "/get-all";
        return get(`${roleUrl}${endpoint}`);
    }

    return { GetAllBudgets }
}