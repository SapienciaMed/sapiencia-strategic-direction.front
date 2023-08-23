import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { causesEffectsValidator, problemDescriptionValidator } from "../../../common/schemas";
import { Controller, UseFormHandleSubmit, useFieldArray, useForm } from "react-hook-form";
import { FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { ICause, IEffect, IProblemDescriptionForm } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { AppContext } from "../../../common/contexts/app.context";
import { EDirection } from "../../../common/constants/input.enum";
import { ProjectsContext } from "../contexts/projects.context";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
}

export function ProblemDescriptionComponent({ disableNext, enableNext }: IProps): React.JSX.Element {
    const causesEffectsComponentRef = useRef(null);
    const [problemDescriptionData, setProblemDescriptionData] = useState<IProblemDescriptionForm>(null)
    const { setProjectData, projectData } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const resolver = useYupValidationResolver(problemDescriptionValidator);
    const {
        control,
        register,
        getValues,
        setValue,
        formState: { errors, isValid },
        watch
    } = useForm<IProblemDescriptionForm>({
        resolver, defaultValues: {
            problemDescription: projectData?.identification?.problemDescription?.problemDescription ? projectData.identification.problemDescription.problemDescription : "",
            magnitude: projectData?.identification?.problemDescription?.magnitude ? projectData.identification.problemDescription.magnitude : "",
            centerProblem: projectData?.identification?.problemDescription?.centerProblem ? projectData.identification.problemDescription.centerProblem : "",
            causes: projectData?.identification?.problemDescription?.causes ? projectData.identification.problemDescription.causes : [],
            effects: projectData?.identification?.problemDescription?.effects ? projectData.identification.problemDescription.effects : [],
        }
    });

    useEffect(() => {
        if (projectData) setProblemDescriptionData(projectData.identification?.problemDescription)
    }, []);

    useEffect(() => {
        const subscription = watch((value: IProblemDescriptionForm) => setProblemDescriptionData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if (isValid) {
            enableNext();
        } else {
            disableNext();
        }
    }, [isValid]);

    useEffect(() => {
        if (problemDescriptionData) setProjectData(prev => {
            const identification = prev ? { ...prev.identification, problemDescription: { ...problemDescriptionData } } : { problemDescription: { ...problemDescriptionData } };
            return { ...prev, identification: { ...identification } }
        })
    }, [problemDescriptionData]);

    const causesColumns: ITableElement<ICause>[] = [
        {
            fieldName: "type",
            header: "Tipo",
            renderCell: (row) => {
                return <>{row.consecutive.includes(".") ? "Indirecto" : "Directo"}</>
            }
        },
        {
            fieldName: "description",
            header: "Descripción",
            renderCell: (row) => {
                return <>{row.consecutive}. {row.description}</>
            }
        },
    ];
    const causesActions: ITableAction<ICause>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                const search = row.consecutive.includes(".") ? row.consecutive.split(".")[0] : row.consecutive;
                const cause = getValues("causes").find(cause => cause.consecutive === search);
                let counter = null;
                if (row.consecutive.includes(".")) {
                    cause.childrens.forEach((children, index) => {
                        if (children.consecutive === row.consecutive) counter = index;
                    })
                }
                setMessage({
                    title: "Editar causa",
                    description: <CausesFormComponent ref={causesEffectsComponentRef} item={cause} counter={counter} />,
                    show: true,
                    background: true,
                    OkTitle: "Guardar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        if (causesEffectsComponentRef.current) {
                            causesEffectsComponentRef.current.handleSubmit((data: ICause) => {
                                const newCauses = getValues('causes').filter(cause => cause.consecutive !== data.consecutive).concat(data).sort((a, b) => parseInt(a.consecutive) - parseInt(b.consecutive));
                                setProblemDescriptionData(prev => {
                                    return { ...prev, causes: newCauses };
                                })
                                setValue("causes", newCauses);
                                setMessage({
                                    title: "Se editó exitosamente",
                                    description: "Se ha editado la causa exitosamente",
                                    show: true,
                                    background: true,
                                    OkTitle: "Aceptar",
                                    onOk: () => {
                                        setMessage({});
                                    },
                                    onClose: () => {
                                        setMessage({});
                                    },
                                });
                            })();
                        }
                        setMessage({});
                    },
                    onCancel: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    },
                });
            }
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
                    title: row.consecutive.includes(".") ? "¿Desea quitar la causa indirecta?" : "¿Desea quitar la causa directa junto con sus causas indirectas?",
                    onOk: () => {
                        if (row.consecutive.includes(".")) {
                            const newCauses = getValues("causes").map((cause) => {
                                return {
                                    ...cause, childrens: cause.childrens.filter(children => children.consecutive !== row.consecutive).map((children, childrenIndex) => {
                                        return { ...children, consecutive: `${cause.consecutive}.${childrenIndex + 1}` }
                                    })
                                }
                            })
                            setProblemDescriptionData(prev => {
                                return { ...prev, causes: newCauses };
                            })
                            setValue('causes', newCauses);
                        } else {
                            const causesFilter = getValues("causes").filter((cause) => cause.consecutive !== row.consecutive);
                            const newCauses = causesFilter.map((cause, index) => {
                                const newChildrends = cause.childrens.map((children, childrenIndex) => {
                                    return { ...children, consecutive: `${index + 1}.${childrenIndex + 1}` }
                                })
                                return { ...cause, consecutive: `${index + 1}`, childrens: newChildrends }
                            });
                            setProblemDescriptionData(prev => {
                                return { ...prev, causes: newCauses };
                            })
                            setValue('causes', newCauses);
                        }
                        setMessage({});
                    }
                });
            },
        }
    ];
    const effectsColumns: ITableElement<IEffect>[] = [
        {
            fieldName: "type",
            header: "Tipo",
            renderCell: (row) => {
                return <>{row.consecutive.includes(".") ? "Indirecto" : "Directo"}</>
            }
        },
        {
            fieldName: "description",
            header: "Descripción",
            renderCell: (row) => {
                return <>{row.consecutive}. {row.description}</>
            }
        },
    ];
    const effectsActions: ITableAction<ICause>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                const search = row.consecutive.includes(".") ? row.consecutive.split(".")[0] : row.consecutive;
                const effect = getValues("effects").find(effect => effect.consecutive === search);
                let counter = null;
                if (row.consecutive.includes(".")) {
                    effect.childrens.forEach((children, index) => {
                        if (children.consecutive === row.consecutive) counter = index;
                    })
                }
                setMessage({
                    title: "Editar efecto",
                    description: <EffectsFormComponent ref={causesEffectsComponentRef} item={effect} counter={counter} />,
                    show: true,
                    background: true,
                    OkTitle: "Guardar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        if (causesEffectsComponentRef.current) {
                            causesEffectsComponentRef.current.handleSubmit((data: ICause) => {
                                const newEffects = getValues('effects').filter(effect => effect.consecutive !== data.consecutive).concat(data).sort((a, b) => parseInt(a.consecutive) - parseInt(b.consecutive));
                                setProblemDescriptionData(prev => {
                                    return { ...prev, effect: newEffects };
                                })
                                setValue("effects", newEffects);
                                setMessage({
                                    title: "Se editó exitosamente",
                                    description: "Se ha editado el efecto exitosamente",
                                    show: true,
                                    background: true,
                                    OkTitle: "Aceptar",
                                    onOk: () => {
                                        setMessage({});
                                    },
                                    onClose: () => {
                                        setMessage({});
                                    },
                                });
                            })();
                        }
                        setMessage({});
                    },
                    onCancel: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    },
                });
            }
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
                    title: row.consecutive.includes(".") ? "¿Desea quitar el efecto indirecto?" : "¿Desea quitar el efecto directo junto con sus efectos indirectos?",
                    onOk: () => {
                        if (row.consecutive.includes(".")) {
                            const newEffects = getValues("effects").map((effect) => {
                                return {
                                    ...effect, childrens: effect.childrens.filter(children => children.consecutive !== row.consecutive).map((children, childrenIndex) => {
                                        return { ...children, consecutive: `${effect.consecutive}.${childrenIndex + 1}` }
                                    })
                                }
                            })
                            setProblemDescriptionData(prev => {
                                return { ...prev, effects: newEffects };
                            })
                            setValue('effects', newEffects);
                        } else {
                            const effectsFilter = getValues("effects").filter((effect) => effect.consecutive !== row.consecutive);
                            const newEffects = effectsFilter.map((effect, index) => {
                                const newChildrends = effect.childrens.map((children, childrenIndex) => {
                                    return { ...children, consecutive: `${index + 1}.${childrenIndex + 1}` }
                                })
                                return { ...effect, consecutive: `${index + 1}`, childrens: newChildrends }
                            });
                            setProblemDescriptionData(prev => {
                                return { ...prev, effects: newEffects };
                            })
                            setValue('effects', newEffects);
                        }
                        setMessage({});
                    }
                });
            },
        }
    ];
    return (
        <div className="main-page">
            <FormComponent action={undefined} className="problem-description-container">
                <Controller
                    control={control}
                    name={"problemDescription"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción detallada del problema central, sus causas y efectos"
                                classNameLabel="text-black big bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            >
                                <label className="label-max-texarea">Max 800 caracteres</label>
                            </TextAreaComponent>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"magnitude"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Magnitud del problema"
                                classNameLabel="text-black big bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            >
                                <label className="label-max-texarea">Max 500 caracteres</label>
                            </TextAreaComponent>
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={"centerProblem"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Problema central"
                                classNameLabel="text-black big bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            >
                                <label className="label-max-texarea">Max 300 caracteres</label>
                            </TextAreaComponent>
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Listado de causas
                        </label>

                        <div className="title-button text-main biggest" onClick={() => {
                            setMessage({
                                title: "Agregar causas",
                                description: <CausesFormComponent ref={causesEffectsComponentRef} counter={problemDescriptionData?.causes ? problemDescriptionData.causes.length + 1 : 1} />,
                                show: true,
                                background: true,
                                OkTitle: "Guardar",
                                cancelTitle: "Cancelar",
                                onOk: () => {
                                    if (causesEffectsComponentRef.current) {
                                        causesEffectsComponentRef.current.handleSubmit((data: ICause) => {
                                            setProblemDescriptionData(prev => {
                                                const causes = prev?.causes ? prev.causes.concat(data) : [data];
                                                return { ...prev, causes: causes };
                                            })
                                            setValue('causes', getValues('causes').concat(data));
                                            setMessage({
                                                title: "Se guardó exitosamente",
                                                description: "Se ha agregado una causa exitosamente",
                                                show: true,
                                                background: true,
                                                OkTitle: "Aceptar",
                                                onOk: () => {
                                                    setMessage({});
                                                },
                                                onClose: () => {
                                                    setMessage({});
                                                },
                                            });
                                        })();
                                    }
                                },
                                onCancel: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                },
                                style: "causes-effects-modal-size"
                            });
                        }}>
                            Añadir causa <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('causes').length > 0 && <TableExpansibleComponent actions={causesActions} columns={causesColumns} data={getValues('causes')} />}
                </div>
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Listado de efectos
                        </label>

                        <div className="title-button text-main biggest" onClick={() => {
                            setMessage({
                                title: "Agregar efectos",
                                description: <EffectsFormComponent ref={causesEffectsComponentRef} counter={problemDescriptionData?.effects ? problemDescriptionData.effects.length + 1 : 1} />,
                                show: true,
                                background: true,
                                OkTitle: "Guardar",
                                cancelTitle: "Cancelar",
                                onOk: () => {
                                    if (causesEffectsComponentRef.current) {
                                        causesEffectsComponentRef.current.handleSubmit((data: IEffect) => {
                                            setProblemDescriptionData(prev => {
                                                const effects = prev?.effects ? prev.effects.concat(data) : [data];
                                                return { ...prev, effects: effects };
                                            })
                                            setValue('effects', getValues('effects').concat(data));
                                            setMessage({
                                                title: "Se guardó exitosamente",
                                                description: "Se ha agregado un efecto exitosamente",
                                                show: true,
                                                background: true,
                                                OkTitle: "Aceptar",
                                                onOk: () => {
                                                    setMessage({});
                                                },
                                                onClose: () => {
                                                    setMessage({});
                                                },
                                            });
                                        })();
                                    }
                                },
                                onCancel: () => {
                                    setMessage({});
                                },
                                onClose: () => {
                                    setMessage({});
                                },
                            });
                        }}>
                            Añadir efecto <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {getValues('effects').length > 0 && <TableExpansibleComponent actions={effectsActions} columns={effectsColumns} data={getValues('effects')} />}
                </div>
            </FormComponent>
        </div >
    )
}


