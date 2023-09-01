import { useContext, useEffect, useRef } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import IdentificationPage from "../pages/identification.page";
import RegisterPage from "../pages/register.page";
import { ProjectsContext } from "../contexts/projects.context";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import PreparationPage from "../pages/preparation.page";

export function useProjectsCrudData() {
    const tabsComponentRef = useRef(null);
    const { step, disableContinue, actionContinue, projectData, setProjectData, setStep } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        { id: "preparation", title: "3. Preparación", content: <PreparationPage />, action: () => {setStep(0)} },
        { id: "identification", title: "2. Identificación", content: <IdentificationPage />, action: () => {setStep(1)} },
        { id: "register", title: "1. Registro", content: <RegisterPage />, action: () => {setStep(2)} },
        { id: "programming", title: "4. Programación", content: <>aqui va tu pagina c:</>, action: () => {setStep(3)} },
        { id: "transfer", title: "5. Transferir", content: <>aqui va tu pagina c:</>, action: () => {setStep(4)} }
    ];
    useEffect(() => {
        const projectDataLocal = JSON.parse(localStorage.getItem("create_project_data"));
        if(projectDataLocal) setProjectData({...projectDataLocal});
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
    
    const onSaveTemp = () => {
        localStorage.removeItem('create_project_data');
        localStorage.setItem('create_project_data', JSON.stringify(projectData));
        setMessage({
            title: "Guardado temporal realizado con éxito",
            description:<p className="text-primary biggest">Se guardó exitosamente. Podrás continuar la creación del Proyecto en cualquier momento</p>,
            background: true,
            show: true,
            OkTitle: "Cerrar",
            onOk: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            }
        })
    }

    return { tabs, tabsComponentRef, disableContinue, actionContinue, onSaveTemp, setMessage, navigate }
}