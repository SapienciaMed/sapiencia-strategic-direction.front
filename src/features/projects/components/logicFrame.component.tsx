import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { logicFrameValidator, logicFrameFormValidator } from "../../../common/schemas";
import { IAddLogicFrame, IlogicFrameForm } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useWidth } from "../../../common/hooks/use-width";
import { useIndicatorsService } from "../hooks/indicators.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";


interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

const ResumeData: IDropdownProps[] = [
    {
        name: "Objetivo general",
        value: 1,
    },
    {
        name: "objetivo específico",
        value: 2,
    },
    {
        name: "Actividades",
        value: 3,
    }
];

function LogicFrameComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const resolver = useYupValidationResolver(logicFrameFormValidator);
    const [LogicFrameData, setLogicFrameData] = useState<IlogicFrameForm>(null);
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue, formAction, setDisableContinue } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const { GetIndicatorName } = useIndicatorsService();
    const [indicatorsNameData, setIndicatorsNameData] = useState<MasterTable[]>(null);
    const { width } = useWidth();
    const {
        getValues,
        setValue,
        formState: { isValid },
        watch,
        trigger
    } = useForm<IlogicFrameForm>({
        resolver, mode: "all", defaultValues: {
            logicFrame: projectData?.programation?.logicFrame?.logicFrame ? projectData.programation.logicFrame.logicFrame : null
        }
    });

    const ObjectivesEspecific : IDropdownProps[] = projectData.identification.problemDescription.causes.map((cause) => {
        return {
            name: `${cause.consecutive}. ${cause.description}`,
            value: cause.consecutive
        }
    });

    const IndicatorList : IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.activityMGA}. ${cause.activityDescriptionMGA}`,
            value: cause.activityMGA
        }
    });

    const indicators : IDropdownProps[] = projectData.programation.indicators.indicators.map((indicator,index) => {
        const matchedData = indicatorsNameData?.find(data => data.id === indicator.indicator);
        return {
            name: matchedData ? `${matchedData.description}` : ` ${indicator.staticValue}`,
            value: index
        }
     });

     useEffect(() => {
        GetIndicatorName().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setIndicatorsNameData(response.data);
            } else {
                console.log(response.operation.message);
            }
        });
    }, []);

    const onCancel = () => {
        setMessage({
            title: "Cancelar la acción",
            description: "¿Deseas cancelar la creación del marco lógico?",
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
            title: "Cancelar la acción",
            description: "¿Deseas cancelar los cambios? ",
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

    const objectivesColumns: ITableElement<IAddLogicFrame>[] = [
        {
            fieldName: "resume",
            header: "Resumen narrativo",
            renderCell: (row) => {
                if (ResumeData) {
                    const Resume = ResumeData.find(item => item.value == row.resume)
                    return <>{Resume ? Resume.name || "" : ""}</>;
                }

            },

        },
        {
            fieldName: "description",
            header: "Descripción",
            renderCell: (row) => {
                switch (row.resume) {
                    case 1:
                        return <>{projectData.identification.objectives.generalObjective}</>
              
                    case 2:
                        const objetives = ObjectivesEspecific.find(item => item.value == row.description)
                        return <>{objetives.name || ""}</>;
                    case 3:
                        const levelActivities = IndicatorList.find(item => item.value == row.description)
                        return <>{levelActivities.name || "" }</>;
                    default:
                        return <></>
                }
            },
        
        },
        {
            fieldName: "indicador",
            header: "Nombre indicador",
            renderCell: (row) => {
                if (indicators) {
                    const typeIndicator = indicators.find(item => item.value == row.indicator)
                    return <>{typeIndicator ? typeIndicator.name || "" : ""}</>;
                } else {
                    return;
                }

            },
           
        },
        {
            fieldName: "meta",
            header: "Meta indicador",
        },
        {
            fieldName: "sourceVerification",
            header: "Fuente de verificación",
        },
        {
            fieldName: "assumptions",
            header: "Supuestos",
        },
    ];
    const objectivesActions: ITableAction<IAddLogicFrame>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<AddLogicFrameComponent setForm={setForm} returnData={changeLogicFrame} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancelEdit);
            }
        },
    ];
    const changeLogicFrame = (data: IAddLogicFrame, row?: IAddLogicFrame) => {
        if (row) {
            const risksData = getValues("logicFrame").filter(item => item !== row).concat(data)
            setValue("logicFrame", risksData);
            setLogicFrameData(prev => {
                return { ...prev, risks: risksData };
            });
        } else {
            const risksData = getValues("logicFrame");
            setValue("logicFrame", risksData ? risksData.concat(data) : [data]);
            setLogicFrameData(prev => {
                return { ...prev, risks: risksData ? risksData.concat(data) : [data] };
            });
        }
        trigger("logicFrame");
    };

    useEffect(() => {
        if ( isValid && formAction === "new" ) {
            enableNext();
        } else if( !isValid && formAction === "new" ) {
            disableNext();
        } else if( isValid && formAction === "edit" ) {
            enableNext();
        }      
        setDisableContinue(isValid);
    }, [isValid]);
    
    useEffect(() => {
        const subscription = watch((value: IlogicFrameForm) => setLogicFrameData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (LogicFrameData) setProjectData(prev => {
            const programation = prev ? { ...prev.programation, logicFrame: { ...LogicFrameData } } : { logicFrame: { ...LogicFrameData } };
            return { ...prev, programation: { ...programation } };
        })
    }, [LogicFrameData]);
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Matriz de marco lógico
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<AddLogicFrameComponent setForm={setForm} returnData={changeLogicFrame} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir marco lógico <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('logicFrame')?.length > 0 && <TableExpansibleComponent  widthTable={`${(width * 0.0149) + 40}vw`}  actions={objectivesActions} columns={objectivesColumns} data={getValues('logicFrame')} horizontalScroll />}
                </div>      
                </FormComponent>
        </div>
    )
}

interface IPropsAddRisks {
    returnData: (data: IAddLogicFrame, item?: IAddLogicFrame) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: IAddLogicFrame;
}

function AddLogicFrameComponent({ returnData, setForm, item }: IPropsAddRisks) {
    const { setMessage } = useContext(AppContext);
    const { GetIndicatorName } = useIndicatorsService();
    const [descriptionData, setDescriptionData] = useState([]);
    const [indicatorsNameData, setIndicatorsNameData] = useState<MasterTable[]>(null);

    const resolver = useYupValidationResolver(logicFrameValidator);

    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue } = useContext(ProjectsContext);
    const {
        control,
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
        getValues,
    } = useForm<IAddLogicFrame>({
            resolver, mode: "all", defaultValues: {
            resume: item?.resume ? item.resume : null,
            indicator: item?.indicatorType ? projectData.programation.indicators.indicators.findIndex(data => JSON.stringify(data) === JSON.stringify(item.indicatorType)): null,
            meta:item?.meta ? item.meta : null,
            description: item?.description ? item.description : "",
            sourceVerification: item?.sourceVerification ? item?.sourceVerification : "",
            assumptions: item?.assumptions ? item?.assumptions : "",
            indicatorType:item?.indicatorType ? item.indicatorType : null,
        }
    });

    useEffect(() => {
        GetIndicatorName().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setIndicatorsNameData(response.data);
            } else {
                console.log(response.operation.message);
            }
        });
    }, []);


    const ObjectivesEspecific : IDropdownProps[] = projectData.identification.problemDescription.causes.map((cause) => {
        return {
            name: `${cause.consecutive}. ${cause.description}`,
            value: cause.consecutive
        }
    });

      const activities : IDropdownProps[] = projectData.preparation.activities.activities.map((cause) => {
        return {
            name: `${cause.activityMGA}. ${cause.activityDescriptionMGA}`,
            value: cause.activityMGA
        }
    });

     const indicators : IDropdownProps[] = projectData.programation.indicators.indicators.map((indicator,index) => {
        const matchedData = indicatorsNameData?.find(data => data.id === indicator.indicator);
        return {
            name: matchedData ? `${matchedData.description}`  : ` ${indicator.staticValue}`,
            value: index
        }
     });

     const indicator = watch("indicator");
    useEffect(() => {
    if(indicator == null || indicator == undefined){
        setValue("meta",null)    
        return
    }
        const selectedIndicator = projectData.programation.indicators.indicators[indicator]
        if (selectedIndicator.total){
            let meta = selectedIndicator.total
            setValue("meta",meta)
            setValue("indicatorType",selectedIndicator)
            
        }else{
            let meta = (selectedIndicator.year0 + selectedIndicator.year1 + selectedIndicator.year2 + selectedIndicator.year3 + selectedIndicator.year4)
            setValue("meta",meta)
            setValue("indicatorType",selectedIndicator)
        }
    }, [indicator])




    const idLevel = watch("resume")
    useEffect(() => {
        if (idLevel == 1) {
            const levelObjectives = [
                {
                    name: projectData.identification.objectives.generalObjective,
                    value: "1",
                },
            ];
            setDescriptionData(levelObjectives);
            setValue("description","1");
        } else if (idLevel == 2){
            setDescriptionData(ObjectivesEspecific);
            if(getValues("description") && item?.resume != idLevel){
                setValue("description",null);
            }
        } else if (idLevel == 3) {
            setDescriptionData(activities)
            if(getValues("description") && item?.resume != idLevel){
                setValue("description",null);
            }
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



    const onSubmit = handleSubmit(async (data: IAddLogicFrame) => {
        setMessage({
            title: item ? "Guardar cambios" : "Crear marco lógico",
            description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar el marco lógico?",
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
                    title: item ? "Cambios guardados" : "Marco lógico",
                    description: item ? "¡Cambios Guardados exitosamente!" : "¡Guardado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Cerrar",
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
            <p className="text-black large bold">{item ? "Editar marco lógico" : "Agregar marco lógico"}</p>
                <div className="logic-component">
                    <SelectComponent
                        control={control}
                        idInput={"resume"}
                        className="select-basic span-width"
                        label="Resumen narrativo"
                        classNameLabel="text-black biggest bold text-required"
                        data={ResumeData}
                        errors={errors}

                    />
                    <SelectComponent
                        control={control}
                        idInput={"description"}
                        className="select-basic span-width"
                        label="Descripción"
                        classNameLabel="text-black biggest bold text-required"
                        data={descriptionData}
                        errors={errors}

                    />
                    <SelectComponent
                        control={control}
                        idInput={"indicator"}
                        className="select-basic span-width"
                        label="Nombre de indicador"
                        classNameLabel="text-black biggest bold text-required"
                        data={indicators}
                        errors={errors}

                    />
                </div>
                <div className="meta-div">
                    <Controller
                        control={control}
                        name={"meta"}
                        defaultValue={null}
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Meta"
                                    className="input-basic background-textArea"
                                    classNameLabel="text-black biggest bold"
                                    typeInput={"number"}
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                    disabled
                                />
                            );
                        }}
                    />  
                    </div>
                    <div className="assumptions-div">

                    <Controller
                            control={control}
                            name={"sourceVerification"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Fuente de verificación"
                                        classNameLabel="text-black biggest bold"
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
                    <Controller
                            control={control}
                            name={"assumptions"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Supuestos"
                                        classNameLabel="text-black biggest bold"
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
                        
        </FormComponent>
    )
}


export default React.memo(LogicFrameComponent);