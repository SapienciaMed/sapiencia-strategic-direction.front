import { IIndicatorsPAI, IIndicatorsPAITemp, IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { revisionPAIValidator } from "../../../common/schemas";
import { useContext, useEffect, useState } from "react";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import TableComponent from "../../../common/components/table.component";
import { ITableElement } from "../../../common/interfaces/table.interfaces";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { generalFieldsData, indicatorFieldsData } from "../data/dropdowns-revision-pai";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { useEntitiesService } from "../hooks/entities-service.hook";

interface IProps {
    indicator: IIndicatorsPAI;
    showGeneralFields: boolean;
}

function IndicatorsRevisionComponent({ indicator, showGeneralFields }: Readonly<IProps>): React.JSX.Element {
    const ind: IIndicatorsPAITemp = {
        ...indicator, bimesters: [
            {
                bimester: "1",
                value: indicator.firstBimester
            },
            {
                bimester: "2",
                value: indicator.secondBimester
            },
            {
                bimester: "3",
                value: indicator.thirdBimester
            },
            {
                bimester: "4",
                value: indicator.fourthBimester
            },
            {
                bimester: "5",
                value: indicator.fifthBimester
            },
            {
                bimester: "6",
                value: indicator.sixthBimester
            },
        ]
    };
    const [fieldsData, setFieldsData] = useState<IDropdownProps[]>([]);
    const { revisionPAI, setRevisionPAI, pai } = useContext(RevisionPAIContext);
    const { getIndicatorsType } = useEntitiesService();
    const {
        register,
        control,
        formState: { errors },
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
    useEffect(() => {
        if (showGeneralFields) {
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
            setFieldsData(generalFieldsData.concat(linesData).concat(risksData).concat(indicatorFieldsData).concat(productsData).concat(responsiblesData).concat(coresponsiblesData))
        } else {
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
                    name: `Producto No. ${index + 1}`,
                    value: `coresponsibles.${coresponsible.id}`
                }
            });
            setFieldsData(indicatorFieldsData.concat(productsData).concat(responsiblesData).concat(coresponsiblesData))
        }
        getIndicatorsType().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const indicatorType: IPAIIndicatorType[] = response.data;
                const arrayIndicatorsType: IPAIIndicatorType[] = indicatorType.map((indicator) => {
                    return { name: indicator?.description, value: indicator?.id };
                });
                const indType = arrayIndicatorsType.find(ind => ind.value === indicator.indicatorType);
                setValue("indicatorType", indType.name || "");
            }
        }).catch(() => { });
    }, []);
    return (
        <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                <Controller
                    control={control}
                    name={`projectIndicator`}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Indicador de proyecto"
                                className="input-basic"
                                classNameLabel="text-black biggest bold"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled />
                        );
                    }}
                />
                <Controller
                    control={control}
                    name={`indicatorType`}
                    render={({ field }) => {
                        return (
                            <InputComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Tipo de indicador"
                                className="input-basic"
                                classNameLabel="text-black biggest bold"
                                typeInput={"text"}
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled />
                        );
                    }}
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
                            disabled
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
                            return (
                                <Controller key={item.id}
                                    control={control}
                                    name={`bimesters.${index}.value`}
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}%`}
                                                label={`Bimestre ${index + 1}`}
                                                className="input-basic"
                                                classNameLabel="text-black biggest bold"
                                                typeInput={"text"}
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                disabled
                                            />
                                        );
                                    }}
                                />
                            )
                        })
                    }
                    <Controller
                        control={control}
                        name={`totalPlannedGoal`}
                        render={({ field }) => {
                            return (
                                <InputComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}%`}
                                    label={`Meta total planeada`}
                                    className="input-basic"
                                    classNameLabel="text-black biggest bold"
                                    typeInput={"text"}
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                    disabled
                                />
                            );
                        }}
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
                                                disabled
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
                                                disabled
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
                                                disabled
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
                                    classNameLabel="text-black biggest bold"
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
                {tableData.length > 0 && <div className="card-table">
                    <TableComponent
                        columns={tableColumns}
                        data={tableData}
                        title="Campos a modificar"
                        isShowModal={false}
                        hideActions={true}
                    />
                </div>}
            </FormComponent>
        </div>
    );
}

export default IndicatorsRevisionComponent;