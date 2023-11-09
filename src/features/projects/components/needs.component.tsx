import React, { useContext, useEffect, useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { needsObjectivesValidator, needsValidator } from "../../../common/schemas";
import { INeedObjetive, INeedsForm } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "./table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ProjectsContext } from "../contexts/projects.context";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { FaTrashAlt } from "react-icons/fa";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}

function NeedsComponent({ disableNext, enableNext, setForm }: IProps): React.JSX.Element {
    const [needsData, setNeedsData] = useState<INeedsForm>(null)
    const { setProjectData, projectData, setTextContinue, setActionCancel, setActionContinue, setDisableContinue, formAction, setDisableStatusUpdate } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(needsValidator);
    const {
        control,
        register,
        getValues,
        setValue,
        formState: { errors, isValid },
        watch,
        trigger
    } = useForm<INeedsForm>({
        resolver, mode: "all", defaultValues: {
            alternative: projectData?.preparation?.technicalAnalysis?.alternative ? projectData.preparation.technicalAnalysis.alternative : "",
            generalObjetive: projectData?.identification?.problemDescription?.centerProblem ? projectData.identification.problemDescription.centerProblem : "",
            objetives: projectData?.preparation?.needs?.objetives ? projectData.preparation.needs.objetives : null
        }
    });
    const onCancel = () => {
        setMessage({
            title: "Cancelar objetivo",
            description: "Deseas cancelar la acción, no se guardarán los datos",
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
    const objectivesColumns: ITableElement<INeedObjetive>[] = [
        {
            fieldName: "objetive",
            header: "Objetivo",
            renderCell: (row) => {
                return <>{row.objetive.consecutive}. {row.objetive.description}</>
            }
        },
        {
            fieldName: "interventionActions",
            header: "Acciones de intervención",
        },
        {
            fieldName: "estatesService",
            header: "Bienes/Servicios",
            renderCell: (row) => {
                return <>{row.estatesService.length}</>
            }
        },
        {
            fieldName: "quantification",
            header: "Cuantificación",
        },
    ];
    const objectivesActions: ITableAction<INeedObjetive>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                setMessage({
                    title: "Detalle del objetivo",
                    description: <DetailsComponent row={row} />,
                    OkTitle: "Cerrar",
                    background: true,
                    show: true,
                    onOk: () => {
                        setMessage({});
                    }
                })
            }
        },
        {
            icon: "Edit",
            onClick: (row) => {
                setForm(<NeedObjectivesComponent setForm={setForm} returnData={changeObjetives} item={row} />);
                setTextContinue("Guardar y regresar");
                setActionCancel(() => onCancel);
            }
        },
        {
            icon: "Delete",
            onClick: (row) => {
                setMessage({
                    title: "Eliminar objetivo",
                    description: "¿Deseas eliminar el objetivo?",
                    show: true,
                    background: true,
                    cancelTitle: "Cancelar",
                    OkTitle: "Aceptar",
                    onCancel: () => {
                        setMessage({});
                    },
                    onOk: () => {
                        const objectivesData = getValues("objetives").filter(item => item !== row);
                        setValue("objetives", objectivesData);
                        setNeedsData(prev => {
                            return { ...prev, objetives: objectivesData };
                        });
                        trigger("objetives");
                        setMessage({
                            title: "Objetivo eliminado",
                            description: "¡Objetivo eliminado exitosamente!",
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
    const changeObjetives = (data: INeedObjetive, row?: INeedObjetive) => {
        if (row) {
            const objectivesData = getValues("objetives").filter(item => item !== row).concat(data).sort((a, b) => parseInt(a.objetive.consecutive) - parseInt(b.objetive.consecutive));
            setValue("objetives", objectivesData);
            setNeedsData(prev => {
                return { ...prev, objetives: objectivesData };
            });
        } else {
            const objectivesData = getValues("objetives");
            setValue("objetives", objectivesData ? objectivesData.concat(data) : [data]);
            setNeedsData(prev => {
                return { ...prev, objetives: objectivesData ? objectivesData.concat(data) : [data] };
            });
        }
        trigger("objetives");
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
        setDisableStatusUpdate(!isValid);
    }, [isValid]);
    useEffect(() => {
        const subscription = watch((value: INeedsForm) => setNeedsData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (needsData) setProjectData(prev => {
            const preparation = prev ? { ...prev.preparation, needs: { ...needsData } } : { needs: { ...needsData } };
            return { ...prev, preparation: { ...preparation } };
        })
    }, [needsData]);
    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <Controller
                    control={control}
                    name={"alternative"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Nombre de la alternativa"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic background-textArea"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={true}
                            />
                        );
                    }}

                />
                <Controller
                    control={control}
                    name={"generalObjetive"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Objetivo general"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic background-textArea"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={true}
                            />
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Listado de objetivos específicos
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            setForm(<NeedObjectivesComponent setForm={setForm} returnData={changeObjetives} />);
                            setTextContinue("Guardar y regresar");
                            setActionCancel(() => onCancel);
                        }}>
                            Añadir objetivo <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('objetives')?.length > 0 && <TableExpansibleComponent actions={objectivesActions} columns={objectivesColumns} data={getValues('objetives')} />}
                </div>
            </FormComponent>
        </div>
    )
}

interface IPropsNeedsObjectives {
    returnData: (data: INeedObjetive, item?: INeedObjetive) => void;
    setForm: (value: React.SetStateAction<React.JSX.Element>) => void;
    item?: INeedObjetive;
}

function NeedObjectivesComponent({ returnData, setForm, item }: IPropsNeedsObjectives) {
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(needsObjectivesValidator);
    const { projectData, setActionContinue, setTextContinue, setActionCancel, setDisableContinue, isADisabledInput } = useContext(ProjectsContext);
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        getValues
    } = useForm<INeedObjetive>({
        resolver, mode: "all", defaultValues: {
            interventionActions: item?.interventionActions ? item.interventionActions : "",
            objetive: item?.objetive ? item.objetive : null,
            objectiveSelect: item?.objetive?.consecutive ? item.objetive.consecutive : null,
            quantification: item?.quantification ? item?.quantification : null,
            estatesService: item?.estatesService ? item?.estatesService : null
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "estatesService",
    });
    useEffect(() => {
        return () => {
            setForm(null);
        }
    }, []);
    useEffect(() => {
        setDisableContinue(!isValid);
    }, [isValid]);
    const objectiveSelect = watch("objectiveSelect");
    const newObjectives = item ? projectData.identification.problemDescription.causes.filter(cause => !projectData?.preparation?.needs?.objetives ? null : !projectData.preparation.needs.objetives.some(obj => cause.consecutive === obj.objetive.consecutive)).concat(item?.objetive).sort((a, b) => parseInt(a.consecutive) - parseInt(b.consecutive)) : projectData.identification.problemDescription.causes.filter(cause => !projectData?.preparation?.needs?.objetives ? null : !projectData.preparation.needs.objetives.some(obj => cause.consecutive === obj.objetive.consecutive));
    const getValObj = projectData?.preparation?.needs?.objetives?.length > 0 ? newObjectives : projectData.identification.problemDescription.causes;
    const objectives: IDropdownProps[] = getValObj.map((cause) => {
        return {
            name: `${cause.consecutive}. ${cause.description}`,
            value: cause.consecutive
        }
    });
    const onSubmit = handleSubmit(async (data: INeedObjetive) => {
        setMessage({
            title: item ? "Editar objetivo" : "Guardar objetivo",
            description: item ? "¿Deseas editar el objetivo?" : "¿Deseas guardar el objetivo?",
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
                    title: item ? "Editar objetivo" : "Guardar objetivo",
                    description: item ? "¡Objetivo editado exitosamente!" : "¡Objetivo guardado exitosamente!",
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
    });
    useEffect(() => {
        setActionContinue(() => onSubmit);
    }, []);
    useEffect(() => {
        if (objectiveSelect) setValue("objetive", projectData.identification.problemDescription.causes.find(cause => cause.consecutive == objectiveSelect));
    }, [objectiveSelect]);
    return (
        <FormComponent action={undefined} className="card-table">
            <p className="text-black large bold">{item ? "Editar Objetivo" : "Agregar Objetivo"}</p>
            <div className="problem-description-container">
                <SelectComponent
                    control={control}
                    idInput={"objectiveSelect"}
                    className="select-basic span-width"
                    label="Objetivo"
                    classNameLabel="text-black biggest bold text-required"
                    data={objectives}
                    errors={errors}
                    filter={true}
                    disabled={isADisabledInput}
                />
                <Controller
                    control={control}
                    name={"interventionActions"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Acciones de intervención"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={300}
                                disabled={isADisabledInput}
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"quantification"}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Cuantificación"
                                className="input-basic"
                                classNameLabel="text-black biggest bold text-required"
                                typeInput={"number"}
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            />
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Bienes y/o servicios
                        </label>

                        <div className="title-button text-main large" onClick={() => {
                            append({ description: "" });
                        }}>
                            Añadir bienes y/o servicios <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <label className="text-main big error-message bold">
                        {errors?.estatesService?.message}
                    </label>
                    <div className="problem-description-container">
                        {fields.map((field, index) => {
                            return (
                                <div key={field.id} className="needs-objectives-estates-services">
                                    <Controller
                                        control={control}
                                        name={`estatesService.${index}.description`}
                                        defaultValue=""
                                        render={({ field }) => {
                                            return (
                                                <TextAreaComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    value={`${field.value}`}
                                                    className="text-area-basic"
                                                    placeholder="Escribe aquí"
                                                    register={register}
                                                    fieldArray={true}
                                                    onChange={field.onChange}
                                                    errors={errors}
                                                    characters={300}
                                                >
                                                    {getValues(`estatesService.${index}.description`) === "" ? <p className="error-message bold not-margin-padding">El campo es obligatorio</p> : <></>}
                                                    {getValues(`estatesService.${index}.description`).length > 300 ? <p className="error-message bold not-margin-padding">Solo se permiten 300 caracteres</p> : <></>}
                                                </TextAreaComponent>
                                            );
                                        }}
                                    />
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
                                                setMessage({});
                                            },
                                            onCancel: () => {
                                                setMessage({});
                                            }
                                        })
                                    }} className="actions-needs">
                                        <FaTrashAlt className="button grid-button button-delete" />
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
    row: INeedObjetive;
}

function DetailsComponent({ row }: IDetailsProps): React.JSX.Element {
    return (
        <section className="needs-objectives-details">
            <div className="items-details">
                <label className="text-black bold biggest">Objetivo</label>
                <span className="text-primary biggest">{row.objetive.description}</span>
            </div>
            <div className="items-details">
                <label className="text-black bold biggest">Acciones de intervención</label>
                <span className="text-primary biggest">{row.interventionActions}</span>
            </div>
            <div className="items-details">
                <label className="text-black bold biggest">Cuantificación</label>
                <span className="text-primary biggest">{row.quantification}</span>
            </div>
            <div className="items-estates">
                <p className="text-black bold text-center biggest">Bienes y servicios</p>
                {row.estatesService.map(estates => {
                    return (
                        <span className="text-primary biggest" key={estates.description}>{estates.description}</span>
                    )
                })}
            </div>
        </section>
    );
}

export default React.memo(NeedsComponent);