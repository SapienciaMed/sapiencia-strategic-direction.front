import React from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import TableComponent from "../../../common/components/table.component";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller } from "react-hook-form";
//import styles from "../../anticorruption-plan/estilos/";

function addActivity(): React.JSX.Element {
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
    return (
        <div className='main-page'>
            <div className="main-page">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">Componente No. 1 - Agregar actividad</div>
                    </div>
                    <div className="card-table">
                        
                            <TextAreaComponent
									id="referencia"
									idInput="referencia"
									label="Descripción de activida"
									className=""
									classNameLabel="text--black text-required"
									register={register}
									errors={errors}
									disabled={false}
									rows={5}
									placeholder="Escribe aquí"
									onChange={(e) => {}
							}/>
						
						<span
							className=""
						>
							Max 1000 caracteres
						</span>
                    
                        <div className="card-table" style={{marginTop: '10px'}}>
                            <div className="title-area">
                                <label className="text-black large bold">
                                    Indicadores de producto <span>*</span>
                                    
                                </label>
                                { validateActionAccess("PROYECTO_CREAR") && 
                                    <div className="title-button text-three large" onClick={() => { navigate('./crear-proyecto') }}>
                                        <span style={{ marginRight: '0.5em' }} >Agregar Indicador</span>
                                        {<AiOutlinePlusCircle size={20} color="533893" />}
                                    </div>
                                }
                            </div>
                                <TextAreaComponent
                                        id="referencia"
                                        idInput="referencia"
                                        label="Descripción de indicador"
                                        className=""
                                        classNameLabel="text--black text-required"
                                        register={register}
                                        errors={errors}
                                        disabled={false}
                                        rows={5}
                                        placeholder="Escribe aquí"
                                        onChange={(e) => {}
                                }/>
                            
                            <span
                                className=""
                            >
                                Max 1000 caracteres
                            </span>

                            <div className="select-sections" style={{display: 'flex',
                            justifyContent: 'flex-start', columnGap: '50px'}}>
                                <div className="" style={{marginTop: '2%', width: '100%', maxWidth: '330px'}}>
                                <SelectComponent
                                    control={control}
                                    idInput={"status"}
                                    className={`select-basic span-width`}
                                    label="Meta Cuatrimestre 1"
                                    classNameLabel="text-black biggest bold"
                                    data={statusData}
                                    errors={errors}
                                    filter={true}
                                />
                                </div>
                                <div className="" style={{marginTop: '2%', width: '100%', maxWidth: '330px'}}>
                                <SelectComponent
                                    control={control}
                                    idInput={"status"}
                                    className={`select-basic span-width`}
                                    label="Unidad de medida"
                                    classNameLabel="text-black biggest bold"
                                    data={statusData}
                                    errors={errors}
                                    filter={true}
                                />
                                </div>
                            </div>

                            <div className="card-table" style={{marginTop: '5%'}}>
                                <div className="title-area">
                                    <label className="text-black large bold">
                                    Responsable
                                    </label>
                                    { validateActionAccess("PROYECTO_CREAR") && 
                                        <div className="title-button text-three large" onClick={() => { navigate('./crear-proyecto') }}>
                                            <span style={{ marginRight: '0.5em' }} >Agregar Responsable</span>
                                            {<AiOutlinePlusCircle size={20} color="533893" />}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>                     
            <div className="strategic-direction-search-buttons">
                        <span className="bold text-center button" onClick={() => {
                            reset();
                            onSubmit();
                        }}>
                            Cancelar
                        </span>
                        <ButtonComponent
                            className="button-main huge hover-three"
                            value="Guardar"
                            type="submit"
                        />
                    </div>                        

        </div>
    )
}

export default React.memo(addActivity);