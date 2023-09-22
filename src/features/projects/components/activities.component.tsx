import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../common/contexts/app.context";
import { IActivitiesForm, IActivityMGA } from "../interfaces/ProjectsInterfaces";
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

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function ActivitiesComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const [activitiesData, setActivitiesData] = useState<IActivitiesForm>(null)
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(activitiesValidator);
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
            OkTitle: "Continuar",
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
        if (row) {
            const activitiesData = getValues("activities").filter(item => item !== row).concat(data).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA));
            setValue("activities", activitiesData);
            setActivitiesData(prev => {
                return { ...prev, activities: activitiesData };
            });
        } else {
            const activitiesData = getValues("activities");
            setValue("activities", activitiesData ? activitiesData.concat(data).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA)) : [data]);
            setActivitiesData(prev => {
                return { ...prev, activities: activitiesData ? activitiesData.concat(data).sort((a, b) => parseFloat(a.productMGA) - parseFloat(b.productMGA)) : [data] };
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
                return <>$ {row.budgetsMGA.year0.budget}</>
            }
        },
        {
            fieldName: "budgetsMGA.year1",
            header: "Año 1",
            renderCell: (row) => {
                return <>$ {row.budgetsMGA.year1.budget}</>
            }
        },
        {
            fieldName: "budgetsMGA.year2",
            header: "Año 2",
            renderCell: (row) => {
                return <>$ {row.budgetsMGA.year2.budget}</>
            }
        },
        {
            fieldName: "budgetsMGA.year3",
            header: "Año 3",
            renderCell: (row) => {
                return <>$ {row.budgetsMGA.year3.budget}</>
            }
        },
        {
            fieldName: "budgetsMGA.year4",
            header: "Año 4",
            renderCell: (row) => {
                return <>$ {row.budgetsMGA.year4.budget}</>
            }
        },
        {
            fieldName: "",
            header: "Presupuesto",
            renderCell: (row) => {
                const suma = row.budgetsMGA.year0.budget + row.budgetsMGA.year1.budget + row.budgetsMGA.year2.budget + row.budgetsMGA.year3.budget + row.budgetsMGA.year4.budget;
                return <>$ {suma}</>
            }
        },
    ];

    const activitiesActions: ITableAction<IActivityMGA>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                setForm(<ActivityMGAComponent setForm={setForm} returnData={(data: IActivityMGA, row?: IActivityMGA) => { }} item={row} view />);
                setTextContinue("Aceptar");
                setActionCancel(() => onCancel);
            }
        },
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<ActivityMGAComponent setForm={setForm} returnData={changeActivities} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancel);
            }
        }
    ];

    useEffect(() => {
        if (isValid) {
            enableNext();
        } else {
            disableNext();
        }
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

    return (
        <div className="card-table">
            <FormComponent action={undefined}>
                <div className="title-area">
                    <label className="text-black large bold text-required">
                        Cadena de valor MGA
                    </label>


                    <div className={getValues('activities')?.length > 0 && "strategic-direction-grid-1 strategic-direction-grid-2-web"} style={{justifyItems:"end"}}>
                        {getValues('activities')?.length > 0 && <div className="title-button text-main large" onClick={async () => {
                            const response = await fetch(`${process.env.urlApiStrategicDirection}/api/v1/activities/generate-consolidated`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
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
                {getValues('activities')?.length > 0 && <TableExpansibleComponent actions={activitiesActions} columns={activitiesColumns} data={getValues('activities')} />}
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
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const [stagesData, setStagesData] = useState<IDropdownProps[]>([]);
    const [componentsData, setComponentsData] = useState<IDropdownProps[]>([]);
    const { getListByGrouper } = useGenericListService();
    const { GetStages } = useStagesService();
    const { GetComponents } = useComponentsService();
    const resolver = useYupValidationResolver(activityMGAValidator);
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue } = useContext(ProjectsContext);
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
            budgetsMGA: item?.budgetsMGA ? item.budgetsMGA : {
                year0: { budget: 0, validity: 0 },
                year1: { budget: 0, validity: 0 },
                year2: { budget: 0, validity: 0 },
                year3: { budget: 0, validity: 0 },
                year4: { budget: 0, validity: 0 },
            },
            detailActivities: item?.detailActivities ? item.detailActivities : null,
            objetiveActivity: item?.objetiveActivity ? item.objetiveActivity : null,
            productDescriptionMGA: item?.productDescriptionMGA ? item.productDescriptionMGA : "",
            productMGA: item?.productMGA ? item.productMGA : "",
            stageActivity: item?.stageActivity ? item.stageActivity : null,
            validity: item?.validity ? item.validity : null,
            year: item?.year !== undefined && item.year !== null ? item.year : null,
            objectiveSelect: item?.objetiveActivity ? item.objetiveActivity.consecutive : null
        }
    });

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

    const testData: IDropdownProps[] = [
        {
            name: "Prueba",
            value: 1
        }
    ]

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
        if (view) {
            setForm(null);
            setTextContinue(null);
            setActionCancel(null);
            setActionContinue(null);
            setMessage({});
            setDisableContinue(true);
        } else {
            setMessage({
                title: item ? "Editar actividad" : "Crear actividad",
                description: item ? "¿Deseas editar la actividad?" : "¿Deseas guardar la actividad?",
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
                        title: item ? "Editar actividad" : "Crear actividad",
                        description: item ? "¡Actividad editada exitosamente!" : "¡Actividad guardada exitosamente!",
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
        }

    });

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
                    <>
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
                    </>
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
                        minFractionDigits={0}
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
                if (objectiveSelect === item.objectiveSelect) {
                    setValue("productMGA", item.productMGA);
                    setValue("activityMGA", item.activityMGA);
                    fields.forEach((_item, index) => {
                        setValue(`detailActivities.${index}.consecutive`, `${item.activityMGA}.${index + 1}`)
                    })
                } else {
                    suma++;
                    const productCount = projectData?.preparation?.activities?.activities ? projectData.preparation.activities.activities.filter(activity => activity.objectiveSelect === objectiveSelect).length : 0;
                    setValue("productMGA", `${objectiveSelect}.${productCount + suma}`);
                    setValue("activityMGA", `${objectiveSelect}.${productCount + suma}.${productCount + suma}`);
                    fields.forEach((_item, index) => {
                        setValue(`detailActivities.${index}.consecutive`, `${objectiveSelect}.${productCount + suma}.${productCount + suma}.${index + 1}`)
                    })
                }
            } else {
                setValue("objetiveActivity", projectData.identification.problemDescription.causes.find(cause => cause.consecutive == objectiveSelect));
                const productCount = projectData?.preparation?.activities?.activities ? projectData.preparation.activities.activities.filter(activity => activity.objectiveSelect === objectiveSelect).length : 0;
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
    const totalCostCalculate = () => {
        let totalCost = 0
        const detailActivities = getValues("detailActivities");
        if (!detailActivities) return "$ 0"
        detailActivities.forEach(item => {
            totalCost += item.unitCost * item.amount || 0;
        })
        return `$${totalCost}`;
    }
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
                        <label className="text-black large bold text-required">
                            Actividad detallada
                        </label>

                        <div className="title-button text-main large" onClick={() => {
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
                        </div>
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
                                            classNameLabel="text-black biggest bold text-required"
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
                                classNameLabel="text-black biggest bold text-required"
                                data={yearsData}
                                errors={errors}
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
                                            return (
                                                <TextAreaComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    value={`${field.value}`}
                                                    label="Descripción actividad detallada"
                                                    classNameLabel="text-black biggest bold text-required"
                                                    className={`text-area-basic ${view && "background-textArea"}`}
                                                    placeholder="Escribe aquí"
                                                    register={register}
                                                    onChange={field.onChange}
                                                    errors={errors}
                                                    characters={600}
                                                    fieldArray
                                                    disabled={view}
                                                >
                                                </TextAreaComponent>
                                            );
                                        }}
                                    />
                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                        <SelectComponent
                                            control={control}
                                            idInput={`detailActivities.${index}.component`}
                                            className={`select-basic span-width ${view && "background-textArea"}`}
                                            label="Componente"
                                            classNameLabel="text-black biggest bold text-required"
                                            data={componentsData}
                                            errors={errors}
                                            fieldArray
                                            disabled={view}
                                        />
                                        <SelectComponent
                                            control={control}
                                            idInput={`detailActivities.${index}.measurement`}
                                            className={`select-basic span-width ${view && "background-textArea"}`}
                                            label="Unidad de medida"
                                            classNameLabel="text-black biggest bold text-required"
                                            data={measurementData}
                                            errors={errors}
                                            fieldArray
                                            disabled={view}
                                        />
                                        <InputNumberComponent
                                            idInput={`detailActivities.${index}.amount`}
                                            control={control}
                                            label="Cantidad"
                                            errors={errors}
                                            classNameLabel="text-black biggest bold text-required"
                                            className={`inputNumber-basic ${view && "background-textArea"}`}
                                            onChange={() => {
                                                setValue(`detailActivities.${index}.totalCost`, `$ ${getValues(`detailActivities.${index}.unitCost`) * getValues(`detailActivities.${index}.amount`)}`)
                                            }}
                                            fieldArray
                                            disabled={view}
                                        />
                                    </div>
                                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                        <InputNumberComponent
                                            idInput={`detailActivities.${index}.unitCost`}
                                            control={control}
                                            label="Costo unitario"
                                            errors={errors}
                                            classNameLabel="text-black biggest bold text-required"
                                            className={`inputNumber-basic ${view && "background-textArea"}`}
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={0}
                                            onChange={() => {
                                                setValue(`detailActivities.${index}.totalCost`, `$ ${getValues(`detailActivities.${index}.unitCost`) * getValues(`detailActivities.${index}.amount`)}`)
                                            }}
                                            fieldArray
                                            disabled={view}
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
                                            data={testData}
                                            errors={errors}
                                            fieldArray
                                            disabled={view}
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
                                                        typeInput={"number"}
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
                                            data={testData}
                                            errors={errors}
                                            disabled
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
                                                        typeInput={"number"}
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
                            <label className="text-main large bold" style={{ marginLeft: "5px" }}>{totalCostCalculate()}</label>
                        </div>
                    </div>
                </div>
            </div>
        </FormComponent>
    )
}

export default React.memo(ActivitiesComponent);
