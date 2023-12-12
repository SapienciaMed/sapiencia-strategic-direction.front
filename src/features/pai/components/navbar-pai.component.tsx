
import React, { useContext, useEffect } from "react";
import { PAIContext } from "../contexts/pai.context";
import { ButtonComponent } from "../../../common/components/Form";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router";

export function NavbarPai(): React.JSX.Element {

    const navigate = useNavigate();
    const {saveButtonAction, tempButtonAction,actionCancel,saveButtonText,tempButtonText, disableSaveButton, disableTempBtn } = useContext(PAIContext);
    const { setMessage } = useContext(AppContext);

    return (
        <><div className="projects-footer-mobile mobile">
            <div className="save-temp">
            {<ButtonComponent
                    className="button-main extra_extra_large hover-three button-save"
                    value={tempButtonText || "Guardar temporalmente"}
                    type="button"
                    action={tempButtonAction} 
                    disabled={disableTempBtn} />}
            </div>
            <div className="mobile-actions">
                {<span className="bold text-center button" onClick={actionCancel || (() => {
                        //if(!dirty) return navigate('/direccion-estrategica/proyectos/');
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
                    </span>}

                <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={saveButtonText || "Guardar y regresar"}
                        type="button"
                        action={saveButtonAction}
                        disabled={disableSaveButton} />
                </div>
        </div><div className="container-button-bot space-between">
                {<ButtonComponent
                    className="button-main extra_extra_large hover-three button-save"
                    value={tempButtonText || "Guardar temporalmente"}
                    type="button"
                    action={tempButtonAction} 
                    disabled={disableTempBtn}/>}
                <div className="buttons-bot">
                    {<span className="bold text-center button" onClick={actionCancel || (() => {
                        //if(!dirty) return navigate('/direccion-estrategica/proyectos/');
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
                    </span>}
                    <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={saveButtonText || "Guardar y regresar"}
                        type="button"
                        action={saveButtonAction}
                        disabled={disableSaveButton} />
                </div>
            </div></>
    )
}
