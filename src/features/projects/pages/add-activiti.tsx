import React, { useContext, useState } from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import TableComponent from "../../../common/components/table.component";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller } from "react-hook-form";
import "../../anticorruption-plan/style/add-activities.scss";
import { AppContext } from "../../../common/contexts/app.context";
import { Tooltip } from "primereact/tooltip";
import { PiTrash } from "react-icons/pi";

function AddActivity(): React.JSX.Element {
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
    
    const { setMessage } = useContext(AppContext);
    const [responsables, setResponsables] = useState([]);

    const handleClick = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion/formular-plan/editar/:id');
    };

    const handleCancel = () => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Desea cancelar la acción?, No se guardarán los datos.",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            },
            show: true,
            title: "Cancelar acción",
            onOk: () => {
                setMessage({});
                handleClick();
            },
        });
    };

    const agregarResponsable = () => {
        const nuevaSeccion = {
            id: responsables.length + 1,
        };
        setResponsables([...responsables, nuevaSeccion]);
    };

    const eliminarResponsable = (id) => {
        const nuevaListaResponsables = responsables.filter((item) => item.id !== id);
        setResponsables(nuevaListaResponsables);
    };

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
									label="Descripción de actividad"
									className="input-textarea"
									classNameLabel="text--black text-required"
									register={register}
									errors={errors}
									disabled={false}
									rows={5}
									placeholder="Escribe aquí"
									onChange={(e) => {}
							}/>
						
						<span
							className="alert-textarea"
						>
							Max 1000 caracteres
						</span>
                    
                        <div className="card-table" style={{marginTop: '10px'}}>
                            <div className="title-area">
                                <label className="text-black large bold">
                                    Indicadores de producto <span>*</span>
                                    
                                </label>
                               
                            </div>
                                <TextAreaComponent
                                        id="referencia"
                                        idInput="referencia"
                                        label="Descripción de indicador"
                                        className="input-textarea"
                                        classNameLabel="text--black text-required"
                                        register={register}
                                        errors={errors}
                                        disabled={false}
                                        rows={5}
                                        placeholder="Escribe aquí"
                                        onChange={(e) => {}
                                }/>
                            
                            <span
                                className="alert-textarea"
                            >
                                Max 500 caracteres
                            </span>

                            <div className="select-sections" style={{display: 'flex',
                            justifyContent: 'flex-start', columnGap: '50px', flexWrap: 'wrap'}}>
                                <div className="" style={{marginTop: '2%', width: '100%', maxWidth: '330px'}}>
                                <SelectComponent
                                    control={control}
                                    idInput={"status"}
                                    className={`select-basic span-width `}
                                    label="Meta Cuatrimestre 1"
                                    classNameLabel="text-black biggest bold color-1"
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
                                    classNameLabel="text-black biggest bold color-1"
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
                                    label="Meta Cuatrimestre 2"
                                    classNameLabel="text-black biggest bold color-2"
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
                                    classNameLabel="text-black biggest bold color-2"
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
                                    label="Meta Cuatrimestre 3"
                                    classNameLabel="text-black biggest bold color-3"
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
                                    classNameLabel="text-black biggest bold color-3"
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
                                        <div className="title-button text-three large" onClick={agregarResponsable}>
                                            <span style={{ marginRight: '0.5em' }} >Agregar Responsable</span>
                                            {<AiOutlinePlusCircle size={20} color="533893" />}
                                        </div>
                                    }
                                </div>
                            </div>
                            {responsables.map((item) => (
                                <div key={item.id} className="responsable-section">
                                    <h3>Responsable</h3>
                                        <div
                                        className="delete-action"
                                        style={{ 'color': '#e53935', fontSize: '1rem',
                                        cursor: 'pointer', display: 'flex',
                                        justifyContent: 'flex-end', alignItems: 'flex-end'}}
                                        onClick={() => eliminarResponsable(item.id)}>
                                        Eliminar <PiTrash className="button grid-button button-delete" />
                                    </div>
                                    <TextAreaComponent
                                        id="referencia"
                                        idInput="referencia"
                                        label="Responsable"
                                        className="input-textarea text-area-init"
                                        classNameLabel="text--black text-required"
                                        register={register}
                                        errors={errors}
                                        disabled={false}
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        onChange={(e) => {}
                                }/>
                            
                            <span
                                className="alert-textarea"
                            >
                                Max 100 caracteres
                            </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>                     
            <div className="strategic-direction-search-buttons">
                        <span className="bold text-center button" onClick={() => {
                            handleCancel();
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

export default React.memo(AddActivity);