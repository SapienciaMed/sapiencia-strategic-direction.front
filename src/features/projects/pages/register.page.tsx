import React, { useContext, Suspense } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useRegisterData } from "../hooks/register.hook";
import { Controller } from "react-hook-form";
import { ProjectsContext } from "../contexts/projects.context";

function RegisterPage(): React.JSX.Element {
    const { register, errors, controlRegister, onSubmit, localitationData, dependecyData, processData,watchDateFrom } = useRegisterData();
    const { formAction, projectData } = useContext(ProjectsContext);
    const statusForDisabledInputs = [2,3];
    return (
        <div className="crud-page full-height">
            <FormComponent action={onSubmit}>
                <div className="card-table">
                    <div className="project-container">
                        <Controller
                            control={controlRegister}
                            name={"bpin"}
                            defaultValue={null}
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Código BPIN"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"number"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        disabled={ statusForDisabledInputs.includes(projectData?.status) && formAction === "edit" }
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={controlRegister}
                            name={"project"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Nombre Proyecto"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        disabled={ statusForDisabledInputs.includes(projectData?.status) && formAction === "edit" }
                                    />
                                );
                            }}
                        />
                    </div>
                    <div className="project-dates-container">
                        <Controller
                            control={controlRegister}
                            name={"dateFrom"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Período inicial"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"number"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} />
                                );
                            }}
                        />
                        <Controller
                            control={controlRegister}
                            name={"dateTo"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Período final"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"number"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        disabled={!watchDateFrom}
                                    />
                                );
                            }}
                        />
                    </div>
                    <div className="project-filters-container">
                        <SelectComponent
                            idInput="process"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Proceso"
                            classNameLabel="text-black biggest bold text-required"
                            data={processData}
                            filter={true}
                            disabled={ statusForDisabledInputs.includes(projectData?.status) && formAction === "edit" }
                        />
                        <SelectComponent
                            idInput="localitation"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Localización"
                            classNameLabel="text-black biggest bold"
                            data={localitationData}
                            disabled={true}
                            filter={true}
                        />
                        <SelectComponent
                            idInput="dependency"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Dependencia"
                            classNameLabel="text-black biggest bold text-required"
                            data={dependecyData}
                            filter={true}
                        />
                    </div>
                    <div>
                        <Controller
                            control={controlRegister}
                            name={"object"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Objeto"
                                        className="text-area-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={500}
                                        disabled={ statusForDisabledInputs.includes(projectData?.status) && formAction === "edit" }
                                    ></TextAreaComponent>
                                );
                            }}
                        />
                    </div>
                </div>
            </FormComponent>
        </div>
    )
}

export default React.memo(RegisterPage);