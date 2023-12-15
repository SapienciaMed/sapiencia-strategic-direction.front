import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRevisionPAIData from "../hooks/revision-pai.hook";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Control, Controller, FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import { ICreatePlanAction } from "../interfaces/PAIInterfaces";
import { PAIContext } from "../contexts/pai.context";
import IndicatorsPaiPage from "./indicators-pai.page";
import { NavbarPai } from "../components/navbar-pai.component";
import { AppContext } from "../../../common/contexts/app.context";

interface IActionListPaiProps {
    actionId: number;
    control: Control<ICreatePlanAction>;
    register: UseFormRegister<ICreatePlanAction>;
    errors: FieldErrors<ICreatePlanAction>;
}
function ActionListPAIPage({ actionId, control, register, errors }: Readonly<IActionListPaiProps>): React.JSX.Element {

    const { PAIData,
            setPAIData,
            setActionCancel,
            isValidIndicator,
            setSaveButtonText,
            setTempButtonText,
            setDisableTempBtn,
            setSaveButtonAction,
            setDisableSaveButton,
            setIndicatorsFormComponent, } = useContext(PAIContext);
    const { setMessage } = useContext(AppContext)
    const [accordionsIndicators, setAccordionsIndicators] = useState<IAccordionTemplate[]>([]);
    const indicators = PAIData.actionsPAi.at(actionId)?.indicators;
    
    useEffect(()=>{
        localStorage.setItem('tempAction', JSON.stringify(PAIData));
        setAccordionsIndicators(indicators && indicators.length > 0 ? indicators.map((indicator, indexIndicator) => {
            return {
                id: indexIndicator,
                name: `Indicador No. ${indexIndicator + 1}`,
                content: <IndicatorsPaiPage actionId={actionId} indicatorId={indexIndicator} editMode={true}/>
            };
        }) : []);
    },[]);

    useEffect(()=>{
        setTimeout(()=>{
            setActionCancel(()=> onCancel);
            setSaveButtonAction( () => onEdit );
        },50)
    },[])

    useEffect(()=>{
        setDisableSaveButton(!isValidIndicator);
        setDisableTempBtn(!isValidIndicator);
    },[isValidIndicator])

    
    const onEdit = () => {
        setMessage({
            title: "Guardar cambios",
            description: "¿Desea guardar los cambios?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                setIndicatorsFormComponent(null)
                setSaveButtonText("Guardar y regresar");
                localStorage.removeItem('tempAction');
                setMessage({
                    title: "Cambio guardados ",
                    description: "¡Guardados exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    }
                });
            }
        })
    }

    const onCancel = () => {
        setMessage({
            title: "Cancelar acción",
            description: "¿Desea cancelar los cambios? ",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                const tempAction = JSON.parse(localStorage.getItem('tempAction'));
                setPAIData(tempAction)
                setIndicatorsFormComponent(null)
                setSaveButtonText("Guardar y regresar");
                setMessage({});
                setTempButtonText("Guardar temporalmente");
                localStorage.removeItem('tempAction');
            }
        })
    }

    return (
        <>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Acción No {actionId}</div>
                    </div>
                    <div style={{margin: "30px 0 30px"}}>
                        <Controller
                            control={control}
                            name={`actionsPAi.${actionId}.description`}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Descripción de la acción"
                                        classNameLabel="text-black biggest bold text-required"
                                        className="text-area-basic"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
                        />
                    </div>
                    {(indicators && indicators.length > 0)
                        && <AccordionsComponent data={accordionsIndicators} />
                    }
                </div>
            </div>
            <NavbarPai editMode={true}/>
        </>
    )
}

export default React.memo(ActionListPAIPage);