import { IIndicatorsPAITemp, IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ButtonComponent, FormComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { revisionPAIValidator } from "../../../common/schemas";
import { useContext, useEffect, useState } from "react";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import TableComponent from "../../../common/components/table.component";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { generalFieldsData } from "../data/dropdowns-revision-pai";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useEntitiesService } from "../hooks/entities-service.hook";
import { file_check_fill } from "../../../common/components/icons/file_check_fill";
import { check_o } from "../../../common/components/icons/check_o";
import { AppContext } from "../../../common/contexts/app.context";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";

interface IProps {
    indicator: IIndicatorsPAITemp;
    showGeneralFields: boolean;
}

function IndicatorsRevisionComponent({ indicator, showGeneralFields }: Readonly<IProps>): React.JSX.Element {
    const ind: IIndicatorsPAITemp = { ...indicator };
    const [typesIndicatorData, setTypesIndicatorData] = useState<IDropdownProps[]>([]);
    const [projectIndicatorsData, setProjectIndicatorsData] = useState<IDropdownProps[]>([]);
    const [fieldsData, setFieldsData] = useState<IDropdownProps[]>([]);
    const {
        revisionPAI,
        setRevisionPAI,
        pai, projectPAI,
        status: { status },
        fieldsChange,
        setCorrectionFields,
        correctionFields,
        fieldsCorrected,
        setFieldsCorrected,
        fieldsValues
    } = useContext(RevisionPAIContext);
    const { setMessage } = useContext(AppContext);
    const { getIndicatorsType } = useEntitiesService();
    const {
        register,
        control,
        formState: { errors },
        getValues,
        watch,
        setValue
    } = useForm<any>({ mode: "all", defaultValues: ind });
    const { fields: fieldsBimesters } = useFieldArray({
        control: control,
        name: "bimesters",
    });
    const { fields: fieldsProducts } = useFieldArray({
        control: control,
        name: "products",
    });
    const { fields: fieldsResponsibles } = useFieldArray({
        control: control,
        name: "responsibles",
    });
    const { fields: fieldsCoresponsibles } = useFieldArray({
        control: control,
        name: "coresponsibles",
    });
    const resolver = useYupValidationResolver(revisionPAIValidator);
    const {
        register: registerRevision,
        control: controlRevision,
        formState: { errors: errorsRevision },
        handleSubmit,
        reset
    } = useForm<IRevisionFormPAI>({ resolver, mode: "all" });
    const onSubmit = handleSubmit(async (data: IRevisionFormPAI) => {
        setRevisionPAI(prev => {
            const newRevision = prev.concat({ ...data, idIndicator: indicator.id });
            return newRevision;
        });
        reset();
    });
    const tableData = revisionPAI.filter(revision => revision.idIndicator === indicator.id || (showGeneralFields && revision.idIndicator === null));
    const tableColumns: ITableElement<IRevisionFormPAI>[] = [
        {
            header: "Campo",
            fieldName: "field",
            renderCell: (row) => {
                const field = fieldsData.find(field => field.value === row.field);
                return <>{field ? field.name : ""}</>
            }
        },
        {
            header: "Observaciones",
            fieldName: "observations"
        }
    ];
    const actionColumnCorrection: ITableAction<IRevisionFormPAI>[] = [
        {
            customIcon: (row) => {
                const field = row.field.split(" || ");
                if (fieldsCorrected.includes(field[0]) || fieldsCorrected.includes(field[1])) return check_o;
                return file_check_fill;
            },
            onClick: (row) => {
                const field = row.field.split(" || ");
                if (correctionFields[indicator.id] && (Reflect.has(correctionFields[indicator.id], field[0]) || Reflect.has(correctionFields[indicator.id], field[1]))) {
                    setMessage({
                        title: "Hacer cambios",
                        description: "¿Deseas confirmar que haz realizado el cambio?",
                        show: true,
                        OkTitle: "Aceptar",
                        cancelTitle: "Cancelar",
                        onCancel: () => {
                            setMessage({});
                        },
                        onOk: () => {
                            setFieldsCorrected(prev => {
                                let corrected = [...prev, row.field];
                                return corrected;
                            });
                            setMessage({});
                        },
                    });
                } else {
                    setMessage({
                        title: "Hacer cambios",
                        description: "Debes cambiar el valor del campo antes de confirmar los cambios.",
                        show: true,
                        OkTitle: "Aceptar",
                        onCancel: () => {
                            setMessage({});
                        },
                        onOk: () => {
                            setMessage({});
                        },
                    });
                }
            }
        }
    ];
    const actionColumnAdjustment: ITableAction<IRevisionFormPAI>[] = [

    ];
    const actionColumnsTable = {
        "revision": null,
        "correction": actionColumnCorrection,
        "adjustment": actionColumnAdjustment
    };
    useEffect(() => {
        const linesData: IDropdownProps[] = pai.linePAI.map((line, index) => {
            return {
                name: `Línea No. ${index + 1}`,
                value: `linePAI.${line.id}`
            }
        });
        const risksData: IDropdownProps[] = pai.risksPAI.map((risk, index) => {
            return {
                name: `Riesgo No. ${index + 1}`,
                value: `risksPAI.${risk.id}`
            }
        });
        const indicatorFieldsData: IDropdownProps[] = [
            {
                value: `description.${indicator.id}`,
                name: "Descripción de la Acción"
            },
            {
                value: `projectIndicator.${indicator.id} || indicatorDesc.${indicator.id}`,
                name: "Indicador proyecto/Descripción indicador"
            },
            {
                value: `indicatorType.${indicator.id}`,
                name: "Tipo indicador"
            }
        ]
        const bimestersData: IDropdownProps[] = indicator.bimesters.map((bimester, index) => {
            return {
                name: `Bimestre ${index + 1}`,
                value: `bimesters.${bimester.id}`
            }
        });
        const productsData: IDropdownProps[] = indicator.products.map((product, index) => {
            return {
                name: `Producto No. ${index + 1}`,
                value: `products.${product.id}`
            }
        });
        const responsiblesData: IDropdownProps[] = indicator.responsibles.map((responsible, index) => {
            return {
                name: `Responsable No. ${index + 1}`,
                value: `responsibles.${responsible.id}`
            }
        });
        const coresponsiblesData: IDropdownProps[] = indicator.coresponsibles.map((coresponsible, index) => {
            return {
                name: `Corresponsable No. ${index + 1}`,
                value: `coresponsibles.${coresponsible.id}`
            }
        });
        if (showGeneralFields) {
            setFieldsData(generalFieldsData.concat(linesData).concat(risksData).concat(indicatorFieldsData).concat(bimestersData).concat(productsData).concat(responsiblesData).concat(coresponsiblesData));
        } else {
            setFieldsData(indicatorFieldsData.concat(bimestersData).concat(productsData).concat(responsiblesData).concat(coresponsiblesData))
        }
        getIndicatorsType().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const indicatorType: IPAIIndicatorType[] = response.data;
                const arrayIndicatorsType: IDropdownProps[] = indicatorType.map((indicator) => {
                    return { name: indicator?.description, value: indicator?.id };
                });
                setTypesIndicatorData(arrayIndicatorsType);
            }
        }).catch(() => { });
        if (projectPAI) {
            const projectInd = projectPAI.indicatorsAction?.concat(projectPAI.indicatorsIndicative);
            let arrayIndicators = [];
            for (let i = 0; i < projectInd?.length; i++) {
                const ind = projectPAI.activities
                    ?.find(activity => activity.productMGA === projectInd[i].productMGA);
                arrayIndicators.push({
                    name: `${ind?.productMGA} - ${ind?.productDescriptionMGA}`,
                    value: projectInd[i].type
                })
            }
            setProjectIndicatorsData(arrayIndicators);
        }
        if (fieldsValues.length > 0) {
            const values = Reflect.ownKeys(getValues());
            fieldsValues.forEach(value => {
                const field = value.field.split(".");
                if (values.includes(field[0])) {
                    if (field[0] === "bimesters") {
                        const bimesters = getValues("bimesters");
                        bimesters.forEach((bimester, index) => {
                            if (String(bimester.id) === field[1]) setValue(`${field[0]}.${index}.value`, value.value);
                        });
                    } else if (field[0] === "products") {
                        const products = getValues("products");
                        products.forEach((product, index) => {
                            if (String(product.id) === field[1]) setValue(`${field[0]}.${index}.product`, value.value);
                        });
                    } else if (field[0] === "responsibles") {
                        const responsibles = getValues("responsibles");
                        responsibles.forEach((responsible, index) => {
                            if (String(responsible.id) === field[1]) setValue(`${field[0]}.${index}.responsible`, value.value);
                        });
                    } else if (field[0] === "coresponsibles") {
                        const coresponsibles = getValues("coresponsibles");
                        coresponsibles.forEach((coresponsible, index) => {
                            if (String(coresponsible.id) === field[1]) setValue(`${field[0]}.${index}.coresponsible`, value.value);
                        });
                    } else {
                        setValue(field[0], value.value);
                    }
                }
            });
        }
    }, []);
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            return setCorrectionFields(prev => {
                const newValues = { ...prev[indicator.id] };
                const nameField = name.split(".");
                if (nameField.length === 1) {
                    const field = name
                        .replace(".line", "")
                        .replace(".risk", "")
                        .replace(".product", "")
                        .replace(".responsible", "")
                        .replace(".coresponsible", "")
                        .replace(".value", "");
                    Reflect.set(newValues, `${field}.${indicator.id}`, value[field]);
                } else {
                    const item = value[nameField[0]][nameField[1]];
                    Reflect.set(newValues, `${nameField[0]}.${item.id}`, value[nameField[0]][nameField[1]][nameField[2]]);
                }
                const valueReturn = { ...prev };
                Reflect.set(valueReturn, indicator.id, newValues);
                return valueReturn;
            });
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    return (
        <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                <SelectComponent
                    control={control}
                    idInput={"projectIndicator"}
                    className={`select-basic span-width`}
                    label="Indicador de proyecto"
                    classNameLabel={`text-black biggest bold`}
                    data={projectIndicatorsData}
                    errors={errors}
                    filter={true}
                    disabled={(!fieldsChange.includes(`projectIndicator.${indicator.id} || indicatorDesc.${indicator.id}`) ? true : pai.typePAI !== 1) || fieldsCorrected.includes(`projectIndicator.${indicator.id}`)}
                />
                <SelectComponent
                    control={control}
                    idInput={"indicatorType"}
                    className={`select-basic span-width`}
                    label="Tipo de indicador"
                    classNameLabel={`text-black biggest bold`}
                    data={typesIndicatorData}
                    errors={errors}
                    filter={true}
                    disabled={!fieldsChange.includes(`indicatorType.${indicator.id}`) || fieldsCorrected.includes(`indicatorType.${indicator.id}`)}
                />
            </div>
            <Controller
                control={control}
                name={"indicatorDesc"}
                defaultValue=""
                render={({ field }) => {
                    return (
                        <TextAreaComponent
                            id={field.name}
                            idInput={field.name}
                            value={`${field.value}`}
                            label="Descripción del indicador"
                            classNameLabel="text-black biggest bold"
                            className="text-area-basic"
                            register={register}
                            onChange={field.onChange}
                            errors={errors}
                            disabled={(!fieldsChange.includes(`projectIndicator.${indicator.id} || indicatorDesc.${indicator.id}`) ? true : pai.typePAI !== 2) || fieldsCorrected.includes(`indicatorDesc.${indicator.id}`)}
                        >
                        </TextAreaComponent>
                    );
                }}
            />
            <div className="card-table">
                <div className="title-area">
                    <div className="text-black large bold">Meta planeada</div>
                </div>
                <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                    {
                        fieldsBimesters.map((item, index) => {
                            const idField = getValues(`bimesters.${index}.id`);
                            return (
                                <InputNumberComponent key={item.id}
                                    idInput={`bimesters.${index}.value`}
                                    control={control}
                                    label={`Bimestre ${index + 1}`}
                                    errors={errors}
                                    placeholder=""
                                    suffix={`${indicator.typePAI === 2 ? "%" : ""}`}
                                    classNameLabel="text-black biggest bold"
                                    className={`inputNumber-basic`}
                                    disabled={!fieldsChange.includes(`bimesters.${idField}`) || fieldsCorrected.includes(`bimesters.${idField}`)}
                                />
                            )
                        })
                    }
                    <InputNumberComponent
                        idInput={`totalPlannedGoal`}
                        control={control}
                        label={`Meta total planeada`}
                        errors={errors}
                        placeholder=""
                        suffix={`${indicator.typePAI === 2 ? "%" : ""}`}
                        classNameLabel="text-black biggest bold"
                        className={`inputNumber-basic`}
                        disabled={true}
                    />
                </div>
            </div>
            <div className="card-table">
                <div className="title-area">
                    <div className="text-black large bold">Productos</div>
                </div>
                <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                    {
                        fieldsProducts.map((item, index) => {
                            const idField = getValues(`products.${index}.id`);
                            return (
                                <Controller key={item.id}
                                    control={control}
                                    name={`products.${index}.product`}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label={`Producto No. ${index + 1}`}
                                                classNameLabel="text-black biggest bold"
                                                className="text-area-basic"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                disabled={!fieldsChange.includes(`products.${idField}`) || fieldsCorrected.includes(`products.${idField}`)}
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className="card-table">
                <div className="title-area">
                    <div className="text-black large bold">Responsable directo</div>
                </div>
                <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                    {
                        fieldsResponsibles.map((item, index) => {
                            const idField = getValues(`responsibles.${index}.id`);
                            return (
                                <Controller key={item.id}
                                    control={control}
                                    name={`responsibles.${index}.responsible`}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label={`Responsable No. ${index + 1}`}
                                                classNameLabel="text-black biggest bold"
                                                className="text-area-basic"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                disabled={!fieldsChange.includes(`responsibles.${idField}`) || fieldsCorrected.includes(`responsibles.${idField}`)}
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <div className="card-table">
                <div className="title-area">
                    <div className="text-black large bold">Corresponsables</div>
                </div>
                <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                    {
                        fieldsCoresponsibles.map((item, index) => {
                            const idField = getValues(`coresponsibles.${index}.id`);
                            return (
                                <Controller key={item.id}
                                    control={control}
                                    name={`coresponsibles.${index}.coresponsible`}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label={`Corresponsable No. ${index + 1}`}
                                                classNameLabel="text-black biggest bold"
                                                className="text-area-basic"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                disabled={!fieldsChange.includes(`coresponsibles.${idField}`) || fieldsCorrected.includes(`coresponsibles.${idField}`)}
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                            )
                        })
                    }
                </div>
            </div>
            <FormComponent action={undefined} id="revision-form" className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                {status === "revision" && <>
                    <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                        <SelectComponent
                            control={controlRevision}
                            idInput={"field"}
                            className={`select-basic span-width`}
                            label="Campo"
                            classNameLabel={`text-black biggest bold text-required`}
                            data={fieldsData}
                            errors={errorsRevision}
                            filter={true}
                        />
                    </div>
                    <div className="strategic-direction-revision-pai-form">
                        <Controller
                            control={controlRevision}
                            name={`observations`}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Observaciones"
                                        characters={5000}
                                        classNameLabel="text-black biggest bold text-required"
                                        className="text-area-basic"
                                        register={registerRevision}
                                        onChange={field.onChange}
                                        errors={errorsRevision}
                                    >
                                    </TextAreaComponent>
                                );
                            }}
                        />
                        <div style={{ textAlign: "center" }}>
                            <ButtonComponent
                                className="button-main huge hover-three button-save"
                                value="Agregar observación"
                                type="button"
                                action={onSubmit}
                                form="revision-form"
                            />
                        </div>
                    </div>
                </>
                }
                {tableData.length > 0 && <div className="card-table">
                    <TableComponent
                        columns={tableColumns}
                        data={tableData}
                        title="Campos a modificar"
                        isShowModal={false}
                        actions={actionColumnsTable[status]}
                        hideActions={status === "revision"}
                    />
                </div>}
            </FormComponent>
        </div>
    );
}

export default IndicatorsRevisionComponent;