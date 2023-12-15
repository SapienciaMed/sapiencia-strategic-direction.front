import { Controller, get, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { AppContext } from "../../../common/contexts/app.context";
import { useSchedulesService } from "./schedules-service.hook";
import { useNavigate } from "react-router";
import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { useProjectsService } from "./projects-service.hook";
import { usePaiService } from "./pai-service.hook"
import { IProject } from "../interfaces/ProjectsInterfaces";
import { InputInplaceComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import IndicatorsPaiPage from "../pages/indicators-pai.page";
import { useParams } from "react-router-dom";
import ActionListPaiPage from "../pages/actionList-pai.page";



export default function usePlanActionPAIData({ status }) {
    useBreadCrumb({
        isPrimaryPage: false,
        name: "Formular Plan de Acción Institucional (PAI)",
        url: "/direccion-estrategica/pai/crear-pai",
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
    const [loadData, setLoadData] = useState<boolean>(false);
    const [actionCount, setActionCount] = useState<number>(1);
    const [riskText, RisksTextData] = useState<string>("");

    const [CreatePlanActionFormData, setCreatePlanActionFormData] = useState<ICreatePlanAction>(null)
    const { getRiskPAI,getProcessPAI,getObjectivesPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const { CreatePAI, UpdatePAI, GetPAIById } =  usePaiService();
    const { getOptions } = useRoleService();

    const { authorization, setMessage } = useContext(AppContext);
    const { id: idPAI } = useParams();
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
        setFormAction,
        setDisableTempBtn,
        setIndicatorsFormComponent,
        IndicatorsFormComponent } = useContext(PAIContext);

        useEffect(() => {
            setFormAction(status)
        }, [status]);

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
        actionsPAi:PAIData?.actionsPAi ? PAIData.actionsPAi : null,
    }});

    const updatePAIForm =  () => trigger();

    useEffect(() => {
        const subscription = watch((value: ICreatePlanAction ) => setPAIData(prev => {
            return { ...prev, ...value }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);


    useEffect(() => {
        if (Number(idPAI) && status === "edit") {
            GetPAIById(Number(idPAI))
                .then((response) => {
                    debugger;
                    if (response.operation.code === EResponseCodes.OK) {
                        const res = response.data;
                        // const actionsRes =  res.actionsPAi.map((action,index) => {
                        //     return {...action, index : index + 1 , action : index + 1}
                        // })
                        //setValue("actionsPAi",actionsRes);
                        setValue("yearPAI", res.yearPAI);
                        setValue("budgetPAI", res.budgetPAI);
                        setValue("objectivePAI", res.objectivePAI);
                        setValue("articulationPAI", res.articulationPAI);
                        setValue("linePAI", res.linePAI);
                        setValue("risksPAI", res.risksPAI);
                        setValue("typePAI", res.typePAI);
                        setValue("namePAI", res.namePAI);
                        setPAIData(res);
                        setLoadData(true);
                        setDisableTempBtn(false);
                        setDisableSaveButton(true);
                        
                    } else if (response.operation.code === EResponseCodes.FAIL) {
                        setMessage({
                            title: "No se pudo cargar el plan",
                            description: <p className="text-primary biggest">{response.operation.message}</p>,
                            background: true,
                            show: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                            },
                            onClose: () => {
                                setMessage({});
                            },
                        });
                    }
                })
                .catch((error) => {
                    setMessage({
                        title: "Error petición plan",
                        description: <p className="text-primary biggest">{error}</p>,
                        background: true,
                        show: true,
                        OkTitle: "Aceptar",
                        onOk: () => {
                            setMessage({});
                        },
                        onClose: () => {
                            setMessage({});
                        },
                    });
                });
        }
    }, [idPAI]);

        const onSubmitSave = handleSubmit(async (data: ICreatePlanAction) => {
            const dataPAI = {...PAIData}
            setMessage({
                title: " Crear plan ",
                description: "¿Deseas enviar el plan de acción institucional para revisión? ",
                show: true,
                background: true,
                cancelTitle: "Cancelar",
                OkTitle: "Aceptar",
                onCancel: () => {
                    setMessage({});
                },
                onOk: async () => {
                    if (data?.id) {
                        const formData = { ...PAIData,
                                    user: authorization.user.numberDocument, 
                                    status: 2,
                                    };
                        const res = await UpdatePAI(PAIData.id, formData );
                        if (res.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: "Plan de acción institucional",
                                description: "¡Enviado exitosamente!",
                                show: true,
                                background: true,
                                OkTitle: "Aceptar",
                                onOk: () => {
                                    navigate('/direccion-estrategica/pai');
                                    setMessage({});
                                }
                            })
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
                    } else {
                        const formData = { ...PAIData, user: authorization.user.numberDocument, status: 2 };
                        const res = await CreatePAI(formData);
                        setPAIData(prev => {
                            return { ...prev, id: res.data.id }
                        });
                        if (res.operation.code === EResponseCodes.OK) {
                            setMessage({
                                title: " Crear plan ",
                                description: "¿Deseas enviar el plan de acción institucional para revisión? ",
                                show: true,
                                background: true,
                                cancelTitle: "Cancelar",
                                OkTitle: "Aceptar",
                                onCancel: () => {
                                    setMessage({});
                                },
                                onOk: () => {
                                    setMessage({
                                        title: "Plan de acción institucional",
                                        description: "¡Enviado exitosamente!",
                                        show: true,
                                        background: true,
                                        OkTitle: "Aceptar",
                                        onOk: () => {
                                            navigate('/direccion-estrategica/pai');
                                            setMessage({});
                                        }
                                    })
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
            });
        });

    const onSubmitTemp = handleSubmit(async (data: ICreatePlanAction) => {
            if (data?.id) {
                const dataPai = { ...data, user: authorization.user.numberDocument ,status: 1};
                const res = await UpdatePAI(dataPai.id, dataPai);
                if (res.operation.code === EResponseCodes.OK) {
                    setMessage({
                        title: "Guardado temporal realizado con éxito",
                        description: <p className="text-primary biggest">Podrás continuar la formulación del plan en cualquier momento</p>,
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
                    if (res.operation.message === ("Error: id.")) {
                        setMessage({
                            title: "Validación ID.",
                            description: <p className="text-primary biggest">Ya existe un plan con el id ingresado, por favor verifique.</p>,
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
                const dataPai = { ...data, user: authorization.user.numberDocument,status: 1 };
                const res = await CreatePAI(dataPai);
                setPAIData(prev => {
                    return { ...prev, id: res.data.id }
                });
                if (res.operation.code === EResponseCodes.OK) {
                    setMessage({
                        title: "Guardado temporal realizado con éxito",
                        description: <p className="text-primary biggest">Podrás continuar la formulación del plan en cualquier momento</p>,
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
                    if (res.operation.message === ("Error: Ya existe un plan con este id.")) {
                        setMessage({
                            title: "Validación id.",
                            description: <p className="text-primary biggest">Ya existe un plan con este id , por favor verifique.</p>,
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
                    return { name: entity.bpin + " - " + entity.project, value: entity.id };
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


    const idType = watch("typePAI")

    useEffect(() => {
        setValue("namePAI",null)
        if(loadData == true){
            setValue("objectivePAI","")
            setValue("articulationPAI","")
        }
        if (idType == 1) {
            setNamePAIData(projectsPAIData)
        } else if (idType == 2){
            setNamePAIData(processPAIData);
        } 
    }, [idType]);

    

    const idName = watch("namePAI")

    useEffect(() => {
       
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
                    name={`actionsPAi.${row.action - 1}.description`}
                    defaultValue={""}
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
                    <div
                        className="create-action"
                        data-pr-position="bottom"
                        style={{ 'color': '#D72FD1' }}
                    >
                        <AiOutlinePlusCircle />
                    </div>
            )
        },
        onClick: (row) => {
            setIndicatorsFormComponent(<IndicatorsPaiPage actionId={row?.id | row.action} updatePAIForm={updatePAIForm}/>);
        }
        
    },
    {
      icon: "Detail",
      onClick: (row) => {
        setIndicatorsFormComponent(<ActionListPaiPage actionId={row?.id | row.action} control={control} register={register} errors={errors}/>);
      }
    },
    {
      icon: "Delete",
      onClick: (row) => {
        setMessage({
          background: true,
          cancelTitle: "Cancelar",
          description: "¿Deseas eliminar la acción y la información que contiene? No se podrá recuperar",
          OkTitle: "Aceptar",
          onCancel: () => {
            setMessage({});
          },
          onClose: () => {
            setMessage({});
          },
          show: true,
          title: "¿Eliminar acción?",
          onOk: () => {
            setMessage({
                title: "Acción del PAI",
                description: "¡Eliminada exitosamente!",
                show: true,
                background: true,
                OkTitle: "Aceptar",
                onOk: () => {
                  setMessage({});
                  const valueAction = getValues("actionsPAi").filter(action => action.index != row.index)
                  setValue("actionsPAi",valueAction)
                  setPAIData( prev =>{ 
                        return{
                            ...prev , actionsPAi : valueAction,
                        } 
                    })
                },
                onClose: () => {
                  setMessage({});
                },
              });
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
    setValue("actionsPAi",getValues("actionsPAi").concat({ action: getValues("actionsPAi").length + 1  , description:"", index: getValues("actionsPAi").length + 1 , id: getValues("actionsPAi").length + 1}));
    //setTableData(tableData.concat({action:tableData.length + 1, description:""}));
  };



    useEffect(()=>{
        setDisableTempBtn(false);
        const actions = getValues("actionsPAi");
        const actionsIndicators = actions.filter(action => action.indicators?.length == 0);
        if(getValues("actionsPAi").length > 0 ){
            setDisableTempBtn(true);
            setDisableSaveButton(true);
            if(actionsIndicators.length != 0){
                setSaveButtonAction(() => onSubmitSave);
                setDisableSaveButton(false);
            }
        }else {
            setTempButtonAction( () => onSubmitTemp );
            setDisableSaveButton(true);
            setDisableTempBtn(false);
        } 
    },[getValues("actionsPAi")])

    const onCancel = () => {
        setMessage({
            title: "Cancelar acción",
            description: "¿Deseas cancelar la acción y regresar a la opción de consulta?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                navigate('/direccion-estrategica/pai');
                setMessage({});
            }
        });
    }

    useEffect(()=>{
        const actions = getValues("actionsPAi");
        const actionsIndicators = actions.filter(action => action.indicators?.length == 0);
        if(getValues("actionsPAi").length > 0 ){
            setDisableTempBtn(true);
            setDisableSaveButton(true);
            if(actionsIndicators.length == 0){
                setSaveButtonAction(() => onSubmitSave);
                setDisableSaveButton(false);
            }
        }else {
            setTempButtonAction( () => onSubmitTemp );
            setDisableSaveButton(true);
            setDisableTempBtn(false);
        } 
        setActionCancel(()=> onCancel)
        setTempButtonText("Guardar temporalmente"); 
        setSaveButtonText("Guardar y regresar"); 
    },[IndicatorsFormComponent])


    const saveAction = () => {
       
    }

    return { errors,fields, getValues , append,View,riskText, formAction,setFormAction,NamePAIData,tableData,IndicatorsFormComponent,remove,changeActionsPAi,onSubmitCreate,createPlanActionColumns, riskFields, appendRisk,riskPAIData, getFieldState,register, yearsArray, control, setMessage, navigate, onSubmitEdit, setValue, cancelAction, saveAction,createPlanActionActions };
}