import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { causesValidator, effectsValidator, problemDescriptionValidator } from "../../../common/schemas";
import { Controller, UseFormHandleSubmit, useFieldArray, useForm } from "react-hook-form";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { ICause, IEffect, IProblemDescriptionForm , IActorsForm, IParticipatingActors } from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { FaTrashAlt } from "react-icons/fa";
import { AppContext } from "../../../common/contexts/app.context";
import { EDirection } from "../../../common/constants/input.enum";
import { ProjectsContext } from "../contexts/projects.context";
import TableComponent from "../../../common/components/table.component";


interface IProps {
    disableNext: () => void;
    enableNext: () => void;
}


export function ActorCreateComponent({ disableNext, enableNext }: IProps): React.JSX.Element {
    const ActorCreateComponentRef = useRef(null);
    const [ActorCreateData, setActorCreateData] = useState<IActorsForm>()
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
    } = useForm<IActorsForm>({
        resolver, defaultValues: {
            actors: projectData?.identification?.actors?.actors ? projectData.identification.actors.actors : [],
        }
    });

    // useEffect(() => {
    //     if (projectData) setActorCreateData(projectData.identification.actors.actors);
    // }, []);

    useEffect(() => {
        const subscription = watch((value: IActorsForm) => setActorCreateData(prev => { return { ...prev, ...value } }));
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
        if (ActorCreateData) setProjectData(prev => {
            const identification = prev ? { ...prev.identification, actors: { ...ActorCreateData } } : { actors: { ...ActorCreateData } };
            return { ...prev, identification: { ...identification } }
        })
    }, [ActorCreateData]);

    const actorColumns: ITableElement<IParticipatingActors>[] = [
        {
            fieldName: "actor",
            header: "Actor",
        },
        {
            fieldName: "expectation",
            header: "Interés/Expectativa",
        },
        {
            fieldName: "position",
            header: "Posición",
        },
        {
            fieldName: "contribution",
            header: "Contribución",
        },
    ];
    const actorActions: ITableAction<ICause>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                const search = row.consecutive.includes(".") ? row.consecutive.split(".")[0] : row.consecutive;
                const actor = getValues("actors").find(actor => actor.actor === search);
                let counter = null;
               
                setMessage({
                    title: "Editar Actor",
                  //description: <ActorFormComponent ref={causesEffectsComponentRef} item={actor} counter={counter} />,
                    show: true,
                    background: true,
                    OkTitle: "Guardar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        if (ActorCreateComponentRef.current) {
                            ActorCreateComponentRef.current.handleSubmit((data: IParticipatingActors) => {
                                const newCauses = getValues('actors').filter(actor => actor.actor !== data.actor).concat(data).sort((a, b) => parseInt(a.actor) - parseInt(b.actor));
                                setActorCreateData(prev => {
                                    return { ...prev, actors: newCauses };
                                })
                                setValue("actors", newCauses);
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
                    },
                    onCancel: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    },
                    style: "causes-effects-modal-size"
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
                      
                    }
                });
            },
        }
    ];
    return (
        <div className="main-page">
            <FormComponent action={undefined} className="problem-description-container">
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Listado de actores
                        </label>

                        <div className="title-button text-main biggest" onClick={() => {
                            setMessage({
                                title: "Agregar Actor",
                                description: <ActorFormComponent ref={ActorCreateComponentRef} />,
                                show: true,
                                background: true,
                                OkTitle: "Guardar",
                                cancelTitle: "Cancelar",
                                onOk: () => {
                                    if (ActorCreateComponentRef.current) {
                                        ActorCreateComponentRef.current.handleSubmit((data: IParticipatingActors) => {
                                            setActorCreateData(prev => {
                                                const actors = prev?.actors ? prev.actors.concat(data) : [data];
                                                return { ...prev, actors: actors };
                                            })
                                            setValue('actors', getValues('actors').concat(data));
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
                            Añadir Actor <AiOutlinePlusCircle />
                        </div>
                    </div>
                    {<TableExpansibleComponent actions={actorActions} columns={actorColumns} data={getValues('actors')} />}
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

const ActorFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter, item } = props;
    const positionData: IDropdownProps[] = [
        {
            name: "Posición 1",
            value: "1",
        },
        {
            name: " Posición 2",
            value: "2",
        }
    ];
    const resolver = useYupValidationResolver(causesValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue
    } = useForm<IParticipatingActors>({ mode: "all" });
   
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));

    return (
        <FormComponent action={undefined} className="actors-form-container">
            <div className="actors-inputs">
                 <Controller
                        control={control}
                        name={"actor"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Actor"
                                    classNameLabel="text-black big bold text-required"
                                    className="text-area-basic"
                                    placeholder="Escribe aquí"
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"expectation"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Interés/Expectativa"
                                    classNameLabel="text-black big bold text-required"
                                    className="text-area-basic"
                                    placeholder="Escribe aquí"
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"position"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <SelectComponent
                                idInput={field.name}
                                className="select-basic"
                                control={control}
                                errors={errors}
                                label="Posición"
                                classNameLabel="text-black biggest bold text-required"
                                direction={EDirection.row}
                                data={positionData}
                            />
                            );
                        }}
                    />

                    <Controller
                        control={control}
                        name={"contribution"}
                        defaultValue=""
                        render={({ field }) => {
                            return (
                                <TextAreaComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Contribución"
                                    classNameLabel="text-black big bold text-required"
                                    className="text-area-basic"
                                    placeholder="Escribe aquí"
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                />
                            );
                        }}
                    />
            </div>
        </FormComponent>
    )
});

export default React.memo(ActorCreateComponent);