import React from "react";
import { ButtonComponent } from "../../../common/components/Form";
import TabListComponent from "../../../common/components/tab-list.component";
import { useProjectsCrudData } from "../hooks/projects-crud.hook";

function ProjectsCrudPage(): React.JSX.Element {
    const { tabs, tabsComponentRef, disableContinue, actionContinue, onSaveTemp, setMessage, navigate } = useProjectsCrudData();
    return (
        <div className='crud-page full-height'>
            <div className="main-page full-height">
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Crear proyecto</div>
                    </div>
                    <TabListComponent tabs={tabs} ref={tabsComponentRef} />
                    <div className="projects-footer-mobile mobile">
                        <div className="save-temp">
                            <ButtonComponent
                                className="button-main huge hover-three"
                                value="Guardar temporalmente"
                                type="button"
                                action={onSaveTemp}
                            />
                        </div>
                        <div className="mobile-actions">
                            <span className="bold text-center button" onClick={() => {
                                setMessage({
                                    title: "Crear proyecto",
                                    description: "Desea cancelar la acción, no se guardarán los datos",
                                    show: true,
                                    background: true,
                                    cancelTitle: "Continuar",
                                    OkTitle: "Si, cancelar",
                                    onCancel: () => {
                                        setMessage({});
                                    },
                                    onOk: () => {
                                        localStorage.removeItem('create_project_data');
                                        navigate('./../');
                                        setMessage({});
                                    }
                                })
                            }}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                value="Siguiente"
                                className="button-main huge hover-three"
                                type="button"
                                action={actionContinue}
                                disabled={disableContinue}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="container-button-bot space-between">
                <ButtonComponent
                    className="button-main huge hover-three"
                    value="Guardar temporalmente"
                    type="button"
                    action={onSaveTemp}
                />
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={() => {
                        setMessage({
                            title: "Crear proyecto",
                            description: "Desea cancelar la acción, no se guardarán los datos",
                            show: true,
                            background: true,
                            cancelTitle: "Continuar",
                            OkTitle: "Si, cancelar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                localStorage.removeItem('create_project_data');
                                navigate('./../');
                                setMessage({});
                            }
                        })
                    }}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Siguiente"
                        type="button"
                        action={actionContinue}
                        disabled={disableContinue}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsCrudPage);