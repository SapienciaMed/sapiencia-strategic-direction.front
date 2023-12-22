import { useMemo } from "react";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

export function useApplicationsData() {
  const applications = useMemo((): IMenuAccess[] =>
    [
      {
        id: 1,
        name: "Módulo de Dirección Estratégica",
        order: 10,
        url: ""
      },
    ], []);

  return { applications };
}
