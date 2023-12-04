import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ICause, IEffect, IObjectivesForm } from "../interfaces/ProjectsInterfaces";
import { ProjectsContext } from "../contexts/projects.context";
import { AppContext } from "../../../common/contexts/app.context";
import { Controller, UseFormHandleSubmit, useFieldArray, useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { causesValidator, effectsValidator, objectivesValidator } from "../../../common/schemas";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import TableExpansibleComponent from "./table-expansible.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IDropdownProps } from "../../../common/interfaces/select.interface";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
}
export function ObjectivesComponent({ disableNext, enableNext }: Readonly<IProps>): React.JSX.Element {
    const specificObjectivesPurposesComponentRef = useRef(null);
    const [objectivesData, setObjectivesData] = useState<IObjectivesForm>(null)
    const [measurementData, setMeasurementData] = useState<IDropdownProps[]>([]);
    const { setProjectData, projectData, formAction, setDisableContinue, isADisabledInput, setDisableStatusUpdate } = useContext(ProjectsContext);
    const { setMessage } = useContext(AppContext);
    const { getListByGrouper } = useGenericListService();
    const resolver = useYupValidationResolver(objectivesValidator);
    const {
        control,
        register,
        getValues,
        setValue,
        formState: { errors, isValid },
        watch
    } = useForm<IObjectivesForm>({
        resolver, mode: "all", defaultValues: {
            generalObjective: projectData?.identification?.problemDescription?.centerProblem ? projectData.identification.problemDescription.centerProblem : "",
            specificObjectives: projectData?.identification?.problemDescription?.causes ? projectData.identification.problemDescription.causes : [],
            purposes: projectData?.identification?.problemDescription?.effects ? projectData.identification.problemDescription.effects : [],
            measurement: projectData?.identification?.objectives?.measurement ? projectData.identification.objectives.measurement : null,
            indicators: projectData?.identification?.objectives?.indicators ? projectData.identification.objectives.indicators : "",
            goal: projectData?.identification?.objectives?.goal ? projectData.identification.objectives.goal : null
        }
    });
    useEffect(() => {
        getListByGrouper("UNIDAD_MEDIDA_OBJETIVOS").then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const data: IDropdownProps[] = response.data.map(data => {
                    return { name: data.itemDescription, value: Number(data.itemCode) }
                })
                setMeasurementData(data);
            }
        });
    }, []);
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
        const subscription = watch((value: IObjectivesForm) => setObjectivesData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    useEffect(() => {
        if (objectivesData) setProjectData(prev => {
            const identification = prev ? { ...prev.identification, problemDescription: { ...prev.identification.problemDescription, centerProblem: objectivesData.generalObjective, causes: objectivesData.specificObjectives, effects: objectivesData.purposes }, objectives: { ...objectivesData } } : { objectives: { ...objectivesData } };
            return { ...prev, identification: { ...identification } }
        })
    }, [objectivesData]);
    const specificObjectivesColumns: ITableElement<ICause>[] = [
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
    const specificObjectivesActions: ITableAction<ICause>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                const search = row.consecutive.includes(".") ? row.consecutive.split(".")[0] : row.consecutive;
                const specificObjective = getValues("specificObjectives").find(specificObjective => specificObjective.consecutive === search);
                let counter = null;
                if (row.consecutive.includes(".")) {
                    specificObjective.childrens.forEach((children, index) => {
                        if (children.consecutive === row.consecutive) counter = index;
                    })
                }
                setMessage({
                    title: "Editar objetivos específicos",
                    description: <SpecificObjectivesFormComponent ref={specificObjectivesPurposesComponentRef} item={specificObjective} counter={counter} />,
                    show: true,
                    background: true,
                    OkTitle: "Guardar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        if (specificObjectivesPurposesComponentRef.current) {
                            specificObjectivesPurposesComponentRef.current.handleSubmit((data: ICause) => {
                                const newSpecificObjectives = getValues('specificObjectives').filter(specificObjective => specificObjective.consecutive !== data.consecutive).concat(data).sort((a, b) => parseInt(a.consecutive) - parseInt(b.consecutive));
                                setObjectivesData(prev => {
                                    return { ...prev, causes: newSpecificObjectives };
                                })
                                setValue("specificObjectives", newSpecificObjectives);
                                setMessage({
                                    title: "Se editó exitosamente",
                                    description: "¡Se ha editado exitosamente!",
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
            },
            hideRow: () => isADisabledInput
        }
    ];
    const purposesColumns: ITableElement<IEffect>[] = [
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
    const purposesActions: ITableAction<IEffect>[] = [
        {
            icon: "Edit",
            onClick: (row) => {
                const search = row.consecutive.includes(".") ? row.consecutive.split(".")[0] : row.consecutive;
                const effect = getValues("purposes").find(effect => effect.consecutive === search);
                let counter = null;
                if (row.consecutive.includes(".")) {
                    effect.childrens.forEach((children, index) => {
                        if (children.consecutive === row.consecutive) counter = index;
                    })
                }
                setMessage({
                    title: "Editar fines",
                    description: <PurposesFormComponent ref={specificObjectivesPurposesComponentRef} item={effect} counter={counter} />,
                    show: true,
                    background: true,
                    OkTitle: "Guardar",
                    cancelTitle: "Cancelar",
                    onOk: () => {
                        if (specificObjectivesPurposesComponentRef.current) {
                            specificObjectivesPurposesComponentRef.current.handleSubmit((data: IEffect) => {
                                const newPurposes = getValues('purposes').filter(purpose => purpose.consecutive !== data.consecutive).concat(data).sort((a, b) => parseInt(a.consecutive) - parseInt(b.consecutive));
                                setObjectivesData(prev => {
                                    return { ...prev, effect: newPurposes };
                                })
                                setValue("purposes", newPurposes);
                                setMessage({
                                    title: "Se editó exitosamente",
                                    description: "Se ha editado fin exitosamente",
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
            },
            hideRow: () => isADisabledInput
        }
    ];

    return (
        <div className="card-table">
            <FormComponent action={undefined} className="problem-description-container">
                <Controller
                    control={control}
                    name={"generalObjective"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Objetivo general"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={300}
                                disabled={ isADisabledInput }
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Listado de objetivos específicos
                        </label>

                        <div className="title-button text-main biggest">
                            {errors.specificObjectives}
                        </div>
                    </div>
                    {getValues('specificObjectives').length > 0 && <TableExpansibleComponent actions={specificObjectivesActions} columns={specificObjectivesColumns} data={getValues('specificObjectives')} hideActions={isADisabledInput}/>}
                </div>
                <div>
                    <div className="title-area">
                        <label className="text-black large bold text-required">
                            Listado de fines
                        </label>

                        <div className="title-button text-main large">
                            {errors.purposes}
                        </div>
                    </div>
                    {getValues('purposes').length > 0 && <TableExpansibleComponent actions={purposesActions} columns={purposesColumns} data={getValues('purposes')} hideActions={isADisabledInput} />}
                </div>
                <Controller
                    control={control}
                    name={"indicators"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Indicadores para medir objetivo central"
                                classNameLabel="text-black biggest bold text-required"
                                className="text-area-basic"
                                placeholder="Escribe aquí"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                characters={500}
                                disabled={ isADisabledInput }
                            >
                            </TextAreaComponent>
                        );
                    }}
                />
                <div className="identification-objectives-container">
                    <SelectComponent
                        control={control}
                        idInput={"measurement"}
                        className="select-basic"
                        label="Unidad de medida"
                        classNameLabel="text-black biggest bold text-required"
                        data={measurementData}
                        errors={errors}
                        filter={true}
                        disabled={ isADisabledInput }
                    />
                    <Controller
                        control={control}
                        name={"goal"}
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label="Meta"
                                    className="input-basic"
                                    classNameLabel="text-black biggest bold text-required"
                                    typeInput={"number"}
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                    disabled={ isADisabledInput }
                                />
                            );
                        }}
                    />
                    
                </div>
            </FormComponent>
        </div>
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

const SpecificObjectivesFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter, item } = props;
    const resolver = useYupValidationResolver(causesValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue
    } = useForm<ICause>({ mode: "all", resolver, defaultValues: { consecutive: item ? item.consecutive : counter.toString(), description: item ? item.description : "" } });
    const { fields, append } = useFieldArray({
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
                    className="input-basic background-textArea"
                    register={register}
                    label="No"
                    classNameLabel="text-black big bold"
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
                                label="Descripción objetivo Directo"
                                className="input-basic"
                                classNameLabel="text-black big bold text-required"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                disabled={item ? counter !== null : false}
                                errors={errors} />
                        );
                    }}
                />
            </div>
            <div className="causes-form-container">
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="causes-inputs">
                            <InputComponent
                                idInput={`childrens.${index}.consecutive`}
                                typeInput="text"
                                className="input-basic background-textArea"
                                label="No"
                                classNameLabel="text-black big bold"
                                register={register}
                                errors={errors}
                                fieldArray={true}
                                disabled={true}
                            />
                            <Controller
                                control={control}
                                name={`childrens.${index}.description`}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Descripción objetivo Directo"
                                            className="input-basic"
                                            classNameLabel="text-black big bold text-required"
                                            typeInput={"text"}
                                            register={register}
                                            onChange={field.onChange}
                                            disabled={item ? !compareIds(counter, index) : false}
                                            errors={errors} />
                                    );
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </FormComponent>
    );
});

const PurposesFormComponent = forwardRef<IRef, IPropsCausesEffectsForm>((props, ref) => {
    const { counter, item } = props;
    const resolver = useYupValidationResolver(effectsValidator);
    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue,
    } = useForm<IEffect>({ mode: "all", resolver, defaultValues: { consecutive: item ? item.consecutive : counter.toString(), description: item ? item.description : "" } });
    const { fields, append } = useFieldArray({
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
                    className="input-basic background-textArea"
                    register={register}
                    label="No"
                    classNameLabel="text-black big bold"
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
                                label="Descripción fin Directo"
                                className="input-basic"
                                classNameLabel="text-black big bold text-required"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                disabled={item ? counter !== null : false}
                                errors={errors} />
                        );
                    }}
                />
            </div>
            <div className="causes-form-container">
                {fields.map((field, index) => {
                    return (
                        <div key={field.id} className="causes-inputs">
                            <InputComponent
                                idInput={`childrens.${index}.consecutive`}
                                typeInput="text"
                                className="input-basic background-textArea"
                                label="No"
                                classNameLabel="text-black big bold"
                                register={register}
                                errors={errors}
                                fieldArray={true}
                                disabled={true}
                            />
                            <Controller
                                control={control}
                                name={`childrens.${index}.description`}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Descripción fin Indirecto"
                                            className="input-basic"
                                            classNameLabel="text-black big bold text-required"
                                            typeInput={"text"}
                                            register={register}
                                            onChange={field.onChange}
                                            disabled={item ? !compareIds(counter, index) : false}
                                            errors={errors} />
                                    );
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </FormComponent>
    );
});

export default React.memo(ObjectivesComponent);