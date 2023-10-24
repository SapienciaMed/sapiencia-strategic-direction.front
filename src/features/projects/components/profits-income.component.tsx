import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { profitsIncomeFormValidator, profitsIncomeValidator } from "../../../common/schemas";
import { INeedObjetive, INeedsForm,IproftisIncomeForm, IprofitsIncome,Iperiod } from "../interfaces/ProjectsInterfaces";
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
import { useWidth } from "../../../common/hooks/use-width";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function ProfitsIncomeComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const [ profitsFormData, setProfitsFormData] = useState<IproftisIncomeForm>(null)
    const { setProjectData, 
            projectData, 
            setTextContinue, 
            setActionCancel, 
            setActionContinue ,
            setShowCancel,  
            setDisableContinue, 
            formAction } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const { getListByGrouper } = useGenericListService();
    const resolver = useYupValidationResolver(profitsIncomeFormValidator)
    const { width } = useWidth();
    const {
        getValues,
        setValue,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<IproftisIncomeForm>({ 
        resolver, mode: "all", defaultValues: {
            profitsIncome: projectData?.programation?.profitsIncome?.profitsIncome ? projectData.programation.profitsIncome.profitsIncome : null
        }
    });
    const onCancel = () => {
        setMessage({
            title: "Cancelar la acción",
            description: "¿Deseas cancelar la creación del ingreso/beneficio?",
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
        getListByGrouper("UNIDAD_MEDIDA_OBJETIVOS").then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.itemDescription, value: Number(data.itemCode) }
                })
                setMeasurementData(data);
            }
        })
    }, []);

    const objectivesColumns: ITableElement<IprofitsIncome>[] = [
        {
            fieldName: "type",
            header: "Tipo",
            renderCell: (row) => {
                return <>{row.type}</>
            }
        },
        {
            fieldName: "description",
            header: "Descripción",
        },
        {
            fieldName: "unit",
            header: "Unidad de medida",
            renderCell: (row) => {
                if(measurementData){
                    const typeRisk = measurementData.find( item => item.value == row.unit)
                    return <>{typeRisk ? typeRisk.name || "" : ""}</>;
                }else {
                    return;
                }
            },
        },
        
    ];
    const objectivesActions: ITableAction<IprofitsIncome>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                setForm(<ProfitsIncomeAddComponent setForm={setForm} returnData={changeProfitsIncome} item={row} view={true}/>);
                setTextContinue("Aceptar");
                setShowCancel(false);
                setActionCancel(() => onCancel);
            }
        },
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<ProfitsIncomeAddComponent setForm={setForm} returnData={changeProfitsIncome} item={row} />);
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
                        const profitsIncomeData = getValues("profitsIncome").filter(item => item !== row);
                        setValue("profitsIncome", profitsIncomeData);
                        setProfitsFormData(prev => {
                            return { ...prev, profitsIncome: profitsIncomeData };
                        });
                        trigger("profitsIncome");
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
    const changeProfitsIncome = (data: IprofitsIncome, row?: IprofitsIncome) => {
        if (row) {
            const profitsIncomeData = getValues("profitsIncome").filter(item => item !== row).concat(data);
            setValue("profitsIncome", profitsIncomeData);
            setProfitsFormData(prev => {
                return { ...prev, profitsIncome: profitsIncomeData };
            });
        } else {
            const profitsIncomeData = getValues("profitsIncome");
            setValue("profitsIncome", profitsIncomeData ? profitsIncomeData.concat(data) : [data]);
            setProfitsFormData(prev => {
                return { ...prev, profitsIncome: profitsIncomeData ? profitsIncomeData.concat(data) : [data] };
            });
        }
        trigger("profitsIncome");
    };
    useEffect(() => {
        if ( isValid && formAction === "new" ) {
            enableNext();
        } else if( !isValid && formAction === "new" ) {
            disableNext();
        } else if( isValid && formAction === "edit" ) {
            enableNext();
            setDisableContinue(false);
        } else {      
            setDisableContinue(true);
        }
    }, [isValid]);
    useEffect(() => {
        const subscription = watch((value: IproftisIncomeForm) => setProfitsFormData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (profitsFormData) setProjectData(prev => {
            const programation = prev ? { ...prev.programation, profitsIncome: { ...profitsFormData } } : { profitsIncome: { ...profitsFormData } };
            return { ...prev, programation: { ...programation } };
        })
    }, [profitsFormData]);
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Ingresos y beneficios
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<ProfitsIncomeAddComponent setForm={setForm} returnData={changeProfitsIncome} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir ingreso/beneficio <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('profitsIncome')?.length > 0 && <TableExpansibleComponent actions={objectivesActions} columns={objectivesColumns}  widthTable={`${(width * 0.0149) + 40}vw`}  data={getValues('profitsIncome')}  horizontalScroll/>}
                </div>
            </FormComponent>
        </div>
    )
}

