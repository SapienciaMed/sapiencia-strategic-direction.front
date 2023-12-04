import React, { useContext, useEffect, useState } from "react";
import { FormComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { riskValidator, risksValidator } from "../../../common/schemas";
import { IAddRisks, IRisks } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useEntitiesService } from "../hooks/entities-service.hook"
import { IEntities } from "../interfaces/Entities";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useWidth } from "../../../common/hooks/use-width";


interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

const LevelData: IDropdownProps[] = [
    {
        name: "Objetivo general",
        value: 1,
    },
    {
        name: "Producto",
        value: 2,
    },
    {
        name: "Actividad",
        value: 3,
    }
];

function RisksComponent({ disableNext, enableNext, setForm }: Readonly<IProps>): React.JSX.Element {
    const resolver = useYupValidationResolver(riskValidator);
    const [risksData, setRisksData] = useState<IRisks>(null);
    const { setProjectData,
        projectData,
        setTextContinue,
        setActionCancel,
        setActionContinue,
        setDisableContinue,
        formAction,
        setDisableStatusUpdate
    } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const [typeRiskData, setTypeRiskData] = useState<IDropdownProps[]>(null);
    const [probabilityData, setProbabilityData] = useState<IDropdownProps[]>(null);
    const [impactData, setImpactData] = useState<IDropdownProps[]>(null);
    const { width } = useWidth();
    const { getEntitiesTypesRisks, getEntitiesProbability, getEntitiesImpact } = useEntitiesService();
    const {
        getValues,
        setValue,
        formState: { isValid },
        watch,
        trigger
    } = useForm<IRisks>({
        resolver, mode: "all", defaultValues: {
            risks: projectData?.preparation?.risks?.risks ? projectData.preparation.risks.risks : null
        }
    });

    const products: IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.productMGA}. ${cause.productDescriptionMGA}`,
            value: cause.productMGA
        }
    });

    const activities: IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.activityMGA}. ${cause.activityDescriptionMGA}`,
            value: cause.activityMGA
        }
    });


    const onCancel = () => {
        setMessage({
            title: "Cancelar riesgo",
            description: "¿Deseas cancelar la creación del riesgo?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                setForm(null);
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        })
    }

    const onCancelEdit = () => {
        setMessage({
            title: "Cancelar cambios",
            description: "¿Deseas cancelar los cambios del riesgo? ",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                setForm(null);
                setTextContinue(null);
                setActionCancel(null);
                setActionContinue(null);
                setMessage({});
            }
        })
    }


    useEffect(() => {
        getEntitiesImpact().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setImpactData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    useEffect(() => {
        getEntitiesTypesRisks().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setTypeRiskData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    useEffect(() => {
        getEntitiesProbability().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setProbabilityData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    const objectivesColumns: ITableElement<IAddRisks>[] = [
        {
            fieldName: "level",
            header: "Nivel",
            renderCell: (row) => {
                if (LevelData) {
                    const levelRisk = LevelData.find(item => item.value == row.level)
                    return <>{levelRisk ? levelRisk.name || "" : ""}</>;
                }

            },


            width: "200px"

        },
        {
            fieldName: "risk",
            header: "Riesgo relacionado",
            renderCell: (row) => {
                const levelRisk = products.find(item => item.value == row.risk);
                const levelActivities = activities.find(item => item.value == row.risk);
                switch (row.level) {
                    case 1:
                        return <>{projectData.identification.objectives.generalObjective}</>

                    case 2:
                        return <>{levelRisk.name || ""}</>;
                    case 3:
                        return <>{levelActivities.name || ""}</>;
                    default:
                        return <></>
                }
            },
            width: "200px"
        },
        {
            fieldName: "typeRisk",
            header: "Tipo de riesgo",
            renderCell: (row) => {
                if (typeRiskData) {
                    const typeRisk = typeRiskData.find(item => item.value == row.typeRisk)
                    return <>{typeRisk ? typeRisk.name || "" : ""}</>;
                } else {
                    return;
                }

            },
            width: "200px"
        },
        {
            fieldName: "descriptionRisk",
            header: "Descripción del riesgo",
            width: "200px"
        },
        {
            fieldName: "probability",
            header: "Probabilidad",
            renderCell: (row) => {
                if (probabilityData) {
                    const probability = probabilityData.find(item => item.value == row.probability);
                    return <>{probability ? probability.name || "" : ""}</>;
                } else {
                    return;
                }
            },
            width: "200px"
        },
        {
            fieldName: "impact",
            header: "Impacto",
            renderCell: (row) => {
                if (impactData) {
                    const impact = impactData.find(item => item.value == row.impact)
                    return <>{impact ? impact.name || "" : ""}</>;
                } else {
                    return;
                }
            },
            width: "200px"
        },
        {
            fieldName: "effects",
            header: "Efectos",
            width: "200px"
        },
        {
            fieldName: "mitigation",
            header: "Medidas de mitigación",
            width: "200px"
        },
    ];
    const objectivesActions: ITableAction<IAddRisks>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<AddRisksComponent setForm={setForm} returnData={changeRisks} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancelEdit);
            }
        },
        {
            icon: "Delete",
            onClick: (row) => {
                setMessage({
                    title: "Eliminar Riesgo",
                    description: "¿Deseas eliminar el Riesgo?",
                    show: true,
                    background: true,
                    cancelTitle: "Cancelar",
                    OkTitle: "Aceptar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        const risksData = getValues("risks").filter(item => item !== row);
                        setValue("risks", risksData);
                        setRisksData(prev => {
                            return { ...prev, risks: risksData };
                        });
                        setMessage({
                            title: "Riesgo",
                            description: "¡Eliminado exitosamente!",
                            show: true,
                            background: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                            }
                        });
                        trigger("risks");
                    }
                });
            }
        }
    ];
    const changeRisks = (data: IAddRisks, row?: IAddRisks) => {
        if (row) {
            const risksData = getValues("risks").filter(item => item !== row).concat(data)
            setValue("risks", risksData);
            setRisksData(prev => {
                return { ...prev, risks: risksData };
            });
        } else {
            const risksData = getValues("risks");
            setValue("risks", risksData ? risksData.concat(data) : [data]);
            setRisksData(prev => {
                return { ...prev, risks: risksData ? risksData.concat(data) : [data] };
            });
        }
        trigger("risks");
    };
    useEffect(() => {
        if (isValid && formAction === "new") {
            setTimeout(() => {
                enableNext();
            }, 500)
        } else if (!isValid && formAction === "new") {
            disableNext();
        } else if (isValid && formAction === "edit") {
            setTimeout(() => {
                enableNext();
                setDisableContinue(false);
            }, 500)
        } else {
            setDisableContinue(true);
        }
        setDisableStatusUpdate(!isValid);
    }, [isValid]);
    useEffect(() => {
        const subscription = watch((value: IRisks) => setRisksData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (risksData) setProjectData(prev => {
            const preparation = prev ? { ...prev.preparation, risks: { ...risksData } } : { risks: { ...risksData } };
            return { ...prev, preparation: { ...preparation } };
        })
    }, [risksData]);
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Análisis de riesgos
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<AddRisksComponent setForm={setForm} returnData={changeRisks} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir riesgo <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('risks')?.length > 0 && <TableExpansibleComponent widthTable={`${(width * 0.0149) + 40}vw`} actions={objectivesActions} columns={objectivesColumns} data={getValues('risks')} horizontalScroll />}
                </div>
            </FormComponent>
        </div>
    )
}

