import React from "react";
import { ButtonComponent, FormComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useProjectsData } from "../hooks/projects.hook";
import TableComponent from "../../../common/components/table.component";

function ProjectsPage(): React.JSX.Element {
    const { navigate, tableComponentRef, tableColumns, tableActions, onSubmit, reset } = useProjectsData();
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Proyectos</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-table">
                        <div className="title-area">
                            <label className="text-black large bold">
                                Consultar Proyecto
                            </label>
                            <div className="title-button text-three large">
                                <span style={{ marginRight: '0.5em' }} onClick={() => { navigate('./crear-proyecto') }}> Crear proyecto</span>
                                {<AiOutlinePlusCircle size={20} color="533893" />}
                            </div>
                        </div>
                    </div>
                    <div className="strategic-direction-search-buttons">
                        <span className="bold text-center button" onClick={() => {
                            reset();
                            onSubmit();
                        }}>
                            Limpiar campos
                        </span>
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Buscar"
                            type="submit"
                        />
                    </div>
                </FormComponent>
                <div className="card-table">
                    <TableComponent
                        ref={tableComponentRef}
                        url={``}
                        columns={tableColumns}
                        actions={tableActions}
                        isShowModal={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsPage);