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
    } = useForm<IProblemDescriptionForm>({ resolver, defaultValues: {
        problemDescription: projectData?.identification?.problemDescription?.problemDescription ? projectData.identification.problemDescription.problemDescription : "",
        magnitude: projectData?.identification?.problemDescription?.magnitude ? projectData.identification.problemDescription.magnitude : "",
        centerProblem: projectData?.identification?.problemDescription?.centerProblem ? projectData.identification.problemDescription.centerProblem : "",
        causes: projectData?.identification?.problemDescription?.causes ? projectData.identification.problemDescription.causes : [],
        effects: projectData?.identification?.problemDescription?.effects ? projectData.identification.problemDescription.effects : [],
    }});

    useEffect(() => {
        if(projectData) setProblemDescriptionData(projectData.identification?.problemDescription)
    }, []);

    useEffect(() => {
        const subscription = watch((value: IProblemDescriptionForm) => setProblemDescriptionData(prev => {return {...prev, ...value}}));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        if(isValid) {
            enableNext();
        } else {
            disableNext();
        }
    }, [isValid]);

    useEffect(() => {
        if(problemDescriptionData) setProjectData(prev => {
            const identification = prev ? {...prev.identification, problemDescription: {...problemDescriptionData}} : {problemDescription: {...problemDescriptionData}};
            return {...prev, identification: {...identification}}
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
            header: "Descripción"
        },
    ];
    const causesActions: ITableAction<ICause>[] = [
        {
            icon: "Detail",
            onClick: (row) => {
                console.log(row)
            },
        },
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
            header: "Descripción"
        },
    ];
    const effectsActions: ITableAction<ICause>[] = [
        {
            icon: "Detail",
            onClick: (row) => {

            },
        },
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
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            />
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
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            />
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
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                            />
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
                                description: <CausesFormComponent ref={causesEffectsComponentRef} counter={problemDescriptionData.causes.length+1} />,
                                show: true,
                                background: true,
                                OkTitle: "Guardar",
                                cancelTitle: "Cancelar",
                                onOk: () => {
                                    if (causesEffectsComponentRef.current) {
                                        causesEffectsComponentRef.current.handleSubmit((data: ICause) => {
                                            setProblemDescriptionData(prev => {
                                                const causes = prev?.causes ? prev.causes.concat(data) : [data];
                                                return {...prev, causes: causes};
                                            })
                                            setValue('causes', getValues('causes').concat(data));
                                            setMessage({});
                                        })();
                                    }
                                },
                                onCancel: () => {
                                    setMessage({});
                                },
                            });
                        }}>
                            Añadir causa <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <TableExpansibleComponent actions={causesActions} columns={causesColumns} data={getValues('causes')} />
                </div>
                <div>
                    <div className="title-area">
                        <label className="text-black biggest bold">
                            Listado de efectos
                        </label>

                        <div className="title-button text-main biggest" onClick={() => {
                            setMessage({
                                title: "Agregar efectos",
                                description: <EffectsFormComponent ref={causesEffectsComponentRef} counter={problemDescriptionData.causes.length+1} />,
                                show: true,
                                background: true,
                                OkTitle: "Guardar",
                                cancelTitle: "Cancelar",
                                onOk: () => {
                                    if (causesEffectsComponentRef.current) {
                                        causesEffectsComponentRef.current.handleSubmit((data: IEffect) => {
                                            console.log(data)
                                            setMessage({});
                                        })();
                                    }
                                },
                                onCancel: () => {
                                    setMessage({});
                                },
                            });
                        }}>
                            Añadir efecto <AiOutlinePlusCircle />
                        </div>
                    </div>
                    <TableExpansibleComponent actions={effectsActions} columns={effectsColumns} data={getValues('effects')} />
                </div>
            </FormComponent>
        </div>
    )
}


interface IRef {
    handleSubmit: UseFormHandleSubmit<ICause | IEffect, undefined>;
}

interface IPropsCausesEffectsForm {
    counter: number;
}

const CausesFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter } = props;
    const resolver = useYupValidationResolver(causesEffectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control
    } = useForm<ICause>({ mode: "all", resolver, defaultValues: { consecutive: counter.toString() } });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "childrens",
    });
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));
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
                <InputComponent
                    idInput="description"
                    typeInput="text"
                    className="input-basic"
                    register={register}
                    label="Descripción causa Directa"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.row}
                    errors={errors}
                />
            </div>
            <div className="title-area">
                <label className="text-main biggest error-message">
                    {errors.childrens?.message}
                </label>
                <div className="title-button text-main biggest" onClick={() => {
                    append({
                        consecutive: `${counter.toString()}.${fields.length + 1}`,
                        description: ""
                    })
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
                            />
                            <div onClick={() => { remove(index) }} style={{ paddingTop: '1.4rem' }}>
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
    const { counter } = props;
    const resolver = useYupValidationResolver(causesEffectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control
    } = useForm<IEffect>({ mode: "all", resolver, defaultValues: { consecutive: counter.toString() } });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "childrens",
    });
    useImperativeHandle(ref, () => ({
        handleSubmit: handleSubmit
    }));
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
                <InputComponent
                    idInput="description"
                    typeInput="text"
                    className="input-basic"
                    register={register}
                    label="Descripción efecto directa"
                    classNameLabel="text-black big bold text-required"
                    direction={EDirection.row}
                    errors={errors}
                />
            </div>
            <div className="title-area">
                <label className="text-main biggest error-message">
                    {errors.childrens?.message}
                </label>
                <div className="title-button text-main biggest" onClick={() => {
                    append({
                        consecutive: `${counter.toString()}.${fields.length + 1}`,
                        description: ""
                    })
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
                            />
                            <div onClick={() => { remove(index) }} style={{ paddingTop: '1.4rem' }}>
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