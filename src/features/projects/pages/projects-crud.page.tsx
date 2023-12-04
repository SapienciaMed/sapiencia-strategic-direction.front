import React, { useContext } from "react";
import { ButtonComponent } from "../../../common/components/Form";
import TabListComponent from "../../../common/components/tab-list.component";
import { useProjectsCrudData } from "../hooks/projects-crud.hook";
import { useParams } from "react-router-dom";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";

function ProjectsCrudPage(): React.JSX.Element {

    const {
        tabs,
        tabsComponentRef,
        disableContinue,
        actionContinue,
        onSaveTemp,
        onUpdateStatus,
        setMessage,
        navigate,
        actionCancel,
        textContinue,
        projectData,
        showCancel,
        step,
        formAction,
        disableStatusUpdate,
        dirty
    } = useProjectsCrudData();

    const { id: idProyect } = useParams();

    useBreadCrumb({
        isPrimaryPage: false,
        name: formAction == "edit" ? "Editar Proyecto" : "Formular proyecto",
        url: formAction == "edit" ? "/direccion-estrategica/proyectos/edit" : "/direccion-estrategica/proyectos/crear-proyecto",
        extraParams: formAction == "edit" ? `/${idProyect}` : undefined,
    });
    const statusValidation = projectData?.status == 2 || projectData?.status == 3;
    const textBtnUpdateStatus = statusValidation ? "Actualizar estado" : "Guardar temporalmente";
    const btnContinueDisableValidation = disableContinue || (statusValidation && tabs[step]?.id != 'transfer' && !textContinue);
    if (!projectData?.status && formAction === "edit") { return <p>Cargando...</p>; }
    return (
        <div className='crud-page full-height'>
            <div className="main-page full-height">
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">{formAction === "new" ? "Formular proyecto" : "Editar proyecto"}</div>
                    </div>
                    <TabListComponent tabs={tabs} ref={tabsComponentRef} />
                    <div className="projects-footer-mobile mobile">
                        {!actionCancel && <div className="save-temp">
                            <ButtonComponent
                                className="button-main huge hover-three button-save"
                                value={textBtnUpdateStatus}
                                type="button"
                                action={statusValidation ? onUpdateStatus : onSaveTemp}
                                disabled={statusValidation && disableStatusUpdate}
                            />
                        </div>}
                        <div className="mobile-actions">
                            {!showCancel ? <span></span> : <span className="bold text-center button" onClick={actionCancel || (() => {
                                if(!dirty) return navigate('/direccion-estrategica/proyectos/');
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
                                        localStorage.removeItem('create_project_data');
                                        navigate('/direccion-estrategica/proyectos/');
                                        setMessage({});
                                    }
                                })
                            })}>
                                Cancelar
                            </span>}
                            <ButtonComponent
                                value={textContinue || (statusValidation ? "Guardar" : "Continuar")}
                                className="button-main huge hover-three"
                                type="button"
                                action={actionContinue || (() => { })}
                                disabled={btnContinueDisableValidation}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className="container-button-bot space-between">
                {actionCancel ? <div></div> :
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value={textBtnUpdateStatus}
                        type="button"
                        action={statusValidation ? onUpdateStatus : onSaveTemp}
                        disabled={statusValidation && disableStatusUpdate}
                    />
                }
                <div className="buttons-bot">
                    {!showCancel ? <span></span> : <span className="bold text-center button" onClick={actionCancel || (() => {
                        if(!dirty) return navigate('/direccion-estrategica/proyectos/');
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
                                navigate('/direccion-estrategica/proyectos/');
                                setMessage({});
                            }
                        })
                    })}>
                        Cancelar
                    </span>}
                    <ButtonComponent
                        className={`button-main ${textContinue?.length > 10 ? "extra_extra_large" : "huge"} hover-three button-save`}
                        value={textContinue || (statusValidation ? "Guardar" : "Continuar")}
                        type="button"
                        action={actionContinue || (() => { })}
                        disabled={btnContinueDisableValidation}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsCrudPage);