import React from "react";
import useHistoricalProjects from "../hooks/historical-projects.hook";
import { ButtonComponent, FormComponent, InputComponent } from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import TableExpansibleComponent from "../components/table-expansible.component";

function HistoricalProjectsPage(): React.JSX.Element {
    const { register, errors, control, showTable, onSubmit, clear, dataTable, tableColumns, tableActions } = useHistoricalProjects();
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Consultar proyectos históricos</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-table">
                        <div className="title-area">
                            <label className="text-black large bold">
                                Consultar Proyecto
                            </label>
                        </div>
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                            <Controller
                                control={control}
                                name={"bpin"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="BPIN"
                                            className="input-basic"
                                            classNameLabel="text-black biggest bold"
                                            typeInput={"text"}
                                            register={register}
                                            onChange={field.onChange}
                                            errors={errors}
                                        />
                                    );
                                }}
                            />
                            <Controller
                                control={control}
                                name={"project"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Nombre proyecto"
                                            className="input-basic"
                                            classNameLabel="text-black biggest bold"
                                            typeInput={"text"}
                                            register={register}
                                            onChange={field.onChange}
                                            errors={errors}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <div className="strategic-direction-search-buttons">
                        <span className="bold text-center button" onClick={clear}>
                            Limpiar campos
                        </span>
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Buscar"
                            type="submit"
                        />
                    </div>
                </FormComponent>
                {showTable && <div className="card-table">
                    <TableExpansibleComponent actions={tableActions} columns={tableColumns} data={dataTable} title="Resultados de búsqueda" />
                </div>}
            </div>
        </div>
    );
}

export default React.memo(HistoricalProjectsPage)