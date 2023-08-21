import { useContext, useEffect, useRef } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import IdentificationPage from "../pages/identification.page";
import RegisterPage from "../pages/register.page";
import { ProjectsContext } from "../contexts/projects.context";

export function useProjectsCrudData() {
    const tabsComponentRef = useRef(null);
    const { step, disableContinue, actionContinue } = useContext(ProjectsContext);
    const tabs: ITabsMenuTemplate[] = [
        { id: "register", title: "1. Registro", content: <RegisterPage /> },
        { id: "identification", title: "2. Identificación", content: <IdentificationPage /> },
        { id: "preparation", title: "3. Preparación", content: <>aqui va tu pagina c:</> },
        { id: "programming", title: "4. Programación", content: <>aqui va tu pagina c:</> },
        { id: "transfer", title: "5. Transferir", content: <>aqui va tu pagina c:</> }
    ];
    useEffect(() => {
        if (tabsComponentRef.current) {
            tabsComponentRef.current.disableTabs(["identification","programming", "preparation", "transfer"]);
        }
    }, []);
    useEffect(() => {
        if(step) {
            if (tabsComponentRef.current) {
                tabsComponentRef.current.enableTabs(tabs[step].id);
                tabsComponentRef.current.goToTab(tabs[step].id);
            }
        }
    }, [step]);

    return { tabs, tabsComponentRef, disableContinue, actionContinue }
}