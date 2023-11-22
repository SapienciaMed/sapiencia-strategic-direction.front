import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { IActivitiesForm, IActivityMGA, IBudgetMGAYear } from "../interfaces/ProjectsInterfaces";
import { ProjectsContext } from "../contexts/projects.context";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { activitiesValidator, activityMGAValidator } from "../../../common/schemas";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent, InputInplaceComponent, InputNumberInplaceComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle, AiOutlineDownload } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
import { useStagesService } from "../hooks/stages-service.hook";
import { useComponentsService } from "../hooks/components-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { formaterNumberToCurrency } from "../../../common/utils/helpers";
import { useWidth } from "../../../common/hooks/use-width";
import { IBudgets } from "../interfaces/BudgetsInterfaces";
import { useBudgetsService } from "../hooks/budgets-service.hook";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function ActivitiesComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const [stagesData, setStagesData] = useState<IDropdownProps[]>([]);
    const [activitiesData, setActivitiesData] = useState<IActivitiesForm>(null);
    const [budgetsData, setBudgetsData] = useState(null);
    const { setProjectData,
        projectData,
        setTextContinue,
        setActionCancel,
        setActionContinue,
        setShowCancel,
        setDisableContinue,
        formAction,
        setDisableStatusUpdate } = useContext(ProjectsContext);
    const { GetStages } = useStagesService();
    const { setMessage, authorization } = useContext(AppContext);
    const resolver = useYupValidationResolver(activitiesValidator);
    const { width } = useWidth();
    const {
        getValues,
        setValue,
        formState: { isValid },
        watch,
        trigger
    } = useForm<IActivitiesForm>({
        resolver, mode: "all", defaultValues: {
            activities: projectData?.preparation?.activities?.activities ? projectData.preparation.activities.activities : null
        }
    });
    const onCancel = () => {
        setMessage({
            title: "Cancelar actividad",
            description: "¿Deseas cancelar la creación de la actividad?",
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
            description: "¿Desea cancelar los cambios de la actividad?",
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
    const changeActivities = (data: IActivityMGA, row?: IActivityMGA) => {
        const activityData = {
            ...data, budgetsMGA: {
                year0: {
                    validity: data.budgetsMGA.year0.validity || 0,
                    budget: data.budgetsMGA.year0.budget || 0,
                },
                year1: {
                    validity: data.budgetsMGA.year1.validity || 0,
                    budget: data.budgetsMGA.year1.budget || 0,
                },
                year2: {
                    validity: data.budgetsMGA.year2.validity || 0,
                    budget: data.budgetsMGA.year2.budget || 0,
                },
                year3: {
                    validity: data.budgetsMGA.year3.validity || 0,
                    budget: data.budgetsMGA.year3.budget || 0,
                },
                year4: {
                    validity: data.budgetsMGA.year4.validity || 0,
                    budget: data.budgetsMGA.year4.budget || 0,
                },
            }
        }
        if (row) {
            const activitiesData = getValues("activities").filter(item => item !== row).concat(activityData).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA));
            setValue("activities", activitiesData);
            setActivitiesData(prev => {
                return { ...prev, activities: activitiesData };
            });
        } else {
            const activitiesData = getValues("activities");
            setValue("activities", activitiesData ? activitiesData.concat(activityData).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA)) : [activityData]);
            setActivitiesData(prev => {
                return { ...prev, activities: activitiesData ? activitiesData.concat(activityData).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA)) : [activityData] };
            });
        }
        trigger("activities");
    };

    const activitiesColumns: ITableElement<IActivityMGA>[] = [
        {
            fieldName: "objetiveActivity",
            header: "Objetivo específico",
            renderCell: (row) => {
                return <>{row.objetiveActivity.consecutive}. {row.objetiveActivity.description}</>
            }
        },
        {
            fieldName: "productMGA",
            header: "Producto MGA",
            renderCell: (row) => {
                return <>{row.productMGA}. {row.productDescriptionMGA}</>
            }
        },
        {
            fieldName: "stageActivity",
            header: "Etapa",
            renderCell: (row) => {
                const stage = stagesData.find(stage => stage.value === row.stageActivity) || null;
                return <>{stage.name}</>
            }
        },
        {
            fieldName: "activityMGA",
            header: "Actividad MGA",
            renderCell: (row) => {
                return <>{row.activityMGA}. {row.activityDescriptionMGA}</>
            }
        },
        {
            fieldName: "budgetsMGA.year0",
            header: "Año 0",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.budgetsMGA.year0.budget)}</>
            }
        },
        {
            fieldName: "budgetsMGA.year1",
            header: "Año 1",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.budgetsMGA.year1.budget)}</>
            }
        },
        {
            fieldName: "budgetsMGA.year2",
            header: "Año 2",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.budgetsMGA.year2.budget)}</>
            }
        },
        {
            fieldName: "budgetsMGA.year3",
            header: "Año 3",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.budgetsMGA.year3.budget)}</>
            }
        },
        {
            fieldName: "budgetsMGA.year4",
            header: "Año 4",
            renderCell: (row) => {
                return <>{formaterNumberToCurrency(row.budgetsMGA.year4.budget)}</>
            }
        },
        {
            fieldName: "",
            header: "Presupuesto",
            renderCell: (row) => {
                const suma = row.budgetsMGA.year0.budget + row.budgetsMGA.year1.budget + row.budgetsMGA.year2.budget + row.budgetsMGA.year3.budget + row.budgetsMGA.year4.budget;
                return <>{formaterNumberToCurrency(suma)}</>
            }
        },
    ];

    const activitiesActions: ITableAction<IActivityMGA>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                setForm(<ActivityMGAComponent setForm={setForm} returnData={(data: IActivityMGA, row?: IActivityMGA) => { }} item={row} view />);
                setTextContinue("Aceptar");
                setShowCancel(false);
                setActionCancel(() => onCancel);
            }
        },
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<ActivityMGAComponent setForm={setForm} returnData={changeActivities} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancelEdit);
            }
        }
    ];

    useEffect(() => {
        if (isValid && formAction === "new") {
            enableNext();
        } else if (!isValid && formAction === "new") {
            disableNext();
        } else if (isValid && formAction === "edit") {
            enableNext();
            setDisableContinue(false);
        } else {
            setDisableContinue(true);
        }
        setDisableStatusUpdate(!isValid);
    }, [isValid]);

    useEffect(() => {
        const subscription = watch((value: IActivitiesForm) => setActivitiesData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (activitiesData) setProjectData(prev => {
            const preparation = prev ? { ...prev.preparation, activities: { ...activitiesData } } : { activities: { ...activitiesData } };
            return { ...prev, preparation: { ...preparation } };
        })
    }, [activitiesData]);

    useEffect(() => {
        GetStages().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.description, value: data.id }
                })
                setStagesData(data);
            }
        });
    }, []);

    const activities = getValues('activities');

    useEffect(() => {
        if (activities?.length !== 0) {
            let budget0 = 0;
            let budget1 = 0;
            let budget2 = 0;
            let budget3 = 0;
            let budget4 = 0;
            activities?.forEach(activity => {
                budget0 += activity.budgetsMGA.year0.budget;
                budget1 += activity.budgetsMGA.year1.budget;
                budget2 += activity.budgetsMGA.year2.budget;
                budget3 += activity.budgetsMGA.year3.budget;
                budget4 += activity.budgetsMGA.year4.budget;
            });
            setBudgetsData({
                year0: budget0,
                year1: budget1,
                year2: budget2,
                year3: budget3,
                year4: budget4,
            });
        }
    }, [activities]);
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div className="title-area">
                    <label className="text-black large bold text-required">
                        Cadena de valor MGA
                    </label>


                    <div className={activities?.length > 0 && "strategic-direction-grid-1 strategic-direction-grid-2-web"} style={{ justifyItems: "end" }}>
                        {activities?.length > 0 && <div className="title-button text-main large" onClick={async () => {
                            const token = localStorage.getItem("token");
                            const response = await fetch(`${process.env.urlApiStrategicDirection}/api/v1/activities/generate-consolidated`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    permissions: authorization.encryptedAccess,
                                    authorization: `Bearer ${token}`
                                },
                                body: JSON.stringify(getValues())
                            });
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            const fechaActual = new Date();
                            const dia = fechaActual.getDate().toString().padStart(2, '0');
                            const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
                            const anio = fechaActual.getFullYear();
                            a.download = `Consolidado actividades_${dia}${mes}${anio}.xlsx`;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                        }}>
                            Descargar consolidado <AiOutlineDownload />
                        </div>}
                        <div className="title-button text-main large" onClick={() => {
                            setForm(<ActivityMGAComponent setForm={setForm} returnData={changeActivities} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir actividad <AiOutlinePlusCircle />
                        </div>
                    </div>
                </div>
                {stagesData?.length > 0 && activities?.length > 0 && <TableExpansibleComponent widthTable={`${(width * 0.0149) + 40}vw`} actions={activitiesActions} columns={activitiesColumns} data={activities} horizontalScroll />}
                {stagesData?.length > 0 && activities?.length > 0 && budgetsData && <div className="card-table">
                    <div className="strategic-direction-total-cost">
                        <div className="row-budget">
                            <span className="text-black biggest bold text-center">Total presupuesto</span>
                            <span className="text-black big text-center"></span>
                        </div>
                        <div className="row-budget">
                            <span className="text-black biggest text-center">Año 0</span>
                            <span className="text-black big text-center">{formaterNumberToCurrency(budgetsData.year0)}</span>
                        </div>
                        <div className="row-budget">
                            <span className="text-black biggest text-center">Año 1</span>
                            <span className="text-black big text-center">{formaterNumberToCurrency(budgetsData.year1)}</span>
                        </div>
                        <div className="row-budget">
                            <span className="text-black biggest text-center">Año 2</span>
                            <span className="text-black big text-center">{formaterNumberToCurrency(budgetsData.year2)}</span>
                        </div>
                        <div className="row-budget">
                            <span className="text-black biggest text-center">Año 3</span>
                            <span className="text-black big text-center">{formaterNumberToCurrency(budgetsData.year3)}</span>
                        </div>
                        <div className="row-budget">
                            <span className="text-black biggest text-center">Año 4</span>
                            <span className="text-black big text-center">{formaterNumberToCurrency(budgetsData.year4)}</span>
                        </div>
                    </div>
                </div>}
            </FormComponent>
        </div>
    );
}

interface IActivityMGAObjectives {
    returnData: (data: IActivityMGA, item?: IActivityMGA) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: IActivityMGA;
    view?: boolean;
}

interface IBudgetsTable {
    year: number;
    validity: number;
    budget: number;
}

function ActivityMGAComponent({ returnData, setForm, item, view }: IActivityMGAObjectives): React.JSX.Element {
    const { setMessage } = useContext(AppContext);
    const [totalCostCalculate, setTotalCostCalculate] = useState<number>(0);
    const [pospreData, setPospreData] = useState<IBudgets[]>([]);
    const [cpcData, setCpcData] = useState<IDropdownProps[]>([]);
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const [stagesData, setStagesData] = useState<IDropdownProps[]>([]);
    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const { getListByGrouper } = useGenericListService();
    const { GetStages } = useStagesService();
    const { GetComponents } = useComponentsService();
    const { GetAllBudgets } = useBudgetsService();
    const resolver = useYupValidationResolver(activityMGAValidator);
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue, setShowCancel } = useContext(ProjectsContext);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        getValues
    } = useForm<IActivityMGA>({
        resolver, mode: "all", defaultValues: {
            activityDescriptionMGA: item?.activityDescriptionMGA ? item.activityDescriptionMGA : "",
            activityMGA: item?.activityMGA ? item.activityMGA : "",
            budgetsMGA: item?.budgetsMGA ? item.budgetsMGA : null,
            detailActivities: item?.detailActivities ? item.detailActivities.map(detail => {
                return { ...detail, totalCost: formaterNumberToCurrency(detail.amount * detail.unitCost) }
            }) : null,
            objetiveActivity: item?.objetiveActivity ? item.objetiveActivity : null,
            productDescriptionMGA: item?.productDescriptionMGA ? item.productDescriptionMGA : "",
            productMGA: item?.productMGA ? item.productMGA : "",
            stageActivity: item?.stageActivity ? item.stageActivity : null,
            validity: item?.validity ? item.validity : null,
            year: item?.year !== undefined && item.year !== null ? item.year : null,
            objectiveSelect: item?.objetiveActivity ? item.objetiveActivity.consecutive : null
        }
    });
    const validityRequired = control._formValues.detailActivities?.length > 0;
    const objectiveSelect = watch('objectiveSelect');

    const { fields, append } = useFieldArray({
        control,
        name: "detailActivities",
    });

    let suma = item || view ? 0 : 1;

    const objectives: IDropdownProps[] = projectData.identification.problemDescription.causes.map((cause) => {
        return {
            name: `${cause.consecutive}. ${cause.description}`,
            value: cause.consecutive
        }
    });

    const yearsData: IDropdownProps[] = [
        {
            name: "0",
            value: 0
        },
        {
            name: "1",
            value: 1
        },
        {
            name: "2",
            value: 2
        },
        {
            name: "3",
            value: 3
        },
        {
            name: "4",
            value: 4
        },
    ];

    const onSubmit = handleSubmit(async (data: IActivityMGA) => {

        if (validityRequired) {
            const { validityOfOffBudget, budgetForValidityYear } = validateActivitiesBudget(data);
            if (!budgetForValidityYear) {
                return setMessage({
                    title: "Validación presupuestos",
                    description: `No existe un año con la vigencia ${validityOfOffBudget} en la actividad MGA.`,
                    show: true,
                    background: true,
                    OkTitle: "Cerrar",
                    onOk: () => {
                        setMessage({});
                    }
                })
            }
        }

        if (view) {
            setForm(null);
            setTextContinue(null);
            setActionCancel(null);
            setActionContinue(null);
            setMessage({});
            setDisableContinue(true);
            setShowCancel(true);
        } else {
            setMessage({
                title: item ? "Guardar cambios" : "Crear actividad",
                description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar la actividad?",
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
                        title: item ? "Guardar cambios" : "Actividad",
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
                            validateActivitiesBudget(data);
                        }
                    })
                }
            });
        }

    });

    const validateActivitiesBudget = (activity: IActivityMGA) => {
        let yearOfOffBudget: number;
        let budgetForValidityYear: IBudgetMGAYear;
        let validationType: "minor" | "major";
        let validationResult = false;
        const validityOfOffBudget = activity?.validity;
        for (let i in activity.budgetsMGA) {
            if (Number(activity.budgetsMGA[i].validity) === validityOfOffBudget) {
                budgetForValidityYear = activity.budgetsMGA[i]
                yearOfOffBudget = Number(i.replace("year", ""));
            }
        }
        activity.detailActivities.forEach(detailActivitie => {
            const totalCost = detailActivitie.unitCost * detailActivitie.amount;
            if (totalCost > budgetForValidityYear?.budget || totalCost < budgetForValidityYear?.budget) {
                validationResult = true;
                validationType = totalCost > budgetForValidityYear?.budget ? "major" : "minor";
            }
        });

        if (validationResult) {
            setMessage({
                title: "Validación presupuestos",
                description: `El costo total de las actividades detalladas para el año ${yearOfOffBudget} y vigencia ${validityOfOffBudget} es ${validationType == "major" ? "mayor" : "menor"} que los de la actividad MGA.`,
                show: true,
                background: true,
                OkTitle: "Cerrar",
                onOk: () => {
                    setMessage({});
                }
            })
        }

        return { budgetForValidityYear, validationResult, validationType, validityOfOffBudget, yearOfOffBudget };

    }

    const budgetsYears = {
        0: "budgetsMGA.year0.budget",
        1: "budgetsMGA.year1.budget",
        2: "budgetsMGA.year2.budget",
        3: "budgetsMGA.year3.budget",
        4: "budgetsMGA.year4.budget",
    }

    const validitiesYears = {
        0: "budgetsMGA.year0.validity",
        1: "budgetsMGA.year1.validity",
        2: "budgetsMGA.year2.validity",
        3: "budgetsMGA.year3.validity",
        4: "budgetsMGA.year4.validity",
    }

    const budgetsData: IBudgetsTable[] = [
        {
            year: 0,
            budget: getValues("budgetsMGA.year0.budget"),
            validity: getValues("budgetsMGA.year0.validity"),
        },
        {
            year: 1,
            budget: getValues("budgetsMGA.year1.budget"),
            validity: getValues("budgetsMGA.year1.validity"),
        },
        {
            year: 2,
            budget: getValues("budgetsMGA.year2.budget"),
            validity: getValues("budgetsMGA.year2.validity"),
        },
        {
            year: 3,
            budget: getValues("budgetsMGA.year3.budget"),
            validity: getValues("budgetsMGA.year3.validity"),
        },
        {
            year: 4,
            budget: getValues("budgetsMGA.year4.budget"),
            validity: getValues("budgetsMGA.year4.validity"),
        },
    ]

    const budgetsColumns: ITableElement<IBudgetsTable>[] = [
        {
            fieldName: "year",
            header: "Año",
        },
        {
            fieldName: "validity",
            header: "Vigencia",
            renderCell: (row) => {
                return (
                    <Controller
                        control={control}
                        name={validitiesYears[row.year]}
                        defaultValue={0}
                        render={({ field }) => {
                            return (
                                <InputInplaceComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="0"
                                    className="input-basic"
                                    typeInput={"number"}
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
        {
            fieldName: "budget",
            header: "Presupuesto",
            renderCell: (row) => {
                return (
                    <InputNumberInplaceComponent
                        idInput={budgetsYears[row.year]}
                        control={control}
                        label="$ 0"
                        errors={errors}
                        className="inputNumber-basic"
                        mode="currency"
                        currency="COP"
                        locale="es-CO"
                        minFractionDigits={2}
                    />
                )
            }
        }
    ];

    useEffect(() => {
        setActionContinue(() => onSubmit);
        getListByGrouper("UNIDAD_MEDIDA_OBJETIVOS").then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.itemDescription, value: Number(data.itemCode) }
                })
                setMeasurementData(data);
            }
        });
        GetComponents().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.description, value: data.id }
                })
                setComponentsData(data);
            }
        });
        GetStages().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.description, value: data.id }
                })
                setStagesData(data);
            }
        });
        GetAllBudgets().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setPospreData(response.data);
            }
        }).catch(err => console.log(err));
        setTotalCostCalculate(_prev => {
            let count = 0;
            getValues("detailActivities").forEach(item => {
                count += item.amount * item.unitCost;
            });
            return count;
        });
        return () => {
            setForm(null);
        }
    }, []);
    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);
    useEffect(() => {
        if (objectiveSelect) {
            if (item) {
                setValue("objetiveActivity", projectData.identification.problemDescription.causes.find(cause => cause.consecutive == objectiveSelect));
                if (objectiveSelect === item.objetiveActivity.consecutive) {
                    setValue("productMGA", item.productMGA);
                    setValue("activityMGA", item.activityMGA);
                    fields.forEach((_item, index) => {
                        setValue(`detailActivities.${index}.consecutive`, `${item.activityMGA}.${index + 1}`)
                    })
                } else {
                    suma++;
                    const productCount = projectData?.preparation?.activities?.activities ? projectData.preparation.activities.activities.filter(activity => activity.objetiveActivity.consecutive === objectiveSelect).length : 0;
                    setValue("productMGA", `${objectiveSelect}.${productCount + suma}`);
                    setValue("activityMGA", `${objectiveSelect}.${productCount + suma}.${productCount + suma}`);
                    fields.forEach((_item, index) => {
                        setValue(`detailActivities.${index}.consecutive`, `${objectiveSelect}.${productCount + suma}.${productCount + suma}.${index + 1}`)
                    })
                }
            } else {
                setValue("objetiveActivity", projectData.identification.problemDescription.causes.find(cause => cause.consecutive == objectiveSelect));
                const productCount = projectData?.preparation?.activities?.activities ? projectData.preparation.activities.activities.filter(activity => activity.objetiveActivity.consecutive === objectiveSelect).length : 0;
                setValue("productMGA", `${objectiveSelect}.${productCount + suma}`);
                setValue("activityMGA", `${objectiveSelect}.${productCount + suma}.${productCount + suma}`);
                fields.forEach((_item, index) => {
                    setValue(`detailActivities.${index}.consecutive`, `${objectiveSelect}.${productCount + suma}.${productCount + suma}.${index + 1}`)
                })
            }
        } else {
            setValue("productMGA", "");
            setValue("activityMGA", "");
        }
    }, [objectiveSelect]);
    return (
        <FormComponent action={undefined} className="card-table">
            {view && <p className="text-black large bold">Detalle actividad MGA</p>}
            {!view && <p className="text-black large bold">{item ? "Editar actividad MGA" : "Agregar actividad MGA"}</p>}
            <div className="strategic-direction-grid-1">
                <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                    <SelectComponent
                        control={control}
                        idInput={"objectiveSelect"}
                        className={`select-basic span-width ${view && "background-textArea"}`}
                        label="Objetivo específco"
                        classNameLabel="text-black biggest bold text-required"
                        data={objectives}
                        errors={errors}
                        filter={true}
                        disabled={view}
                    />
                    <SelectComponent
                        control={control}
                        idInput={"stageActivity"}
                        className={`select-basic span-width ${view && "background-textArea"}`}
                        label="Etapa"
                        classNameLabel="text-black biggest bold text-required"
                        data={stagesData}
                        errors={errors}
                        filter={true}
                        disabled={view}
                    />
                    <Controller
                        control={control}
                        name={"productMGA"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="No. producto MGA"
                                    className="input-basic background-textArea"
                                    classNameLabel="text-black biggest bold text-required"
                                    typeInput={"text"}
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                    disabled
                                />
                            );
                        }}
                    />
                </div>
                <Controller
                    control={control}
                    name={"activityMGA"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="No. actividad MGA"
                                className="input-basic background-textArea"
                                classNameLabel="text-black biggest bold text-required"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled
                            />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"productDescriptionMGA"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción producto MGA"
                                classNameLabel="text-black biggest bold text-required"
                                className={`text-area-basic ${view && "background-textArea"}`}
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={500}
                                disabled={view}
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"activityDescriptionMGA"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción actividad MGA"
                                classNameLabel="text-black biggest bold text-required"
                                className={`text-area-basic ${view && "background-textArea"}`}
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={600}
                                disabled={view}
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold text-required">
                            Añadir Presupuesto
                        </label>
                    </div>
                    <TableExpansibleComponent columns={budgetsColumns} data={budgetsData} hidePagination />
                </div>
                <div className="card-table">
                    <div className="title-area">
                        <label className="text-black large bold">
                            {!view && item ? "Editar actividades detalladas" : "Actividades detalladas"}
                        </label>

                        {!view && <div className="title-button text-main large" onClick={() => {
                            const consecutive = `${getValues("activityMGA")}.${fields.length + 1}`;
                            append({
                                consecutive: consecutive,
                                detailActivity: "",
                                component: null,
                                measurement: null,
                                amount: null,
                                unitCost: null
                            });
                        }}>
                            Añadir actividad detallada <AiOutlinePlusCircle />
                        </div>}
                    </div>
                    <div className="strategic-direction-grid-1">
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                            <Controller
                                control={control}
                                name={"validity"}
                                defaultValue={null}
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Vigencia"
                                            className={`input-basic ${view && "background-textArea"}`}
                                            classNameLabel={`text-black biggest bold ${validityRequired && "text-required"}`}
                                            typeInput={"number"}
                                            register={register}
                                            onChange={field.onChange}
                                            errors={errors}
                                            disabled={view}
                                        />
                                    );
                                }}
                            />
                            <SelectComponent
                                control={control}
                                idInput={"year"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Año"
                                classNameLabel={`text-black biggest bold ${validityRequired && "text-required"}`}
                                data={yearsData}
                                errors={errors}
                                filter={true}
                                disabled={view}
                            />
                        </div>
                        {fields.map((item, index) => {
                            return (
                                <div className="card-table strategic-direction-grid-1" key={item.id}>
                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                        <Controller
                                            control={control}
                                            name={`detailActivities.${index}.consecutive`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                return (
                                                    <InputComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label="No. actividad detallada"
                                                        className="input-basic background-textArea"
                                                        classNameLabel="text-black biggest bold text-required"
                                                        typeInput={"text"}
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        disabled
                                                        fieldArray
                                                    />
                                                );
                                            }}
                                        />
                                    </div>
                                    <Controller
                                        control={control}
                                        name={`detailActivities.${index}.detailActivity`}
                                        defaultValue=""
                                        render={({ field }) => {
                                            const isEmpty = getValues(`detailActivities.${index}.detailActivity`) === "";
                                            const isOverLimit = getValues(`detailActivities.${index}.detailActivity`).length > 500;
                                            return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Descripción actividad detallada"
                                                classNameLabel="text-black biggest bold text-required"
                                                className={`text-area-basic ${view && "background-textArea"} ${isEmpty ? "undefined error" : ""} ${isOverLimit ? "undefined error" : ""} `}
                                                placeholder="Escribe aquí"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                characters={500}
                                                fieldArray
                                                disabled={view}
                                            >
                                                {isEmpty && <p className="error-message bold not-margin-padding">El campo es obligatorio</p>}
                                                {isOverLimit && <p className="error-message bold not-margin-padding">Solo se permiten 500 caracteres</p>}
                                            </TextAreaComponent>
                                            );
                                        }}
                                    />

                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                    <Controller
                                            control={control}
                                            name={`detailActivities.${index}.component`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                const selectedComponent = getValues(`detailActivities.${index}.component`);
                                                const isEmptyComponent = selectedComponent == null;
                                                return (
                                                    <SelectComponent
                                                    control={control}
                                                    idInput={`detailActivities.${index}.component`}
                                                    className={`select-basic span-width ${view && "background-textArea"} ${isEmptyComponent ? "undefined error" : ""}`}
                                                    label="Componente"
                                                    classNameLabel="text-black biggest bold text-required"
                                                    data={componentsData}
                                                    errors={errors}
                                                    fieldArray
                                                    filter={true}
                                                    disabled={view}>
                                                
                                                    {isEmptyComponent && <p className="error-message bold not-margin-padding">Debe seleccionar una opción</p>}
                                                </SelectComponent>
                                                );
                                            }}
                                        />

                                        <Controller
                                            control={control}
                                            name={`detailActivities.${index}.measurement`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                const selectedMeasurement= getValues(`detailActivities.${index}.measurement`);
                                                const isEmptyMeasurement = selectedMeasurement == null;
                                                return (
                                                    <SelectComponent
                                                    control={control}
                                                    idInput={`detailActivities.${index}.measurement`}
                                                    className={`select-basic span-width ${view && "background-textArea"} ${isEmptyMeasurement ? "undefined error" : ""}`}
                                                    label="Unidad de medida"
                                                    classNameLabel="text-black biggest bold text-required"
                                                    data={measurementData}
                                                    errors={errors}
                                                    fieldArray
                                                    filter={true}
                                                    disabled={view}>
                                                
                                                    {isEmptyMeasurement && <p className="error-message bold not-margin-padding">Debe seleccionar una opción</p>}
                                                </SelectComponent>
                                                );
                                            }}
                                        />
                                        
                                        <Controller
                                            control={control}
                                            name={`detailActivities.${index}.amount`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                const selectedAmount = getValues(`detailActivities.${index}.amount`);
                                                const isEmptyAmount = selectedAmount == null;
                                                return (
                                                    <InputNumberComponent
                                                        idInput={`detailActivities.${index}.amount`}
                                                        control={control}
                                                        label="Cantidad"
                                                        errors={errors}
                                                        classNameLabel="text-black biggest bold text-required"
                                                        className={`inputNumber-basic ${view && "background-textArea"} ${isEmptyAmount ? "undefined error" : ""}`}
                                                        onChange={() => {
                                                            setValue(`detailActivities.${index}.totalCost`, formaterNumberToCurrency(getValues(`detailActivities.${index}.unitCost`) * getValues(`detailActivities.${index}.amount`)));
                                                            setTotalCostCalculate(_prev => {
                                                                let count = 0;
                                                                getValues("detailActivities").forEach(item => {
                                                                    count += item.amount * item.unitCost;
                                                                });
                                                                return count;
                                                            });
                                                        }}
                                                        fieldArray
                                                        disabled={view}
                                                    >
                                                    {isEmptyAmount && <p className="error-message bold not-margin-padding">El campo es obligatorio</p>}
                                                </InputNumberComponent>
                                                );
                                            }}
                                        />
                                        
                                       
                                    </div>
                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">

                                    <Controller
                                            control={control}
                                            name={`detailActivities.${index}.measurement`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                const selectedUnit = getValues(`detailActivities.${index}.unitCost`);
                        
                                                const isEmptyUnit = selectedUnit == null;
                                                return (
                                                    <InputNumberComponent
                                                        idInput={`detailActivities.${index}.unitCost`}
                                                        control={control}
                                                        label="Costo unitario"
                                                        errors={errors}
                                                        classNameLabel="text-black biggest bold text-required"
                                                        className={`inputNumber-basic ${view && "background-textArea"} ${isEmptyUnit ? "undefined error" : ""}`}
                                                        mode="currency"
                                                        currency="COP"
                                                        locale="es-CO"
                                                        minFractionDigits={2}
                                                        onChange={() => {
                                                            setValue(`detailActivities.${index}.totalCost`, formaterNumberToCurrency(getValues(`detailActivities.${index}.unitCost`) * getValues(`detailActivities.${index}.amount`)));
                                                            setTotalCostCalculate(_prev => {
                                                                let count = 0;
                                                                getValues("detailActivities").forEach(item => {
                                                                    count += item.amount * item.unitCost;
                                                                });
                                                                return count;
                                                            });
                                                        }}
                                                        fieldArray
                                                        disabled={view}
                                                    >
                                                        {isEmptyUnit && <p className="error-message bold not-margin-padding">El campo es obligatorio</p>} 
                                                    </InputNumberComponent>
                                                );
                                            }}
                                        />
                                        <InputComponent
                                            idInput={`detailActivities.${index}.totalCost`}
                                            label="Costo total"
                                            className="input-basic background-textArea"
                                            classNameLabel="text-black biggest bold"
                                            typeInput={"text"}
                                            register={register}
                                            errors={errors}
                                            disabled
                                            fieldArray
                                        />
                                        <SelectComponent
                                            control={control}
                                            idInput={`detailActivities.${index}.pospre`}
                                            className={`select-basic span-width ${view && "background-textArea"}`}
                                            label="Objeto de gasto POSPRE"
                                            classNameLabel="text-black biggest bold"
                                            data={pospreData.length > 0 ? pospreData.map(pospre => {
                                                return {
                                                    name: `${pospre.number} - ${pospre.description}`,
                                                    value: pospre.id
                                                }
                                            }) : []}
                                            errors={errors}
                                            fieldArray
                                            filter={true}
                                            disabled={view}
                                            onChange={() => {
                                                setValue(`detailActivities.${index}.clasificatorCPC`, null);
                                                setValue(`detailActivities.${index}.sectionValidatorCPC`, "No");
                                                const pospreItem = pospreData.find(item => item.id === getValues(`detailActivities.${index}.pospre`));
                                                if (pospreItem?.productClassifications?.length > 0) {
                                                    setValue(`detailActivities.${index}.validatorCPC`, "Si");
                                                    setCpcData(pospreItem.productClassifications.map(cpc => {
                                                        return {
                                                            name: `${cpc.number} - ${cpc.description}`,
                                                            value: cpc.id
                                                        }
                                                    }));
                                                } else {
                                                    setValue(`detailActivities.${index}.validatorCPC`, "No");
                                                    setCpcData([]);
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                        <Controller
                                            control={control}
                                            name={`detailActivities.${index}.validatorCPC`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                return (
                                                    <InputComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label="Validador CPC"
                                                        className="input-basic background-textArea"
                                                        classNameLabel="text-black biggest bold"
                                                        typeInput={"text"}
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        disabled
                                                        fieldArray
                                                    />
                                                );
                                            }}
                                        />
                                        <SelectComponent
                                            control={control}
                                            idInput={`detailActivities.${index}.clasificatorCPC`}
                                            className="select-basic span-width background-textArea"
                                            label="Clasificador CPC"
                                            classNameLabel="text-black biggest bold"
                                            data={cpcData}
                                            errors={errors}
                                            disabled={cpcData.length === 0}
                                            filter={true}
                                            onChange={() => {
                                                const validatorCPCItem = getValues(`detailActivities.${index}.validatorCPC`);
                                                setValue(`detailActivities.${index}.sectionValidatorCPC`, "No");
                                                if (validatorCPCItem !== null && validatorCPCItem !== undefined) {
                                                    setValue(`detailActivities.${index}.sectionValidatorCPC`, "Si");
                                                } else {
                                                    setValue(`detailActivities.${index}.sectionValidatorCPC`, "No");
                                                }
                                            }}
                                            fieldArray
                                        />
                                        <Controller
                                            control={control}
                                            name={`detailActivities.${index}.sectionValidatorCPC`}
                                            defaultValue={null}
                                            render={({ field }) => {
                                                return (
                                                    <InputComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label="Validador sección CPC"
                                                        className="input-basic background-textArea"
                                                        classNameLabel="text-black biggest bold"
                                                        typeInput={"text"}
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        disabled
                                                        fieldArray
                                                    />
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                        <div className="strategic-direction-grid-2 strategic-direction-activities-total-cost" style={{ alignItems: "center" }}>
                            <label className="text-black large bold">Costo total actividades detalladas:</label>
                            <label className="text-main large bold" style={{ marginLeft: "5px" }}>{formaterNumberToCurrency(totalCostCalculate)}</label>
                        </div>
                    </div>
                </div>
            </div>
        </FormComponent>
    )
}

export default React.memo(ActivitiesComponent);
