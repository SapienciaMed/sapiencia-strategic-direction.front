import React, { useContext, useEffect, useState } from "react";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import TableComponent from "../../../common/components/table.component";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { Controller, useForm } from "react-hook-form";
import "../../anticorruption-plan/style/add-activities.scss";
import { AppContext } from "../../../common/contexts/app.context";
import { PiTrash } from "react-icons/pi";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { antiCorruptionPlanIndicatorValidator } from "../../../common/schemas";
import AddResponsibles from "./add-responsibles";
import * as uuid from 'uuid';
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const schema = Yup.object().shape({
    description: Yup.string().required('La descripción es obligatoria'),
    quarterly_goal1: Yup.number().required('El campo es obligatorio'),
    quarterly_goal2: Yup.number().required('El campo es obligatorio'),
    quarterly_goal3: Yup.number().required('El campo es obligatorio'),
    unit1: Yup.string().required('El campo es obligatorio'),
    unit2: Yup.string().required('El campo es obligatorio'),
    unit3: Yup.string().required('El campo es obligatorio'),
});

const resolver = yupResolver(schema);

interface Props {
    selectedActivity: string;
    onSave?: () => void
}

function AddIndicator(props: Props): React.JSX.Element {
    const { navigate, validateActionAccess, indicators, setIndicators, responsibles, setResponsibles } = useAntiCorruptionPlanData();

    const {
        register,
        control,
        watch,
        setValue,
        getValues,
        formState: { errors, isValid },
    } = useForm({ 
        resolver, mode: "all" 
    });

    const { setMessage } = useContext(AppContext);
    const { selectedActivity } = props;
    const [selectedIndicator, setSelectedIndicator] = useState<string>('')
    const units = [
        { name: 'Porcentaje', value: 'Porcentaje' },
        { name: 'Numero', value: 'Numero' }
    ];

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
                loadData();
            },
        });
    };

    const handleOnDelete = () => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Desea eliminar el indicador?, No podra recuperar los datos.",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            },
            show: true,
            title: "Aceptar",
            onOk: () => {
                setMessage({});
                setSelectedIndicator('');
                setIndicators([...indicators.filter(i => i.uuid !== selectedIndicator)]);
            },
        });
    };


    useEffect(() => {
        setValue('description', 'asdasdasd')
        addIndicator();
    }, [])

    useEffect(() => {
        loadData();
    }, [selectedIndicator]);

    const loadData = () => {
        const indicator = indicators?.find((i) => i.uuid == selectedIndicator);

        setValue('description', indicator?.description)
        setValue('quarterly_goal1', indicator?.quarterly_goal1)
        setValue('unit1', indicator?.unit1)
        setValue('quarterly_goal2', indicator?.quarterly_goal2)
        setValue('unit2', indicator?.unit2)
        setValue('quarterly_goal3', indicator?.quarterly_goal3)
        setValue('unit3', indicator?.unit3)
    }

    const addIndicator = () => {
        const _id = uuid.v4()
        setSelectedIndicator(_id);
        setIndicators([...indicators, {
            uuid: _id,
            description: '',
            quarterly_goal1: 0,
            unit1: 'Porcentaje',
            quarterly_goal2: 0,
            unit2: 'Porcentaje',
            quarterly_goal3: 0,
            unit3: 'Porcentaje',
            acpa_uuid: selectedActivity,
        }])
    }

    const addResponsible = () => {
        const _id = uuid.v4()

        setResponsibles([...responsibles, {
            uuid: _id,
            description: '',
            ipa_uuid: selectedIndicator,
        }])
    }

    const save = () => {
        const index = indicators.findIndex((i) => i.uuid == selectedIndicator)
        indicators[index].description = getValues('description');
        indicators[index].quarterly_goal1 = getValues('quarterly_goal1');
        indicators[index].unit1 = getValues('unit1');
        indicators[index].quarterly_goal2 = getValues('quarterly_goal2');
        indicators[index].unit2 = getValues('unit2');
        indicators[index].quarterly_goal3 = getValues('quarterly_goal3');
        indicators[index].unit3 = getValues('unit3');
        
        setIndicators([...indicators])
    }

    console.log('indicators', indicators)

    return (
        <div className='main-page'>
            <div className="main-page">

                <div className="title-area">
                    <label className="text-black large bold">
                        Indicadores de producto *
                    </label>
                    {validateActionAccess("PROYECTO_CREAR") &&
                        <div className="title-button text-three large" onClick={addIndicator}>
                            <span style={{ marginRight: '0.5em' }} >Agregar indicador</span>
                            {<AiOutlinePlusCircle size={20} color="533893" />}
                        </div>
                    }
                </div>


                <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    {indicators.filter((i) => i.acpa_uuid === selectedActivity ).map((indicator, index) => {
                        return (
                            <div
                                key={`${indicator.uuid}-${index}`}
                                style={{
                                    width: 40, height: 40, borderRadius: '100%',
                                    border: 'none', textAlign: 'center', fontSize: '14px',
                                    backgroundColor: indicator.uuid == selectedIndicator ? '#533893' : '#E2E2E2',
                                    color: indicator.uuid == selectedIndicator ? 'white' : 'black',
                                    justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer',
                                    margin: 7
                                }}
                                onClick={() => {
                                    setSelectedIndicator(indicator.uuid);
                                    loadData();
                                }}
                            >
                                {index + 1}
                            </div>
                        )
                    })}
                </div>

                {
                    selectedIndicator !== '' ? (
                        <div
                            className="delete-action"
                            style={{
                                'color': '#e53935', fontSize: '1rem',
                                cursor: 'pointer', display: 'flex',
                                justifyContent: 'flex-end', alignItems: 'flex-end'
                            }}
                            onClick={() => handleOnDelete()}>
                            Eliminar <PiTrash className="button grid-button button-delete" />
                        </div>
                    ) : null
                }

                {
                    selectedIndicator !== '' ? (
                        <>
                            <Controller
                                control={control}
                                name="description"
                                defaultValue={indicators.find((i) => i.uuid === selectedIndicator)?.description}
                                render={({ field }) => {
                                    return (
                                        <>
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                register={register}
                                                onChange={(e) => {
                                                    field.onChange(e)
                                                    save();
                                                }}
                                                value={field.value}
                                                label="Descripción de indicador"
                                                classNameLabel="text-black biggest bold text-required"
                                                className={`text-area-basic ${errors?.description ? 'error' : ''}`}
                                            />
                                            {errors.description && (
                                                <span className="error-text">El campo es obligatorio</span>
                                            )}
                                        </>
                                    );
                                }}
                            />
                            <span
                                className="alert-textarea"
                            >
                                Max 1000 caracteres
                            </span>


                            <div className="select-sections" style={{ display: 'flex', justifyContent: 'flex-start', columnGap: '50px'}}>

                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                <InputNumberComponent
                                    idInput="quarterly_goal1"
                                    control={control}
                                    label="Meta Cuatrimestre 1"
                                    errors={errors}
                                    placeholder=""
                                    classNameLabel="text-black biggest bold color-1 text-required"
                                    className={`inputNumber-basic ${errors?.quarterly_goal1 ? 'error' : ''}`}
                                    onChange={() => save()}
                                />
                                </div>
                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                    <SelectComponent
                                        control={control}
                                        idInput="unit1"
                                        label="Unidad de medida"
                                        classNameLabel="text-black biggest bold color-1 text-required"
                                        data={units}
                                        errors={errors}
                                        filter={true}
                                        className={`select-basic span-width ${errors?.unit1 ? 'error' : ''}`}
                                        onChange={() => save()}
                                    />
                                </div>
                            </div>

                            <div className="select-sections" style={{ display: 'flex', justifyContent: 'flex-start', columnGap: '50px'}}>
                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                    <InputNumberComponent
                                        idInput="quarterly_goal2"
                                        control={control}
                                        label="Meta Cuatrimestre 2"
                                        errors={errors}
                                        placeholder=""
                                        classNameLabel="text-black biggest bold color-2 text-required"
                                        className={`inputNumber-basic ${errors?.quarterly_goal2 ? 'error' : ''}`}
                                        onChange={() => save()}
                                    />
                                </div>
                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                    <SelectComponent
                                        control={control}
                                        idInput="unit2"
                                        label="Unidad de medida"
                                        classNameLabel="text-black biggest bold color-2 text-required"
                                        data={units}
                                        errors={errors}
                                        filter={true}
                                        className={`select-basic span-width ${errors?.unit2 ? 'error' : ''}`}
                                        onChange={() => save()}
                                    />
                                </div>
                            </div>

                            <div className="select-sections" style={{ display: 'flex', justifyContent: 'flex-start', columnGap: '50px'}}>
                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                    <InputNumberComponent
                                        idInput="quarterly_goal3"
                                        control={control}
                                        label="Meta Cuatrimestre 3"
                                        errors={errors}
                                        placeholder=""
                                        classNameLabel="text-black biggest bold color-3 text-required"
                                        className={`inputNumber-basic ${errors?.quarterly_goal3 ? 'error' : ''}`}
                                        onChange={() => save()}
                                    />
                                </div>
                                <div className="" style={{ marginTop: '2%', width: '100%', maxWidth: '330px' }}>
                                    <SelectComponent
                                        control={control}
                                        idInput="unit3"
                                        label="Unidad de medida"
                                        classNameLabel="text-black biggest bold color-3 text-required"
                                        data={units}
                                        errors={errors}
                                        filter={true}
                                        className={`select-basic span-width ${errors?.unit3 ? 'error' : ''}`}
                                        onChange={() => save()}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null
                }

                {
                    selectedIndicator !== '' ? (
                        <>
                            <div className="card-table" style={{ marginTop: '5%' }}>
                                <div className="title-area">
                                    <label className="text-black large bold">
                                        Responsable
                                    </label>
                                    {validateActionAccess("PROYECTO_CREAR") &&
                                        <div className="title-button text-three large" onClick={addResponsible}>
                                            <span style={{ marginRight: '0.5em' }} >Agregar Responsable</span>
                                            {<AiOutlinePlusCircle size={20} color="533893" />}
                                        </div>
                                    }
                                </div>

                                {responsibles.length > 0 && responsibles.filter((responsible) => responsible.ipa_uuid === selectedIndicator).map((r, index) => (
                                    <AddResponsibles key={`${r.uuid}-${index}`} name={r.description} responsible_uuid={r.uuid} />
                                ))}
                            </div>

                            {/* 

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
                                    action={save}
                                />
                            </div> */}
                        </>
                    ) : null
                }
            </div>


        </div>
    )
}

export default React.memo(AddIndicator);