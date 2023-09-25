import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import {  sourceFundingValidator,EntityValidator } from "../../../common/schemas";
import { ISourceFundingForm, ISourceFunding } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { FaTrashAlt } from "react-icons/fa";
import { RadioButton } from 'primereact/radiobutton';
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { useComponentsService } from "../hooks/components-service.hook";
import { useStagesService } from "../hooks/stages-service.hook";
import { useEntitiesService } from "../hooks/entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import { useWidth } from "../../../common/hooks/use-width";
import { formaterNumberToCurrency } from "../../../common/utils/helpers";


interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function SourceFundingComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const [ sourceFundingFormData, setsourceFundingFormData] = useState<ISourceFundingForm>(null)
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const  resolver = useYupValidationResolver(sourceFundingValidator)
    const [stagesData, setStagesData] = useState<IDropdownProps[]>([]);
    const [ entityData, setEntityData] = useState<IDropdownProps[]>([]);
    const [ resourceData, setResourceData] = useState<IDropdownProps[]>([]);
    const [esValidoPreinversion, setEsValidoPreinversion] = useState(false);
    const [esValidoOperacion, setEsValidoOperacion] = useState(false);
    const [esValidoInversion, setEsValidoInversion] = useState(false);
    const { width } = useWidth();
    


    const { getEntity,getResource } = useEntitiesService();
    const { GetStages } = useStagesService();
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const { getListByGrouper } = useGenericListService();
    const {
        getValues,
        setValue,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<ISourceFundingForm>({ 
        resolver,
        mode: "all", defaultValues: {
            sourceFunding: projectData?.programation?.sourceFunding?.sourceFunding ? projectData.programation.sourceFunding.sourceFunding : null
        }
    });
    const onCancel = () => {
        setMessage({
            title: "Cancelar entidad",
            description: "¿Deseas cancelar la creación de la entidad?",
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

    useEffect(() => {
        GetStages().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.description, value: data.id }
                })
                setStagesData(data);
            }
        });
        getEntity().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setEntityData(arrayEntities);
            }
        }).catch(() => { });

        getResource().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setResourceData(arrayEntities);
            }
        }).catch(() => { });

    }, []);



    const objectivesColumns: ITableElement<ISourceFunding>[] = [
        {
            fieldName: "stage",
            header: "Etapa",
            renderCell: (row) => {
                const stage = stagesData.find(stage => stage.value === row.stage) || null;
                return <>{stage ? stage.name || "" : ""}</>
            }
        },
        {
            fieldName: "typeEntity",
            header: "Tipo de entidad",
            renderCell: (row) => {
                const entity = entityData.find(stage => stage.value === row.typeEntity) || null;
                return <>{entity ? entity.name || "" : ""}</>
            }
        },
        {
            fieldName: "entity",
            header: "Entidad",
        },
        {
            fieldName: "resource",
            header: "Tipo de recurso",
            renderCell: (row) => {
                const resource = resourceData.find(stage => stage.value === row.resource) || null;
                return <>{resource ? resource.name || "" : ""}</>
            }
        },
        {
            fieldName: "year0",
            header: "Año 0",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.year0)}</>
            }
        },
        {
            fieldName: "year1",
            header: "Año 1",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.year1)}</>
            }
        },
        {
            fieldName: "year2",
            header: "Año 2",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.year2)}</>
            }
        },
        {
            fieldName: "year3",
            header: "Año 3",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.year3)}</>
            }
        },
        {
            fieldName: "year4",
            header: "Año 4",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.year4)}</>
            }
        },
        
    ];
    const objectivesActions: ITableAction<ISourceFunding>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<EntityAddComponent setForm={setForm} returnData={changeEntity} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancelEdit);
            }
        },
        {
            icon: "Delete",
            onClick: (row) => {
                setMessage({
                    title: "Eliminar registro",
                    description: "¿Deseas Continuar?",
                    show: true,
                    background: true,
                    cancelTitle: "Cancelar",
                    OkTitle: "Aceptar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        const sourceFundingData = getValues("sourceFunding").filter(item => item !== row);
                        setValue("sourceFunding", sourceFundingData);
                        setsourceFundingFormData(prev => {
                            return { ...prev, sourceFunding: sourceFundingData };
                        });
                        trigger("sourceFunding");
                        setMessage({
                            title: "Registro eliminado",
                            description: "¡Eliminado exitosamente!",
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
    const changeEntity = (data: ISourceFunding, row?: ISourceFunding) => {
        if (row) {
            const sourceFundingData = getValues("sourceFunding").filter(item => item !== row).concat(data);
            setValue("sourceFunding", sourceFundingData);
            setsourceFundingFormData(prev => {
                return { ...prev, sourceFunding: sourceFundingData };
            });
        } else {
            const sourceFundingData = getValues("sourceFunding");
            setValue("sourceFunding", sourceFundingData ? sourceFundingData.concat(data) : [data]);
            setsourceFundingFormData(prev => {
                return { ...prev, sourceFunding: sourceFundingData ? sourceFundingData.concat(data) : [data] };
            });
        }
        trigger("sourceFunding");
    };
    useEffect(() => {
        if (isValid) {
            enableNext();
        } else {
            disableNext();
        }
    }, [isValid]);
    useEffect(() => {
        const subscription = watch((value: ISourceFundingForm) => setsourceFundingFormData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (sourceFundingFormData) setProjectData(prev => {
            const programation = prev ? { ...prev.programation, sourceFunding: { ...sourceFundingFormData } } : { sourceFunding: { ...sourceFundingFormData } };
            return { ...prev, programation: { ...programation } };
        })
    }, [sourceFundingFormData]);

    const PositivoIcon = () => {
        return <BsFillCheckCircleFill color="green" size={32} />;
      };

    const NegativoIcon = () => {
        return <FaTimesCircle color="red" size={32} />;
      };

    const DivConIcono = ({ esValidoPreinversion,esValidoOperacion,esValidoInversion }) => {
        return (
            <>
            <div className="Validation-form">

            {esValidoPreinversion !== null && (
            <div>
                <label className="text-black large bold">
                        Preinversión
                </label>
                <div className="centrar-div">
                        {esValidoPreinversion === false ?<NegativoIcon />  : esValidoPreinversion && <PositivoIcon /> }
                </div>
            </div>
             )}

            {esValidoOperacion !== null && (
             <div>
                <label className="text-black large bold">
                    Operación
                </label>
                <div className="centrar-div" > 
                        {esValidoOperacion === false ?   <NegativoIcon /> :  esValidoOperacion && <PositivoIcon />}
                </div>
             </div>
            )}
            {esValidoInversion !== null && (
                <div>
                    <label className="text-black large bold">
                        Inversión
                    </label>
                    <div className="centrar-div">
                            {esValidoInversion === false  ?  <NegativoIcon />  : esValidoInversion && <PositivoIcon /> }
                    </div>
                </div>
             )}
   
            </div>
                
            </>
        );
      };
    
      // actividades y suma de años
      let activitiesPreinversion = 0

      projectData.preparation?.activities?.activities?.filter(activity=> activity.stageActivity === 1).forEach(activity => {
        activitiesPreinversion += activity.budgetsMGA.year0.budget + activity.budgetsMGA.year1.budget + activity.budgetsMGA.year2.budget + activity.budgetsMGA.year3.budget + activity.budgetsMGA.year4.budget
      });
    
      let activitiesOperacion = 0


      projectData.preparation?.activities?.activities?.filter(activity=> activity.stageActivity === 2).forEach(activity => {
        activitiesOperacion += activity.budgetsMGA.year0.budget + activity.budgetsMGA.year1.budget + activity.budgetsMGA.year2.budget + activity.budgetsMGA.year3.budget + activity.budgetsMGA.year4.budget
      });

      let activitiesInversion = 0

      projectData.preparation?.activities?.activities?.filter(activity=> activity.stageActivity === 3).forEach(activity => {
        activitiesInversion += activity.budgetsMGA.year0.budget + activity.budgetsMGA.year1.budget + activity.budgetsMGA.year2.budget + activity.budgetsMGA.year3.budget + activity.budgetsMGA.year4.budget
      });
    
      // fondos de inversion y suma de años 

      let fundingPreInversion=0

      projectData.programation?.sourceFunding?.sourceFunding?.filter(sourceFunding=> sourceFunding.stage === 1).forEach(sourceFunding => {
        fundingPreInversion += sourceFunding.year0 + sourceFunding.year1 + sourceFunding.year2 + sourceFunding.year3 + sourceFunding.year4
      });

        let fundingOperacion=0

      projectData.programation?.sourceFunding?.sourceFunding?.filter(sourceFunding=> sourceFunding.stage === 2).forEach(sourceFunding => {
        fundingOperacion += sourceFunding.year0 + sourceFunding.year1 + sourceFunding.year2 + sourceFunding.year3 + sourceFunding.year4
      });

      let fundingInversion=0

      projectData.programation?.sourceFunding?.sourceFunding?.filter(sourceFunding=> sourceFunding.stage === 3).forEach(sourceFunding => {
        fundingInversion += sourceFunding.year0 + sourceFunding.year1 + sourceFunding.year2 + sourceFunding.year3 + sourceFunding.year4
      });


        // Llama a validarFormulario cada vez que cambien las variables relevantes
        useEffect(() => {
            validarFormulario();
        }, [activitiesPreinversion, activitiesOperacion, activitiesInversion,fundingInversion,fundingPreInversion,fundingOperacion]);

        


    function validarFormulario() 
    {
        if (activitiesPreinversion != 0 && fundingPreInversion != 0 && activitiesPreinversion == fundingPreInversion) {
            setEsValidoPreinversion(true); 
          }else if(activitiesPreinversion != 0 || fundingPreInversion != 0){
            setEsValidoPreinversion(false); 
          }else {
            setEsValidoPreinversion(null); 
          }
          if (activitiesOperacion != 0 && fundingOperacion != 0 && fundingOperacion == activitiesOperacion) {
            setEsValidoOperacion(true);  
          }else if(fundingOperacion != 0 || activitiesOperacion != 0){
            setEsValidoOperacion(false); 
          }else{
            setEsValidoOperacion(null); 
          }
          if (activitiesInversion != 0 && fundingInversion != 0 && fundingInversion == activitiesInversion ) {
            setEsValidoInversion(true); 
          }else if(activitiesInversion != 0 || fundingInversion != 0){
            setEsValidoInversion(false); 
          }else {
            setEsValidoInversion(null)
          }
    };
    

    return (
        <><div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Listado de Entidades
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<EntityAddComponent setForm={setForm} returnData={changeEntity} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        } }>
                            Añadir entidad <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('sourceFunding')?.length > 0 && <TableExpansibleComponent actions={objectivesActions} columns={objectivesColumns}  widthTable={`${(width * 0.0149) + 40}vw`}  data={getValues('sourceFunding')}  horizontalScroll />}
                </div>
            </FormComponent>
        </div>
        
        {
                
                    <div className="container-validation">
                    <div className="card-table">
            
                        <label className="text-black large bold text-required">
                            Validación por etapa
                        </label>
            
                        <DivConIcono
                            esValidoPreinversion={esValidoPreinversion}
                            esValidoOperacion={esValidoOperacion}
                            esValidoInversion={esValidoInversion}
                        />
            
                        </div>
                    </div>
        }
  
        </>
        

     
    )
}

interface IPropsEntity {
    returnData: (data: ISourceFunding, item?: ISourceFunding) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: ISourceFunding;
    view?:boolean;
}


function EntityAddComponent({ returnData, setForm, item , view }: IPropsEntity) {
    const { setMessage } = useContext(AppContext);
    const [stagesData, setStagesData] = useState<IDropdownProps[]>([]);
    const [ entityData, setEntityData] = useState<IDropdownProps[]>([]);
    const [ resourceData, setResourceData] = useState<IDropdownProps[]>([]);
    const { GetStages } = useStagesService();

    const { getEntity,getResource } = useEntitiesService();
    const resolver = useYupValidationResolver(EntityValidator);
    const { getListByGrouper } = useGenericListService();
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue , setShowCancel} = useContext(ProjectsContext);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        getValues
    } = useForm<ISourceFunding>({
        resolver, mode: "all", defaultValues: {
            stage: item?.stage ? item.stage : null,
            resource: item?.resource ? item.resource : null,
            entity: item?.entity ? item.entity : "",
            typeEntity: item?.typeEntity ? item.typeEntity : null,
            year0 : item?.year0 ? item.year0 : null,
            year1 : item?.year1 ? item.year1 : null,
            year2 : item?.year2 ? item.year2 : null,
            year3 : item?.year3 ? item.year3 : null,
            year4 : item?.year4 ? item.year4 : null,
        }
    });

    useEffect(() => {
        return () => {
            setForm(null);
        }
    }, []);
    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);

    useEffect(() => {
        GetStages().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.description, value: data.id }
                })
                setStagesData(data);
            }
        });
        getEntity().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setEntityData(arrayEntities);
            }
        }).catch(() => { });

        getResource().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setResourceData(arrayEntities);
            }
        }).catch(() => { });

    }, []);

    const onSubmit = handleSubmit(async (data: ISourceFunding) => {
        if(view) {
            setForm(null);
            setTextContinue(null);
            setActionCancel(null);
            setActionContinue(null);
            setMessage({});
            setDisableContinue(true);
        }else {
            setMessage({
                title: item ? "Guardar cambios" : "Crear Entidad",
                description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar la entidad?",
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
                        title: item ? "Cambios guardados" : "Entidad",
                        description: item ? "¡Cambios guardados exitosamente!" : "¡Guardada exitosamente!",
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
        };

    });
    useEffect(() => {
        setActionContinue(() => onSubmit);
    }, []);

    return (
        
        <FormComponent action={undefined} className="card-form-development">
            <div className="card-table">
            <p className="text-black large bold">
                {
                     item ? "Editar Entidad" : "Agregar Entidad"
                }
            </p>
            <div className="container-profits">
                <div className="entity-container">
                    <SelectComponent
                        control={control}
                        idInput={"stage"}
                        className="select-basic span-width"
                        label="Etapa"
                        classNameLabel="text-black biggest bold text-required"
                        data={stagesData}
                        errors={errors}
                    />
                       <SelectComponent
                        control={control}
                        idInput={"typeEntity"}
                        className="select-basic span-width"
                        label="Tipo de entidad"
                        classNameLabel="text-black biggest bold text-required"
                        data={entityData}
                        errors={errors}
                        
                    />
                       <SelectComponent
                        control={control}
                        idInput={"resource"}
                        className="select-basic span-width"
                        label="Tipo de recurso"
                        classNameLabel="text-black biggest bold text-required"
                        data={resourceData}
                        errors={errors}
                        
                    />
                </div>
                         <Controller
                            control={control}
                            name={"entity"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Entidad"
                                        classNameLabel="text-black biggest bold text-required"
                                        className="text-area-basic"
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={300}
                                    >
                                    </TextAreaComponent>
                                );
                            }}
                        />
                         <div className="year-container-1">
                                <InputNumberComponent
                                    idInput={`year0`}
                                    control={control}
                                    label="Año 0"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold text-required"
                                    className="inputNumber-basic"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={2}

                                />
                                <InputNumberComponent
                                    idInput={"year1"}
                                    control={control}
                                    label="Año 1"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold text-required"
                                    className="inputNumber-basic"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={2}
                                />
                                <InputNumberComponent
                                    idInput={"year2"}
                                    control={control}
                                    label="Año 2"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold text-required"
                                    className="inputNumber-basic"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={2}
                                />
                            </div>
                            <div className="year-container-2">
                                <InputNumberComponent
                                    idInput={"year3"}
                                    control={control}
                                    label="Año 3"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold text-required"
                                    className="inputNumber-basic"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={2}
                                />
                                <InputNumberComponent
                                    idInput={"year4"}
                                    control={control}
                                    label="Año 4"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold text-required"
                                    className="inputNumber-basic"
                                    mode="currency"
                                    currency="COP"
                                    locale="es-CO"
                                    minFractionDigits={2}
                                />
                            </div>
                    </div>
                </div>
        </FormComponent>
    )
}

export default React.memo(SourceFundingComponent);