interface IPropsAddRisks {
    returnData: (data: IAddRisks, item?: IAddRisks) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: IAddRisks;
}

function AddRisksComponent({ returnData, setForm, item }: Readonly<IPropsAddRisks>) {
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(risksValidator);

    const [riskData, setRiskData] = useState([]);
    const [typeRiskData, setTypeRiskData] = useState<IDropdownProps[]>(null);
    const [probabilityData, setProbabilityData] = useState<IDropdownProps[]>(null);
    const [impactData, setImpactData] = useState<IDropdownProps[]>(null);
    const { getEntitiesTypesRisks, getEntitiesProbability, getEntitiesImpact } = useEntitiesService();

    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue } = useContext(ProjectsContext);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
    } = useForm<IAddRisks>({
        resolver, mode: "all", defaultValues: {
            level: item?.level ? item.level : null,
            risk: item?.risk ? item.risk : null,
            typeRisk: item?.typeRisk ? item.typeRisk : null,
            descriptionRisk: item?.descriptionRisk ? item?.descriptionRisk : "",
            probability: item?.probability ? item?.probability : null,
            impact: item?.impact ? item?.impact : null,
            effects: item?.effects ? item?.effects : "",
            mitigation: item?.mitigation ? item?.mitigation : ""
        }
    });

    const products: IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.productMGA}. ${cause.productDescriptionMGA}`,
            value: cause.productMGA
        }
    });

    const activities: IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.activityMGA}. ${cause.activityDescriptionMGA}`,
            value: cause.activityMGA
        }
    });

    const idLevel = watch("level")

    useEffect(() => {
        if (idLevel == 1) {
            const levelObjectives = [
                {
                    name: projectData.identification.objectives.generalObjective,
                    value: "1",
                },
            ];
            setRiskData(levelObjectives);
        } else if (idLevel == 2) {
            setRiskData(products);
        } else if (idLevel == 3) {
            setRiskData(activities)
        }

    }, [idLevel]);

    useEffect(() => {
        return () => {
            setForm(null);
        }
    }, []);
    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);


    useEffect(() => {
        getEntitiesImpact().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setImpactData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    useEffect(() => {
        getEntitiesTypesRisks().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setTypeRiskData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    useEffect(() => {
        getEntitiesProbability().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setProbabilityData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    const onSubmit = handleSubmit(async (data: IAddRisks) => {
        setMessage({
            title: item ? "Editar riesgo" : "Crear riesgo",
            description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar el riesgo?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                setDisableContinue(true);
                returnData(data, item);
                setMessage({
                    title: item ? "Cambios guardados" : "Riesgo",
                    description: item ? "¡Cambios Guardados exitosamente!" : "¡Guardado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setForm(null);
                        setTextContinue(null);
                        setActionCancel(null);
                        setActionContinue(null);
                        setMessage({});
                    }
                })
            }
        });
    });
    useEffect(() => {
        setActionContinue(() => onSubmit);
    }, []);

    return (
        <FormComponent action={undefined} className="card-table">
            <p className="text-black large bold">{item ? "Editar Riesgo" : "Agregar Riesgo"}</p>
            <div className="problem-description-container">
                <div className="risk-component">
                    <SelectComponent
                        control={control}
                        idInput={"level"}
                        className="select-basic span-width"
                        label="Nivel"
                        classNameLabel="text-black biggest bold text-required"
                        data={LevelData}
                        errors={errors}
                        filter={true}

                    />
                    <SelectComponent
                        control={control}
                        idInput={"risk"}
                        className="select-basic span-width"
                        label="Riesgo relacionado"
                        classNameLabel="text-black biggest bold text-required"
                        data={riskData}
                        errors={errors}
                        filter={true}

                    />
                    <SelectComponent
                        control={control}
                        idInput={"typeRisk"}
                        className="select-basic span-width"
                        label="Tipo de riesgo"
                        classNameLabel="text-black biggest bold text-required"
                        data={typeRiskData}
                        errors={errors}
                        filter={true}

                    />
                    <div className="grid-span-3-columns">
                        <Controller
                            control={control}
                            name={"descriptionRisk"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Descripción riesgo"
                                        classNameLabel="text-black biggest bold text-required"
                                        className="text-area-basic"
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={500}
                                    >
                                    </TextAreaComponent>
                                );
                            }}
                        />
                    </div>
                </div>
                <div className="risk-component-2">
                    <SelectComponent
                        control={control}
                        idInput={"probability"}
                        className="select-basic span-width"
                        label="Probabilidad"
                        classNameLabel="text-black biggest bold text-required"
                        data={probabilityData}
                        filter={true}
                        errors={errors}

                    />
                    <SelectComponent
                        control={control}
                        idInput={"impact"}
                        className="select-basic span-width"
                        label="Impacto"
                        classNameLabel="text-black biggest bold text-required"
                        data={impactData}
                        errors={errors}
                        filter={true}

                    />
                    <div className="grid-span-2-columns">
                        <Controller
                            control={control}
                            name={"effects"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Efectos"
                                        classNameLabel="text-black biggest bold text-required"
                                        className="text-area-basic"
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={500}
                                    >
                                    </TextAreaComponent>
                                );
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Controller
                        control={control}
                        name={"mitigation"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Medidas de mitigación"
                                    classNameLabel="text-black biggest bold text-required"
                                    className="text-area-basic"
                                    placeholder="Escribe aquí"
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                    characters={500}
                                >
                                </TextAreaComponent>
                            );
                        }}
                    />
                </div>
            </div>
        </FormComponent>
    )
}


export default React.memo(RisksComponent);