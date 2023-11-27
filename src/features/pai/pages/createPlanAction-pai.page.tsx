import React from "react";
import usePlanActionPAIData from "../hooks/createPlanAction-pai.hook";
import { ButtonComponent, DatePickerComponent, FormComponent, SelectComponent,InputComponent,TextAreaComponent } from "../../../common/components/Form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { Controller } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "../../projects/components/table-expansible.component";

interface IProps {
    setForm: React.Dispatch<React.SetStateAction<React.JSX.Element>>;
}


function CreatePlanActionPAIPage(): React.JSX.Element {

    const { errors, navigate, getFieldState, fields,changeActionsPAi,NamePAIData, riskPAIData, riskFields, TypePAIData, appendRisk,append, remove, yearsArray, setMessage, control, onSubmitCreate,register, rolData, statusData, editSchedule,getValues, setValue, cancelAction, saveAction } = usePlanActionPAIData();
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Formular Plan de Acción Institucional (PAI)</div>
                    </div>
                    {<FormComponent action={onSubmitCreate}>
                        <div className="card-table">
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                <SelectComponent
                                    control={control}
                                    idInput={"yearPAI"}
                                    className={`select-basic span-width`}
                                    label="Año del plan de acción institucional"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={yearsArray}
                                    errors={errors}
                                    filter={true}
                                />

                                <Controller
                                    control={control}
                                    name={"budgetPAI"}
                                    defaultValue= {0}
                                    render={({ field }) => {
                                        return (
                                            <InputNumberComponent
                                            idInput={field.name}
                                            control={control}
                                            label="Presupuesto"
                                            errors={errors}
                                            classNameLabel="text-black biggest bold text-required "
                                            className="inputNumber-basic background-textArea"
                                            mode="currency"
                                            currency="COP"
                                            locale="es-CO"
                                            minFractionDigits={2}
                                        />
                                        );
                                    }}
                                />

                                <SelectComponent
                                    control={control}
                                    idInput={"typePAI"}
                                    className={`select-basic span-width`}
                                    label="Tipo de plan de acción institucional"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={TypePAIData}
                                    errors={errors}
                                    filter={true}
                                />
                                <SelectComponent
                                    control={control}
                                    idInput={"name"}
                                    className={`select-basic span-width`}
                                    label="Nombre proyecto/proceso"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={NamePAIData}
                                    errors={errors}
                                    filter={true}
                                />
                            </div>
                            <div className="strategic-direction-grid-1 " style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                                <Controller
                                    control={control}
                                    name={"objectivePAI"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Objetivo proyecto proceso"
                                                classNameLabel="text-black biggest bold text-required"
                                                className="text-area-basic"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                //disabled={ true }
                                               
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                                <Controller
                                    control={control}
                                    name={"articulationPAI"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Articulación plan de desarrollo distrital"
                                                classNameLabel="text-black biggest bold text-required"
                                                className="text-area-basic"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                //disabled={ true }
                                                characters={100}
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="card-table">
                                <div className="title-area">
                                    <label className="text-black biggest bold text-required">
                                        Articulación plan estratégico
                                    </label>

                                    <div className="title-button text-main large" onClick={() => {
                                    append({ line: null });
                                    }}>
                                    Añadir clasificación <AiOutlinePlusCircle />
                                    </div>
                                </div>
                                {fields.map((fields, index) => {
                                    const lineNumber = index + 1;
                                    return (
                                    <div key={fields.id}> 
                                        <Controller
                                            control={control}
                                            name={`linePAI.${index}.line`}
                                            defaultValue=""
                                            render={({ field }) => {
                                                const isEmpty = !field.value; // Reemplazar con la lógica adecuada si el valor debe ser tratado como vacío
                                                const isOverLimit = field.value?.length > 100;
                                                const isFieldDirty = getFieldState(`linePAI.${index}.line`);
                                            return (
                                                <TextAreaComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    label={`Línea No. ${lineNumber}`} 
                                                    classNameLabel="text-black biggest bold"
                                                    value={`${field.value}`}
                                                    className="text-area-basic"
                                                    placeholder="Escribe aquí"
                                                    register={register}
                                                    fieldArray={true}
                                                    onChange={field.onChange}
                                                    errors={errors}
                                                    characters={100}
                                                >
                                                {isEmpty && isFieldDirty.isDirty && (
                                                    <p className="error-message bold not-margin-padding">
                                                        El campo es obligatorio
                                                    </p>
                                                    )}
                                                    {isOverLimit && (
                                                    <p className="error-message bold not-margin-padding">
                                                        Solo se permiten 100 caracteres
                                                    </p>
                                                )}                                                
                                                </TextAreaComponent>
                                            );
                                            }}
                                        />
                                    </div>
                                    )
                                })}
                            </div>

                            <div className="card-table">
                                <div className="title-area">
                                    <label className="text-black biggest bold text-required">
                                        Riesgos asociados
                                    </label>

                                    <ButtonComponent
                                        className="button-main extra_extra_large hover-three button-save"
                                        value={"Agregar riesgo"}
                                        type="button"
                                        action={() => { 
                                                        appendRisk({ risk: null });
                                                      }
                                                }
                                    />
  
                                </div>
                                {fields.map((fields, index) => {
                                    const lineNumber = index + 1;
                                    return (
                                    <div key={fields.id}> 
                                        <Controller
                                            control={control}
                                            name={`linePAI.${index}.line`}
                                            defaultValue=""
                                            render={({ field }) => {
                                                const isEmpty = !field.value; // Reemplazar con la lógica adecuada si el valor debe ser tratado como vacío
                                                const isOverLimit = field.value?.length > 100;
                                                const isFieldDirty = getFieldState(`linePAI.${index}.line`);
                                            return (
                                                <TextAreaComponent
                                                    id={field.name}
                                                    idInput={field.name}
                                                    label={`Línea No. ${lineNumber}`} 
                                                    classNameLabel="text-black biggest bold"
                                                    value={`${field.value}`}
                                                    className="text-area-basic"
                                                    placeholder="Escribe aquí"
                                                    register={register}
                                                    fieldArray={true}
                                                    onChange={field.onChange}
                                                    errors={errors}
                                                    characters={100}
                                                >
                                                {isEmpty && isFieldDirty.isDirty && (
                                                    <p className="error-message bold not-margin-padding">
                                                        El campo es obligatorio
                                                    </p>
                                                    )}
                                                    {isOverLimit && (
                                                    <p className="error-message bold not-margin-padding">
                                                        Solo se permiten 100 caracteres
                                                    </p>
                                                )}                                                
                                                </TextAreaComponent>
                                            );
                                            }}
                                        />
                                    </div>
                                    )
                                })}
                            </div>

                            <div className="card-table">
                                    <FormComponent action={undefined} className="problem-description-container">
                                        <div>
                                            <div className="title-area">
                                                <label className="text-black large bold text-required">
                                                    Acciones del PAI
                                                </label>

                                                <div className="title-button text-main large" onClick={() => {
                                                
                                                }}>
                                                    Consolidado de acciones PAI <AiOutlinePlusCircle />
                                                </div>
                                                <div className="title-button text-main large" onClick={() => {
                                                
                                                }}>
                                                    Agregar acción <AiOutlinePlusCircle />
                                                </div>
                                            </div>
                                        </div>
                                    </FormComponent>
                            </div>

                    </FormComponent>}

                    
                </div>
            </div>
            <div className="container-button-bot space-between">
                {
                    <ButtonComponent
                        className="button-main extra_extra_large hover-three button-save"
                        value={"Guardar temporalmente"}
                        type="button"
                        action={saveAction}
                    />
                }
                <div className="buttons-bot">
                    { <span className="bold text-center button" onClick={cancelAction || (() => {
                        //if(!dirty) return navigate('/direccion-estrategica/proyectos/');
                        setMessage({
                            title: "Cancelar acción",
                            description: "¿Deseas cancelar la acción y regresar a la opción de consulta?",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                //navigate('/direccion-estrategica/proyectos/');
                                setMessage({});
                            }
                        })
                    })}>
                        Cancelar
                    </span>}
                    <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={"Guardar y regresar"}
                        type="button"
                        action={saveAction}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(CreatePlanActionPAIPage);