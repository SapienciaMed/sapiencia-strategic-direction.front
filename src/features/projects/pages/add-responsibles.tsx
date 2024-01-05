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
import { antiCorruptionPlanIndicatorValidator } from "../../../common/schemas";

interface Props {
    responsible_uuid: string;
    name: string|'';
}

function AddResponsibles(props: Props): React.JSX.Element {
    const { navigate, validateActionAccess, responsibles, setResponsibles } = useAntiCorruptionPlanData();
    const resolver = useYupValidationResolver(antiCorruptionPlanIndicatorValidator);

    const {
		register,
		control,
		watch,
		setValue,
		formState: { errors, isValid },
	} = useForm<any>({ resolver, mode: "all" });
    
    const { name, responsible_uuid } = props;

    useEffect(() => {
        setValue('name', name)
    }, [])

    return (
        <div className="responsable-section">
            <div
                className="delete-action"
                style={{ 'color': '#e53935', fontSize: '1rem',
                cursor: 'pointer', display: 'flex',
                justifyContent: 'flex-end', alignItems: 'flex-end'}}
                onClick={() => {
                    setResponsibles([...responsibles.filter((r) => r.uuid !== responsible_uuid)]);
                }}
            >
                Eliminar <PiTrash className="button grid-button button-delete" />
            </div>
            <Controller
                control={control}
                name="name"
                render={({ field }) => {
                    return (
                        <TextAreaComponent
                            id={field.name}
                            idInput={field.name}
                            value={`${field.value}`}
                            label="Responsable"
                            classNameLabel="text-black biggest bold text-required"
                            className="text-area-basic"
                            register={register}
                            onChange={(e) => {
                                field.onChange(e)
                                const index = responsibles.findIndex((r) => r.uuid == responsible_uuid)
                                responsibles[index].description = e.target.value;
                                setResponsibles([...responsibles]);
                            }}
                            errors={errors}
                        />
                    );
                }}
            />
            <span
                className="alert-textarea"
            >
                Max 1000 caracteres
            </span>
        </div>
    )
}

export default React.memo(AddResponsibles);