import React from "react";
import { ButtonComponent } from "../../../common/components/Form";
import TabListComponent from "../../../common/components/tab-list.component";
import { useProjectsCrudData } from "../hooks/projects-crud.hook";

function ProjectsCrudPage(): React.JSX.Element {
    const { tabs, tabsComponentRef, disableContinue, actionContinue, onSaveTemp } = useProjectsCrudData();
    return (
        <div className='crud-page full-height'>
            <div className="main-page full-height">
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Crear proyecto</div>
                    </div>
                    <TabListComponent tabs={tabs} ref={tabsComponentRef} />
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
                    <span className="bold text-center button" onClick={() => { localStorage.removeItem('create_project_data'); }}>
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