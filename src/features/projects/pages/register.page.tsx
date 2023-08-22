import React from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useRegisterData } from "../hooks/register.hook";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller } from "react-hook-form";



function RegisterPage(): React.JSX.Element {
    const { register, errors, controlRegister, onSubmit, localitationData, DependecyData, processData } = useRegisterData();
    return (
        <div className="crud-page full-height">
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="project-container">
                        <Controller
                            control={controlRegister}
                            name={"bpin"}
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Código BPIN"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        direction={EDirection.row}
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} />
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
                                        direction={EDirection.row}
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} />
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
                                        label="Periodo inicial"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        direction={EDirection.row}
                                        typeInput={"text"}
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
                                        label="Periodo final"
                                        className="input-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        direction={EDirection.row}
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
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
                            direction={EDirection.row}
                            data={processData}
                        />
                        <SelectComponent
                            idInput="localitation"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Localización"
                            classNameLabel="text-black biggest bold"
                            direction={EDirection.row}
                            data={localitationData}
                            disabled={true}
                        />
                        <SelectComponent
                            idInput="dependency"
                            className="select-basic"
                            control={controlRegister}
                            errors={errors}
                            label="Dependencia"
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            data={DependecyData}
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
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
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