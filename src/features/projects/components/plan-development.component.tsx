import React from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useRegisterData } from "../hooks/register.hook";
import { EDirection } from "../../../common/constants/input.enum";
import { Controller } from "react-hook-form";

 interface IProps {
        disableNext: () => void;
        enableNext: () => void;
    }
    

export function PlanDevelopmentComponent({ disableNext, enableNext }: IProps): React.JSX.Element {

   
    const { register, errors, controlRegister, onSubmit, localitationData, DependecyData, processData,watchDateFrom } = useRegisterData();
    return (
        <div className="crud-page full-height">
            <FormComponent action={onSubmit}>
                <div className="card-form">
                     <label className="text-black biggest bold">
                            Plan nacional de desarrollo
                        </label>
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
                                        label="Pacto"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Línea"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Programa"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
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
                <div className="card-form-development">
                    <label className="text-black biggest bold">
                            Plan de desarrollo departamental
                        </label>
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
                                        label="Pacto"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Componente"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Programa"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
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
                <div className="card-form-development">
                     <label className="text-black biggest bold">
                            Plan de desarrollo distrital
                     </label>
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
                                        label="Línea"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Componente"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
                                        rows={4}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                    />
                                );
                            }}
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
                                        label="Programa"
                                        className="text-area-basic"
                                        classNameLabel="text-black big bold text-required"
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

export default React.memo(PlanDevelopmentComponent);