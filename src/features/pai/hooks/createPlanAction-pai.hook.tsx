import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { ICreatePlanAction ,IAddAction } from "../interfaces/PAIInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { CreatePAIValidator } from "../../../common/schemas";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useContext, useEffect, useState } from "react";
import { PAIContext } from "../contexts/pai.context";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import useRoleService from "../../../common/hooks/role-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import { useSchedulesService } from "./schedules-service.hook";
import { useNavigate } from "react-router";
import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { useProjectsService } from "./projects-service.hook";
import { usePaiService } from "./createPlanAction-pai-service.hook"
import { boolean } from "yargs";
import { IProject } from "../interfaces/ProjectsInterfaces";
import { InputInplaceComponent } from "../../../common/components/Form";
import { AiOutlineDownload, AiOutlinePlusCircle } from "react-icons/ai";
import IndicatorsPaiPage from "../pages/indicators-pai.page";
import { IIndicatorsPAI } from "../interfaces/IndicatorsPAIInterfaces";



export default function usePlanActionPAIData() {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Formular Plan de Acción Institucional (PAI)",
        url: "/direccion-estrategica/pai/",
    });

    const [tableData, setTableData] = useState<IAddAction[]>([]);
    const [actionForm, setActionForm] = useState();
    const [riskPAIData, setRiskPAIData] = useState<IDropdownProps[]>(null);
    const [NamePAIData, setNamePAIData] = useState<IDropdownProps[]>(null);
    const [objectivePAIData, setObjectivePAIData] = useState<IDropdownProps[]>(null);
    const [processPAIData, setProcessPAIData] = useState<IDropdownProps[]>(null);
    const [projectsPAIData, setProjectsPAIData] = useState<IDropdownProps[]>(null);
    const [projectsData, setProjectsData] = useState<IProject[]>(null);
    const [View, ViewData] = useState<boolean>(false);
    const [riskText, RisksTextData] = useState<string>("");

    const [CreatePlanActionFormData, setCreatePlanActionFormData] = useState<ICreatePlanAction>(null)
    const { getRiskPAI,getProcessPAI,getObjectivesPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const {CreatePAI,UpdatePAI} =  usePaiService();
    const { getOptions } = useRoleService();
    const { getScheduleStatuses, getSchedules, crudSchedules } = useSchedulesService();
    const { authorization, setMessage } = useContext(AppContext);
    const {   
        disableSaveButton,
        setDisableSaveButton,
        PAIData,
        setPAIData,
        tempButtonText,
        setTempButtonText,
        tempButtonAction,
        setTempButtonAction,
        saveButtonText,
        setSaveButtonText,
        saveButtonAction,
        setSaveButtonAction,
        actionCancel,
        setActionCancel,
        showCancel,
        setShowCancel,
        formAction,
        setDisableTempBtn,
        setIndicatorsFormComponent,
        IndicatorsFormComponent } = useContext(PAIContext);

    const createPermission = authorization?.allowedActions?.find(action => action === "CREAR_PLAN");
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(CreatePAIValidator);
    const {
        handleSubmit,
        formState: { errors, isValid },
        reset,
        control,
        setValue,
        getValues,
        register,
        getFieldState,
        watch,
        trigger
    } = useForm<ICreatePlanAction>({ resolver, mode: "all" ,defaultValues: {
        id: PAIData?.id ? PAIData.id : null,
        yearPAI: PAIData?.yearPAI ? PAIData.yearPAI :null,
        budgetPAI: PAIData?.budgetPAI ? PAIData.budgetPAI :null,
        typePAI: PAIData?.typePAI ? PAIData.typePAI :null,
        namePAI: PAIData?.namePAI ? PAIData.namePAI :null,
        objectivePAI: PAIData?.objectivePAI ? PAIData.objectivePAI :"",
        articulationPAI: PAIData?.articulationPAI ? PAIData.articulationPAI :"",
        linePAI: PAIData?.linePAI ? PAIData?.linePAI :null,
        risksPAI: PAIData?.risksPAI ? PAIData?.risksPAI : null,
    }});

    useEffect(() => {
        const subscription = watch((value: ICreatePlanAction ) => setPAIData(prev => {
            return { ...prev, ...value }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmitTemp = handleSubmit(async (data: ICreatePlanAction) => {
            if (data?.id) {
                const dataPai = { ...data, user: authorization.user.numberDocument };
                const res = await UpdatePAI(dataPai.id, dataPai);
                if (res.operation.code === EResponseCodes.OK) {
                    setMessage({
                        title: "Guardado temporal realizado con éxito",
                        description: <p className="text-primary biggest">Podrás continuar la formulación del plan en cualquier momento</p>,
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
                    if (res.operation.message === ("Error: Ya existe un proyecto con este BPIN.")) {
                        setMessage({
                            title: "Validación BPIN.",
                            description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
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
                            title: "¡Ha ocurrido un error!",
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
            } else {
                const dataPai = { ...PAIData, user: authorization.user.numberDocument };
                const res = await CreatePAI(dataPai);
                setPAIData(prev => {
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
                    if (res.operation.message === ("Error: Ya existe un proyecto con este BPIN.")) {
                        setMessage({
                            title: "Validación BPIN.",
                            description: <p className="text-primary biggest">Ya existe un proyecto con el BPIN ingresado, por favor verifique.</p>,
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
                            title: "¡Ha ocurrido un error!",
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
    });

    const onSubmitEdit = handleSubmit(async (data: ICreatePlanAction) => {
        
    });

    useEffect(() => {
        getRiskPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setRiskPAIData(arrayEntities);
            }
        }).catch(() => { });

        getProcessPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setProcessPAIData(arrayEntities);
            }
        }).catch(() => { });

        getObjectivesPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setObjectivePAIData(arrayEntities);
            }
        }).catch(() => { });
    }, []);

    useEffect(() => {
        getProjectsByFilters(2).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const arrayEntities: IDropdownProps[] = response.data.map((entity) => {
                    return { name: entity.bpin, value: entity.id };
                });
                setProjectsPAIData(arrayEntities);
                setProjectsData(response.data)
            } 
        });
    }, []);

    const yearsArray: IDropdownProps[] = [];

    // Generar un array de objetos para representar los años
    for (let year = 2024; year <= 2100; year++) {
      yearsArray.push({ name: year.toString(), value: year });
    }

    useEffect(() => {
        const subscription = watch((value: ICreatePlanAction) => setCreatePlanActionFormData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    
    const changeActionsPAi = (data: IAddAction, row?: IAddAction) => {
        if (row) {
            const CreateActionData = getValues("actionsPAi").filter(item => item !== row).concat(data);
            setValue("actionsPAi", CreateActionData);
            setCreatePlanActionFormData(prev => {
                return { ...prev, actionsPAi: CreateActionData };
            });
        } else {
            const CreateActionData = getValues("actionsPAi");
            setValue("actionsPAi", CreateActionData ? CreateActionData.concat(data) : [data]);
            setCreatePlanActionFormData(prev => {
                return { ...prev, actionsPAi: CreateActionData ? CreateActionData.concat(data) : [data] };
            });
        }
        trigger("actionsPAi");
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "linePAI",
      });
    
      const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
        control,
        name: "risksPAI",
      });
    

    
    const TypePAIData: IDropdownProps[] = [
        {
            name: "Proyecto",
            value: 1
        },
        {
            name: "Proceso",
            value: 2
        },
    ];

    const idType = watch("typePAI")

    useEffect(() => {
        setValue("namePAI",null)
        if (idType == 1) {
            setNamePAIData(projectsPAIData)
        } else if (idType == 2){
            setNamePAIData(processPAIData);
        } 
    }, [idType]);

    

    const idName = watch("namePAI")

    useEffect(() => {
        setValue("objectivePAI","")
        setValue("articulationPAI","")
        if (idType == 1 && idName != null) {
           const project = projectsData.find(project => project.id === idName);
           setValue("objectivePAI",(project.centerProblem))
           setValue("articulationPAI",project.pdd_linea);
           ViewData(true);
            
        } else if (idType == 2 && idName != null){
            const objective = objectivePAIData.find(project => project.value === idName).name;
            setValue("objectivePAI",(objective))
            ViewData(false);
        } 
        
    }, [idName]);

    const idRisks = watch("selectedRisk")

    useEffect(() => {

        if (idRisks != null ) {
            const objective = riskPAIData.find(project => project.value === idRisks).name;
            setValue("selectedRisk",idRisks)
            RisksTextData(objective)
         } 

    }, [idRisks]);


    const cancelAction = () => {
            navigate("./../");
        
    }

    
  const createPlanActionColumns: ITableElement<IAddAction>[] = [
    {
      fieldName: "action",
      header: "No.acción",
    },
    {
      fieldName: "description",
      header: "Descripción de acción PAI",
        renderCell: (row) => {
            return (
                <Controller
                    control={control}
                    name={`actionsPAi.${row.action}.description`}
                    defaultValue={"           "}
                    render={({ field }) => {
                        return (
                            <InputInplaceComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label=""
                                className="input-basic"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            />
                        );
                    }}
                />
            )
        }
    },
  ];

  const createPlanActionActions: ITableAction<IAddAction>[] = [
    {
        customIcon: (row) => {
            return (
                <>
                    <div
                        className="create-action"
                        data-pr-position="bottom"
                        style={{ 'color': '#D72FD1' }}
                    >
                        <AiOutlinePlusCircle />
                    </div>
                </>
            )
        },
        onClick: (row) => {
            setIndicatorsFormComponent(<IndicatorsPaiPage actionId={row?.id | row.action}/>);
        }
    },
    {
      icon: "Detail",
      onClick: (row) => {
        setMessage({
          title: "Agregar Acción",
          description: ( ""
            //<ActorFormComponent ref={ActorCreateComponentRef} item={row} />
          ),
          show: true,
          background: true,
          OkTitle: "Guardar",
          cancelTitle: "Cancelar",
          onOk: () => {
            // if (ActorCreateComponentRef.current) {
            //   ActorCreateComponentRef.current.handleSubmit(
            //     (data: IParticipatingActors) => {
            //       const newActors = getValues("actors")
            //         .filter((actor) => actor !== row)
            //         .concat(data)
            //       setActorCreateData((prev) => {
            //         return { ...prev, actors: newActors };
            //       });
            //       setValue("actors", newActors);
            //       trigger("actors");
            //       setMessage({
            //         title: "Se editó exitosamente",
            //         description: "Se ha editado el actor exitosamente",
            //         show: true,
            //         background: true,
            //         OkTitle: "Aceptar",
            //         onOk: () => {
            //           setMessage({});
            //         },
            //         onClose: () => {
            //           setMessage({});
            //         },
            //       });
            //     }
            //   )();
            // }
          },
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          style: "causes-effects-modal-size",
        });
      },
    },
    {
      icon: "Delete",
      onClick: (row) => {
        setMessage({
          background: true,
          cancelTitle: "Cancelar",
          description: "No se podrá recuperar",
          OkTitle: "Aceptar",
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          show: true,
          title: "¿Deseas quitar la acción?",
          onOk: () => {
            // const newActors = getValues("actors").filter((actor) =>
            //   actor !== row
            // );
            // setActorCreateData((prev) => {
            //   return { ...prev, actors: newActors };
            // });
            // setValue("actors", newActors);
            // trigger("actors");
            // setMessage({});
          },
        });
      },

    },
  ];

    const { fields: fieldsActionsPAi, append: appendActionsPAi, remove: removeActionPai } = useFieldArray({
        control: control,
        name: "actionsPAi",
    });

    const actionsPAiFieldArray = useWatch({
        control: control,
        name: "actionsPAi"
    });


  const onSubmitCreate = () => {
    appendActionsPAi({ action: fieldsActionsPAi.length ++, description:"prueba"})
    // setTableData(tableData.concat({action:tableData.length + 1, description:"prueba"}));
  };

    useEffect(()=>{
        if(isValid){
            setTempButtonAction( () => onSubmitTemp );
            setSaveButtonAction(() => onSubmitTemp); 
        }
        setDisableTempBtn(!isValid);
        setDisableSaveButton(!isValid);
    },[isValid])

    useEffect(()=>{
        setTempButtonAction( () => onSubmitTemp );
        setSaveButtonAction(() => onSubmitTemp); 
        setTempButtonText("Guardar temporalmente"); 
        setSaveButtonText("Guardar y regresar"); 
        setDisableTempBtn(!isValid);
        setDisableSaveButton(!isValid);
    },[IndicatorsFormComponent])

    const saveAction = () => {
       
    }

    return { errors,fields, fieldsActionsPAi, append,View,riskText, NamePAIData,tableData,IndicatorsFormComponent,remove,changeActionsPAi,onSubmitCreate,createPlanActionColumns, riskFields, TypePAIData, appendRisk,riskPAIData, getFieldState,register, yearsArray, control, setMessage, navigate, onSubmitEdit, getValues, setValue, cancelAction, saveAction,createPlanActionActions };
}