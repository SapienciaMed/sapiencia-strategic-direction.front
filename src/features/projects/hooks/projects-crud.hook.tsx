import { useContext, useEffect, useRef } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import IdentificationPage from "../pages/identification.page";
import RegisterPage from "../pages/register.page";
import { ProjectsContext } from "../contexts/projects.context";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import PreparationPage from "../pages/preparation.page";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export function useProjectsCrudData() {
    const tabsComponentRef = useRef(null);
    const { step, disableContinue, actionContinue, projectData, setProjectData, setStep, actionCancel, textContinue, setTextContinue, setActionCancel, setActionContinue } = useContext(ProjectsContext);
    const { setMessage, authorization } = useContext(AppContext);
    const { CreateProject, GetProjectByUser, UpdateProject, DeleteProject } = useProjectsService();
    const navigate = useNavigate();
    const tabs: ITabsMenuTemplate[] = [
        {
            id: "register", title: "1. Registro", content: <RegisterPage />, action: () => {
                setStep(0);
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        },
        {
            id: "identification", title: "2. Identificación", content: <IdentificationPage />, action: () => {
                setStep(1)
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        },
        {
            id: "preparation", title: "3. Preparación", content: <PreparationPage />, action: () => {
                setStep(2)
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        },
        {
            id: "programming", title: "4. Programación", content: <>aqui va tu pagina c:</>, action: () => {
                setStep(3)
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        },
        {
            id: "transfer", title: "5. Transferir", content: <>aqui va tu pagina c:</>, action: () => {
                setStep(4)
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        }
    ];
    useEffect(() => {
        if (tabsComponentRef.current) {
            tabsComponentRef.current.disableTabs(["identification", "programming", "preparation", "transfer"]);
        }
    }, []);
    useEffect(() => {
        if (authorization?.user?.numberDocument) GetProjectByUser(authorization.user.numberDocument).then((response => {
            if (response.operation.code === EResponseCodes.OK) {
                const projectDataResponse = response.data;
                setProjectData({
                    id: projectDataResponse.id,
                    status: projectDataResponse.status,
                    user: projectDataResponse.user,
                    register: {
                        bpin: projectDataResponse.bpin,
                        project: projectDataResponse.project,
                        dateFrom: projectDataResponse.dateFrom.toString(),
                        dateTo: projectDataResponse.dateTo.toString(),
                        process: projectDataResponse.process,
                        dependency: projectDataResponse.dependency,
                        object: projectDataResponse.object,
                        localitation: projectDataResponse.localitation
                    },
                    identification: {
                        problemDescription: {
                            problemDescription: projectDataResponse.problemDescription,
                            magnitude: projectDataResponse.magnitude,
                            centerProblem: projectDataResponse.centerProblem,
                            causes: projectDataResponse.causes,
                            effects: projectDataResponse.effects
                        },
                        planDevelopment: {
                            pnd_pacto: projectDataResponse.pnd_pacto,
                            pnd_linea: projectDataResponse.pnd_linea,
                            pnd_programa: projectDataResponse.pnd_programa,
                            pdd_linea: projectDataResponse.pdd_linea,
                            pdd_componentes: projectDataResponse.pdd_componentes,
                            pdd_programa: projectDataResponse.pdd_programa,
                            pdi_linea: projectDataResponse.pdi_linea,
                            pdi_componentes: projectDataResponse.pdi_componentes,
                            pdi_programa: projectDataResponse.pdi_programa
                        },
                        objectives: {
                            generalObjective: projectDataResponse.centerProblem,
                            specificObjectives: projectDataResponse.causes,
                            purposes: projectDataResponse.effects,
                            indicators: projectDataResponse.indicators,
                            measurement: Number(projectDataResponse.measurement),
                            goal: projectDataResponse.goal
                        },
                        actors: {
                            actors: projectDataResponse.actors
                        }
                    }
                })
            } else {
                setMessage({
                    title: "No se pudo cargar el proyecto",
                    description: <p className="text-primary biggest">{response.operation.message}</p>,
                    background: true,
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }
        })).catch((error) => {
            setMessage({
                title: "Error peticion proyecto",
                description: <p className="text-primary biggest">{error}</p>,
                background: true,
                show: true,
                OkTitle: "Cerrar",
                onOk: () => {
                    setMessage({});
                },
                onClose: () => {
                    setMessage({});
                }
            });
        });
    }, [authorization])
    useEffect(() => {
        if (step) {
            if (tabsComponentRef.current) {
                tabsComponentRef.current.enableTabs(tabs[step].id);
                tabsComponentRef.current.goToTab(tabs[step].id);
            }
        }
    }, [step]);
    const onSaveTemp = async () => {
        if (projectData?.id) {
            const data = { ...projectData, user: authorization.user.numberDocument, status: false };
            const res = await UpdateProject(projectData.id, data);
            if (res.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado temporal realizado con éxito",
                    description: <p className="text-primary biggest">Se guardó exitosamente. Podrás continuar la creación del Proyecto en cualquier momento</p>,
                    background: true,
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                setMessage({
                    title: "Ocurrio un problema...",
                    description: <p className="text-primary biggest">{res.operation.message}</p>,
                    background: true,
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }
        } else {
            const data = { ...projectData, user: authorization.user.numberDocument, status: false };
            const res = await CreateProject(data);
            setProjectData(prev => {
                return { ...prev, id: res.data.id }
            });
            if (res.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado temporal realizado con éxito",
                    description: <p className="text-primary biggest">Se guardó exitosamente. Podrás continuar la creación del Proyecto en cualquier momento</p>,
                    background: true,
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                setMessage({
                    title: "Ocurrio un problema...",
                    description: <p className="text-primary biggest">{res.operation.message}</p>,
                    background: true,
                    show: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }
        }

    }

    return { tabs, tabsComponentRef, disableContinue, actionContinue, onSaveTemp, setMessage, navigate, actionCancel, textContinue, DeleteProject, projectData }
}