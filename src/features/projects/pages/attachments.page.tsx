import React from "react";
import { useParams } from "react-router-dom";
import { InputComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";
import useAttachmentsData from "../hooks/attachments.hook";

function AttachmentsPage(): React.JSX.Element {
    const { id } = useParams();
    const { tableData, tableColumns, tableActions, bpin, project } = useAttachmentsData(id);
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Proyectos</div>
                </div>
                <div className="strategic-direction-attachments-form">
                    <div className="card-table">
                        <div className="title-area">
                            <label className="text-black large bold">
                                Consultar adjuntos del proyecto
                            </label>
                        </div>
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                            <InputComponent
                                idInput={"bpin"}
                                value={bpin}
                                label="BPIN"
                                className="input-basic"
                                classNameLabel="text-black biggest bold"
                                typeInput={"text"}
                                disabled
                            />
                            <InputComponent
                                idInput={"project"}
                                value={project}
                                label="Nombre del proyecto"
                                className="input-basic"
                                classNameLabel="text-black biggest bold"
                                typeInput={"text"}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="card-table">
                        <TableComponent
                            data={tableData}
                            columns={tableColumns}
                            actions={tableActions}
                            isShowModal={true}
                            titleMessageModalNoResult="Resultados de búsqueda"
                            descriptionModalNoResult="No se generó resultado en la búsqueda"
                            title="Listado de archivos adjuntos"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.memo(AttachmentsPage);