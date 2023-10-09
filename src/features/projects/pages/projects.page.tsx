import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useProjectsData } from "../hooks/projects.hook";
import TableComponent from "../../../common/components/table.component";
import { Controller } from "react-hook-form";

function ProjectsPage(): React.JSX.Element {
    const { navigate, tableComponentRef, tableColumns, tableActions, onSubmit, reset, control, register, statusData, errors } = useProjectsData();
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
                            <SelectComponent
                                control={control}
                                idInput={"status"}
                                className={`select-basic span-width`}
                                label="Estado"
                                classNameLabel="text-black biggest bold"
                                data={statusData}
                                errors={errors}
                            />
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
                        url={`${process.env.urlApiStrategicDirection}/api/v1/project/get-project-paginated`}
                        columns={tableColumns}
                        actions={tableActions}
                        isShowModal={true}
                        titleMessageModalNoResult="Resultados de búsqueda"
                        descriptionModalNoResult="No se generó resultado en la búsqueda"
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProjectsPage);