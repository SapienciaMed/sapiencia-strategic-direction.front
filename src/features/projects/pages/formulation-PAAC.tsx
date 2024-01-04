import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { ButtonComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import "../../anticorruption-plan/style/formulation.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import * as uuid from 'uuid';
import AddActivity from "./add-activity";
import { PiTrash } from "react-icons/pi";

const FormulationPAACEdition = () => {
    const { navigate,
        control,
        statusData,
        yearsArray,
        antiCorruptionPlan,
        getAllByPlanId,
        deleteAllByIds,
        store,
        createPAAC,
        components,
        setComponents,
        setDeletedComponents,
        deletedComponents,
        handleAddComponent,
        deleteRow,
        activities,
        setActivities,
        errors } = useAntiCorruptionPlanData();


    const { setMessage } = useContext(AppContext);
    const [selectedComponent, setSelectedComponent] = useState<string>('')
    const [selectedActivity, setSelectedActivity] = useState<string>('');

    const handleDeleteComponent = (idToDelete) => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Deseas eliminar la acción y la información que contiene? No se podrá recuperar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            },
            show: true,
            title: "¿Eliminar acción?",
            onOk: () => {
                setMessage({
                    title: "Acción del PAI",
                    description: "¡Eliminada exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onClose: () => {
                        setMessage({});
                    },
                });

                deletedComponents.push(idToDelete)
                setDeletedComponents(deletedComponents);
                deleteRow(idToDelete);
            },
        });
    };

    const handleCancel = () => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Estás seguro de cancelar? No se guardarán los datos.",
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
                navigate('/direccion-estrategica/planes/plan-anticorrupcion')
            },
        });
    };

    const handleAddActivity = (component_uuid?: string) => {
        const uuidActivity =  uuid.v4();
        setSelectedActivity(uuidActivity);
        setActivities([...activities, {
            uuid: uuidActivity,
            description: '',
            component_uuid: component_uuid || selectedComponent,
        }]);
    }

    return (
        <>
            {
                selectedComponent === '' ? (
                    <div className="main-page">
                        <div className="card-table">
                            <h2>Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)</h2>
                            <div className="card-table">
                                <section className="select_PAAC">
                                    <SelectComponent
                                        control={control}
                                        idInput={"year"}
                                        className={`select-basic span-width`}
                                        label="Año"
                                        classNameLabel="text-black biggest bold text-required"
                                        data={yearsArray}
                                        errors={errors}
                                        filter={true}
                                    />
                                </section>
                            </div>
                            <section className="card-table mt-15">
                                <h3>Componentes</h3>
                                <SelectComponent
                                    control={control}
                                    idInput={"component_desc"}
                                    className={`select-basic span-width`}
                                    label="Lista de componentes"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[
                                        { name: 'name 1', value: 'name 1' }
                                    ]}
                                    errors={errors}
                                    filter={true}
                                />
                                <div className="text-buttom-circle" onClick={handleAddComponent}>
                                    Agregar componente <AiOutlinePlusCircle />
                                </div>
                                <div className="card-table mt-15">
                                    <table className="table-PAA">
                                        <thead>
                                            <tr>
                                                <th className="p-datatable-thead-PAA">No. Componente</th>
                                                <th className="p-datatable-thead-PAA">Descripción de componente</th>
                                                <th className="p-datatable-thead-PAA">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {components.length > 0 && components.map((component) => (
                                                <AntiCorruptionExpansibleTable
                                                    key={component.uuid}
                                                    description={component.description}
                                                    onChange={(_id, value) =>  {
                                                        const index = components.findIndex((c) => c.uuid === _id)
                                                        components[index].description = value
                                                        setComponents(components);
                                                    }}
                                                    _id={component.uuid}
                                                    index={component.index}
                                                    onDelete={() => handleDeleteComponent(component.uuid)}
                                                    handleAddActivity={(_id) => {
                                                        setSelectedComponent(_id);
                                                        handleAddActivity(_id);
                                                    }}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                            <div className="container-button-bot space-between">
                                <div>
                                <ButtonComponent
                                        className={`button-main huge hover-three button-save`}
                                        value={"Guardar temporalmente"}
                                        type="button"
                                        // action={onSave}
                                    />
                                </div>
                                <div className="buttons-bot">
                                    <span className="bold text-center button" onClick={handleCancel}>
                                        Cancelar
                                    </span>
                                    <ButtonComponent
                                        className={`button-main huge hover-three button-save`}
                                        value={"Guardar y regresar"}
                                        type="button"
                                        // action={() => {
                                        //     // onSave();
                                        //     handleClick();
                                        // }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null
            }

            

            {
                selectedComponent !== '' ? (
                    <div className="strategic-direction-grid-3-web" style={{ gridTemplateColumns: '4fr 1fr', columnGap: '0rem' }}>
                        <div>
                            {
                                selectedActivity !== '' ? (
                                    <AddActivity
                                        onSave={() => {
                                            setSelectedActivity('')
                                            setSelectedComponent('')
                                        }}
                                        onCancel={() => {
                                            setSelectedActivity('')
                                            setSelectedComponent('')
                                        }}
                                        selectedActivity={selectedActivity}
                                        selectedComponent={selectedComponent}
                                    />
                                ) : null
                            }
                        </div>
                        <div style={{ marginRight: 20 }}>
                            <h2>Actividades</h2>
                            {
                                activities.filter((activity) => activity.component_uuid == selectedComponent ).map((a, index) => {
                                    return (
                                        <div key={`${a.uuid}-${index}`} style={{ display: 'flex', alignItems: 'center' }}>
                                            <div
                                                
                                                className="bg-hover-F1F5FF"
                                                style={{
                                                    width: '100%', height: '49px', cursor: 'pointer', textAlign: 'center',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    flexDirection: 'column', marginTop: 7, borderBottom: '1px solid #ECECEE',
                                                    backgroundColor: a.uuid == selectedActivity ? '#F1F5FF' : 'white'
                                                }}
                                                onClick={() => setSelectedActivity(a.uuid)}
                                            >
                                                {index + 1}  
                                            </div>
                                            <div
                                                className="delete-action"
                                                style={{ 'color': '#e53935', fontSize: '24px', marginLeft: 7,
                                                cursor: 'pointer', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}
                                                onClick={() => {
                                                    setActivities(activities.filter((ac) => ac.uuid !== a.uuid));

                                                    if (selectedActivity == a.uuid) {
                                                        setSelectedActivity('');
                                                    }
                                                }}
                                            >
                                                <PiTrash className="button grid-button button-delete" />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="text-buttom-circle" style={{ justifyContent: 'center'}} onClick={() => handleAddActivity()}>
                                Agregar actividad <AiOutlinePlusCircle />
                            </div>
                        </div>
                    </div>
                ) : null
            }
            
        </>
    );
};

export default FormulationPAACEdition;





