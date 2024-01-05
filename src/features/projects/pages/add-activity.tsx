import React, { useContext, useEffect, useState } from "react";
import { ButtonComponent, TextAreaComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller, useForm } from "react-hook-form";
import "../../anticorruption-plan/style/add-activities.scss";
import { AppContext } from "../../../common/contexts/app.context";
import { useParams } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { antiCorruptionPlanActivityValidator } from "../../../common/schemas";
import AddIndicators from "./add-indicators";
import { IActivity } from "../interfaces/AntiCorruptionPlanInterfaces";

interface Props {
    selectedActivity: string;
    selectedComponent: string;
    onSave: () => void;
    onCancel: () => void;
}

interface ActivityCountProps extends Props {
    activityCount: number;
}

function AddActivity(props: ActivityCountProps): React.JSX.Element {
    const { activities, setActivities } = useAntiCorruptionPlanData();
    const resolver = useYupValidationResolver(antiCorruptionPlanActivityValidator);
    const {activityCount } = props;
    

    const {
        register,
        control,
        setValue,
        formState: { errors, isValid },
    } = useForm<any>({
        resolver,
        mode: "all",
    });

 
    const { setMessage } = useContext(AppContext);
    const { selectedActivity, onSave, onCancel } = props;

    useEffect(() => {
        loadData();
    }, [selectedActivity])

    const loadData = () => {
        setValue('description', activities.find((a) => a.uuid == selectedActivity).description)
    }

    const handleCancel = () => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Desea cancelar la acción?, No se guardarán los datos.",
            OkTitle: "Aceptar",
            onCancel: () => { setMessage({}); },
            onClose: () => { setMessage({}); },
            show: true,
            title: "Cancelar acción",
            onOk: () => {
                setMessage({});
                onCancel();
            },
        });
    };

    const handleSave = () => {
        setMessage({
            background: true,
            cancelTitle: "Guardar",
            description: "¿Desea guardar los cambios?",
            OkTitle: "Aceptar",
            onCancel: () => { setMessage({}); },
            onClose: () => { setMessage({}); },
            show: true,
            title: "Guardar acción",
            onOk: () => {
                setMessage({});
                onSave();
            },
        });
    };

    return (
        <div className='main-page'>
            <div className="main-page">
                <div className="card-table">
                    <div className="title-area">
                    <div className="text-black extra-large bold">Componente No. {activities.findIndex((a) => a.uuid == selectedActivity) + 1} - Agregar actividad</div>
                    </div>
                    {
                        selectedActivity !== '' ? (
                            <div className="card-table">
                                <Controller
                                    control={control}
                                    name="description"
                                    defaultValue={activities.find((a) => a.uuid == selectedActivity).description}
                                    render={({ field }) => (
                                        <>
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={field.value}
                                                register={register}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    // onChange(e.target.value)
                                                    const index = activities.findIndex((a) => a.uuid == selectedActivity)
                                                    activities[index].description = e.target.value;
                                                    setActivities([...activities])
                                                }}
                                                label="Descripción de actividad"
                                                classNameLabel="text-black biggest bold text-required"
                                                className={`text-area-basic ${errors.description ? 'error' : ''}`}
                                            />
                                            {errors.description && (
                                                <span className="alert-textarea error-text">
                                                    La descripción es obligatoria
                                                </span>
                                            )}
                                        </>
                                    )}
                                />
                                <span
                                    className="alert-textarea"
                                >
                                    Max 1000 caracteres
                                </span>
                            </div>
                        ) : null
                    }

                    <div className="card-table" style={{ marginTop: 40 }}>
                        <AddIndicators selectedActivity={selectedActivity} />
                    </div>
                </div>

            </div>
            <div className="strategic-direction-search-buttons">
                <span className="bold text-center button" onClick={() => {
                    handleCancel();
                }}>
                    Cancelar
                </span>
                <ButtonComponent
                    className="button-main huge hover-three"
                    value="Guardar"
                    type="submit"
                    action={handleSave}
                />
            </div>
        </div>
    )
}

export default React.memo(AddActivity);