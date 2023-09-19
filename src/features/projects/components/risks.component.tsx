import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { risksValidator } from "../../../common/schemas";
import { IAddRisks, IRisks } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import {useEntitiesService} from "../hooks/entities-service.hook"
import { FaTrashAlt } from "react-icons/fa";
import { IEntities } from "../interfaces/Entities";
import { EResponseCodes } from "../../../common/constants/api.enum";

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

function RisksComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {

    const [RisksData, setRisksData] = useState<IRisks>(null)
    const [riskSelectData, setRiskSelectData] = useState([]);
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const [ typeRiskData, setTypeRiskData] = useState<IDropdownProps[]>(null);
    const [ probabilityData, setProbabilityData] = useState<IDropdownProps[]>(null);
    const [ impactData, setImpactData] = useState<IDropdownProps[]>(null);
    const { getEntitiesTypesRisks, getEntitiesProbability } = useEntitiesService();
    const {
        control,
        register,
        getValues,
        setValue,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<IRisks>({
         mode: "all", defaultValues: {
            risks: projectData?.preparation?.risks?.risks ? projectData.preparation.risks.risks : null
        }
    });
    const onCancel = () => {
        setMessage({
            title: "Cancelar riesgo",
            description: "¿Deseas cancelar la creación del riesgo?",
            show: true,
            background: true,
            cancelTitle: "Continuar",
            OkTitle: "Si, cancelar",
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
            description: "¿Desea cancelar los cambios del riesgo? ",
            show: true,
            background: true,
            cancelTitle: "Continuar",
            OkTitle: "Si, cancelar",
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
                const levelRisk = LevelData.find( item => item.value == row.level)
                return <>{ levelRisk.name || ""}</>
            },
            width:"200px"

        },
        {
            fieldName: "risk",
            header: "Riesgo relacionado",
            renderCell: (row) => {
                switch (row.level) {
                    case 1:
                        return <>{projectData.identification.objectives.generalObjective}</>
                    default:
                        return <></>
                }         
            },
            width:"200px"
        },
        {
            fieldName: "typeRisk",
            header: "Tipo de riesgo",
            renderCell: (row) => {
                const typeRisk = typeRiskData.find( item => item.value == row.typeRisk)
                return <>{ typeRisk.name || ""}</>
            },
            width:"200px"
        },
        {
            fieldName: "descriptionRisk",
            header: "Descripción del riesgo",
            width:"200px"
        },
        {
            fieldName: "probability",
            header: "Probabilidad",
            renderCell: (row) => {
                const probability = probabilityData.find( item => item.value == row.probability)
                return <>{ probability.name || ""}</>
            },
            width:"200px"
        },
        {
            fieldName: "impact",
            header: "Impacto",
            width:"200px"
        },
        {
            fieldName: "effects",
            header: "Efectos",
            width:"200px"
        },
        {
            fieldName: "mitigation",
            header: "Medidas de mitigación",
            width:"200px"
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
                        trigger("risks");
                        setMessage({
                            title: "Riesgo",
                            description: "!Eliminado exitosamente!",
                            show: true,
                            background: true,
                            OkTitle: "Cerrar",
                            onOk: () => {
                                setMessage({});
                            }
                        });
                    }
                });
            }
        }
    ];
    const changeRisks = (data: IAddRisks, row?: IAddRisks) => {
        if (row) {
            debugger;
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
        if (isValid) {
            enableNext();
        } else {
            disableNext();
        }
    }, [isValid]);
    useEffect(() => {
        const subscription = watch((value: IRisks) => setRisksData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (RisksData) setProjectData(prev => {
            const preparation = prev ? { ...prev.preparation, risks: { ...RisksData } } : { risks: { ...RisksData } };
            return { ...prev, preparation: { ...preparation } };
        })
    }, [RisksData]);
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
                    {getValues('risks')?.length > 0 && <TableExpansibleComponent actions={objectivesActions} columns={objectivesColumns} data={getValues('risks')} />}
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

function AddRisksComponent({ returnData, setForm, item }: IPropsAddRisks) {
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(risksValidator);

    const [riskData, setRiskData] = useState([]);
    const [ typeRiskData, setTypeRiskData] = useState<IDropdownProps[]>(null);
    const [ probabilityData, setProbabilityData] = useState<IDropdownProps[]>(null);
    const [ impactData, setImpactData] = useState<IDropdownProps[]>(null);
    const { getEntitiesTypesRisks, getEntitiesProbability } = useEntitiesService();
    
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue } = useContext(ProjectsContext);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        getValues
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

    const DataImpact: IDropdownProps[] = [
        {
            name: "impacto 1",
            value: 1,
        },
        {
            name: "impacto 2",
            value: 2,
        }
    ];


    const idLevel = watch("level")
    useEffect(() => {
        if (idLevel == 1) {
            const levelObjectives = [
                {
                    name:projectData.identification.objectives.generalObjective,
                    value: 1,
                },
            ];
            setRiskData(levelObjectives);
        }else {
            setRiskData([{}])
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
            description: item ? "¿Deseas editar el riesgo?" : "¿Deseas guardar el riesgo?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                returnData(data, item);
                setMessage({
                    title: item ? "Cambios guardados" : "Riesgo",
                    description: item ? "!Cambios Guardados exitosamente!" : "¡Guardado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setForm(null);
                        setTextContinue(null);
                        setActionCancel(null);
                        setActionContinue(null);
                        setMessage({});
                        setDisableContinue(true);
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
                        
                    />
                    <SelectComponent
                        control={control}
                        idInput={"risk"}
                        className="select-basic span-width"
                        label="Riesgo relacionado"
                        classNameLabel="text-black biggest bold text-required"
                        data={riskData}
                        errors={errors}
                        
                    />
                        <SelectComponent
                        control={control}
                        idInput={"typeRisk"}
                        className="select-basic span-width"
                        label="Tipo de riesgo"
                        classNameLabel="text-black biggest bold text-required"
                        data={typeRiskData}
                        errors={errors}
                        
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
                            errors={errors}
                            
                        />
                            <SelectComponent
                            control={control}
                            idInput={"impact"}
                            className="select-basic span-width"
                            label="Impacto"
                            classNameLabel="text-black biggest bold text-required"
                            data={DataImpact}
                            errors={errors}
                            
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