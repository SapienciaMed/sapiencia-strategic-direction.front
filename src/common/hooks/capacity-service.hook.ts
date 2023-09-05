import { EResponseCodes } from "../constants/api.enum";
import { ApiResponse } from "../utils/api-response";
import { AppContext } from "../contexts/app.context";
import { useContext } from "react";
import instanceApi from "../utils/api-instance";

export function useCapacityService<T>(baseUrl: string) {
    const { authorization } = useContext(AppContext);
    const api = instanceApi(baseUrl);
    let errorMessage = "Hubo un error al cominicarse con la api.";

  const get = async <T>(
    endpoint: string,
    params: Object = {}
  ): Promise<ApiResponse<T>> => {
    try {
      return await api({
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          permissions: authorization.encryptedAccess,
        },
        url: `${baseUrl}${endpoint}`,
        params: params,
      });
    } catch (error: any) {
      return new ApiResponse(
        {} as T,
        EResponseCodes.FAIL,
        JSON.parse(error?.response?.request?.response)?.operation?.message ||
          errorMessage
      );
    }
  };

  return {
    get,
  };
}

export default useCapacityService;
