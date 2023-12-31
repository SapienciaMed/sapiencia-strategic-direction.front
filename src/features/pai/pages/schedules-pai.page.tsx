import React from "react";
import useSchedulesPAIData from "../hooks/schedules-pai.hook";
import { ButtonComponent, DatePickerComponent, FormComponent, SelectComponent } from "../../../common/components/Form";
import TableComponent from "../../../common/components/table.component";

function SchedulesPAIPage(): React.JSX.Element {
    const {
        errors,
        resetForm,
        control,
        onSubmitCreate,
        tableColumns,
        tableActions,
        rolData,
        statusData,
        bimesterData,
        tableData,
        createPermission,
        editSchedule,
        getValues,
        setValue,
        cancelAction,
        saveAction,
        isValid,
        hiddenAdd,
        onSubmitEdit
    } = useSchedulesPAIData();
    return (
        <div className='crud-page full-height'>
            <div className='main-page full-height'>
                <div className='card-table'>
                    <div className="title-area">
                        <div className="text-black extra-large bold">Cronograma del Plan de Acción Institucional</div>
                    </div>
                    {createPermission && <FormComponent action={editSchedule !== null ? undefined : onSubmitCreate}>
                        <div className="card-table">
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web">
                                <SelectComponent
                                    control={control}
                                    idInput={"idRol"}
                                    className={`select-basic span-width`}
                                    label="Rol"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={rolData}
                                    errors={errors}
                                    filter={true}
                                />
                                <SelectComponent
                                    control={control}
                                    idInput={"idStatus"}
                                    className={`select-basic span-width`}
                                    label="Estado del plan"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={statusData}
                                    errors={errors}
                                    filter={true}
                                />
                                <SelectComponent
                                    control={control}
                                    idInput={"bimester"}
                                    className={`select-basic span-width`}
                                    label="Bimestre"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={bimesterData}
                                    errors={errors}
                                    filter={true}
                                />
                            </div>
                            <div className="strategic-direction-grid-1 strategic-direction-grid-3-web" style={{ marginTop: "1.5rem" }}>
                                <DatePickerComponent
                                    control={control}
                                    idInput="startDate"
                                    dateFormat="dd/mm/yy"
                                    className="dataPicker-basic span-width"
                                    label="Fecha inicio"
                                    classNameLabel="text-black biggest bold text-required"
                                    minDate={new Date()}
                                    onChange={() => {
                                        setValue("endDate", null);
                                    }}
                                />
                                <DatePickerComponent
                                    control={control}
                                    idInput="endDate"
                                    dateFormat="dd/mm/yy"
                                    className="dataPicker-basic span-width"
                                    label="Fecha final"
                                    classNameLabel="text-black biggest bold text-required"
                                    disabled={!getValues("startDate")}
                                    minDate={getValues("startDate") ? new Date(getValues("startDate")) : null}
                                />
                                {!hiddenAdd && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", marginTop: "20px" }}>
                                    <span className="bold text-center button" onClick={() => {
                                        resetForm();
                                    }}>
                                        Limpiar campos
                                    </span>
                                    <ButtonComponent
                                        className="button-main huge hover-three"
                                        value={editSchedule !== null ? "Editar" : "Agregar"}
                                        type={editSchedule !== null ? "button" : "submit"}
                                        disabled={!isValid}
                                    />
                                </div>}
                            </div>
                        </div>

                    </FormComponent>}
                    {tableData.length > 0 && <div className="card-table" style={{ marginTop: "3rem" }}>
                        <TableComponent
                            columns={tableColumns}
                            actions={tableActions}
                            data={tableData.filter(data => !data.delete)}
                            isShowModal={false}
                            hideActions={!createPermission}
                        />
                    </div>}
                    {createPermission && <div className="projects-footer-mobile mobile" style={{ marginTop: "2rem" }}>
                        <div className="mobile-actions">
                            <span className="bold text-center button" onClick={cancelAction}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                value={"Guardar"}
                                className="button-main huge hover-three"
                                type="button"
                                action={editSchedule !== null ? onSubmitEdit : saveAction}
                                disabled={editSchedule !== null ? !isValid : false}
                            />
                        </div>
                    </div>}
                </div>
            </div>
            {createPermission && <div className="container-button-bot space-between">
                <div></div>
                <div className="buttons-bot">
                    <span className="bold text-center button" onClick={editSchedule !== null ? resetForm : cancelAction}>
                        Cancelar
                    </span>
                    <ButtonComponent
                        className={`button-main extra_extra_large hover-three button-save`}
                        value={"Guardar"}
                        type="button"
                        action={editSchedule !== null ? onSubmitEdit : saveAction}
                        disabled={editSchedule !== null ? !isValid : false}
                    />
                </div>
            </div>}
        </div>
    )
}

export default React.memo(SchedulesPAIPage);