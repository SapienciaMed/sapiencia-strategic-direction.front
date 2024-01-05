import React, { useContext, useEffect, useState } from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import TableComponent from "../../../common/components/table.component";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller, useForm } from "react-hook-form";
import "../../anticorruption-plan/style/add-activities.scss";
import { AppContext } from "../../../common/contexts/app.context";
import { Tooltip } from "primereact/tooltip";
import { PiTrash } from "react-icons/pi";
import { useParams } from "react-router-dom";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { antiCorruptionPlanActivityValidator } from "../../../common/schemas";
import AddIndicators from "./add-indicators";

interface Props {
    selectedActivity: string;
    selectedComponent: string;
    onSave: () => void;
    onCancel: () => void;
}

function AddActivity(props: Props): React.JSX.Element {
    const { navigate, validateActionAccess } = useAntiCorruptionPlanData();
    const resolver = useYupValidationResolver(antiCorruptionPlanActivityValidator);

    const {
        register,
        control,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<any>({
        resolver,
        mode: "all",
    });

    const { setMessage } = useContext(AppContext);
    const [responsables, setResponsables] = useState([]);
    const { selectedActivity, selectedComponent, onSave, onCancel } = props;

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
                onCancel
            },
        });
    };

    const handleSave = () => {
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
                onCancel();
            },
        });
    };


    return (
        <div className='main-page'>
            <div className="main-page">
                <div className="card-table">
                    <div className="title-area">
                        <div className="text-black extra-large bold">Componente No. {selectedActivity} - Agregar actividad</div>
                    </div>
                    <div className="card-table">
                        <Controller
                            control={control}
                            name="description_activity"
                            render={({ field }) => (
                                <>
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={field.value}
                                        label="Descripción de actividad"
                                        classNameLabel="text-black biggest bold text-required"
                                        className={`text-area-basic ${errors.description_activity ? 'error' : ''}`}
                                        {...field}
                                    />
                                    {errors.description_activity && (
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