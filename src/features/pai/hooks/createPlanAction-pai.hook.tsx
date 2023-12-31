import { Controller, useFieldArray, useForm } from "react-hook-form";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { ICreatePlanAction, IAddAction } from "../interfaces/PAIInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { CreatePAIValidator } from "../../../common/schemas";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useContext, useEffect, useState } from "react";
import { PAIContext } from "../contexts/pai.context";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router";
import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities";
import { useProjectsService } from "./projects-service.hook";
import { usePaiService } from "./pai-service.hook"
import { IProject } from "../interfaces/ProjectsInterfaces";
import { InputComponent, InputInplaceComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import IndicatorsPaiPage from "../pages/indicators-pai.page";
import { useParams } from "react-router-dom";
import ActionListPaiPage from "../pages/actionList-pai.page";
import { Tooltip } from "primereact/tooltip";
import { AiOutlineEye } from "react-icons/ai";
import { PiTrash } from "react-icons/pi";
import { v4 as uuidv4 } from 'uuid';



export default function usePlanActionPAIData({ status }) {
    useBreadCrumb({
        isPrimaryPage: false,
        name: "Formular Plan de Acción Institucional (PAI)",
        url: "/direccion-estrategica/pai/crear-pai",
    });
    const [riskPAIData, setRiskPAIData] = useState<IDropdownProps[]>(null);
    const [namePAIData, setNamePAIData] = useState<IDropdownProps[]>(null);
    const [objectivePAIData, setObjectivePAIData] = useState<IDropdownProps[]>(null);
    const [processPAIData, setProcessPAIData] = useState<IDropdownProps[]>(null);
    const [projectsPAIData, setProjectsPAIData] = useState<IDropdownProps[]>(null);
    const [projectsData, setProjectsData] = useState<IProject[]>(null);
    const [view, setView] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(false);
    const [riskText, setRiskText] = useState<string>("");
    const [actionsPAi, setActionsPAi] = useState([]);


    const { getRiskPAI, getProcessPAI, getObjectivesPAI } = useEntitiesService();
    const { getProjectsByFilters } = useProjectsService();
    const { GetPAIById } = usePaiService();

    const { setMessage } = useContext(AppContext);
    const { id: idPAI } = useParams();
    const {
        disableSaveButton,
        setDisableSaveButton,
        PAIData,
        setPAIData,
        setTempButtonText,
        setSaveButtonText,
        setActionCancel,
        formAction,
        setFormAction,
        setDisableTempBtn,
        setIndicatorsFormComponent,
        IndicatorsFormComponent,
        setEditId
    } = useContext(PAIContext);

    useEffect(() => {
        setFormAction(status)
    }, [status]);

    const navigate = useNavigate();
    const resolver = useYupValidationResolver(CreatePAIValidator);
    const {
        handleSubmit,
        formState: { errors, isValid },
        control,
        setValue,
        getValues,
        register,
        getFieldState,
        watch,
        trigger
    } = useForm<ICreatePlanAction>({
        resolver, mode: "all", defaultValues: {
            id: PAIData?.id ? PAIData.id : null,
            yearPAI: PAIData?.yearPAI ? PAIData.yearPAI : null,
            budgetPAI: PAIData?.budgetPAI ? PAIData.budgetPAI : null,
            typePAI: PAIData?.typePAI ? PAIData.typePAI : null,
            namePAI: PAIData?.namePAI ? PAIData.namePAI : null,
            objectivePAI: PAIData?.objectivePAI ? PAIData.objectivePAI : "",
            articulationPAI: PAIData?.articulationPAI ? PAIData.articulationPAI : "",
            linePAI: PAIData?.linePAI ? PAIData?.linePAI : null,
            risksPAI: PAIData?.risksPAI ? PAIData?.risksPAI : null,
            actionsPAi: PAIData?.actionsPAi ? PAIData.actionsPAi : null,
        }
    });

    const updatePAIForm = () => trigger();

    useEffect(() => {
        const subscription = watch((value: ICreatePlanAction) => {
            return setPAIData(prev => {
                return { ...prev, ...value };
            });
        });
        return () => subscription.unsubscribe();
    }, [watch]);


    useEffect(() => {
        if (Number(idPAI) && status === "edit") {
            GetPAIById(Number(idPAI))
                .then((response) => {
                    if (response.operation.code === EResponseCodes.OK) {
                        
                        const res = response.data;
                        setLoadData(true);
                        setValue("yearPAI", res.yearPAI);
                        setValue("budgetPAI", res.budgetPAI);
                        setValue("objectivePAI", res.objectivePAI);
                        setValue("articulationPAI", res.articulationPAI);
                        setValue("linePAI", res.linePAI);
                        setValue("risksPAI", res.risksPAI);
                        setValue("typePAI", res.typePAI);
                        const actions = res.actionsPAi.map((action, index) => {
                            return {...action, action: index + 1}
                        })
                        setValue("actionsPAi", actions);
                        setTimeout(() => {
                            setValue("namePAI", res.namePAI);
                            trigger();
                        }, 1000);
                        setValue("id", res.id);
                        setEditId(res.id);
                        setPAIData({...res, actionsPAi: actions});
                        
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

    const { fields, append , remove: removeLine} = useFieldArray({
        control,
        name: "linePAI",
    });

    const { fields: riskFields, append: appendRisk , remove: removeRisk} = useFieldArray({
        control,
        name: "risksPAI",
    });


    const idType = watch("typePAI")

    useEffect(() => {
        setValue("namePAI", null)
        if (!loadData) {
            setValue("objectivePAI", "")
            setValue("articulationPAI", "")
        }
        if (idType == 1) {
            setNamePAIData(projectsPAIData)
        } else if (idType == 2) {
            setNamePAIData(processPAIData);
        }
    }, [idType, projectsData]);



    const idName = watch("namePAI")

    useEffect(() => {
        if (!projectsData) return;
        setLoadData(false);
        if (idType == 1 && idName != null) {
            const project = projectsData?.find(project => project.id === idName);
            setValue("objectivePAI", (project.centerProblem))
            setValue("articulationPAI", project.pdd_linea);
            setView(true);

        } else if (idType == 2 && idName != null) {
            const objective = objectivePAIData?.find(project => project.value === idName).name;
            setValue("objectivePAI", (objective))
            setView(false);
        }

    }, [idName, projectsData]);

    const idRisks = watch("selectedRisk")

    useEffect(() => {

        if (idRisks != null) {
            const objective = riskPAIData.find(project => project.value === idRisks).name;
            setValue("selectedRisk", idRisks)
            setRiskText(objective)
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
                        name={`actionsPAi.${row?.action - 1}.description`}
                        defaultValue={""}
                        render={({ field }) => {
                            
                            return (
                                <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={field.value}
                                label=""
                                className="input-basic"
                                typeInput="text"
                                register={register}
                                // onChange={(e) => {
                                //     const actionIndex = row?.action;
                                //     const actionId = row?.idAcc;
                                //     if (e.target.value.length > 0) {
                                //         setValue(`actionsPAi.${actionIndex}.edit`, true);
                                //     } else {
                                //         setValue(`actionsPAi.${actionIndex}.edit`, false);
                                //     }
                                //     console.log(getValues("actionsPAi"));
                                //     return field.onChange(e.target.value);
                                // }}
                                onChange={(e) => {
                                    const actionIndex = row?.index;
                                
                                    // Obtener el estado actual de actionsPAi
                                    const currentActions = getValues("actionsPAi") || [];
                                
                                    // Crear un nuevo array con las actualizaciones
                                    const updatedActions = currentActions.map((action, index) => {
                                        if (index === actionIndex) {
                                            // Actualizar solo la descripción en la acción específica
                                            return {
                                                ...action,
                                                description: e.target.value,
                                            };
                                        }
                                        return action;
                                    });
                                
                                    // Actualizar el estado utilizando la función de setActionsPAi
                                    setValue("actionsPAi",updatedActions);
                                
                                    // Verificar si hay algún elemento con el mismo índice y idAcc
                                    const existingItem = updatedActions.find((action) => action.index === actionIndex && action.idAcc === row?.idAcc);
                                
                                    if (existingItem) {
                                        // Actualizar el estado de edit solo si existe el elemento
                                        setValue(`actionsPAi.${actionIndex}.edit`, e.target.value.length > 0);
                                        field.onChange(e.target.value);
                                    }
                                }}
                                    
                                    errors={errors}
                                    placeholder="Escribe aquí"
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
              
                if (row.edit) {
                  return (
                    <>
                      <Tooltip target=".create-action" />
                      <div
                        className="create-action"
                        data-pr-tooltip="Agregar Acción"
                        data-pr-position="bottom"
                        style={{ color: '#D72FD1' }}
                      >
                        <AiOutlinePlusCircle />
                      </div>
                    </>
                  );
                }
                
                return null;
            },

            onClick: (row) => {
                setIndicatorsFormComponent(<IndicatorsPaiPage actionId={row?.id | row.action} updatePAIForm={updatePAIForm} />);
            }

        },
        {
            customIcon: (row) => {
                if (row.edit) {
                    return (
                        <><Tooltip target=".detail-action" /><div
                            className="detail-action"
                            data-pr-tooltip="Detalle Acción"
                            data-pr-position="bottom"
                        >
                            <AiOutlineEye className="button grid-button button-detail" />
                        </div></>
                    )
                }
                
                return null;
            },
            onClick: (row) => {
                setIndicatorsFormComponent(<ActionListPaiPage actionId={row.action-1} control={control} register={register} errors={errors} />);
            }
        },
        {
            customIcon: (row) => {
                if ( row.edit) {
                    return (
                        <><Tooltip target=".delete-action" /><div
                            className="delete-action"
                            data-pr-tooltip="Eliminar Acción"
                            data-pr-position="bottom"
                        >
                            <PiTrash className="button grid-button button-delete" />
                        </div></>
                    )
                }
                
                return null;

            },
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
                                const actions = getValues("actionsPAi");
                                
                                // Filtrar la acción que se debe eliminar
                                const updatedActions = actions.filter((action) => action.idAcc !== row.idAcc);
                                
                                // Actualizar los índices de las acciones restantes
                                const updatedActionsWithCorrectIndices = updatedActions.map((action, index) => {
                                  return {
                                    ...action,
                                    action: index + 1,
                                    index,
                                  };
                                });
                                
                                setValue("actionsPAi", updatedActionsWithCorrectIndices);
                                setPAIData((prev) => ({
                                  ...prev,
                                  actionsPAi: updatedActionsWithCorrectIndices,
                                }));
                                
                                // Validar si el campo eliminado está vacío antes de asignar el valor al siguiente campo
                                const nextActionIndex = row.index; // Puedes ajustar esto según tu lógica
                                const nextAction = updatedActionsWithCorrectIndices.find(action => action.index === nextActionIndex);
                                
                                if (nextAction && nextAction.description === "") {
                                  setValue(`actionsPAi.${nextActionIndex}.description`, "");
                                  setValue(`actionsPAi.${nextActionIndex}.edit`, false);
                                }
                                console.log(getValues("actionsPAi"));
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

    // const onSubmitCreate = () => {
    //     const actions = getValues("actionsPAi") || [];
    //     setValue("actionsPAi", actions.concat({ action: actions.length + 1, description: "", index: actions.length, id: actions.length + 1 , edit: false , idAcc:uuidv4() }));
    // };

    const onSubmitCreate = () => {
        const actions = getValues("actionsPAi") || [];
        const newIndex = actions.length + 1;
    
        const existingItem = actions.find((action) => action.index === newIndex - 1);
    
        if (!existingItem) {
            const newAction = { action: newIndex, description: "", index: newIndex - 1, id: newIndex, edit: false, idAcc: uuidv4() };
            setValue("actionsPAi", [...actions, newAction]);
        }
    };



    useEffect(() => {
        setDisableTempBtn(false);
        const actions = getValues("actionsPAi");
        const actionsIndicators = actions?.filter(action => action.indicators?.length == 0);
        if (actions?.length > 0) {
            setDisableTempBtn(true);
            setDisableSaveButton(true);
            if (actionsIndicators?.length != 0) {
                setDisableSaveButton(false);
            }
        } else {
            setDisableSaveButton(true);
            setDisableTempBtn(false);
        }
    }, [getValues("actionsPAi")])

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

    useEffect(() => {
        const actions = getValues("actionsPAi");
        const actionsIndicators = actions?.filter(action => action.indicators?.length == 0);
        if (actions?.length > 0) {
            setDisableTempBtn(true);
            setDisableSaveButton(true);
            if (actionsIndicators.length == 0) {
                setDisableSaveButton(false);
            }
        } else {
            setDisableSaveButton(true);
            setDisableTempBtn(false);
        }
        setActionCancel(() => onCancel)
        setTempButtonText("Guardar temporalmente");
        setSaveButtonText("Guardar y regresar");
    }, [IndicatorsFormComponent])

    useEffect(() => {
        if ((!isValid) === disableSaveButton || IndicatorsFormComponent) return;
        setDisableSaveButton(!isValid);
    }, [isValid, disableSaveButton]);

    return {
        errors,
        fields,
        getValues,
        append,
        view,
        riskText,
        formAction,
        namePAIData,
        onSubmitCreate,
        createPlanActionColumns,
        riskFields,
        appendRisk,
        riskPAIData,
        getFieldState,
        register,
        yearsArray,
        control,
        onSubmitEdit,
        setValue,
        cancelAction,
        createPlanActionActions,
        PAIData,
        setMessage,
        removeLine,
        removeRisk
    };
}