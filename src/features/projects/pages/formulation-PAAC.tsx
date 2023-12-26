import React from "react";

import { ButtonComponent, FormComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { Controller } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import TableExpansibleComponent from "../components/table-expansible.component";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { Tooltip } from "primereact/tooltip";
import usePlanActionPAIData from "../../pai/hooks/createPlanAction-pai.hook";
import { typePAIData } from "../../pai/data/dropdowns-revision-pai";

export interface IPropsPAI {
    status: "new" | "edit";
}

function FormulationPAAC(): React.JSX.Element {
    //{ status }: Readonly<IPropsPAI>
    const { errors,
        getFieldState,
        fields,
        riskText,
        view,
        namePAIData,
        riskPAIData,
        riskFields,
        appendRisk,
        append,
        yearsArray,
        formAction,
        control,
        register,
        getValues,
        createPlanActionActions,
        createPlanActionColumns,
        onSubmitCreate
    } = usePlanActionPAIData({ status });
    return (
        <div>
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">{formAction === "new" ? "Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)" : "Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)"}</div>
                </div>
                {<FormComponent action={undefined}>

                    <div className="card-table" style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                        <div className="create-pai-risks">
                            <SelectComponent
                                control={control}
                                idInput={"selectedRisk"}
                                className={`select-basic span-width`}
                                label="Año"
                                classNameLabel="text-black biggest bold text-required"
                                data={riskPAIData}
                                errors={errors}
                                filter={true} />

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
                                Componentes
                                </label>

                                <div className="actions-pai">

                                    {/* <div className="title-button text-main large" onClick={() => {
                                                }}>
                                                    Consolidado de acciones PAI <AiOutlinePlusCircle />
                                                </div> */}
                                    <div className="title-button text-main large" onClick={onSubmitCreate}>
                                        Agregar componente <AiOutlinePlusCircle />
                                    </div>
                                </div>
                            </div>
                        </FormComponent>
                                    
                        {<AntiCorruptionExpansibleTable
                            actions={createPlanActionActions}
                            columns={createPlanActionColumns}
                            data={getValues("actionsPAi") || []} />}
                    </div>

                </FormComponent>}
            </div>
        </div>
    )
}

export default React.memo(FormulationPAAC);