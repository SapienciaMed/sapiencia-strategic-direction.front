import { useContext, useEffect, useState } from "react";
import { IAddAction } from "../interfaces/PAIInterfaces";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../common/components/Form";
import IndicatorsRevisionComponent from "./indicators-revision.component";
import { RevisionPAIContext } from "../contexts/revision-pai.context";
import ComponentPagination from "../../../common/components/component-pagination.component";

interface IProps {
    action: IAddAction;
    index: number;
}

function ActionsRevisionComponent({ action, index }: Readonly<IProps>): React.JSX.Element {
    const [accordionsIndicators, setAccordionsIndicators] = useState<React.JSX.Element[]>([]);
    const { fieldsChange, setCorrectionFields, fieldsValues, fieldsCorrected, approveFields, status: { status }, setApproveFields } = useContext(RevisionPAIContext);
    const {
        register,
        control,
        formState: { errors },
        getValues,
        watch,
        setValue
    } = useForm<IAddAction>({ mode: "all", defaultValues: action });
    useEffect(() => {
        setAccordionsIndicators(getValues("indicators").map((indicator) => {
            return <IndicatorsRevisionComponent indicator={indicator} actionId={action.id} key={indicator.id}/>
        }));
        if (fieldsValues.length > 0) {
            const values = Reflect.ownKeys(getValues()).map(item => `${String(item)}.${action.indicators[0].id}`);
            fieldsValues.forEach(value => {
                const field = value.field.split(".")[0];
                if (values.includes(value.field)) {
                    setValue(field, value.value);
                }
            });
        }
        if (approveFields.length > 0) {
            const values = Reflect.ownKeys(getValues()).map(item => `${String(item)}.${action.indicators[0].id}`);
            approveFields.forEach(approve => {
                const field: any = approve.field.split(".")[0];
                if (values.includes(approve.field)) {
                    setValue(field, approve.adjustment);
                }
            });
        }
    }, []);

    const validateActiveField = (idInput: string) => {
        const approveIds = approveFields.reduce((result, current) => {
            if (!current.approved) result.push(current.field);
            return result;
        }, []);
        if (approveIds.includes(idInput)) {
            return false;
        }
        if (!fieldsChange.includes(idInput)) {
            return true;
        }
        if (fieldsCorrected.includes(idInput)) {
            return true;
        }
        return false;
    }

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
                        const nameField = `${field}.${action.indicators[0].id}`;
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
                const nameSplit = name.split(".");
                if (nameSplit.length === 1) {
                    const field = name
                        .replace(".line", "")
                        .replace(".risk", "")
                        .replace(".product", "")
                        .replace(".responsible", "")
                        .replace(".coresponsible", "")
                        .replace(".value", "");
                    const correctionSelect = prev.findIndex(correction => correction.field === field);
                    if (correctionSelect !== undefined && correctionSelect !== -1) {
                        let newValues = [...prev];
                        newValues[correctionSelect] = { ...prev[correctionSelect], correction: value[name] }
                        return newValues;
                    } else {
                        let newValues = [...prev];
                        newValues.push({field: `${action.id}-${field}.${action.id}`, correction: value[name]});
                        return newValues;
                    }
                } else {
                    const nameField = `${nameSplit[0]}.${value[nameSplit[0]][nameSplit[1]].id}`
                    const correctionSelect = prev.findIndex(correction => correction.field === nameField);
                    if (correctionSelect !== undefined && correctionSelect !== -1) {
                        let newValues = [...prev];
                        newValues[correctionSelect] = { ...prev[correctionSelect], correction: value[nameSplit[0]][nameSplit[1]][nameSplit[2]] }
                        return newValues;
                    } else {
                        let newValues = [...prev];
                        newValues.push({field: `${action.id}-${nameField}.${action.id}`, correction: value[name]});
                        return newValues;
                    }
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    return (
        <>
            <span className="text-black large bold">{`Accion No. ${index + 1}`}</span>
            <div style={{ marginTop: "1rem" }}>
                <Controller
                    control={control}
                    name={"description"}
                    defaultValue=""
                    render={({ field }) => {
                        return (
                            <TextAreaComponent
                                id={field.name}
                                idInput={field.name}
                                value={`${field.value}`}
                                label="Descripción de la acción"
                                classNameLabel="text-black biggest bold"
                                className="text-area-basic"
                                register={register}
                                onChange={field.onChange}
                                errors={errors}
                                disabled={validateActiveField(`${action.id}-${field.name}.${action.id}`)}
                            />
                        );
                    }}
                />
            </div>
            <div style={{ marginTop: "1.5rem" }}>
                <ComponentPagination components={accordionsIndicators} orientation="top" />
            </div>
        </>
    );
}

export default ActionsRevisionComponent;