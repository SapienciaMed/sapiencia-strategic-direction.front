import { useContext, useEffect, useState } from "react";
import { IApproveRevisionPAI, IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { IPropsRevisionPAI } from "../pages/revision-pai.page";
import { Controller, useForm } from "react-hook-form";
import { InputInplaceComponent } from "../../../common/components/Form";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import { AppContext } from "../../../common/contexts/app.context";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { approvePAIValidator, revisionPAIValidator } from "../../../common/schemas";
import { file_check_fill } from "../../../common/components/icons/file_check_fill";
import { like } from "../../../common/components/icons/like";
import { dislike } from "../../../common/components/icons/dislike";
import { check_o } from "../../../common/components/icons/check_o";
import { TreeNode } from "primereact/treenode";
import { Tooltip } from "primereact/tooltip";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface IProps extends IPropsRevisionPAI {
    idPAI: string;
}

interface TreeNodeRevision extends TreeNode {
    root?: string;
}

export default function useRevisionObservationsPAIData({ idPAI, status }: Readonly<IProps>) {
    const [approveItem, setApproveItem] = useState<IApproveRevisionPAI>(null);
    const [fieldsData, setFieldsData] = useState<TreeNodeRevision[]>([]);
    const [tableData, setTableData] = useState<IRevisionFormPAI[]>([]);
    const {
        revisionPAI,
        setRevisionPAI,
        pai,
        projectPAI,
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
        setValue: setValueRevision,
        formState: { errors: errorsRevision },
        handleSubmit,
        reset
    } = useForm<IRevisionFormPAI>({ resolver, mode: "all" });

    const onSubmitRevision = handleSubmit(async (data: IRevisionFormPAI) => {
        setRevisionPAI(prev => {
            const newRevision = prev.concat({ ...data });
            return newRevision;
        });
        reset();
        setValueRevision("observations", null);
    });
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
    const tableColumns: ITableElement<IRevisionFormPAI>[] = [
        {
            header: "Ruta del campo",
            fieldName: "root",
            renderCell: (row) => {
                let field: TreeNodeRevision;
                for (const item of fieldsData) {
                    if (item.key === row.field) {
                        field = item;
                        break;
                    } else if (item.children?.length > 0) {
                        for (const children of item.children) {
                            if (children.key == row.field) {
                                field = children;
                                break;
                            }  else if (children.children?.length > 0) {
                                for(const childrenChild of children.children) {
                                    if (childrenChild.key == row.field) {
                                        field = childrenChild;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return (
                    <>
                        <Tooltip target={`.root-tooltip`} />
                        <div className={`strategic-direction-view-underline-text root-tooltip`}
                            data-pr-tooltip={field?.root}
                            data-pr-position="bottom"
                        >
                            Ver
                        </div>
                    </>
                )
            }
        },
        {
            header: "Campo",
            fieldName: "field",
            renderCell: (row) => {
                let field: TreeNodeRevision;
                for (const item of fieldsData) {
                    if (item.key === row.field) {
                        field = item;
                        break;
                    } else if (item.children?.length > 0) {
                        for (const children of item.children) {
                            if (children.key == row.field) {
                                field = children;
                                break;
                            }  else if (children.children?.length > 0) {
                                for(const childrenChild of children.children) {
                                    if (childrenChild.key == row.field) {
                                        field = childrenChild;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                return <>{field ? field?.label : ""}</>
            }
        },
        {
            header: <>
                        <Tooltip target={`.observation-tooltip`} />
                        <div className={`observation-tooltip`}
                            data-pr-tooltip="Esta observación la puedes editar al dar clic sobre el texto"
                            data-pr-position="bottom"
                            style={{
                                display: "flex",
                                gap: "4px",
                                alignItems: "center"
                            }}
                        >
                            Observaciones <IoMdInformationCircleOutline />
                        </div>
                    </>,
            fieldName: "observations",
            renderCell: (row) => {
                if (status === "revision") {
                    const onChangeObservation = (observationValue: string) => {
                        setTableData(prev => {
                            const newData = prev.map(data => {
                                if (data.field === row.field) {
                                    return { ...data, observations: observationValue }
                                } else {
                                    return data;
                                }
                            });
                            return newData;
                        })
                    }
                    return <ObservationsInplace value={row.observations} change={onChangeObservation} />
                }
                return <>{row.observations}</>
            }
        }
    ];
    const tableColumnsAdjustment: ITableElement<IRevisionFormPAI>[] = [
        {
            header: "Campo",
            fieldName: "field",
            renderCell: (row) => {
                return <>{""}</>
            }
        },
        {
            header: "Observaciones",
            fieldName: "observations",
            renderCell: (row) => {
                if (status === "revision") {
                    const onChangeObservation = (observationValue: string) => {
                        setTableData(prev => {
                            const newData = prev.map(data => {
                                if (data.field === row.field) {
                                    return { ...data, observations: observationValue }
                                } else {
                                    return data;
                                }
                            });
                            return newData;
                        })
                    }
                    return <ObservationsInplace value={row.observations} change={onChangeObservation} />
                }
                return <>{row.observations}</>
            }
        },
        {
            header: "Cambios realizados",
            fieldName: "",
            renderCell: (row) => {
                const field = row.field.split(" || ");
                const fieldName = field.length > 1 && pai.typePAI === 1 ? field[0] : field[1] || row.field;
                const changes = null;
                // const changes = correctionFields[indicator.id][fieldName];
                return <>{changes ?? ""}</>;
            }
        },
        {
            header: "Comentarios",
            fieldName: "",
            renderCell: (row) => {
                const field = row.field.split(" || ");
                const fieldSelected = approveFields.find(item => item.field === field[0] || item.field === field[1]);
                return <>{fieldSelected?.comments ?? ""}</>
            }
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
                if ((correctionFields.some(item => item.field === field[0]) || correctionFields.some(item => item.field === field[1]))) {
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
                // const item: IApproveRevisionPAI = {
                //     field: fieldName,
                //     observations: row.observations,
                //     changes: correctionFields[indicator.id][fieldName]
                // };
                // setApproveItem(item);
            }
        }
    ];
    const actionColumnsTable = {
        "revision": null,
        "correction": actionColumnCorrection,
        "adjustment": actionColumnAdjustment
    };

    useEffect(() => {
        if (!pai) return;
        const generalFieldsData: TreeNodeRevision[] = [
            {
                key: "yearPAI",
                label: "Año del plan de acción institucional",
                root: "Año del plan de acción institucional"
            },
            {
                key: "budgetPAI",
                label: "Presupuesto",
                root: "Presupuesto"
            },
            {
                key: "namePAI",
                label: "Nombre proyecto/proceso",
                root: "Nombre proyecto/proceso"
            },
            {
                key: "objectivePAI",
                label: "Objetivo",
                root: "Objetivo"
            },
            {
                key: "articulationPAI",
                label: "Articulación Plan de Desarrollo Distrital",
                root: "Articulación Plan de Desarrollo Distrital"
            }
        ];
        const linesData: TreeNodeRevision[] = pai?.linePAI?.map((line, index) => {
            return {
                label: `Línea No. ${index + 1}`,
                root: `Línea No. ${index + 1}`,
                key: `linePAI.${line.id}`
            }
        });
        const risksData: TreeNodeRevision[] = pai?.risksPAI?.map((risk, index) => {
            return {
                label: `Riesgo No. ${index + 1}`,
                root: `Riesgo No. ${index + 1}`,
                key: `risksPAI.${risk.id}`
            }
        });
        const actionsData: TreeNodeRevision[] = pai?.actionsPAi?.map((action, index) => {
            const indicatorsData: TreeNodeRevision[] = action.indicators?.map((indicator, indexIndicator) => {
                const bimestersData: TreeNodeRevision[] = indicator.bimesters.map((bimester, count) => {
                    return {
                        label: `Bimestre ${count + 1}`,
                        key: `${action.id}-${indicator.id}-bimesters.${bimester.id}`,
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Bimestre ${count + 1}`
                    }
                });
                const productsData: TreeNodeRevision[] = indicator.products.map((product, count) => {
                    return {
                        label: `Producto No. ${count + 1}`,
                        key: `${action.id}-${indicator.id}-products.${product.id}`,
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Producto No. ${count + 1}`
                    }
                });
                const responsiblesData: TreeNodeRevision[] = indicator.responsibles.map((responsible, count) => {
                    return {
                        label: `Responsable No. ${count + 1}`,
                        key: `${action.id}-${indicator.id}-responsibles.${responsible.id}`,
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Responsable No. ${count + 1}`
                    }
                });
                const coresponsiblesData: TreeNodeRevision[] = indicator.coresponsibles.map((coresponsible, count) => {
                    return {
                        label: `Corresponsable No. ${count + 1}`,
                        key: `${action.id}-${indicator.id}-coresponsibles.${coresponsible.id}`,
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Corresponsable No. ${count + 1}`
                    }
                });
                const indicatorFieldsData: TreeNodeRevision[] = [
                    {
                        key: `${action.id}-${indicator.id}-projectIndicator.${indicator.id} || ${action.id}-${indicator.id}-indicatorDesc.${indicator.id}`,
                        label: "Indicador proyecto/Descripción indicador",
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Indicador proyecto/Descripción indicador`
                    },
                    {
                        key: `${action.id}-${indicator.id}-indicatorType.${indicator.id}`,
                        label: "Tipo indicador",
                        root: `Accion ${index + 1} > Indicador ${indexIndicator + 1} > Tipo indicador`
                    }
                ];
                return {
                    key: `${action.id}-${indicator.id}`,
                    label: `Indicador No. ${indexIndicator+1}`,
                    selectable: false,
                    children: indicatorFieldsData.concat(bimestersData).concat(productsData).concat(responsiblesData).concat(coresponsiblesData)
                };
            });
            return {
                key: `${action.id}`,
                label: `Accion No. ${index + 1}`,
                selectable: false,
                children: [
                    {
                        key: `${action.id}-description.${action.id}`,
                        label: "Descripción de la Acción",
                        root: `Accion ${index + 1} > Descripción de la Acción`
                    },
                    ...indicatorsData
                ]
            }
        });
        setFieldsData(generalFieldsData.concat(linesData).concat(risksData).concat(actionsData));
    }, [pai]);

    useEffect(() => {
        setTableData(revisionPAI);
    }, [revisionPAI]);

    useEffect(() => {
        if (!approveItem) return;
        setValueApprove("field", approveItem.field);
        setValueApprove("observations", approveItem.observations);
        setValueApprove("changes", approveItem.changes);
    }, [approveItem]);

    return {
        controlRevision,
        fieldsData,
        errorsRevision,
        registerRevision,
        tableData,
        tableColumnsAdjustment,
        tableColumns,
        actionColumnsTable,
        onSubmitRevision
    }
}

interface IObservationsInplace {
    change: (observationValue: string) => void;
    value: string;
}

function ObservationsInplace({ change, value }: Readonly<IObservationsInplace>) {
    const { control, register, formState: { errors }, watch } = useForm<{ value: string }>({ defaultValues: { value: value }, mode: "all" });
    const watchValue = watch("value");
    useEffect(() => {
        change(watchValue);
    }, [watchValue]);
    return (
        <Controller
            control={control}
            name={`value`}
            defaultValue={value}
            render={({ field }) => {
                return (
                    <InputInplaceComponent
                        id={field.name}
                        idInput={field.name}
                        value={`${field.value}`}
                        label=""
                        className="input-basic"
                        typeInput={"text"}
                        register={register}
                        onChange={field.onChange}
                        errors={errors}
                    />
                );
            }}
        />
    )
}