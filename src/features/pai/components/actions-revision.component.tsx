import { useContext, useEffect, useState } from "react";
import { IAddAction } from "../interfaces/PAIInterfaces";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../common/components/Form";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import IndicatorsRevisionComponent from "./indicators-revision.component";
import AccordionsComponent from "../../../common/components/accordions.component";
import { RevisionPAIContext } from "../contexts/revision-pai.context";

interface IProps {
    action: IAddAction;
    index: number;
}

function ActionsRevisionComponent({ action, index }: Readonly<IProps>): React.JSX.Element {
    const [accordionsIndicators, setAccordionsIndicators] = useState<IAccordionTemplate[]>([]);
    const { fieldsChange, setCorrectionFields, fieldsValues, fieldsCorrected } = useContext(RevisionPAIContext);
    const {
        register,
        control,
        formState: { errors },
        getValues,
        watch,
        setValue
    } = useForm<IAddAction>({ mode: "all", defaultValues: action });
    useEffect(() => {
        setAccordionsIndicators(getValues("indicators").map((indicator, indexIndicator) => {
            return {
                id: indexIndicator,
                name: `Indicador No. ${indexIndicator + 1}`,
                content: <IndicatorsRevisionComponent indicator={indicator} showGeneralFields={indexIndicator === 0 && index == 0} />
            };
        }));
        if(fieldsValues.length > 0) {
            const values = Reflect.ownKeys(getValues()).map(item => `${String(item)}.${action.indicators[0].id}`);
            fieldsValues.forEach(value => {
                const field = value.field.split(".")[0];
                if(values.includes(value.field)) {
                    setValue(field, value.value);
                }
            });
        }
    }, []);
    useEffect(() => {
        const subscription = watch((value, { name }) => {
            return setCorrectionFields(prev => {
                const indicatorId = getValues("indicators")[0].id;
                const newValues = {...prev[indicatorId]};
                const nameField = name.split(".");
                if (nameField.length === 1) {
                    const field = name
                        .replace(".line", "")
                        .replace(".risk", "")
                        .replace(".product", "")
                        .replace(".responsible", "")
                        .replace(".coresponsible", "")
                        .replace(".value", "");
                    Reflect.set(newValues, `${field}.${action.indicators[0].id}`, value[field]);
                } else {
                    const item = value[nameField[0]][nameField[1]];
                    Reflect.set(newValues, `${nameField[0]}.${item.id}`, value[nameField[0]][nameField[1]][nameField[2]]);
                }
                const valueReturn = { ...prev };
                Reflect.set(valueReturn, indicatorId, newValues);
                return valueReturn;
            });
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    return (
        <>
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
                            disabled={!fieldsChange.includes(`${field.name}.${action.indicators[0].id}`) || fieldsCorrected.includes(`${field.name}.${action.indicators[0].id}`)}
                        />
                    );
                }}
            />
            <div style={{ marginTop: "1.5rem" }}>
                <AccordionsComponent data={accordionsIndicators} />
            </div>
        </>
    );
}

export default ActionsRevisionComponent;