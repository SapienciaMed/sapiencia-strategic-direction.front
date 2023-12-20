import React, { useState } from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import TableComponent from "../../../common/components/table.component";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller } from "react-hook-form";
//import styles from '../../../anticorruption-plan/style/add-activities.module.scss';

function ProjectsPage(): React.JSX.Element {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Consultar Plan Anticorrupción y Atención al Ciudadano (PAAC)",
        url: "/direccion-estrategica/Consultar/",
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
            msgs, 
            setErrores,
            validateActionAccess } = useAntiCorruptionPlanData();
            const [isEditing, setIsEditing] = useState(false);
    return (
        <div className='main-page'>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Consultar Plan Anticorrupción y Atención al Ciudadano (PAAC)</div>
                </div>
                <FormComponent action={onSubmit}>
                    <div className="card-table">
                        <div className="title-area">
                            <label className="text-black large bold">
                            Consultar plan
                            </label>
                            { validateActionAccess("PROYECTO_CREAR") && 
                                <div className="title-button text-three large" onClick={() => { navigate('./crear-proyecto') }}>
                                    <span style={{ marginRight: '0.5em' }} >Formular plan anticorrupción y atención al ciudadano</span>
                                    {<AiOutlinePlusCircle size={20} color="533893" />}
                                </div>
                            }
                        </div>
                        <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
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
                        url={`${process.env.urlApiStrategicDirection}/api/v1/anti-corruption-plan/paginated`}
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