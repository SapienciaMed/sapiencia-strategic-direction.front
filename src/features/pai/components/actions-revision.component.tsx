import { useEffect, useState } from "react";
import { IAddAction } from "../interfaces/PAIInterfaces";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../common/components/Form";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import IndicatorsRevisionComponent from "./indicators-revision.component";
import AccordionsComponent from "../../../common/components/accordions.component";

interface IProps {
    action: IAddAction;
}

function ActionsRevisionComponent({ action }: Readonly<IProps>): React.JSX.Element {
    const [accordionsIndicators, setAccordionsIndicators] = useState<IAccordionTemplate[]>([]);
    const {
        register,
        control,
        formState: { errors },
        getValues
    } = useForm<IAddAction>({ mode: "all", defaultValues: action });
    useEffect(() => {
        setAccordionsIndicators(getValues("indicators").map((indicator, index) => {
            return {
                id: index,
                name: `Indicador No. ${index + 1}`,
                content: <IndicatorsRevisionComponent indicator={indicator} showGeneralFields={index === 0}/>
            }
        }))
    }, []);
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
                            disabled
                        >
                        </TextAreaComponent>
                    );
                }}
            />
            <div style={{marginTop: "1.5rem"}}>
                <AccordionsComponent data={accordionsIndicators} />
            </div>
        </>
    );
}

export default ActionsRevisionComponent;