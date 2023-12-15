import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useProjectsData } from "../hooks/planAction.hook";
import TableComponent from "../../../common/components/table.component";
import { Controller } from "react-hook-form";
import { UploadComponent } from "../../../common/components/upload.component";
import { Messages } from 'primereact/messages';
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";

function PlanActionPage(): React.JSX.Element {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Plan de Acción institucional",
        url: "/direccion-estrategica/pai/",
    });
    const { navigate, 
            tableComponentRef, 
            tableColumns, 
            tableActions, 
            onSubmit, 
            reset, 
            control, 
            register, 
            statusData, 
            errors, 
            showDialog, 
            setShowDialog, 
            filesUploadData, 
            setFilesUploadData, 
            yearsArray,
            msgs, 
            setErrores,
            validateActionAccess } = useProjectsData();
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Consultar Planes de Acción Institucional (PAI)</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-table">
                        <div className="title-area">
                            <label className="text-black large bold">
                                Consultar Planes
                            </label>
                            { validateActionAccess("CREAR_PLAN") && 
                                <div className="title-button text-three large" onClick={() => { navigate('./crear-pai') }}>
                                        <span style={{ marginRight: '0.5em' }} > Formular plan</span>
                                    {<AiOutlinePlusCircle size={20} color="533893" />}
                                </div>
                            }
                        </div>
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                            <Controller
                                control={control}
                                name={"namePAI"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <InputComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Nombre proyecto - proceso"
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
                                idInput={"yearPAI"}
                                className={`select-basic span-width`}
                                label="Vigencia"
                                classNameLabel="text-black biggest bold"
                                data={yearsArray}
                                errors={errors}
                                filter={true}
                            />
                            <SelectComponent
                                control={control}
                                idInput={"status"}
                                className={`select-basic span-width`}
                                label="Estado"
                                classNameLabel="text-black biggest bold"
                                data={statusData}
                                errors={errors}
                                filter={true}
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
                        url={`${process.env.urlApiStrategicDirection}/api/v1/pai/get-pai-paginated`}
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

export default React.memo(PlanActionPage);