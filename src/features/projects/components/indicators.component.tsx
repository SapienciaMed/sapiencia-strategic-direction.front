import React, { useContext, useEffect, useState } from "react";
import { ProjectsContext } from "../contexts/projects.context";
import { AppContext } from "../../../common/contexts/app.context";
import { IIndicator, IIndicatorsForm } from "../interfaces/ProjectsInterfaces";
import { Controller, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { indicatorValidator, indicatorsFormValidator } from "../../../common/schemas";
import { FormComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { useIndicatorsService } from "../hooks/indicators.hook";
import { MasterTable } from "../../../common/interfaces/MasterTableInterfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function IndicatorsFormComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue, setShowCancel } = useContext(ProjectsContext);
    const [indicatorsData, setIndicatorsData] = useState<IIndicatorsForm>(null);
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(indicatorsFormValidator);
    const {
        getValues,
        setValue,
        formState: { isValid },
        watch,
        trigger
    } = useForm<IIndicatorsForm>({
        resolver, mode: "all", defaultValues: {
            indicators: projectData?.programation?.indicators?.indicators ? projectData.programation.indicators.indicators : null
        }
    });

    const onCancel = () => {
        setMessage({
            title: "Cancelar indicador",
            description: "¿Deseas cancelar la creación del indicador? ",
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
            title: "Cancelar indicador",
            description: "¿Deseas cancelar los cambios del indicador? ",
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

    const changeIndicators = (data: IIndicator, row?: IIndicator) => {
        if (row) {
            const indicators = getValues("indicators").filter(item => item !== row).concat(data);
            setValue("indicators", indicators);
            setIndicatorsData(prev => {
                return { ...prev, activities: indicators };
            });
        } else {
            const indicators = getValues("indicators");
            setValue("indicators", indicators ? indicators.concat(data) : [data]);
            setIndicatorsData(prev => {
                return { ...prev, activities: indicators ? indicators.concat(data) : [data] };
            });
        }
        trigger("indicators");
    };

    const indicatorsColumns: ITableElement<IIndicator>[] = [
        {
            header: "Tipo de indicador",
            fieldName: "type",
        },
        {
            header: "Meta global",
            fieldName: "total",
            renderCell: (row) => {
                const total = row.total | (row.year0 + row.year1 + row.year2 + row.year3 + row.year4)
                return <>{total}</>
            }
        },
        {
            header: "Tipo de indicador",
            fieldName: "productMGA",
        },
    ];
    const indicatorsActions: ITableAction<IIndicator>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                setForm(<IndicatorComponent setForm={setForm} returnData={(data: IIndicator, row?: IIndicator) => { }} item={row} view />);
                setTextContinue("Aceptar");
                setShowCancel(false);
                setActionCancel(() => onCancel);
            }
        },
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<IndicatorComponent setForm={setForm} returnData={changeIndicators} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancelEdit);
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
        const subscription = watch((value: IIndicatorsForm) => setIndicatorsData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (indicatorsData) setProjectData(prev => {
            const programation = prev ? { ...prev.programation, indicators: { ...indicatorsData } } : { indicators: { ...indicatorsData } };
            return { ...prev, programation: { ...programation } };
        })
    }, [indicatorsData]);

    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Listado de indicadores
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<IndicatorComponent setForm={setForm} returnData={changeIndicators} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir objetivo <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('indicators')?.length > 0 && <TableExpansibleComponent actions={indicatorsActions} columns={indicatorsColumns} data={getValues('indicators')} />}
                </div>
            </FormComponent>
        </div>
    )
}

interface IIndicatorsProps {
    returnData: (data: IIndicator, item?: IIndicator) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: IIndicator;
    view?: boolean;
}

function IndicatorComponent({ returnData, setForm, item, view }: IIndicatorsProps): React.JSX.Element {
    const staticValue = 3;
    const { setMessage } = useContext(AppContext);
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue, setShowCancel } = useContext(ProjectsContext);
    const { GetIndicatorDNP, GetIndicatorName, GetIndicatorType, GetIndicatorsComponent, GetProgramation, GetStrategicLine } = useIndicatorsService();
    const { getListByGrouper } = useGenericListService();
    const [indicatorTypeData, setIndicatorTypeData] = useState<IDropdownProps[]>(null);
    const [strategicLineData, setStrategicLineData] = useState<IDropdownProps[]>(null);
    const [indicatorDNPData, setIndicatorDNPData] = useState<IDropdownProps[]>(null);
    const [componentData, setComponentData] = useState<MasterTable[]>(null);
    const [programData, setProgramData] = useState<MasterTable[]>(null);
    const [indicatorsNameData, setIndicatorsNameData] = useState<MasterTable[]>(null);
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const [productMGAData, setProductMGAData] = useState<IDropdownProps[]>([]);
    const resolver = useYupValidationResolver(indicatorValidator);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        reset,
        getValues
    } = useForm<IIndicator>({
        resolver, mode: "all", defaultValues: {
            type: item?.type ? item.type : null,
            accumulative: item?.accumulative !== undefined && item?.accumulative !== null ? item.accumulative : 1,
            component: item?.component,
            developmentPlan: item?.developmentPlan,
            dpn: item?.dpn,
            dpnIndicator: item?.dpnIndicator,
            indicator: item?.indicator,
            line: item?.line,
            measurement: item?.measurement,
            objective: item?.objective,
            productMGA: item?.productMGA,
            program: item?.program,
            staticValue: item?.staticValue,
            staticValueCode: item?.staticValueCode,
            total: item?.total,
            year0: item?.year0,
            year1: item?.year1,
            year2: item?.year2,
            year3: item?.year3,
            year4: item?.year4
        }
    });

    const typeIndicator = watch('type');
    const accumulative = watch('accumulative');
    const strategicLine = watch('line');
    const component = watch('component');
    const program = watch('program');
    const objective = watch('objective');

    const filterData = (data: MasterTable[], filter: string): IDropdownProps[] => {
        if (!filter || !data) return [];
        const filteredData = data.filter(item => {
            let returnData = true;
            const values = item.description.split(" ")[0].split(".");
            filter.split(" ")[0].split(".").forEach((filterValue, index) => {
                if(values[index] !== filterValue && values[index] !== "" && filterValue !== "") {
                    returnData = false;
                }
            });
            return returnData;
        });
        return filteredData.map(item => {
            return {
                name: item.description,
                value: item.id
            }
        })
    }

    const productsData: IDropdownProps[] = projectData?.preparation?.activities?.activities?.length > 0 ? projectData.preparation.activities.activities.map(data => {
        return {
            name: `${data.productMGA}. ${data.productDescriptionMGA}`,
            value: data.productMGA
        }
    }) : [];

    const objectivesData: IDropdownProps[] = projectData?.identification?.problemDescription?.causes.length > 0 ? projectData.identification.problemDescription.causes.map(cause => {
        return {
            name: `${cause.consecutive}. ${cause.description}`,
            value: cause.consecutive
        }
    }) : [];

    const onSubmit = handleSubmit(async (data: IIndicator) => {
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
                title: item ? "Guardar cambios" : "Crear indicador",
                description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar el indicador? ",
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
                        title: item ? "Guardar cambios" : "Indicador",
                        description: item ? "¡Cambios guardados exitosamente!" : "¡Guardado exitosamente! ",
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

    const onChangeYears = () => {
        if ((typeIndicator !== staticValue) || (typeIndicator === staticValue && getValues("accumulative") === 1)) {
            const year0 = getValues("year0") | 0;
            const year1 = getValues("year1") | 0;
            const year2 = getValues("year2") | 0;
            const year3 = getValues("year3") | 0;
            const year4 = getValues("year4") | 0;
            setValue("total", year0 + year1 + year2 + year3 + year4);
        }
    }

    useEffect(() => {
        GetStrategicLine().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setStrategicLineData(response.data.map(data => {
                    return {
                        name: data.description,
                        value: data.id
                    }
                }));
            } else {
                console.log(response.operation.message);
            }
        });
        GetIndicatorsComponent().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setComponentData(response.data);
            } else {
                console.log(response.operation.message);
            }
        });
        GetProgramation().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setProgramData(response.data);
            } else {
                console.log(response.operation.message);
            }
        });
        GetIndicatorName().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                setIndicatorsNameData(response.data);
            } else {
                console.log(response.operation.message);
            }
        });
        getListByGrouper("UNIDAD_MEDIDA_OBJETIVOS").then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.itemDescription, value: Number(data.itemCode) }
                })
                setMeasurementData(data);
            }
        });
        GetIndicatorDNP().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return {
                        name: data.description,
                        value: data.id
                    }
                })
                setIndicatorDNPData(data);
            }
        });
        GetIndicatorType().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return {
                        name: data.description,
                        value: data.id
                    }
                })
                setIndicatorTypeData(data);
            }
        });
        setActionContinue(() => onSubmit);
        return () => {
            setForm(null);
        }
    }, []);

    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);

    useEffect(() => {
        reset({ type: typeIndicator, accumulative: item?.accumulative !== undefined && item?.accumulative !== null ? item.accumulative : 1 });
    }, [typeIndicator])

    useEffect(() => {
        if (!objective) return setProductMGAData([]);
        const productsMGA = projectData.preparation.activities.activities.filter(activity => activity.objetiveActivity.consecutive === objective);
        setProductMGAData(productsMGA.map(data => {
            return {
                name: `${data.productMGA}. ${data.productDescriptionMGA}`,
                value: data.productMGA
            }
        }));
    }, [objective]);

    return (
        <FormComponent action={undefined} className="card-table">
            {view && <p className="text-black large bold">Detalle del indicador </p>}
            {!view && <p className="text-black large bold">{item ? "Editar indicador " : "Agregar indicador "}</p>}
            <div className="strategic-direction-grid-1">
                <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                    <SelectComponent
                        control={control}
                        idInput={"type"}
                        className={`select-basic span-width ${view && "background-textArea"}`}
                        label="Tipo de indicador"
                        classNameLabel="text-black biggest bold text-required"
                        data={indicatorTypeData}
                        errors={errors}
                        disabled={view}
                    />
                    {typeIndicator !== null && <>
                        {typeIndicator === staticValue ?
                            <SelectComponent
                                control={control}
                                idInput={"objective"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Objetivo específico directo"
                                classNameLabel="text-black biggest bold text-required"
                                data={objectivesData}
                                errors={errors}
                                disabled={view}
                            /> :
                            <SelectComponent
                                control={control}
                                idInput={"line"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Línea estratégica"
                                classNameLabel="text-black biggest bold text-required"
                                data={strategicLineData}
                                errors={errors}
                                disabled={view}
                            />}
                        {typeIndicator === staticValue ?
                            <SelectComponent
                                control={control}
                                idInput={"productMGA"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Producto MGA"
                                classNameLabel="text-black biggest bold text-required"
                                data={productMGAData}
                                errors={errors}
                                disabled={view}
                            /> :
                            <SelectComponent
                                control={control}
                                idInput={"component"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Componente"
                                classNameLabel="text-black biggest bold text-required"
                                data={filterData(componentData, strategicLineData?.find(item => item.value === strategicLine)?.name)}
                                errors={errors}
                                disabled={view}
                            />
                        }
                    </>}
                </div>
                {typeIndicator !== null && <>
                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                        {typeIndicator === staticValue ?
                            <SelectComponent
                                control={control}
                                idInput={"dpnIndicator"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Indicador DNP"
                                classNameLabel="text-black biggest bold text-required"
                                data={indicatorDNPData}
                                errors={errors}
                                disabled={view}
                            /> :
                            <SelectComponent
                                control={control}
                                idInput={"program"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Programa"
                                classNameLabel="text-black biggest bold text-required"
                                data={filterData(programData, componentData?.find(item => item.id === component)?.description)}
                                errors={errors}
                                disabled={view}
                            />
                        }
                        {typeIndicator === staticValue ?
                            <InputNumberComponent
                                idInput={`dpn`}
                                control={control}
                                label="Código DNP"
                                errors={errors}
                                placeholder=""
                                classNameLabel="text-black biggest bold text-required"
                                className={`inputNumber-basic ${view && "background-textArea"}`}
                                disabled={view}
                                onChange={onChangeYears}
                            /> :
                            <SelectComponent
                                control={control}
                                idInput={"indicator"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Nombre de indicador"
                                classNameLabel="text-black biggest bold text-required"
                                data={filterData(indicatorsNameData, programData?.find(item => item.id === program)?.description)}
                                errors={errors}
                                disabled={view}
                            />
                        }
                        <SelectComponent
                            control={control}
                            idInput={"measurement"}
                            className={`select-basic span-width ${view && "background-textArea"}`}
                            label="Unidad de medida"
                            classNameLabel="text-black biggest bold text-required"
                            data={measurementData}
                            errors={errors}
                            disabled={view}
                        />
                    </div>
                    {typeIndicator === staticValue ?
                        <Controller
                            control={control}
                            name={`staticValueCode`}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Código valor estadístico"
                                        classNameLabel="text-black biggest bold text-required"
                                        className={`text-area-basic ${view && "background-textArea"}`}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={8}
                                        disabled={view}
                                    />
                                );
                            }}
                        /> :
                        <Controller
                            control={control}
                            name={`developmentPlan`}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Plan de desarrollo"
                                        classNameLabel="text-black biggest bold text-required"
                                        className={`text-area-basic ${view && "background-textArea"}`}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={300}
                                        disabled={view}
                                    />
                                );
                            }}
                        />
                    }
                    {typeIndicator === staticValue ?
                        <Controller
                            control={control}
                            name={`staticValue`}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Nombre valor estadístico"
                                        classNameLabel="text-black biggest bold text-required"
                                        className={`text-area-basic ${view && "background-textArea"}`}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={300}
                                        disabled={view}
                                    />
                                );
                            }}
                        /> :
                        <SelectComponent
                            control={control}
                            idInput={"productMGA"}
                            className={`select-basic span-width ${view && "background-textArea"}`}
                            label="Producto MGA"
                            classNameLabel="text-black biggest bold text-required"
                            data={productsData}
                            errors={errors}
                            disabled={view}
                        />
                    }
                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                        <InputNumberComponent
                            idInput={`year0`}
                            control={control}
                            label="Meta año 0"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            className={`inputNumber-basic ${view && "background-textArea"}`}
                            disabled={view}
                            onChange={onChangeYears}
                        />
                        <InputNumberComponent
                            idInput={`year1`}
                            control={control}
                            label="Meta año 1"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            className={`inputNumber-basic ${view && "background-textArea"}`}
                            disabled={view}
                            onChange={onChangeYears}
                        />
                        <InputNumberComponent
                            idInput={`year2`}
                            control={control}
                            label="Meta año 2"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            className={`inputNumber-basic ${view && "background-textArea"}`}
                            disabled={view}
                            onChange={onChangeYears}
                        />
                    </div>
                    <div className={`strategic-direction-grid-1 ${typeIndicator === staticValue ? "strategic-direction-grid-2-web" : "strategic-direction-grid-3-web"}`}>
                        <InputNumberComponent
                            idInput={`year3`}
                            control={control}
                            label="Meta año 3"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            className={`inputNumber-basic ${view && "background-textArea"}`}
                            disabled={view}
                            onChange={onChangeYears}
                        />
                        <InputNumberComponent
                            idInput={`year4`}
                            control={control}
                            label="Meta año 4"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            className={`inputNumber-basic ${view && "background-textArea"}`}
                            disabled={view}
                            onChange={onChangeYears}
                        />
                        {typeIndicator !== staticValue &&
                            <InputNumberComponent
                                idInput={`total`}
                                control={control}
                                label="Meta global"
                                errors={errors}
                                classNameLabel="text-black biggest bold text-required"
                                className={`inputNumber-basic background-textArea`}
                                disabled={true}
                            />
                        }
                    </div>
                    {typeIndicator === staticValue &&
                        <div className="strategic-direction-grid-1 strategic-direction-grid-2-web">
                            <SelectComponent
                                control={control}
                                idInput={"accumulative"}
                                className={`select-basic span-width ${view && "background-textArea"}`}
                                label="Acumulativo cuatrienio"
                                classNameLabel="text-black biggest bold text-required"
                                data={[{ name: "Si", value: 1 }, { name: "No", value: 0 }]}
                                errors={errors}
                                disabled={view}
                                onChange={onChangeYears}
                            />
                            <InputNumberComponent
                                idInput={`total`}
                                control={control}
                                label="Meta global"
                                errors={errors}
                                classNameLabel="text-black biggest bold text-required"
                                className={`inputNumber-basic ${view && "background-textArea"}`}
                                disabled={view || accumulative === 1}
                            />
                        </div>
                    }
                </>}
            </div>
        </FormComponent>
    )
}

export default React.memo(IndicatorsFormComponent);