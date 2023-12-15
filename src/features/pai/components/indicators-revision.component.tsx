import { IIndicatorsPAITemp, IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { IApproveRevisionPAI, IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent, InputRadioComponent } from "../../../common/components/Form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { approvePAIValidator, revisionPAIValidator } from "../../../common/schemas";
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
import { EDirection } from "../../../common/constants/input.enum";
import { dislike } from "../../../common/components/icons/dislike";
import { like } from "../../../common/components/icons/like";

interface IProps {
    indicator: IIndicatorsPAITemp;
    showGeneralFields: boolean;
}

function IndicatorsRevisionComponent({ indicator, showGeneralFields }: Readonly<IProps>): React.JSX.Element {
    const ind: IIndicatorsPAITemp = { ...indicator };
    const [approveItem, setApproveItem] = useState<IApproveRevisionPAI>(null);
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
        fieldsValues,
        setApproveFields,
        approveFields
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
    const resolverApprove = useYupValidationResolver(approvePAIValidator);
    const {
        register: registerApprove,
        control: controlApprove,
        formState: { errors: errorsApprove },
        reset: resetApprove,
        setValue: setValueApprove,
        handleSubmit: handleSubmitApprove
    } = useForm<IApproveRevisionPAI>({ resolver: resolverApprove, mode: "all" });
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
    console.log(approveFields)
    const onSubmitApprove = handleSubmitApprove(async (data: IApproveRevisionPAI) => {
        const approveForm = data;
        if (approveForm.approved !== undefined && approveForm.approved !== null && approveForm.comments !== "" && approveForm.comments !== undefined && approveForm.comments !== null) {
            setApproveFields(prev => {
                let newValues = prev.concat(approveForm);
                return newValues;
            });
            resetApprove();
            setApproveItem(null);
        }
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
                                const fieldNameIndicator = row.field.split(" || ");
                                if (fieldNameIndicator.length > 1) {
                                    let corrected = [...prev, pai.typePAI === 1 ? fieldNameIndicator[0] : fieldNameIndicator[1]];
                                    return corrected;
                                }
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
        {
            customIcon: (row) => {
                const field = row.field.split(" || ");
                const fieldSelected = approveFields.find(item => item.field === field[0] || item.field === field[1]);
                if (fieldSelected) {
                    if (fieldSelected.approved) {
                        return like;
                    } else {
                        return dislike;
                    }
                }
                return file_check_fill;
            },
            onClick: (row) => {
                const field = row.field.split(" || ");
                const fieldName = field.length > 1 && pai.typePAI === 1 ? field[0] : field[1] || row.field;
                const item: IApproveRevisionPAI = {
                    field: fieldName,
                    observations: row.observations,
                    changes: correctionFields[indicator.id][fieldName]
                };
                setApproveItem(item);
            }
        }
    ];
    const validateActiveField = (idInput: string) => {
        const approveIds = approveFields.reduce((result, current) => {
            if (!current.approved) result.push(current.field);
            return result;
        }, []);
        if (approveIds.includes(idInput)) {
            return false;
        }
        if (idInput.split(".")[0] !== "projectIndicator" && idInput.split(".")[0] !== "indicatorDesc") {
            if (!fieldsChange.includes(idInput)) {
                return true;
            }
        }
        if (fieldsCorrected.includes(idInput)) {
            return true;
        }
        return false;
    }
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
        if(approveFields.length > 0) {
            const values = Reflect.ownKeys(getValues());
            approveFields.forEach(approve => {
                const field = approve.field.split(".");
                if (values.includes(field[0])) {
                    if (field[0] === "bimesters") {
                        const bimesters = getValues("bimesters");
                        bimesters.forEach((bimester, index) => {
                            if (String(bimester.id) === field[1]) setValue(`${field[0]}.${index}.value`, approve.adjustment);
                        });
                    } else if (field[0] === "products") {
                        const products = getValues("products");
                        products.forEach((product, index) => {
                            if (String(product.id) === field[1]) setValue(`${field[0]}.${index}.product`, approve.adjustment);
                        });
                    } else if (field[0] === "responsibles") {
                        const responsibles = getValues("responsibles");
                        responsibles.forEach((responsible, index) => {
                            if (String(responsible.id) === field[1]) setValue(`${field[0]}.${index}.responsible`, approve.adjustment);
                        });
                    } else if (field[0] === "coresponsibles") {
                        const coresponsibles = getValues("coresponsibles");
                        coresponsibles.forEach((coresponsible, index) => {
                            if (String(coresponsible.id) === field[1]) setValue(`${field[0]}.${index}.coresponsible`, approve.adjustment);
                        });
                    } else {
                        setValue(field[0], approve.adjustment);
                    }
                }
            });
        }
    }, []);
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (status === "adjustment") {
                setApproveFields(prev => {
                    const nameSplit = name.split(".");
                    if (nameSplit.length === 1) {
                        const field = name
                            .replace(".line", "")
                            .replace(".risk", "")
                            .replace(".product", "")
                            .replace(".responsible", "")
                            .replace(".coresponsible", "")
                            .replace(".value", "");
                        const nameField = `${field}.${indicator.id}`;
                        const approveSelect = prev.findIndex(approve => approve.field === nameField);
                        if (approveSelect !== undefined && approveSelect !== -1) {
                            let newValues = [...prev];
                            newValues[approveSelect] = { ...prev[approveSelect], adjustment: value[name] }
                            return newValues;
                        }
                    } else {
                        const nameField = `${nameSplit[0]}.${value[nameSplit[0]][nameSplit[1]].id}`
                        const approveSelect = prev.findIndex(approve => approve.field === nameField);
                        if (approveSelect !== undefined && approveSelect !== -1) {
                            let newValues = [...prev];
                            newValues[approveSelect] = { ...prev[approveSelect], adjustment: value[nameSplit[0]][nameSplit[1]][nameSplit[2]] }
                            return newValues;
                        }
                    }
                    return prev;
                });
            }
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

    useEffect(() => {
        if (!approveItem) return;
        setValueApprove("field", approveItem.field);
        setValueApprove("observations", approveItem.observations);
        setValueApprove("changes", approveItem.changes);
    }, [approveItem]);

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
                    disabled={(!fieldsChange.includes(`projectIndicator.${indicator.id} || indicatorDesc.${indicator.id}`) ? true : pai.typePAI !== 1) || validateActiveField(`projectIndicator.${indicator.id}`)}
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
                    disabled={validateActiveField(`indicatorType.${indicator.id}`)}
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
                            disabled={(!fieldsChange.includes(`projectIndicator.${indicator.id} || indicatorDesc.${indicator.id}`) ? true : pai.typePAI !== 2) || validateActiveField(`indicatorDesc.${indicator.id}`)}
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
                                    disabled={validateActiveField(`bimesters.${idField}`)}
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
                                                disabled={validateActiveField(`products.${idField}`)}
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
                                                disabled={validateActiveField(`responsibles.${idField}`)}
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
                                                disabled={validateActiveField(`coresponsibles.${idField}`)}
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
            <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                {status === "revision" && <FormComponent action={undefined} id="revision-form">
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
                </FormComponent>
                }
                {
                    tableData.length > 0 && <div className="card-table">
                        <TableComponent
                            columns={tableColumns}
                            data={tableData}
                            title={status === "adjustment" ? "Revisión de campos" : "Campos a modificar"}
                            isShowModal={false}
                            actions={actionColumnsTable[status]}
                            hideActions={status === "revision"}
                        />
                    </div>
                }
                {
                    approveItem && <FormComponent action={undefined} id="approve-form" className="card-table strategic-direction-grid-1 strategic-direction-grid-1-web">
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                            <Controller
                                control={controlApprove}
                                name={"field"}
                                defaultValue=""
                                render={({ field }) => {
                                    const fieldName = fieldsData.find(fld => {
                                        const fieldValueSelect = String(fld.value).split(" || ");
                                        if (fieldValueSelect.length > 1) {
                                            return fieldValueSelect[0] === field.value || fieldValueSelect[1] === field.value;
                                        }
                                        return fld.value === field.value
                                    });
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={fieldName ? fieldName.name : ""}
                                            label="Campo"
                                            className="input-basic"
                                            classNameLabel="text-black biggest bold"
                                            typeInput={"text"}
                                            register={registerApprove}
                                            onChange={field.onChange}
                                            errors={errorsApprove}
                                            disabled
                                        />
                                    );
                                }}
                            />
                        </div>
                        <div className="strategic-direction-revision-pai-form">
                            <Controller
                                control={controlApprove}
                                name={`observations`}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Observaciones"
                                            classNameLabel="text-black biggest bold"
                                            className="text-area-basic"
                                            register={registerApprove}
                                            onChange={field.onChange}
                                            errors={errorsApprove}
                                            disabled
                                        >
                                        </TextAreaComponent>
                                    );
                                }}
                            />
                            <div style={{ textAlign: "center" }}></div>
                        </div>
                        <div className="strategic-direction-revision-pai-form">
                            <Controller
                                control={controlApprove}
                                name={`changes`}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Cambios realizados"
                                            classNameLabel="text-black biggest bold"
                                            className="text-area-basic"
                                            register={registerApprove}
                                            onChange={field.onChange}
                                            errors={errorsApprove}
                                            disabled
                                        >
                                        </TextAreaComponent>
                                    );
                                }}
                            />
                            <div style={{ textAlign: "center" }}></div>
                        </div>
                        <div className="strategic-direction-adjusment-pai-radios">
                            <InputRadioComponent
                                control={controlApprove}
                                idInput="approved"
                                value={true}
                                direction={EDirection.row}
                                label={"Aprobar"}
                                classNameLabel="text-black biggest bold"
                            />
                            <InputRadioComponent
                                control={controlApprove}
                                idInput="approved"
                                value={false}
                                direction={EDirection.row}
                                label={"No aprobar"}
                                classNameLabel="text-black biggest bold"
                            />
                        </div>
                        <div className="text-black big">
                            <span>{errorsApprove?.approved?.message}</span>
                        </div>

                        <div className="strategic-direction-revision-pai-form">
                            <Controller
                                control={controlApprove}
                                name={`comments`}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Comentarios"
                                            characters={5000}
                                            classNameLabel="text-black biggest bold text-required"
                                            className="text-area-basic"
                                            register={registerApprove}
                                            onChange={field.onChange}
                                            errors={errorsApprove}
                                        >
                                        </TextAreaComponent>
                                    );
                                }}
                            />
                            <div style={{ textAlign: "center" }}>
                                <ButtonComponent
                                    className="button-main huge hover-three button-save"
                                    value="Guardar"
                                    type="button"
                                    action={onSubmitApprove}
                                    form="approve-form"
                                />
                            </div>
                        </div>
                    </FormComponent>
                }
            </div>
        </div>
    );
}

export default IndicatorsRevisionComponent;