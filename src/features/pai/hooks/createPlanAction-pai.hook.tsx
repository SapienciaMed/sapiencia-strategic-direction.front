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
    const [riskPAIData, setRiskPAIData] = useState<IDropdownProps[]>(null);
    const [namePAIData, setNamePAIData] = useState<IDropdownProps[]>(null);
    const [objectivePAIData, setObjectivePAIData] = useState<IDropdownProps[]>(null);
    const [processPAIData, setProcessPAIData] = useState<IDropdownProps[]>(null);
    const [projectsPAIData, setProjectsPAIData] = useState<IDropdownProps[]>(null);
    const [projectsData, setProjectsData] = useState<IProject[]>(null);
    const [view, setView] = useState<boolean>(false);
    const [loadData, setLoadData] = useState<boolean>(false);
    const [riskText, setRiskText] = useState<string>("");

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
        IndicatorsFormComponent
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
        const subscription = watch((value: ICreatePlanAction) => setPAIData(prev => {
            return { ...prev, ...value }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);


    useEffect(() => {
        if (Number(idPAI) && status === "edit") {
            GetPAIById(Number(idPAI))
                .then((response) => {
                    if (response.operation.code === EResponseCodes.OK) {
                        const res = response.data;
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
                        }, 1000);
                        setValue("id", res.id);
                        setPAIData({...res, actionsPAi: actions});
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

    const { fields, append } = useFieldArray({
        control,
        name: "linePAI",
    });

    const { fields: riskFields, append: appendRisk } = useFieldArray({
        control,
        name: "risksPAI",
    });


    const idType = watch("typePAI")

    useEffect(() => {
        setValue("namePAI", null)
        if (loadData) {
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
                setIndicatorsFormComponent(<IndicatorsPaiPage actionId={row?.id | row.action} updatePAIForm={updatePAIForm} />);
            }

        },
        {
            icon: "Detail",
            onClick: (row) => {
                setIndicatorsFormComponent(<ActionListPaiPage actionId={row?.id | row.action} control={control} register={register} errors={errors} />);
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
                                setValue("actionsPAi", valueAction)
                                setPAIData(prev => {
                                    return {
                                        ...prev, actionsPAi: valueAction,
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

    const onSubmitCreate = () => {
        const actions = getValues("actionsPAi") || [];
        setValue("actionsPAi", actions.concat({ action: actions.length + 1, description: "", index: actions.length + 1, id: actions.length + 1 }));
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
        PAIData
    };
}