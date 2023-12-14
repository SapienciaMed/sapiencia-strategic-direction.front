import { useFieldArray, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { usePaiService } from "./pai-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import ActionsRevisionComponent from "../components/actions-revision.component";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import { useEntitiesService } from "./entities-service.hook";
import { useProjectsService } from "./projects-service.hook";
import { IEntities } from "../interfaces/Entities";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { typePAIData } from "../data/dropdowns-revision-pai";
import { IRevisionFormPAI, IRevisionPAI } from "../interfaces/PAIInterfaces";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";

export default function useRevisionPAIData(idPAI: string) {
    const [updatePAI, setUpdatePAI] = useState<number>(null);
    const [accordionsActions, setAccordionsActions] = useState<IAccordionTemplate[]>([]);
    const { setPai, setProjectPAI, revisionPAI, setRevisionPAI } = useContext(RevisionPAIContext);
    const { setMessage, authorization } = useContext(AppContext);
    const { getProcessPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const { GetPAIById, CreateRevisionPAI, UpdateRevisionPAI } = usePaiService();
    const {
        register: registerPAI,
        control: controlPAI,
        formState: { errors: errorsPAI },
        setValue,
    } = useForm<any>({ mode: "all" });
    const { fields: fieldsLines } = useFieldArray({
        control: controlPAI,
        name: "linePAI",
    });
    const { fields: fieldsRisks } = useFieldArray({
        control: controlPAI,
        name: "risksPAI",
    });
    const navigate = useNavigate();
    useEffect(() => {
        if (!idPAI) return;
        GetPAIById(Number(idPAI)).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const res = response.data;
                setValue("yearPAI", res.yearPAI);
                setValue("budgetPAI", res.budgetPAI);
                setValue("objectivePAI", res.objectivePAI);
                setValue("articulationPAI", res.articulationPAI);
                setValue("linePAI", res.linePAI);
                setValue("risksPAI", res.risksPAI);
                setValue("actionsPAi", res.actionsPAi);
                const typePAI = typePAIData.find(type => type.value === res.typePAI);
                setValue("typePAI", typePAI.name || "");
                if (res.typePAI === 1) {
                    getProjectsByFilters(2).then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            const project = response.data.find(project => project.id === res.namePAI);
                            const namePAI = `${project.bpin} - ${project.project}`;
                            setProjectPAI(project);
                            setValue("namePAI", namePAI);
                        }
                    });
                } else if (res.typePAI === 2) {
                    getProcessPAI().then(response => {
                        if (response.operation.code === EResponseCodes.OK) {
                            const entities: IEntities[] = response.data;
                            const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                                return { name: entity.description, value: entity.id };
                            });
                            const namePAI = arrayEntities.find(entity => entity.value === res.namePAI);
                            setValue("namePAI", namePAI.name || "");
                        }
                    }).catch(() => { });
                }
                setAccordionsActions(res.actionsPAi.map((action, index) => {
                    return {
                        id: index,
                        name: `Acción No. ${index + 1}`,
                        content: <ActionsRevisionComponent action={action} />
                    }
                }));
                setPai(res);
                const resRevision = res.revision.find(rev => rev.completed === false);
                if(resRevision) {
                    setUpdatePAI(resRevision.id);
                    let revPAI = [];
                    const jsonRevision = JSON.parse(JSON.stringify(resRevision.json));
                    const ownKeysRevPAI = Reflect.ownKeys(jsonRevision);
                    ownKeysRevPAI.forEach(key => {
                        jsonRevision[key].forEach((indicator: IRevisionFormPAI) => revPAI.push({...indicator, idIndicator: Number(key)}));
                    })
                    setRevisionPAI(revPAI);
                }
            } else {
                console.log(response.operation.message);
            }
        }).catch(err => console.log(err))
    }, [idPAI]);

    const onSaveTemp = () => {
        if (updatePAI !== null && updatePAI !== undefined) {
            let jsonPAI = {};
            revisionPAI.forEach(revision => {
                if(Reflect.has(jsonPAI, revision.idIndicator)) {
                    jsonPAI[revision.idIndicator].push({
                        field: revision.field,
                        observations: revision.observations
                    });
                } else {
                    jsonPAI[revision.idIndicator] = [{
                        field: revision.field,
                        observations: revision.observations
                    }];
                }
            });
            const data: IRevisionPAI = {
                idPai: Number(idPAI),
                completed: false,
                userCreate: authorization.user.numberDocument,
                version: 1,
                json: JSON.stringify(jsonPAI)
            };
            UpdateRevisionPAI(updatePAI, data).then(response => {
                if(response.operation.code === EResponseCodes.OK) {
                    setMessage({
                        title: "Guardado temporal realizado con éxito",
                        description: "Podrás continuar la revisión del plan en cualquier momento",
                        show: true,
                        background: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setUpdatePAI(response.data.id);
                            setMessage({});
                        },
                        onCancel: () => {
                            setMessage({});
                        }
                    })
                } else {
                    setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: response.operation.message,
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
            });
        } else {
            let jsonPAI = {};
            revisionPAI.forEach(revision => {
                if(Reflect.has(jsonPAI, revision.idIndicator)) {
                    jsonPAI[revision.idIndicator].push({
                        field: revision.field,
                        observations: revision.observations
                    });
                } else {
                    jsonPAI[revision.idIndicator] = [{
                        field: revision.field,
                        observations: revision.observations
                    }];
                }
            })
            const data: IRevisionPAI = {
                idPai: Number(idPAI),
                completed: false,
                userCreate: authorization.user.numberDocument,
                version: 1,
                json: JSON.stringify(jsonPAI)
            }
            CreateRevisionPAI(data).then(response => {
                if(response.operation.code === EResponseCodes.OK) {
                    setMessage({
                        title: "Guardado temporal realizado con éxito",
                        description: "Podrás continuar la revisión del plan en cualquier momento",
                        show: true,
                        background: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setUpdatePAI(response.data.id);
                            setMessage({});
                        },
                        onCancel: () => {
                            setMessage({});
                        }
                    })
                } else {
                    setMessage({
                        title: "¡Ha ocurrido un error!",
                        description: response.operation.message,
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
            });
        }
    };

    const onSubmit = () => {
        setMessage({
            title: "Revisión 1 formulación",
            description: "¿Deseas formular la versión 1 del plan de acción institucional?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({});
                if (updatePAI !== null && updatePAI !== undefined) {
                    let jsonPAI = {};
                    revisionPAI.forEach(revision => {
                        if(Reflect.has(jsonPAI, revision.idIndicator)) {
                            jsonPAI[revision.idIndicator].push({
                                field: revision.field,
                                observations: revision.observations
                            });
                        } else {
                            jsonPAI[revision.idIndicator] = [{
                                field: revision.field,
                                observations: revision.observations
                            }];
                        }
                    })
                    const data: IRevisionPAI = {
                        idPai: Number(idPAI),
                        completed: true,
                        userCreate: authorization.user.numberDocument,
                        version: 1,
                        json: JSON.stringify(jsonPAI)
                    }
                    UpdateRevisionPAI(updatePAI, data).then(response => {
                        if(response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Plan de acción institucional",
                                description: "¡Formulado versión 1 exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate(`./../../`);
                                    setMessage({});
                                },
                                onCancel: () => {
                                    setMessage({});
                                }
                            })
                        } else {
                            setMessage({
                                title: "¡Ha ocurrido un error!",
                                description: response.operation.message,
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
                    });
                } else {
                    let jsonPAI = {};
                    revisionPAI.forEach(revision => {
                        if(Reflect.has(jsonPAI, revision.idIndicator)) {
                            jsonPAI[revision.idIndicator].push({
                                field: revision.field,
                                observations: revision.observations
                            });
                        } else {
                            jsonPAI[revision.idIndicator] = [{
                                field: revision.field,
                                observations: revision.observations
                            }];
                        }
                    })
                    const data: IRevisionPAI = {
                        idPai: Number(idPAI),
                        completed: true,
                        userCreate: authorization.user.numberDocument,
                        version: 1,
                        json: JSON.stringify(jsonPAI)
                    }
                    CreateRevisionPAI(data).then(response => {
                        if(response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Plan de acción institucional",
                                description: "¡Formulado versión 1 exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate(`./../../`);
                                    setMessage({});
                                },
                                onCancel: () => {
                                    setMessage({});
                                }
                            })
                        } else {
                            setMessage({
                                title: "¡Ha ocurrido un error!",
                                description: response.operation.message,
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
                    });
                }
            },
            onCancel: () => {
                setMessage({});
            }
        });
    };

    const onCancel = () => {
        setMessage({
            title: "Cancelar acción",
            description: "¿Deseas cancelar la acción?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                navigate(`./../../`);
                setMessage({});
            },
            onCancel: () => {
                setMessage({});
            }
        })
    };

    const onComplete = () => {
        setMessage({
            title: "Revisión 1 formulación",
            description: "¿Deseas devolver el plan de acción institucional con las observaciones indicadas?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                setMessage({});
                if (updatePAI !== null && updatePAI !== undefined) {
                    const data: IRevisionPAI = {
                        idPai: Number(idPAI),
                        completed: true,
                        userCreate: authorization.user.numberDocument,
                        version: 1,
                        json: null
                    };
                    UpdateRevisionPAI(updatePAI, data).then(response => {
                        if(response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Plan de acción institucional",
                                description: "¡Devuelto exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate(`./../../`);
                                    setMessage({});
                                },
                                onCancel: () => {
                                    setMessage({});
                                }
                            })
                        } else {
                            setMessage({
                                title: "¡Ha ocurrido un error!",
                                description: response.operation.message,
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
                    });
                } else {
                    const data: IRevisionPAI = {
                        idPai: Number(idPAI),
                        completed: true,
                        userCreate: authorization.user.numberDocument,
                        version: 1,
                        json: null
                    }
                    CreateRevisionPAI(data).then(response => {
                        if(response.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Plan de acción institucional",
                                description: "¡Devuelto exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate(`./../../`);
                                    setMessage({});
                                },
                                onCancel: () => {
                                    setMessage({});
                                }
                            })
                        } else {
                            setMessage({
                                title: "¡Ha ocurrido un error!",
                                description: response.operation.message,
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
                    });
                }
            },
            onCancel: () => {
                setMessage({});
            }
        });
    }

    return {
        controlPAI,
        registerPAI,
        errorsPAI,
        fieldsLines,
        fieldsRisks,
        accordionsActions,
        onSaveTemp,
        onSubmit,
        onCancel,
        onComplete
    };
}