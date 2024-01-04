import { IIndicatorsPAITemp, IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { IApproveRevisionPAI, IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent, InputRadioComponent, InputInplaceComponent } from "../../../common/components/Form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { approvePAIValidator, revisionPAIValidator } from "../../../common/schemas";
import { useContext, useEffect, useState } from "react";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { generalFieldsData } from "../data/dropdowns-revision-pai";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useEntitiesService } from "../hooks/entities-service.hook";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { AppContext } from "../../../common/contexts/app.context";

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
    useEffect(() => {
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
        </div>
    );
}





export default IndicatorsRevisionComponent;