interface IPropsProfitsIncome {
    returnData: (data: IprofitsIncome, item?: IprofitsIncome) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: IprofitsIncome;
    view?:boolean;
}
let render = 0;

function ProfitsIncomeAddComponent({ returnData, setForm, item , view }: IPropsProfitsIncome) {
    const { setMessage } = useContext(AppContext);
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const resolver = useYupValidationResolver(profitsIncomeValidator);
    const { getListByGrouper } = useGenericListService();
    const [addedPeriod, setAddedPeriod] = useState(false); // Nuevo estado local
    const [periodCounter, setPeriodCounter] = useState(0); 
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue,setShowCancel } = useContext(ProjectsContext);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        getValues
    } = useForm<IprofitsIncome>({
        resolver, mode: "all", defaultValues: {
            type: item?.type ? item.type : "",
            description: item?.description ? item.description : "",
            unit: item?.unit !== undefined && item.unit !== null ? item.unit : null,
            period: item?.period ? item?.period : null,
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "period",
    });

  const watchedValues = useWatch({
    control,
    name: 'period', // Observa el campo 'period'
  });

  // Función para calcular y asignar el valor total
  const calculateTotal = (index) => {
    const quantity = watchedValues[index]?.quantity || 0;
    const unitValue = watchedValues[index]?.unitValue || 0;
    const total = quantity * unitValue;
    //setValue(`period[${index}].financialValue`, total);// Asigna el total al campo 'financialValue'
  };
  
  useEffect(() => {
    // Recalcula el valor total cada vez que cambian 'quantity' o 'unitValue' en cualquier período
    fields.forEach((_, index) => {
      calculateTotal(index);
    });
  }, [watchedValues]);


    useEffect(() => {
        return () => {
            setForm(null);
        }
    }, []);
    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);

    useEffect(() => {
        getListByGrouper("UNIDAD_MEDIDA_OBJETIVOS").then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.itemDescription, value: Number(data.itemCode) }
                })
                setMeasurementData(data);
            }
        })
    }, []);

   

    const onSubmit = handleSubmit(async (data: IprofitsIncome) => {
        if(view) {
            setForm(null);
            setTextContinue(null);
            setActionCancel(null);
            setActionContinue(null);
            setMessage({});
            setDisableContinue(true);
            setShowCancel(true);
        }else {
            setMessage({
                title: item ? "Guardar cambios" : "Crear Ingreso/Beneficio",
                description: item ? "¿Deseas guardar los cambios?" : "¿Deseas guardar el registro?",
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
                        title: item ? "Cambios guardados" : "Ingreso/beneficio",
                        description: item ? "¡Cambios guardados exitosamente!" : "¡Registro guardado exitosamente!",
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

    useEffect(() => {
        // Cuando se agrega un nuevo período, actualiza el estado local para forzar una actualización
        if (addedPeriod) {
            setAddedPeriod(false);
        }
    }, [addedPeriod]);
    return (
        
        <FormComponent action={undefined} className="card-form-development">
            <div className="card-table">
            <p className="text-black large bold">
                {
                    view ? (
                        "Detalle ingreso/beneficio"
                    ) : (
                        item ? "Editar ingreso/beneficio" : "Agregar ingreso/beneficio"
                    )
                }
            </p>
            <div className="container-profits">
                <div className="type-container">
                <label className="text-black large bold text-required">
                            Tipo:
                </label>    
                     <Controller
                        control={control}
                        name="type"
                        defaultValue={null}
                        render={({ field }) => (
                        <div>
                             <label htmlFor={field.name} className="text-black biggest bold">
                                Ingreso: </label>
                            <RadioButton
                            inputId={field.name}
                            name={field.name}
                            value="Ingreso"
                            onChange={(e) => field.onChange(e.value)}
                            checked={field.value === 'Ingreso'}
                            disabled={view ? true : false }
                            />
                        </div>
                        )}
                    />

                    <Controller
                        control={control}
                        name="type"
                        defaultValue={null}
                        render={({ field }) => (
                        <div>
                        <label htmlFor={field.name} className="text-black biggest bold">
                            Beneficio: </label>
                            <RadioButton
                            inputId={field.name}
                            name={field.name}
                            value="Beneficio"
                            onChange={(e) => field.onChange(e.value)}
                            checked={field.value === 'Beneficio'}
                            disabled={view ? true : false }
                            />
                            
                        </div>
                        )}
                    />
                    </div>
                
                <Controller
                    control={control}
                    name={"description"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={600}
                                disabled={view ? true : false }
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                    <SelectComponent
                        control={control}
                        idInput={"unit"}
                        className="select-basic span-width"
                        label="Unidad de medida"
                        classNameLabel="text-black biggest bold text-required"
                        data={measurementData}
                        errors={errors}
                        disabled={view ? true : false }
                    />
                </div>
                </div>
                <div className="card-table">
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Clasificación
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                         if (!view) { 
                            append({ period: periodCounter, quantity: null, unitValue: null, financialValue: null });
                            setAddedPeriod(true); // Marcar que se agregó un período
                            setPeriodCounter(periodCounter + 1); // Incrementar el contador de períodos
                        }
                       }}>
                          {!view && (<> Añadir período <AiOutlinePlusCircle /></>)}
                        </div>
                    </div>
                    <label className="text-main big error-message bold">
                        {errors?.period?.message}
                    </label>
                    <div className="problem-description-container">
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="clasification-period-container">
                                     <Controller
                                        control={control}
                                        name={`period.${index}.period`}
                                        defaultValue= {index} 
                                        render={({ field }) => {
                                            return (
                                                <InputComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    value={`${index}`}
                                                    label="período"
                                                    className="input-basic background-textArea"
                                                    classNameLabel="text-black biggest bold"
                                                    typeInput={"number"}
                                                    register={register}
                                                    onChange={field.onChange}
                                                    disabled={true}
                                                    errors={errors} />
                                            );
                                        }}
                                    />

                                <InputNumberComponent
                                        idInput={`period.${index}.quantity`}
                                        control={control}
                                        label="Cantidad"
                                        errors={errors}
                                        classNameLabel="text-black biggest bold text-required"
                                        className="inputNumber-basic"
                                        onChange={() => {
                                            setValue(`period.${index}.financialValue`,  getValues(`period.${index}.quantity`) * getValues(`period.${index}.unitValue`))
                                        }}
                                        disabled={view ? true : false }
                                />

                                <InputNumberComponent
                                        idInput={`period.${index}.unitValue`}
                                        control={control}
                                        label="Valor unitario"
                                        errors={errors}
                                        classNameLabel="text-black biggest bold text-required "
                                        className="inputNumber-basic"
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                        onChange={() => {
                                            setValue(`period.${index}.financialValue`,  getValues(`period.${index}.quantity`) * getValues(`period.${index}.unitValue`))
                                        }}
                                        minFractionDigits={2}
                                        disabled={view ? true : false }
                                />
                                   <InputNumberComponent
                                        idInput={`period.${index}.financialValue`}
                                        control={control}
                                        label="Valor total financiero"
                                        errors={errors}
                                        classNameLabel="text-black biggest bold "
                                        className="inputNumber-basic background-textArea"
                                        mode="currency"
                                        currency="COP"
                                        locale="es-CO"
                                        disabled={true}
                                        minFractionDigits={2}
                                    />
                                    <div className="actions-needs">
                                         {!view && (
                                            <>
                                              <label className="text-black biggest bold">Acciones</label>
                                            </>
                                        )}
                                    <div onClick={() => {
                                        setMessage({
                                            title: "Eliminar registro",
                                            description: "¿Deseas continuar?",
                                            show: true,
                                            background: true,
                                            OkTitle: "Aceptar",
                                            cancelTitle: "Cancelar",
                                            onOk: () => {
                                                remove(index);
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
                                            },
                                            onCancel: () => {
                                                setMessage({});
                                            }
                                        })
                                    }} className="actions-needs">
                                       <div className="actions-poblations ">
                                       {!view && (
                                            <> <div className="container-div">
                                                 <FaTrashAlt className="button grid-button button-delete" />
                                              </div>
                                            </>
                                        )}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
              </div>
        </FormComponent>
    )
}

interface IDetailsProps {
    row: IprofitsIncome;
}

function DetailsComponent({ row }: IDetailsProps): React.JSX.Element {
    return (
        <section className="needs-objectives-details">
            <div className="items-details">
                <label className="text-black bold biggest">Tipo</label>
                <span className="text-primary biggest">{row.type}</span>
            </div>
            <div className="items-details">
                <label className="text-black bold biggest">Unidad de medida</label>
                <span className="text-primary biggest">{row.unit}</span>
            </div>
            <div className="items-details">
                <label className="text-black bold biggest">Descripción</label>
                <span className="text-primary biggest">{row.description}</span>
            </div>
            <div className="items-estates">
                <p className="text-black bold text-center biggest">Añadir periodo</p>
                {row.period.map(period => {
                    return (
                        <span className="text-primary biggest" key={period.period}>{period.quantity}</span>
                    )
                })}
            </div>
        </section>
    );
}

export default React.memo(ProfitsIncomeComponent);