interface IRef {
    handleSubmit: UseFormHandleSubmit<ICause | IEffect>;
}

interface IPropsCausesEffectsForm {
    counter?: number;
    item?: ICause | IEffect;
}

const compareIds = (id1: string | number, id2: string | number) => {
    if (id1 === null || id2 === null) return true;
    return id1 == id2;
};

const CausesFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter, item } = props;
    const resolver = useYupValidationResolver(causesEffectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue
    } = useForm<ICause>({ mode: "all", resolver, defaultValues: { consecutive: item ? item.consecutive : counter.toString(), description: item ? item.description : "" } });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "childrens",
    });
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));
    useEffect(() => {
        if (!item) return;
        item.childrens.forEach((children) => {
            append({
                consecutive: children.consecutive,
                description: children.description
            });
        });
    }, [item])
    useEffect(() => {
        fields.forEach((field, index) => {
            setValue(`childrens.${index}`, { consecutive: item ? `${item.consecutive}.${index + 1}` : `${counter.toString()}.${index + 1}`, description: field.description });
        });
    }, [fields]);
    return (
        <FormComponent action={undefined} className="causes-form-container">
            <div className="causes-inputs">
                <InputComponent
                    idInput="consecutive"
                    typeInput="text"
                    className="input-basic"
                    register={register}
                    label="No"
                    classNameLabel="text-black big bold"
                    direction={EDirection.row}
                    errors={errors}
                    disabled={true}
                />
                <Controller
                    control={control}
                    name={"description"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción causa Directa"
                                className="input-basic"
                                classNameLabel="text-black big bold"
                                direction={EDirection.row}
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                disabled={item ? counter !== null : false}
                                errors={errors} />
                        );
                    }}
                />
            </div>
            <div className="title-area">
                <label className="text-main biggest error-message bold">
                    {errors.childrens?.message}
                </label>
                <div className="title-button text-main biggest" onClick={() => {
                    if (item && counter) return;
                    append({
                        consecutive: item ? `${item.consecutive}.${fields.length + 1}` : `${counter.toString()}.${fields.length + 1}`,
                        description: ""
                    });
                }}>
                    Añadir causa indirecta <AiOutlinePlusCircle />
                </div>
            </div>
            <div className="causes-form-container">
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="causes-indirect-inputs">
                            <InputComponent
                                idInput={`childrens.${index}.consecutive`}
                                typeInput="text"
                                className="input-basic"
                                label="No"
                                classNameLabel="text-black big bold"
                                register={register}
                                direction={EDirection.row}
                                errors={errors}
                                fieldArray={true}
                                disabled={true}
                            />
                            <InputComponent
                                idInput={`childrens.${index}.description`}
                                typeInput="text"
                                className="input-basic"
                                label="Descripción causa Indirecta"
                                classNameLabel="text-black big bold text-required"
                                register={register}
                                direction={EDirection.row}
                                errors={errors}
                                fieldArray={true}
                                disabled={item ? !compareIds(counter, index) : false}
                            />
                            <div onClick={() => { remove(index) }} style={{ paddingTop: '1.8rem' }}>
                                <FaTrashAlt className="button grid-button button-delete" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </FormComponent>
    )
});

const EffectsFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter, item } = props;
    const resolver = useYupValidationResolver(causesEffectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue,
    } = useForm<IEffect>({ mode: "all", resolver, defaultValues: { consecutive: item ? item.consecutive : counter.toString(), description: item ? item.description : "" } });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "childrens",
    });
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));
    useEffect(() => {
        if (!item) return;
        item.childrens.forEach((children) => {
            append({
                consecutive: children.consecutive,
                description: children.description
            });
        });
    }, [item])
    useEffect(() => {
        fields.forEach((field, index) => {
            setValue(`childrens.${index}`, { consecutive: item ? `${item.consecutive}.${index + 1}` : `${counter.toString()}.${index + 1}`, description: field.description });
        });
    }, [fields]);
    return (
        <FormComponent action={undefined} className="causes-form-container">
            <div className="causes-inputs">
                <InputComponent
                    idInput="consecutive"
                    typeInput="text"
                    className="input-basic"
                    register={register}
                    label="No"
                    classNameLabel="text-black big bold"
                    direction={EDirection.row}
                    errors={errors}
                    disabled={true}
                />
                <Controller
                    control={control}
                    name={"description"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción efecto directo"
                                className="input-basic"
                                classNameLabel="text-black big bold"
                                direction={EDirection.row}
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                disabled={item ? counter !== null : false}
                                errors={errors} />
                        );
                    }}
                />
            </div>
            <div className="title-area">
                <label className="text-main biggest error-message bold">
                    {errors.childrens?.message}
                </label>
                <div className="title-button text-main biggest" onClick={() => {
                    append({
                        consecutive: item ? `${item.consecutive}.${fields.length + 1}` : `${counter.toString()}.${fields.length + 1}`,
                        description: ""
                    });
                }}>
                    Añadir efecto indirecto <AiOutlinePlusCircle />
                </div>
            </div>
            <div className="causes-form-container">
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="causes-indirect-inputs">
                            <InputComponent
                                idInput={`childrens.${index}.consecutive`}
                                typeInput="text"
                                className="input-basic"
                                label="No"
                                classNameLabel="text-black big bold"
                                register={register}
                                direction={EDirection.row}
                                errors={errors}
                                fieldArray={true}
                                disabled={true}
                            />
                            <InputComponent
                                idInput={`childrens.${index}.description`}
                                typeInput="text"
                                className="input-basic"
                                label="Descripción efecto indirecto"
                                classNameLabel="text-black big bold text-required"
                                register={register}
                                direction={EDirection.row}
                                errors={errors}
                                fieldArray={true}
                                disabled={item ? !compareIds(counter, index) : false}
                            />
                            <div onClick={() => { remove(index) }} style={{ paddingTop: '1.8rem' }}>
                                <FaTrashAlt className="button grid-button button-delete" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </FormComponent>
    )
});

export default React.memo(ProblemDescriptionComponent);