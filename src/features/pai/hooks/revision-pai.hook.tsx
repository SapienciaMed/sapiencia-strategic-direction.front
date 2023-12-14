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
import { IProject } from "../interfaces/ProjectsInterfaces";
import { IPropsRevisionPAI } from "../pages/revision-pai.page";

interface IProps extends IPropsRevisionPAI {
    idPAI: string;
}

export default function useRevisionPAIData({ idPAI, status }: Readonly<IProps>) {
    const [updatePAI, setUpdatePAI] = useState<number>(null);
    const [accordionsActions, setAccordionsActions] = useState<IAccordionTemplate[]>([]);
    const [nameProjectsData, setNameProjectsData] = useState<IDropdownProps[]>([]);
    const [nameProcessData, setNameProcessData] = useState<IDropdownProps[]>([]);
    const [projectsData, setProjectsData] = useState<IProject[]>([]);
    const {
        setPai,
        setProjectPAI,
        revisionPAI,
        setRevisionPAI,
        setStatus,
        fieldsChange,
        setFieldsChange,
        correctionFields,
        setCorrectionFields,
        setFieldsCorrected,
        setFieldsValues,
        fieldsValues,
        fieldsCorrected
    } = useContext(RevisionPAIContext);
    const { setMessage, authorization, validateActionAccess } = useContext(AppContext);
    const { getProcessPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const { GetPAIById, CreateRevisionPAI, UpdateRevisionPAI } = usePaiService();
    const {
        register: registerPAI,
        control: controlPAI,
        formState: { errors: errorsPAI },
        setValue,
        getValues,
        watch
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
    const watchProject = watch("namePAI");
    const watchType = watch("typePAI");

    useEffect(() => {
        if (!idPAI) return;
        setStatus({ status });
        if (status === "adjustment" || status === "revision") {
            if (!validateActionAccess("REVISAR_PLAN")) {
                navigate(`./../../`);
                return setMessage({
                    title: "Formulario no disponible",
                    show: true,
                    OkTitle: "Aceptar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        setMessage({});
                    }
                });
            }
        } else if (status === "correction") {
            if (validateActionAccess("CORREGIR_PLAN")) {
                if (validateActionAccess("REVISAR_PLAN")) {
                    navigate(`./../../`);
                    return setMessage({
                        title: "Formulario no disponible",
                        show: true,
                        OkTitle: "Aceptar",
                        onCancel: () => {
                            setMessage({});
                        },
                        onOk: () => {
                            setMessage({});
                        }
                    });
                }
            } else {
                navigate(`./../../`);
                return setMessage({
                    title: "Formulario no disponible",
                    show: true,
                    OkTitle: "Aceptar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        setMessage({});
                    }
                });
            };
        }
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
                setValue("typePAI", res.typePAI);
                setValue("namePAI", res.namePAI);
                setAccordionsActions(res.actionsPAi.map((action, index) => {
                    return {
                        id: index,
                        name: `Acción No. ${index + 1}`,
                        content: <ActionsRevisionComponent action={action} index={index} />
                    }
                }));
                setPai(res);
                if (status === "revision") {
                    const paiRevisions = res.revision.filter(rev => rev.version === 1 && rev.completed === true);
                    if (paiRevisions.length > 0) {
                        navigate(`./../../`);
                        return setMessage({
                            title: "Formulario no disponible",
                            show: true,
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                setMessage({});
                            }
                        });
                    }
                    const resRevision = res.revision.find(rev => rev.completed === false && rev.version === 1);
                    if (resRevision) {
                        setUpdatePAI(resRevision.id);
                        let revPAI = [];
                        const jsonRevision = JSON.parse(JSON.stringify(resRevision.json));
                        const ownKeysRevPAI = Reflect.ownKeys(jsonRevision);
                        ownKeysRevPAI.forEach(key => {
                            jsonRevision[key].forEach((indicator: IRevisionFormPAI) => revPAI.push({ ...indicator, idIndicator: Number(key) }));
                        })
                        setRevisionPAI(revPAI);
                    }
                } else if (status === "correction") {
                    const paiCorrections = res.revision.filter(rev => rev.version === 2 && rev.completed === true);
                    if (paiCorrections.length > 0) {
                        navigate(`./../../`);
                        return setMessage({
                            title: "Formulario no disponible",
                            show: true,
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                setMessage({});
                            }
                        });
                    }
                    const resCorrection = res.revision.find(rev => rev.completed === false && rev.version === 2);
                    const resRevision = res.revision.find(rev => rev.completed === true && rev.version === 1);
                    if (resCorrection && resRevision) {
                        setUpdatePAI(resCorrection.id);
                        let revPAI = [];
                        const jsonCorrection = JSON.parse(JSON.stringify(resRevision.json));
                        const ownKeysRevPAI = Reflect.ownKeys(jsonCorrection);
                        ownKeysRevPAI.forEach(key => {
                            jsonCorrection[key].forEach((indicator: IRevisionFormPAI) => revPAI.push({ ...indicator, idIndicator: Number(key) }));
                        })
                        setRevisionPAI(revPAI);
                        let flds = [];
                        revPAI.forEach(rev => {
                            flds.push(rev.field);
                        });
                        setFieldsChange(flds);
                        const jsonCorrectionPrev = JSON.parse(JSON.stringify(resCorrection.json));
                        setCorrectionFields(jsonCorrectionPrev);
                        let fieldsCorrectionPrev = [];
                        let fieldsValuesPrev = [];
                        Reflect.ownKeys(jsonCorrectionPrev).forEach(key => Reflect.ownKeys(jsonCorrectionPrev[key]).forEach(key2 => {
                            fieldsCorrectionPrev.push(key2);
                            fieldsValuesPrev.push({ field: key2, value: jsonCorrectionPrev[key][key2] });
                        }));
                        setFieldsCorrected(fieldsCorrectionPrev);
                        setFieldsValues(fieldsValuesPrev);
                    } else if (resRevision) {
                        let revPAI = [];
                        const jsonRevision = JSON.parse(JSON.stringify(resRevision.json));
                        const ownKeysRevPAI = Reflect.ownKeys(jsonRevision);
                        ownKeysRevPAI.forEach(key => {
                            jsonRevision[key].forEach((indicator: IRevisionFormPAI) => revPAI.push({ ...indicator, idIndicator: Number(key) }));
                        })
                        setRevisionPAI(revPAI);
                        let flds = [];
                        revPAI.forEach(rev => {
                            flds.push(rev.field);
                        });
                        setFieldsChange(flds);
                    } else {
                        navigate(`./../../`);
                        return setMessage({
                            title: "Formulario no disponible",
                            show: true,
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                setMessage({});
                            }
                        });
                    }
                }
            } else {
                console.log(response.operation.message);
            }
        }).catch(err => console.log(err))
    }, [idPAI]);
    useEffect(() => {
        getProjectsByFilters(2).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setProjectsData(response.data);
                const arrayEntities: IDropdownProps[] = response.data.map((project) => {
                    return { name: `${project.bpin} - ${project.project}`, value: project.id };
                });
                setNameProjectsData(arrayEntities);
            }
        });
        getProcessPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setNameProcessData(arrayEntities);
            }
        }).catch(() => { });
    }, []);


    useEffect(() => {
        if (watchType === 1 && watchProject !== null && watchProject !== undefined) {
            const projectSelected = projectsData.find((project) => project.id === watchProject);
            if (projectSelected) {
                return setProjectPAI(projectSelected);
            }
        }
        return setProjectPAI(null);
    }, [watchProject, watchType]);

    useEffect(() => {
        if (fieldsChange.length > 0) {
            const subscription = watch((value, { name }) => {
                return setCorrectionFields(prev => {
                    const indicatorId = getValues("actionsPAi")[0].indicators[0].id;
                    const newValues = { ...prev[indicatorId] };
                    const nameField = name.split(".");
                    if (nameField.length === 1) {
                        const field = name
                            .replace(".line", "")
                            .replace(".risk", "")
                            .replace(".product", "")
                            .replace(".responsible", "")
                            .replace(".coresponsible", "")
                            .replace(".value", "");
                        Reflect.set(newValues, field, value[field]);
                    } else {
                        const item = value[nameField[0]][nameField[1]];
                        Reflect.set(newValues, `${nameField[0]}.${item.id}`, value[nameField[0]][nameField[1]][nameField[2]]);
                    }
                    const valueReturn = { ...prev };
                    Reflect.set(valueReturn, indicatorId, newValues);
                    return valueReturn;
                });
            });
            return () => subscription.unsubscribe();
        }
    }, [watch, fieldsChange]);

    useEffect(() => {
        if (fieldsValues.length > 0) {
            const values = Reflect.ownKeys(getValues());
            fieldsValues.forEach(value => {
                const field = value.field.split(".");
                if (values.includes(field[0])) {
                    if (field[0] === "risksPAI") {
                        const risks = getValues("risksPAI");
                        risks.forEach((risk, index) => {
                            if (String(risk.id) === field[1]) setValue(`${field[0]}.${index}.risk`, value.value);
                        });
                    } else if (field[0] === "linePAI") {
                        const lines = getValues("linePAI");
                        lines.forEach((line, index) => {
                            if (String(line.id) === field[1]) setValue(`${field[0]}.${index}.line`, value.value);
                        });
                    } else {
                        setValue(field[0], value.value);
                    }
                }
            });
        }
    }, [fieldsValues]);

    const onSaveTemp = () => {
        if (status === "revision") {
            onSaveTempRevision();
        } else if (status === "correction") {
            onSaveTempCorrection();
        }
    }

    const onSaveTempRevision = () => {
        if (updatePAI !== null && updatePAI !== undefined) {
            let jsonPAI = {};
            revisionPAI.forEach(revision => {
                if (Reflect.has(jsonPAI, revision.idIndicator)) {
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
                if (response.operation.code === EResponseCodes.OK) {
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
                if (Reflect.has(jsonPAI, revision.idIndicator)) {
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
                if (response.operation.code === EResponseCodes.OK) {
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

    const onSaveTempCorrection = () => {
        if (updatePAI !== null && updatePAI !== undefined) {
            let jsonPAI = {};
            const correction = { ...correctionFields };
            Reflect.deleteProperty(correction, "pai");
            Reflect.ownKeys(correction).forEach((key, index) => {
                const correctionObject = { ...correction[key] };
                Reflect.ownKeys(correctionObject).forEach(key2 => {
                    if (!fieldsCorrected.includes(String(key2))) Reflect.deleteProperty(correctionObject, String(key2));
                });
                const paiCorrection = correctionObject["pai"];
                if (index === 0) {
                    Reflect.set(jsonPAI, key, { ...correctionObject, paiCorrection });
                } else {
                    Reflect.set(jsonPAI, key, { ...correctionObject });
                }
            });
            const data: IRevisionPAI = {
                idPai: Number(idPAI),
                completed: false,
                userCreate: authorization.user.numberDocument,
                version: 2,
                json: JSON.stringify(jsonPAI)
            };
            UpdateRevisionPAI(updatePAI, data).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
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
            const correction = { ...correctionFields };
            Reflect.deleteProperty(correction, "pai");
            Reflect.ownKeys(correction).forEach((key, index) => {
                const correctionObject = { ...correction[key] };
                Reflect.ownKeys(correctionObject).forEach(key2 => {
                    if (!fieldsCorrected.includes(String(key2))) Reflect.deleteProperty(correctionObject, String(key2));
                });
                const paiCorrection = correctionObject["pai"];
                if (index === 0) {
                    Reflect.set(jsonPAI, key, { ...correctionObject, paiCorrection });
                } else {
                    Reflect.set(jsonPAI, key, { ...correctionObject });
                }
            });
            const data: IRevisionPAI = {
                idPai: Number(idPAI),
                completed: false,
                userCreate: authorization.user.numberDocument,
                version: 2,
                json: JSON.stringify(jsonPAI)
            }
            CreateRevisionPAI(data).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
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
    }

    const onSubmit = () => {
        if (status === "revision") {
            onSubmitRevision();
        } else if (status === "correction") {
            onSubmitCorrection();
        }
    }

    const onSubmitRevision = () => {
        setMessage({
            title: "Revisión 1 formulación",
            description: "¿Deseas formular la versión 1 del plan de acción institucional?",
            show: true,
            OkTitle: "Aceptar",
            cancelTitle: "Cancelar",
            onOk: () => {
                if (updatePAI !== null && updatePAI !== undefined) {
                    let jsonPAI = {};
                    revisionPAI.forEach(revision => {
                        if (Reflect.has(jsonPAI, revision.idIndicator)) {
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
                        if (response.operation.code === EResponseCodes.OK) {
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
                        if (Reflect.has(jsonPAI, revision.idIndicator)) {
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
                        if (response.operation.code === EResponseCodes.OK) {
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

    const onSubmitCorrection = () => {
        const requirements = fieldsChange.reduce((result, current) => {
            if (!result.includes(current)) {
                result.push(current);
            }
            return result
        }, []);
        if (fieldsCorrected.length !== requirements.length) {
            setMessage({
                title: "Atención",
                description: "Debes marcar todos los cambios como completados.",
                show: true,
                OkTitle: "Aceptar",
                onCancel: () => {
                    setMessage({});
                },
                onOk: () => {
                    setMessage({});
                },
            })
        } else {
            setMessage({
                title: "Revisión formulación",
                description: "¿Deseas enviar el plan de acción institucional para la última revisión?",
                show: true,
                OkTitle: "Aceptar",
                cancelTitle: "Cancelar",
                onOk: () => {
                    if (updatePAI !== null && updatePAI !== undefined) {
                        let jsonPAI = {};
                        const correction = { ...correctionFields };
                        Reflect.deleteProperty(correction, "pai");
                        Reflect.ownKeys(correction).forEach((key, index) => {
                            const correctionObject = { ...correction[key] };
                            Reflect.ownKeys(correctionObject).forEach(key2 => {
                                if (!fieldsCorrected.includes(String(key2))) Reflect.deleteProperty(correctionObject, String(key2));
                            });
                            const paiCorrection = correctionObject["pai"];
                            if (index === 0) {
                                Reflect.set(jsonPAI, key, { ...correctionObject, paiCorrection });
                            } else {
                                Reflect.set(jsonPAI, key, { ...correctionObject });
                            }
                        });
                        const data: IRevisionPAI = {
                            idPai: Number(idPAI),
                            completed: true,
                            userCreate: authorization.user.numberDocument,
                            version: 2,
                            json: JSON.stringify(jsonPAI)
                        };
                        UpdateRevisionPAI(updatePAI, data).then(response => {
                            if (response.operation.code === EResponseCodes.OK) {
                                setMessage({
                                    title: "Plan de acción institucional",
                                    description: "¡Enviado exitosamente!",
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
                        const correction = { ...correctionFields };
                        Reflect.deleteProperty(correction, "pai");
                        Reflect.ownKeys(correction).forEach((key, index) => {
                            const correctionObject = { ...correction[key] };
                            Reflect.ownKeys(correctionObject).forEach(key2 => {
                                if (!fieldsCorrected.includes(String(key2))) Reflect.deleteProperty(correctionObject, String(key2));
                            });
                            const paiCorrection = correctionObject["pai"];
                            if (index === 0) {
                                Reflect.set(jsonPAI, key, { ...correctionObject, paiCorrection });
                            } else {
                                Reflect.set(jsonPAI, key, { ...correctionObject });
                            }
                        });
                        const data: IRevisionPAI = {
                            idPai: Number(idPAI),
                            completed: true,
                            userCreate: authorization.user.numberDocument,
                            version: 2,
                            json: JSON.stringify(jsonPAI)
                        }
                        CreateRevisionPAI(data).then(response => {
                            if (response.operation.code === EResponseCodes.OK) {
                                setMessage({
                                    title: "Plan de acción institucional",
                                    description: "¡Enviado exitosamente!",
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
    }

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
                        if (response.operation.code === EResponseCodes.OK) {
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
                        if (response.operation.code === EResponseCodes.OK) {
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
        onComplete,
        getValues,
        typePAIData,
        nameProjectsData,
        nameProcessData,
        fieldsChange,
        fieldsCorrected
    };
}