import { useContext, useEffect, useRef, useState } from "react";
import { ITabsMenuTemplate } from "../../../common/interfaces/tabs-menu.interface";
import IdentificationPage from "../pages/identification.page";
import RegisterPage from "../pages/register.page";
import { ProjectsContext } from "../contexts/projects.context";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate, useParams } from "react-router-dom";
import PreparationPage from "../pages/preparation.page";
import { useProjectsService } from "./projects-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import ProgramationPage from "../pages/programation.page";
import TransferPage from "../pages/transfer.page";

export function useProjectsCrudData() {
    const { id } = useParams();
    const tabsComponentRef = useRef(null);
    const { step,
        disableContinue,
        actionContinue,
        projectData,
        setProjectData,
        setStep,
        actionCancel,
        textContinue,
        setTextContinue,
        setActionCancel,
        setActionContinue,
        showCancel,
        formAction,
        setDisableContinue,
        disableStatusUpdate } = useContext(ProjectsContext);
    const { setMessage, authorization } = useContext(AppContext);
    const { CreateProject, UpdateProject, DeleteProject, GetProjectById } = useProjectsService();
    const [charged, setCharged] = useState<boolean>(false);
    const [dirty, setDirty] = useState<boolean>(false);
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
            id: "programation", title: "4. Programación", content: <ProgramationPage />, action: () => {
                setStep(3)
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        },
        {
            id: "transfer", title: "5. Flujo del proyecto", content: <TransferPage />, action: () => {
                setStep(4)
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        }
    ];
    useEffect(() => {
        if (tabsComponentRef.current && formAction === "new") {
            tabsComponentRef.current.disableTabs(["identification", "programation", "preparation", "transfer"]);
        }
    }, []);
    useEffect(() => {
        if (projectData?.tempTab && projectData?.status == 1) {
            const startIndex = tabs.findIndex(tab => tab.id === projectData?.tempTab);
            const idsAfterTempTab = tabs
                .slice(startIndex + 1)
                .map(tab => tab.id);
            tabsComponentRef.current.disableTabs(idsAfterTempTab);
        }
    }, [projectData?.tempTab, projectData?.status])
    useEffect(() => {
        if (Number(id) && formAction === "edit") {
            GetProjectById(id).then((response => {
                if (response.operation.code === EResponseCodes.OK) {
                    const projectDataResponse = response.data;
                    setProjectData({
                        id: projectDataResponse.id,
                        status: projectDataResponse.status,
                        user: projectDataResponse.user,
                        tempTab: projectDataResponse.tempTab,
                        register: {
                            bpin: projectDataResponse.bpin,
                            project: projectDataResponse.project,
                            dateFrom: projectDataResponse.dateFrom ? projectDataResponse.dateFrom.toString() : null,
                            dateTo: projectDataResponse.dateTo ? projectDataResponse.dateTo.toString() : null,
                            process: projectDataResponse.process,
                            dependency: projectDataResponse.dependency,
                            object: projectDataResponse.object,
                            localitation: projectDataResponse.localitation ? projectDataResponse.localitation : 1
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
                            },
                            poblation: {
                                objectivePeople: projectDataResponse.objectivePeople,
                                informationSource: projectDataResponse.informationSource,
                                region: projectDataResponse.region,
                                departament: projectDataResponse.departament,
                                district: projectDataResponse.district,
                                shelter: projectDataResponse.shelter,
                                demographic: projectDataResponse.classifications
                            }
                        },
                        preparation: {
                            technicalAnalysis: {
                                alternative: projectDataResponse.alternative,
                                resumeAlternative: projectDataResponse.resumeAlternative
                            },
                            needs: {
                                objetives: projectDataResponse.specificObjectives
                            },
                            capacity: {
                                descriptionCapacity: projectDataResponse.descriptionCapacity,
                                unitCapacity: projectDataResponse.unitCapacity,
                                capacityGenerated: projectDataResponse.capacityGenerated
                            },
                            enviromentalAnalysis: {
                                environmentDiagnosis: projectDataResponse.environmentDiagnosis,
                                effects: projectDataResponse.environmentalEffects
                            },
                            activities: {
                                activities: projectDataResponse.activities.map(item => {
                                    return {
                                        ...item, budgetsMGA: {
                                            year0: {
                                                budget: item.budgetsMGA[0].budget,
                                                validity: item.budgetsMGA[0].validity,
                                            },
                                            year1: {
                                                budget: item.budgetsMGA[1].budget,
                                                validity: item.budgetsMGA[1].validity,
                                            },
                                            year2: {
                                                budget: item.budgetsMGA[2].budget,
                                                validity: item.budgetsMGA[2].validity,
                                            },
                                            year3: {
                                                budget: item.budgetsMGA[3].budget,
                                                validity: item.budgetsMGA[3].validity,
                                            },
                                            year4: {
                                                budget: item.budgetsMGA[4].budget,
                                                validity: item.budgetsMGA[4].validity,
                                            },
                                        }
                                    }
                                })
                            },
                            risks: {
                                risks: projectDataResponse.risks,
                            },
                        },
                        programation: {
                            profitsIncome: {
                                profitsIncome: projectDataResponse.profitsIncome,
                            },
                            sourceFunding: {
                                sourceFunding: projectDataResponse.sourceFunding,
                            },
                            indicators: {
                                indicators: projectDataResponse.indicatorsAction.concat(projectDataResponse.indicatorsIndicative)
                            },
                            logicFrame: {
                                logicFrame: projectDataResponse.logicFrame.map(item => {
                                    return { ...item, indicatorType: item.type === 3 ? projectDataResponse.indicatorsAction.find(indicator => indicator.id == item.indicator) : projectDataResponse.indicatorsIndicative.find(indicator => indicator.id == item.indicator) }
                                }).map(item => {
                                    return { ...item, indicator: projectDataResponse.indicatorsAction.concat(projectDataResponse.indicatorsIndicative).findIndex(data => JSON.stringify(data) === JSON.stringify(item.indicatorType)) }
                                }),
                            }
                        },
                        transfers: {
                            ambiental: projectDataResponse.ambiental,
                            formulation: projectDataResponse.formulation,
                            observations: projectDataResponse.observations,
                            order: projectDataResponse.order,
                            rol: projectDataResponse.rol,
                            sociocultural: projectDataResponse.sociocultural,
                            tecniques: projectDataResponse.tecniques,
                        }
                    });
                    setTimeout(() => {
                        setCharged(true);
                    }, 1000)
                } else if (response.operation.code === EResponseCodes.FAIL) {
                    setMessage({
                        title: "No se pudo cargar el proyecto",
                        description: <p className="text-primary biggest">{response.operation.message}</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
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
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            });
        } else {
            setCharged(true);
        }
    }, [id]);
    useEffect(() => {
        if (charged) setDirty(true);
    }, [projectData]);
    useEffect(() => {
        if (step) {
            if (tabsComponentRef.current) {
                tabsComponentRef.current.enableTabs(tabs[step].id);
                tabsComponentRef.current.goToTab(tabs[step].id);
            }
        }
    }, [step]);
    const onUpdateStatus = () => {
        setMessage({
            title: "Guardar cambios",
            description: "El proyecto se guardará en Actualización, ¿Deseas continuar?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                updateStatus()
                setTextContinue(null);
                setActionCancel(null);
                setMessage({});
                setDisableContinue(false);
            }
        });
    }

    
    const updateStatus = async () => {
        const data = {
            ...projectData,
            user: authorization.user.numberDocument,
            status: 3,
            tempTab: String(tabs[step].id),
            createHistory: false,
            oldStatus: projectData.status
        };

        const res = await UpdateProject(projectData.id, data);

        if (res.operation.code !== EResponseCodes.OK) {

            if (res.operation.message === ("Error: Ya existe un proyecto con este BPIN.")) {
                return setMessage({
                    title: "Validación BPIN.",
                    description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }

            return setMessage({
                title: "¡Ha ocurrido un error!",
                description: <p className="text-primary biggest">{res.operation.message}</p>,
                background: true,
                show: true,
                OkTitle: "Aceptar",
                onOk: () => {
                    setMessage({});
                },
                onClose: () => {
                    setMessage({});
                }
            });
        }
        setProjectData({...projectData, status: 3});
        return setMessage({
            title: "Proyecto en actualización",
            description: <p className="text-primary biggest">¡Cambios guardados exitosamente!</p>,
            background: true,
            show: true,
            OkTitle: "Aceptar",
            onOk: () => {
                navigate(`/direccion-estrategica/proyectos/edit/${res?.data?.id}`)
                setMessage({});
            },
            onClose: () => {
                navigate(`/direccion-estrategica/proyectos/edit/${res?.data?.id}`)
                setMessage({});
            }
        });

    }

    const onSaveTemp = async () => {

        if (projectData?.id) {
            const data = { ...projectData, user: authorization.user.numberDocument, status: 1, tempTab: String(tabs[step].id) };
            const res = await UpdateProject(projectData.id, data);
            if (res.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado temporal realizado con éxito",
                    description: <p className="text-primary biggest"> Podrás continuar la  {formAction === "new" ? "creación" : "modificación"} del Proyecto en cualquier momento</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                if (res.operation.message === ("Error: Ya existe un proyecto con este BPIN.")) {
                    setMessage({
                        title: "Validación BPIN.",
                        description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        },
                        onClose: () => {
                            setMessage({});
                        }
                    });
                } else {
                    setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: <p className="text-primary biggest">{res.operation.message}</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        },
                        onClose: () => {
                            setMessage({});
                        }
                    });
                }
            }
        } else {
            const data = { ...projectData, user: authorization.user.numberDocument, status: 1, tempTab: String(tabs[step].id) };
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
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                if (res.operation.message === ("Error: Ya existe un proyecto con este BPIN.")) {
                    setMessage({
                        title: "Validación BPIN.",
                        description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        },
                        onClose: () => {
                            setMessage({});
                        }
                    });
                } else {
                    setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: <p className="text-primary biggest">{res.operation.message}</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
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
    }

    return {
        tabs,
        step,
        tabsComponentRef,
        disableContinue,
        actionContinue,
        onUpdateStatus,
        onSaveTemp,
        setMessage,
        navigate,
        actionCancel,
        textContinue,
        DeleteProject,
        projectData,
        showCancel,
        formAction,
        disableStatusUpdate,
        dirty
    }
}