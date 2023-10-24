import React from "react";
import { FormComponent, InputComponent, TextAreaComponent } from "../../../common/components/Form";
import { useTransferData } from "../hooks/transfer.hook";
import { Controller } from "react-hook-form";
import { Checkbox } from 'primereact/checkbox';

function TransferPage(): React.JSX.Element {

    const { register, errors, control, onSubmit, isValid,watch } = useTransferData();
    
    return (
        <div className="crud-page full-height">
            <FormComponent action={onSubmit}>
                <div className="card-table">
                <p className="text-black large bold">Flujo de proyecto</p>
                    <div className="transfers-container">
                        <Controller
                            control={control}
                            name={"bpin"}
                            defaultValue={null}
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="BPIN"
                                        className="input-basic background-textArea"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"number"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} 
                                        disabled={true}/>
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"project"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Nombre Proyecto"
                                        className="input-basic background-textArea"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} 
                                        disabled={true} />
                                );
                            }}
                        />
                    
                    <Controller
                            control={control}
                            name={"dependency"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <InputComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Dependencia"
                                        className="input-basic background-textArea"
                                        classNameLabel="text-black biggest bold text-required"
                                        typeInput={"text"}
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors} 
                                        disabled={true} />
                                );
                            }}
                        />
                    
                        <Controller
                            control={control}
                            name={"formulation"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Formulador (nombre completo)"
                                        className="text-area-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={100}
                                    ></TextAreaComponent>
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"rol"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Rol"
                                        className="text-area-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={100}
                                    ></TextAreaComponent>
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"order"}
                            defaultValue=""
                            render={({ field }) => {
                                return (
                                    <TextAreaComponent
                                        id={field.name}
                                        idInput={field.name}
                                        value={`${field.value}`}
                                        label="Ordenador del gasto (nombre completo) "
                                        className="text-area-basic"
                                        classNameLabel="text-black biggest bold text-required"
                                        rows={4}
                                        placeholder="Escribe aquí"
                                        register={register}
                                        onChange={field.onChange}
                                        errors={errors}
                                        characters={100}
                                    ></TextAreaComponent>
                                );
                            }}
                        />
                        </div>
                        <div className="div-transfers">
                            <label className="text-black biggest bold text-required">
                                Condiciones del proyecto
                            </label>
                        </div>
                        <Controller
                            control={control}
                            name="tecniques"
                            defaultValue={false} 
                            render={({ field }) => (
                                <div className="div-transfers">
                                    <Checkbox
                                        inputId={field.name}
                                        name={field.name}
                                        className="checkbox-basic checkbox-margin"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                    <label htmlFor={field.name} className="text-black biggest">
                                        Técnicas
                                    </label>
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name="ambiental"
                            defaultValue={false}
                            render={({ field }) => (
                                <div className="div-transfers">
                                    <Checkbox
                                        inputId={field.name}
                                        name={field.name}
                                        className="checkbox-basic checkbox-margin"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                    <label htmlFor={field.name} className="text-black biggest ">
                                        Ambientales
                                    </label>
                                </div>
                            )}
                        />
                        <Controller
                            control={control}
                            name="sociocultural"
                            defaultValue={false}
                            render={({ field }) => (
                                <div className="div-transfers">
                                    <Checkbox
                                        inputId={field.name}
                                        name={field.name}
                                        className="checkbox-basic checkbox-margin"
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
                                    <label htmlFor={field.name} className="text-black biggest">
                                        Socioculturales
                                    </label>
                                </div>
                            )}
                            />
                            {!isValid && !watch("tecniques") && !watch("ambiental") && !watch("sociocultural") && (
                                <div className="error-message div-validation-check">
                                    Debes seleccionar al menos una opción. {/* Mensaje de error personalizado */}
                                </div>
                            )}
                                        <Controller
                                            control={control}
                                            name={"observations"}
                                            defaultValue=""
                                            render={({ field }) => {
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label="Observaciones"
                                                        className="text-area-basic"
                                                        classNameLabel="text-black biggest bold text-required"
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={300}
                                                    ></TextAreaComponent>
                                                );
                                            }}
                                        />
                                    
                                </div>
                            </FormComponent>
                        </div>
    )
}

export default React.memo(TransferPage);