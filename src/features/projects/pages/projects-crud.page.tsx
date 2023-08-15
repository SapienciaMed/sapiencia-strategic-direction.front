import React from "react";
import { ButtonComponent } from "../../../common/components/Form";
import TabListComponent from "../../../common/components/tab-list.component";
import { useProjectsCrudData } from "../hooks/projects-crud.hook";

function ProjectsCrudPage(): React.JSX.Element {
    const { tabs, tabsComponentRef } = useProjectsCrudData();
    return (
        <div className='crud-page full-height'>
            <div className="main-page full-height">
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Crear proyecto</div>
                    </div>
                    <TabListComponent tabs={tabs} ref={tabsComponentRef}/>
                </div>
            </div>
            <div className="container-button-bot">
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={() => { }}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className="button-main huge hover-three"
                        value="Siguiente"
                        type="submit"
                        form=""
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsCrudPage);