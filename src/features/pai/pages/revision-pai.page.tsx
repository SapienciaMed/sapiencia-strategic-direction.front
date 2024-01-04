import React from "react";
import { useParams } from "react-router-dom";
import useRevisionPAIData from "../hooks/revision-pai.hook";
import { ButtonComponent, FormComponent, InputComponent, SelectComponent, TextAreaComponent, TreeSelectComponent } from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import ComponentPagination from "../../../common/components/component-pagination.component";
import ComponentList from "../../../common/components/component-list.component";
import TableComponent from "../../../common/components/table.component";
import useRevisionObservationsPAIData from "../hooks/revision-pai-observations.hook";

export interface IPropsRevisionPAI {
    status: "revision" | "correction" | "adjustment";
}

function RevisionPAIPage({ status }: Readonly<IPropsRevisionPAI>): React.JSX.Element {
    const { id: idPAI } = useParams();
    const {
        controlPAI,
        registerPAI,
        errorsPAI,
        actionsData,
        linesData,
        risksData,
        onSaveTemp,
        onSubmit,
        onCancel,
        onComplete,
        getValues,
        typePAIData,
        nameProjectsData,
        nameProcessData,
        validateActiveField
    } = useRevisionPAIData({ idPAI, status });
    const {
        controlRevision,
        fieldsData,
        errorsRevision,
        registerRevision,
        tableData,
        tableColumnsAdjustment,
        tableColumns,
        actionColumnsTable,
        onSubmitRevision
    } = useRevisionObservationsPAIData({ idPAI, status });
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <FormComponent action={undefined} className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                        <div className="title-area">
                            <div className="text-black extra-large bold">{status === "revision" ? "Revisión 1 Plan de Acción Institucional (PAI)" : "Plan de Acción Institucional (PAI)"}</div>
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
                                                disabled={validateActiveField(field.name)}
                                            />
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
                                    disabled={validateActiveField("budgetPAI")}
                                />
                                <SelectComponent
                                    control={controlPAI}
                                    idInput={"typePAI"}
                                    className={`select-basic span-width`}
                                    label="Tipo de plan de acción institucional"
                                    classNameLabel={`text-black biggest bold`}
                                    data={typePAIData}
                                    errors={errorsPAI}
                                    filter={true}
                                    disabled={validateActiveField("typePAI")}
                                />
                            </div>
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                <SelectComponent
                                    control={controlPAI}
                                    idInput={"namePAI"}
                                    className={`select-basic span-width`}
                                    label="Nombre proyecto - proceso"
                                    classNameLabel={`text-black biggest bold`}
                                    data={getValues("typePAI") === 1 ? nameProjectsData : nameProcessData}
                                    errors={errorsPAI}
                                    filter={true}
                                    disabled={validateActiveField("namePAI")}
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
                                            disabled={validateActiveField(field.name)}
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
                                            disabled={validateActiveField(field.name)}
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
                            <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                                <ComponentPagination components={linesData} orientation="top" />
                            </div>
                        </div>
                        <div className="card-table">
                            <div className="title-area">
                                <div className="text-black large bold">Riesgos asociados</div>
                            </div>
                            <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                                <ComponentPagination components={risksData} orientation="top" />
                            </div>
                        </div>
                        <div>
                            <div className="title-area">
                                <div className="text-black large bold">Acciones del PAI</div>
                            </div>
                            <ComponentList components={actionsData} orientation="right" title="Acciones" className="card-table" />
                        </div>
                    </FormComponent>
                    <div className="strategic-direction-grid-1 strategic-direction-grid-1-web">
                        {status === "revision" && <FormComponent action={undefined} id="revision-form">
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web" style={{marginTop: "1rem"}}>
                                <TreeSelectComponent
                                    control={controlRevision}
                                    idInput={"field"}
                                    className={`select-basic span-width`}
                                    label="Campo"
                                    classNameLabel={`text-black biggest bold text-required`}
                                    data={fieldsData}
                                    errors={errorsRevision}
                                />
                            </div>
                            <div className="strategic-direction-revision-pai-form" style={{marginTop: "1rem"}}>
                                <Controller
                                    control={controlRevision}
                                    name={`observations`}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Observaciones"
                                                characters={5000}
                                                classNameLabel="text-black biggest bold text-required"
                                                className="text-area-basic"
                                                register={registerRevision}
                                                onChange={field.onChange}
                                                errors={errorsRevision}
                                            >
                                            </TextAreaComponent>
                                        );
                                    }}
                                />
                                <div style={{ textAlign: "center" }}>
                                    <ButtonComponent
                                        className="button-main huge hover-three button-save"
                                        value="Agregar observación"
                                        type="button"
                                        action={onSubmitRevision}
                                        form="revision-form"
                                    />
                                </div>
                            </div>
                        </FormComponent>
                        }
                        {
                            tableData.length > 0 && <div className="card-table">
                                <TableComponent
                                    columns={status === "adjustment" ? tableColumnsAdjustment : tableColumns}
                                    data={tableData}
                                    title={status === "adjustment" ? "Revisión de campos" : "Campos a modificar"}
                                    isShowModal={false}
                                    actions={actionColumnsTable[status]}
                                    hideActions={status === "revision"}
                                />
                            </div>
                        }
                    </div>
                </div>
                {status === "revision" && <div className="card-table strategic-direction-complete-revision-pai">
                    <p className="text-black large bold text-center">Para formular la versión 1 del PAI haz clic <span className="strategic-direction-complete-revision-pai-button" onClick={onComplete}>aquí</span></p>
                </div>}
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