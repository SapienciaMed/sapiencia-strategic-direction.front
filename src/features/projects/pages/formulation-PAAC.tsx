import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ButtonComponent, SelectComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import "../../anticorruption-plan/style/formulation.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import * as uuid from 'uuid';
import AddActivity from "./add-activity";
import { PiTrash } from "react-icons/pi";
import {
    useAntiCorruptionPlanService, useAntiCorruptionPlanComponentService, useAntiCorruptionPlanActivityService,
    useAntiCorruptionPlanIndicatorService, useAntiCorruptionPlanResponsibleService
} from "../../anticorruption-plan/hooks/anti-corruption-plan-service.hook";
import moment from "moment";
import { IAntiCorruptionPlanFields } from "../interfaces/AntiCorruptionPlanInterfaces";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { antiCorruptionPlanValidator } from "../../../common/schemas";
import { EResponseCodes } from "../../../common/constants/api.enum";

const FormulationPAACEdition = () => {
    const { navigate, yearsArray, components, setComponents, activities, responsibles, indicators,
        setActivities, setIndicators, setResponsibles, setDeletedActivityIds, deletedActivityIds, deletedComponentIds, deletedIndicatorIds, deletedResponsibleIds,
        setDeletedComponentIds,
    } = useAntiCorruptionPlanData();
    const resolver = useYupValidationResolver(antiCorruptionPlanValidator);
    const { formState: { errors }, control, getValues } = useForm<IAntiCorruptionPlanFields>({ resolver });
    const { id } = useParams()

    const { create: createAnticorruptionPlan, getById: getPlanById, update: updatePlan } = useAntiCorruptionPlanService();
    const { store: storeAnticorruptionPlanComponents, getByPlanId: getComponentsByPlanId, deleteAllByIds: deleteComponentsByIds } = useAntiCorruptionPlanComponentService();
    const { store: storeAnticorruptionPlanActivities, getByPlanId: getActivitiesByPlanId, deleteAllByIds: deleteActivitiesByIds } = useAntiCorruptionPlanActivityService();
    const { store: storeAnticorruptionPlanIndicators, getByPlanId: getIndicatorsByPlanId, deleteAllByIds: deleteIndicatorsByIds } = useAntiCorruptionPlanIndicatorService();
    const { store: storeAnticorruptionPlanResponsibles, getByPlanId: getResponsiblesByPlanId, deleteAllByIds: deleteResponsiblesByIds } = useAntiCorruptionPlanResponsibleService();
    
    

    const { setMessage } = useContext(AppContext);
    const [selectedComponent, setSelectedComponent] = useState<string>('')
    const [selectedActivity, setSelectedActivity] = useState<string>('');
    const [isComponentSelected, setIsComponentSelected] = useState(false);
    const [componentAdded, setComponentAdded] = useState(false);
    const [componentCount, setComponentCount] = useState(1);
    const [deletedComponents, setDeletedComponents] = useState<string[]>([]);

    useEffect(() => {
        getPlanById(id).then((r) => {
            if (r.operation.code === EResponseCodes.OK) {
                console.log(r.data)
            }
        })
        
        getComponentsByPlanId(id).then((r) => {
            if (r.operation.code === EResponseCodes.OK) {
                setComponents(r.data)
            }
        })
        
        getActivitiesByPlanId(id).then((r) => {
            if (r.operation.code === EResponseCodes.OK) {
                setActivities(r.data)
            }
        })

        getIndicatorsByPlanId(id).then((r) => {
            if (r.operation.code === EResponseCodes.OK) {
                setIndicators(r.data)
            }
        })

        getResponsiblesByPlanId(id).then((r) => {
            if (r.operation.code === EResponseCodes.OK) {
                setResponsibles(r.data)
            }
        })
    }, [])

    useEffect(() => {
        if (components.length === 0) {
            setComponentCount(1);
        }
    }, [components]);

    const handleDeleteComponent = (idToDelete) => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Deseas eliminar la acción y la información que contiene? No se podrá recuperar",
            OkTitle: "Aceptar",
            onCancel: () => { setMessage({}); },
            onClose: () => { setMessage({}); },
            show: true,
            title: "¿Eliminar acción?",
            onOk: () => {
                setMessage({
                    title: "Componente del PAAC",
                    description: "¡Eliminado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onClose: () => { setMessage({}); },
                });

                if (components.find((r) => r.uuid  == idToDelete)?.pac_id) {
                    setDeletedComponentIds([...deletedComponentIds, idToDelete])
                }

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
            onCancel: () => { setMessage({}); },
            onClose: () => { setMessage({}); },
            show: true,
            title: "Cancelar acción",
            onOk: () => {
                setMessage({});
                navigate('/direccion-estrategica/planes/plan-anticorrupcion')
            },
        });
    };

    const [activityCount, setActivityCount] = useState(0);

    const handleAddActivity = (cpac_uuid?: string) => {
        const uuidActivity = uuid.v4();
        setSelectedActivity(uuidActivity);
        setActivities([
            ...activities,
            {
                uuid: uuidActivity,
                description: "",
                cpac_uuid: cpac_uuid || selectedComponent,
            },
        ]);
        setActivityCount(activityCount + 1);
    };

    const handleDeleteActivity = (activity) => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Deseas eliminar la Actividad? No se podrá recuperar",
            OkTitle: "Aceptar",
            onCancel: () => { setMessage({}); },
            onClose: () => { setMessage({}); },
            show: true,
            title: "¿Eliminar actividad?",
            onOk: () => {
                setMessage({
                    title: "Actividad del PAAC",
                    description: "¡Actividad eliminada exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onClose: () => {
                        setMessage({});
                    },
                });
    
                if (activities.find((r) => r.uuid  === selectedActivity)?.pac_id) {
                    setDeletedActivityIds([...deletedActivityIds, selectedActivity])
                }

                setActivities(activities.filter((ac) => ac.uuid !== activity.uuid));
    
                if (selectedActivity === activity.uuid) {
                    setSelectedActivity('');
                }
            },
        });
    };

    const handleAddComponent = () => {
        const newComponent = {
            id: componentCount,
            index: componentCount,
            uuid: uuid.v4(),
            description: getValues('component_desc'),
        };

        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setComponentCount((prevCount) => prevCount + 1);
        setComponentAdded(true);
    };

    const deleteRow = (idToDelete) => {
        setComponents((prevComponents) =>
            prevComponents.filter(
                (component) => component.uuid !== idToDelete
            )
        );
        if (components.length <= 1) {
            setComponentAdded(false);
        }
    };

    const handleSave = () => {
        if (id) {

            deleteComponentsByIds(deletedComponentIds).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    console.log('response.data', response.data)
                } else {
                    console.log(response.operation.message);
                }
            });

            deleteResponsiblesByIds(deletedResponsibleIds).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    console.log('response.data', response.data)
                } else {
                    console.log(response.operation.message);
                }
            });

            deleteIndicatorsByIds(deletedIndicatorIds).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    console.log('response.data', response.data)
                } else {
                    console.log(response.operation.message);
                }
            });
        
            deleteActivitiesByIds(deletedActivityIds).then(response => {
                if (response.operation.code === EResponseCodes.OK) {
                    console.log('response.data', response.data)
                } else {
                    console.log(response.operation.message);
                }
            });

            updatePlan(id, String(getValues('year'))).then((response2) => {
                if (response2.operation.code === EResponseCodes.OK) {
                    storeAnticorruptionPlanActivities({
                        activities,
                        plan_id: Number(id),
                    }).then((response3) => {
                        if (response3.operation.code === EResponseCodes.OK) {
                            storeAnticorruptionPlanIndicators({
                                indicators,
                                plan_id: Number(id),
                            }).then((response4) => {
                                if (response4.operation.code === EResponseCodes.OK) {
                                    storeAnticorruptionPlanResponsibles({
                                        responsibles,
                                        plan_id: Number(id),
                                    }).then((response5) => {
                                        console.log(response5)
                                    })
                                }
                            });
                        }
                    })
                }
            })
        } else {
            const plan_uuid = uuid.v4();
            createAnticorruptionPlan({
                name: 'Plan Anticorrupción y Atención al Ciudadano (PAAC)',
                date: moment(new Date()).format('DD/MM/YYYY'),
                status: 1,
                year: String(getValues('year')),
                uuid: plan_uuid,
            }).then((response) => {
                if (response.operation.code === EResponseCodes.OK) {
                    storeAnticorruptionPlanComponents({
                        components,
                        plan_uuid,
                        plan_id: response.data.id
                    }).then((response2) => {
                        if (response2.operation.code === EResponseCodes.OK) {
                            storeAnticorruptionPlanActivities({
                                activities,
                                plan_id: response.data.id
                            }).then((response3) => {
                                if (response3.operation.code === EResponseCodes.OK) {
                                    storeAnticorruptionPlanIndicators({
                                        indicators,
                                        plan_id: response.data.id
                                    }).then((response4) => {
                                        if (response4.operation.code === EResponseCodes.OK) {
                                            storeAnticorruptionPlanResponsibles({
                                                responsibles,
                                                plan_id: response.data.id
                                            }).then((response5) => {
                                                console.log(response5)
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
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
                                    onChange={() => setIsComponentSelected(true)}
                                />
                                <div className="text-buttom-circle" onClick={handleAddComponent} style={{ opacity: isComponentSelected ? 1 : 0.5, pointerEvents: isComponentSelected ? 'auto' : 'none' }}>
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
                                        className={`button-main huge hover-three button-save ${componentAdded ? '' : 'disabled-button'}`}
                                        value={"Guardar temporalmente"}
                                        type="button"
                                        disabled={!componentAdded}
                                        // action={onSave}
                                    />
                                </div>
                                <div className="buttons-bot">
                                    <span className="bold text-center button" onClick={handleCancel}>
                                        Cancelar
                                    </span>
                                    <ButtonComponent
                                        className={`button-main huge hover-three button-save ${componentAdded ? '' : 'disabled-button'}`}
                                        value={"Guardar y regresar"}
                                        type="button"
                                        disabled={!componentAdded}
                                        action={() => {
                                            handleSave()
                                            // handleClick();
                                        }}
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
                                        activityCount={activityCount}
                                    />
                                ) : null
                            }
                        </div>
                        <div style={{ marginRight: 20 }}>
                            <h2>Actividades</h2>
                            {
                                activities.filter((activity) => activity.cpac_uuid == selectedComponent ).map((a, index) => {
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
                                                style={{
                                                    color: "#e53935",
                                                    fontSize: "24px",
                                                    marginLeft: 7,
                                                    cursor: "pointer",
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    alignItems: "flex-end",
                                                }}
                                                onClick={() => handleDeleteActivity(a)}
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





