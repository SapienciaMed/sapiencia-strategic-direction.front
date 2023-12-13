import React from "react";
import { useParams } from "react-router-dom";
import useRevisionPAIData from "../hooks/revision-pai.hook";
import { ButtonComponent, FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import AccordionsComponent from "../../../common/components/accordions.component";

function RevisionPAIPage(): React.JSX.Element {
    const { id: idPAI } = useParams();
    const {
        controlPAI,
        registerPAI,
        errorsPAI,
        fieldsLines,
        fieldsRisks,
        accordionsActions,
        onSaveTemp,
        onSubmit,
        onCancel,
        onComplete
    } = useRevisionPAIData(idPAI);
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <FormComponent action={undefined} className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                        <div className="title-area">
                            <div className="text-black extra-large bold">{"Revisión plan de Acción Institucional (PAI)"}</div>
                        </div>
                        <div className="card-table strategic-direction-grid-1 strategic-direction-grid-1-web">
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                <Controller
                                    control={controlPAI}
                                    name={`yearPAI`}
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Año del plan de acción institucional"
                                                className="input-basic"
                                                classNameLabel="text-black biggest bold"
                                                typeInput={"number"}
                                                register={registerPAI}
                                                onChange={field.onChange}
                                                errors={errorsPAI}
                                                disabled />
                                        );
                                    }}
                                />
                                <InputNumberComponent
                                    idInput={`budgetPAI`}
                                    control={controlPAI}
                                    label="Presupuesto"
                                    errors={errorsPAI}
                                    placeholder=""
                                    prefix="$ "
                                    classNameLabel="text-black biggest bold"
                                    className={`inputNumber-basic`}
                                    disabled
                                />
                                <Controller
                                    control={controlPAI}
                                    name={`typePAI`}
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Tipo de plan de acción institucional"
                                                className="input-basic"
                                                classNameLabel="text-black biggest bold"
                                                typeInput={"text"}
                                                register={registerPAI}
                                                onChange={field.onChange}
                                                errors={errorsPAI}
                                                disabled />
                                        );
                                    }}
                                />
                            </div>
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                <Controller
                                    control={controlPAI}
                                    name={`namePAI`}
                                    render={({ field }) => {
                                        return (
                                            <InputComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Nombre proyecto - proceso"
                                                className="input-basic"
                                                classNameLabel="text-black biggest bold"
                                                typeInput={"text"}
                                                register={registerPAI}
                                                onChange={field.onChange}
                                                errors={errorsPAI}
                                                disabled />
                                        );
                                    }}
                                />
                            </div>
                            <Controller
                                control={controlPAI}
                                name={"objectivePAI"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Objetivo proyecto proceso"
                                            classNameLabel="text-black biggest bold"
                                            className="text-area-basic"
                                            register={registerPAI}
                                            onChange={field.onChange}
                                            errors={errorsPAI}
                                            disabled
                                        >
                                        </TextAreaComponent>
                                    );
                                }}
                            />
                            <Controller
                                control={controlPAI}
                                name={"articulationPAI"}
                                defaultValue=""
                                render={({ field }) => {
                                    return (
                                        <TextAreaComponent
                                            id={field.name}
                                            idInput={field.name}
                                            value={`${field.value}`}
                                            label="Articulación plan de desarrollo distrital"
                                            classNameLabel="text-black biggest bold"
                                            className="text-area-basic"
                                            register={registerPAI}
                                            onChange={field.onChange}
                                            errors={errorsPAI}
                                            disabled
                                        >
                                        </TextAreaComponent>
                                    );
                                }}
                            />
                        </div>
                        <div className="card-table">
                            <div className="title-area">
                                <div className="text-black large bold">Articulación plan estratégico</div>
                            </div>
                            {
                                fieldsLines.map((item, index) => {
                                    return (
                                        <div className="strategic-direction-grid-1 strategic-direction-grid-1-web" key={item.id}>
                                            <Controller
                                                control={controlPAI}
                                                name={`linePAI.${index}.line`}
                                                defaultValue=""
                                                render={({ field }) => {
                                                    return (
                                                        <TextAreaComponent
                                                            id={field.name}
                                                            idInput={field.name}
                                                            value={`${field.value}`}
                                                            label={`Línea No. ${index + 1}`}
                                                            classNameLabel="text-black biggest bold"
                                                            className="text-area-basic"
                                                            register={registerPAI}
                                                            onChange={field.onChange}
                                                            errors={errorsPAI}
                                                            disabled
                                                        >
                                                        </TextAreaComponent>
                                                    );
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="card-table">
                            <div className="title-area">
                                <div className="text-black large bold">Riesgos asociados</div>
                            </div>
                            {
                                fieldsRisks.map((item, index) => {
                                    return (
                                        <div className="strategic-direction-grid-1 strategic-direction-grid-1-web" key={item.id}>
                                            <Controller
                                                control={controlPAI}
                                                name={`risksPAI.${index}.risk`}
                                                defaultValue=""
                                                render={({ field }) => {
                                                    return (
                                                        <TextAreaComponent
                                                            id={field.name}
                                                            idInput={field.name}
                                                            value={`${field.value}`}
                                                            label={`Riesgo No. ${index + 1}`}
                                                            classNameLabel="text-black biggest bold"
                                                            className="text-area-basic"
                                                            register={registerPAI}
                                                            onChange={field.onChange}
                                                            errors={errorsPAI}
                                                            disabled
                                                        >
                                                        </TextAreaComponent>
                                                    );
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="title-area">
                            <div className="text-black extra-large bold">Acciones del PAI</div>
                        </div>
                        <div className="card-table">
                            <AccordionsComponent data={accordionsActions} />
                        </div>
                    </FormComponent>
                </div>
                <div className="card-table strategic-direction-complete-revision-pai">
                    <p className="text-black large bold text-center">Para formular la versión 1 del PAI haz clic <span className="strategic-direction-complete-revision-pai-button" onClick={onComplete}>aquí</span></p>
                </div>
                <div className="projects-footer-mobile mobile">
                    <div className="save-temp">
                        <ButtonComponent
                            className="button-main huge hover-three button-save"
                            value="Guardar temporalmente"
                            type="button"
                            action={onSaveTemp}
                        />
                    </div>
                    <div className="mobile-actions">
                        <span className="bold text-center button" onClick={onCancel}>
                            Cancelar
                        </span>
                        <ButtonComponent
                            value="Guardar"
                            className="button-main huge hover-three"
                            type="button"
                            action={onSubmit}
                        />
                    </div>
                </div>
            </div>
            <div className="container-button-bot space-between">
                <ButtonComponent
                    className="button-main huge hover-three"
                    value="Guardar temporalmente"
                    type="button"
                    action={onSaveTemp}
                />
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={onCancel}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={"Guardar"}
                        type="button"
                        action={onSubmit}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.memo(RevisionPAIPage);