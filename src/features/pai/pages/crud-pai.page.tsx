import React from "react";
import { ButtonComponent } from "../../../common/components/Form";
import useCrudPAIData from "../hooks/crud-pai.hook";
import CreatePlanActionPAIPage, { IPropsPAI } from "./createPlanAction-pai.page";

function CrudPAIPage({ status }: Readonly<IPropsPAI>): React.JSX.Element {
    const {
        IndicatorsFormComponent,
        setMessage,
        saveButtonText,
        tempButtonText,
        tempButtonAction,
        disableTempBtn,
        actionCancel,
        navigate,
        disableSaveButton,
        saveButtonAction,
        onSubmitSave,
        onSubmitTemp
    } = useCrudPAIData({ status });
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                {IndicatorsFormComponent}
                <div style={{ display: IndicatorsFormComponent ? "none" : "block" }}>
                    <CreatePlanActionPAIPage status={status}/>
                </div>
            </div>
            <div className="container-button-bot space-between">
                {!disableTempBtn ? <ButtonComponent
                    className="button-main huge hover-three"
                    value={tempButtonText || "Guardar temporalmente"}
                    type="button"
                    action={tempButtonAction || onSubmitTemp}
                    disabled={disableTempBtn}
                /> : <div></div>}
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={actionCancel || (() => {
                        setMessage({
                            title: "Cancelar acción",
                            description: "¿Deseas cancelar la acción y regresar a la opción de consulta?",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                navigate('/direccion-estrategica/pai');
                                setMessage({});
                            }
                        });
                    })}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={saveButtonText || "Guardar y regresar"}
                        type="button"
                        action={saveButtonAction || onSubmitSave}
                        disabled={disableSaveButton}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(CrudPAIPage);