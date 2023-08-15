import { useEffect, useRef } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import IdentificationPage from "../pages/identification.page";

export function useProjectsCrudData() {
    const tabsComponentRef = useRef(null);
    const tabs: ITabsMenuTemplate[] = [
        { id: "register", title: "1. Registro", content: <>aqui va tu pagina c:</> },
        { id: "identification", title: "2. Identificación", content: <IdentificationPage /> },
        { id: "preparation", title: "3. Preparación", content: <>aqui va tu pagina c:</> },
        { id: "programming", title: "4. Programación", content: <>aqui va tu pagina c:</> },
        { id: "transfer", title: "5. Transferir", content: <>aqui va tu pagina c:</> }
    ];
    useEffect(() => {
        if (tabsComponentRef.current) {
            tabsComponentRef.current.disableTabs(["programming", "preparation", "transfer"]);
        }
    }, []);

    return { tabs, tabsComponentRef }
}