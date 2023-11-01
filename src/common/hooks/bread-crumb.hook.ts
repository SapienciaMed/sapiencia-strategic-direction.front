import { useEffect, useState } from "react";
import useAppCominicator from "./app-communicator.hook";

export interface IBreadCrumb {
  name: string;
  url: string;
  isPrimaryPage: boolean;
  useContext?: boolean;
  extraParams?: string;
}

function useBreadCrumb(data: IBreadCrumb): {
  stringifyContext: string;
  updateContext: (stringifyContext: string) => void;
} {
  // Servicios
  const { publish, subscribe, unsubscribe } = useAppCominicator();

  // State
  const [context, setContext] = useState<string>();

  // Effect que publica la miga de pan y escucha el contexto
  useEffect(() => {
    setTimeout(() => publish("add-bread-crumb", data), 100);

    if (data.useContext) {
      subscribe("page-context", (data) => {
        setContext(data.detail);
      });

      return () => {
        unsubscribe("page-context", () => {});
      };
    }
  }, []);

  // Metodo actualiza el contexto
  function updateContext(stringifyContext: string) {}

  return { stringifyContext: context, updateContext };
}

export default useBreadCrumb;
