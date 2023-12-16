import React, { useEffect } from "react";
import usePlanActionPAIData from "../hooks/createPlanAction-pai.hook";
import { ButtonComponent, FormComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { Controller } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "../../projects/components/table-expansible.component";
import { Tooltip } from "primereact/tooltip";
import { NavbarPai } from "../components/navbar-pai.component";
import { typePAIData } from "../data/dropdowns-revision-pai";

export interface IPropsPAI {
    status: "new" | "edit" ;
}

function CreatePlanActionPAIPage({ status }: Readonly<IPropsPAI>): React.JSX.Element {
    const { errors,
        navigate,
        getFieldState,
        fields,
        changeActionsPAi,
        riskText,
        View,
        NamePAIData,
        riskPAIData,
        riskFields,
        tableData,
        appendRisk,
        append,
        remove,
        yearsArray,
        setMessage,
        formAction,
        control,
        register,
        getValues,
        createPlanActionActions,
        createPlanActionColumns,
        onSubmitCreate,
        disableTempBtn,
        setFormAction,
        IndicatorsFormComponent
    } = usePlanActionPAIData({status});


    return (
        <div>
            {IndicatorsFormComponent}
            <div style={{ display: IndicatorsFormComponent ? "none" : "block" }}>
                <div className='crud-page full-height'>
                    <div className='main-page full-height'>
                        <div className='card-table'>
                            <div className="title-area">
                            <div className="text-black extra-large bold">{formAction === "new" ? "Formular Plan de Acción Institucional (PAI) " : "Editar Plan de Acción Institucional (PAI)"}</div>
                            </div>
                            {<FormComponent action={undefined}>
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
                                            filter={true} />

                                        <Controller
                                            control={control}
                                            name={"budgetPAI"}
                                            defaultValue={0}
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
                                                        minFractionDigits={2} />
                                                );
                                            }} />

                                        <SelectComponent
                                            control={control}
                                            idInput={"typePAI"}
                                            className={`select-basic span-width`}
                                            label="Tipo de plan de acción institucional"
                                            classNameLabel="text-black biggest bold text-required"
                                            data={typePAIData}
                                            errors={errors}
                                            filter={true} />
                                        <SelectComponent
                                            control={control}
                                            idInput={"namePAI"}
                                            className={`select-basic span-width`}
                                            label="Nombre proyecto/proceso"
                                            classNameLabel="text-black biggest bold text-required"
                                            data={NamePAIData}
                                            errors={errors}
                                            filter={true} />
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
                                                        disabled={true}

                                                    >
                                                    </TextAreaComponent>
                                                );
                                            }} />
                                        <div>

                                            <Tooltip
                                                target=".custom-tooltip"
                                                content="Articulación con línea del Plan de Desarrollo Distrital."
                                                position="top"
                                                mouseTrack={true}
                                                showDelay={50}
                                                hideDelay={100} />


                                            <label className="text-black biggest bold text-required custom-tooltip" style={{ marginBottom: "0.5rem" }}>
                                                Articulación plan de desarrollo distrital
                                            </label>

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
                                                            classNameLabel="text-black biggest bold text-required"
                                                            className="text-area-basic"
                                                            register={register}
                                                            onChange={field.onChange}
                                                            errors={errors}
                                                            disabled={View}
                                                            characters={200}
                                                        >
                                                        </TextAreaComponent>
                                                    );
                                                }} />

                                        </div>

                                    </div>
                                </div>

                                <div className="card-table " style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                                    <div className="title-area">
                                        <label className="text-black biggest bold text-required">
                                            Articulación plan estratégico
                                        </label>

                                        <div className="title-button text-main large" onClick={() => {
                                            append({ line: null });
                                        }}>
                                            Agregar Línea <AiOutlinePlusCircle />
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
                                                                classNameLabel="text-black biggest bold text-required"
                                                                value={`${field.value}`}
                                                                className={`text-area-basic ${isEmpty && isFieldDirty.isDirty ? "undefined error" : ""} ${isOverLimit ? "undefined error" : ""} `}
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
                                                    }} />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="card-table" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                                    <div className="create-pai-risks">
                                        <SelectComponent
                                            control={control}
                                            idInput={"selectedRisk"}
                                            className={`select-basic span-width`}
                                            label="Riesgos asociados"
                                            classNameLabel="text-black biggest bold text-required"
                                            data={riskPAIData}
                                            errors={errors}
                                            filter={true} />
                                        <ButtonComponent
                                            className="button-main extra_extra_large hover-three button-save"
                                            value={"Agregar riesgo"}
                                            type="button"
                                            action={() => {
                                                appendRisk({ risk: riskText }); // Agrega el riesgo con el valor seleccionado
                                            }} />

                                    </div>
                                    {riskFields.map((fields, index) => {
                                        const lineNumber = index + 1;
                                        return (
                                            <div key={fields.id} style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                                                <Controller
                                                    control={control}
                                                    name={`risksPAI.${index}.risk`}
                                                    defaultValue=""
                                                    render={({ field }) => {
                                                        return (
                                                            <TextAreaComponent
                                                                id={field.name}
                                                                idInput={field.name}
                                                                label={`Riesgo No. ${lineNumber}`}
                                                                classNameLabel="text-black biggest bold"
                                                                value={`${field.value}`}
                                                                className="text-area-basic"
                                                                placeholder="Escribe aquí"
                                                                register={register}
                                                                fieldArray={true}
                                                                onChange={field.onChange}
                                                                errors={errors}

                                                            >

                                                            </TextAreaComponent>
                                                        );
                                                    }} />
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="card-table">
                                    <FormComponent action={undefined} className="problem-description-container">

                                        <div className="title-area">
                                            <label className="text-black biggest bold text-required">
                                                Acciones del PAI
                                            </label>

                                            <div className="actions-pai">

                                                {/* <div className="title-button text-main large" onClick={() => {
                                                }}>
                                                    Consolidado de acciones PAI <AiOutlinePlusCircle />
                                                </div> */}
                                                <div className="title-button text-main large" onClick={onSubmitCreate}>
                                                    Agregar acción <AiOutlinePlusCircle />
                                                </div>
                                            </div>
                                        </div>
                                    </FormComponent>

                                    {<TableExpansibleComponent
                                        actions={createPlanActionActions}
                                        columns={createPlanActionColumns}
                                        data={ getValues("actionsPAi") || []} />}
                                </div>

                            </FormComponent>}
                        </div>
                    </div>
                </div>
            </div>
                {disableTempBtn ? (
                    <NavbarPai editMode={true} />
                    ) : (
                    <NavbarPai />
                )}
        </div>

    )
}

export default React.memo(CreatePlanActionPAIPage);