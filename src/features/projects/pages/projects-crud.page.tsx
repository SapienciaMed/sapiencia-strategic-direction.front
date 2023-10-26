import React, { useContext } from "react";
import { ButtonComponent } from "../../../common/components/Form";
import TabListComponent from "../../../common/components/tab-list.component";
import { useProjectsCrudData } from "../hooks/projects-crud.hook";

function ProjectsCrudPage(): React.JSX.Element {
    const { tabs, 
            tabsComponentRef, 
            disableContinue, 
            actionContinue, 
            onSaveTemp,
            onUpdateStatus,
            setMessage, 
            navigate, 
            actionCancel, 
            textContinue, 
            DeleteProject, 
            projectData, 
            showCancel,
            step,
            formAction } = useProjectsCrudData();
    const textBtnUpdateStatus = projectData?.status == 2 || projectData?.status == 3 ? "Actualizar estado" : "Guardar temporalmente" ;
    if (!projectData?.status && formAction === "edit") { return <p>Loading...</p>; }
    console.log('projectData?.status: ', projectData?.status );
    return (
        <div className='crud-page full-height'>
            <div className="main-page full-height">
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">{ formAction === "new" ? "Crear proyecto" : "Editar proyecto"}</div>
                    </div>
                    <TabListComponent tabs={tabs} ref={tabsComponentRef} />
                    <div className="projects-footer-mobile mobile">
                        {!actionCancel && <div className="save-temp">
                            <ButtonComponent
                                className="button-main huge hover-three button-save"
                                value={ textBtnUpdateStatus }
                                type="button"
                                action={ projectData?.status == 2 || projectData?.status == 3 ? onUpdateStatus : onSaveTemp }
                            />
                        </div>}
                        <div className="mobile-actions">
                            {!showCancel ? <span></span> : <span className="bold text-center button" onClick={actionCancel || (() => {
                                setMessage({
                                    title: "Cancelar creación de proyecto",
                                    description: "¿Deseas cancelar la creación? No se guardarán los datos",
                                    show: true,
                                    background: true,
                                    cancelTitle: "Cancelar",
                                    OkTitle: "Aceptar",
                                    onCancel: () => {
                                        setMessage({});
                                    },
                                    onOk: () => {
                                        localStorage.removeItem('create_project_data');
                                        navigate('./../');
                                        setMessage({});
                                    }
                                })
                            })}>
                                Cancelar
                            </span>}
                            <ButtonComponent
                                value={ textContinue || (  projectData?.status == 2 ? "Guardar" : "Continuar" ) }
                                className="button-main huge hover-three"
                                type="button"
                                action={ actionContinue || (() => { })}
                                disabled={ disableContinue || projectData?.status == 2 }
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="container-button-bot space-between">
                {actionCancel ? <div></div> :
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value={ textBtnUpdateStatus }
                        type="button"
                        action={ projectData?.status == 2 || projectData?.status == 3 ? onUpdateStatus : onSaveTemp }
                    />
                }
                <div className="buttons-bot">
                    {!showCancel ? <span></span> : <span className="bold text-center button" onClick={actionCancel || (() => {
                        setMessage({
                            title: "Cancelar creación de proyecto",
                            description: "¿Deseas cancelar la creación? No se guardarán los datos",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                if (projectData.id) {
                                    DeleteProject(projectData.id);
                                }
                                navigate('./../');
                                setMessage({});
                            }
                        })
                    })}>
                        Cancelar
                    </span>}
                    <ButtonComponent
                        className={`button-main ${textContinue?.length > 10 ? "extra_extra_large" : "huge"} hover-three button-save`}
                        value={ textContinue || (  projectData?.status == 2 ? "Guardar" : "Continuar" )}
                        type="button"
                        action={ actionContinue || (() => { })}
                        disabled={disableContinue || ( projectData?.status == 2 && tabs[step]?.id != 'transfer' ) }
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsCrudPage);