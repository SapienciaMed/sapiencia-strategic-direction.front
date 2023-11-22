import React from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import useIndicatorsPai from "../hooks/indicators-pai.hook";

function IndicatorsPaiPage(): React.JSX.Element {

    const { errors,
            onSubmit, 
            register,
            controlIndicatorsPai } = useIndicatorsPai();

    const isADisabledInput = false;

    return (
        <div className="main-page full-height">
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Acción No. 1 - Agregar indicador</div>
                </div>
                <div className="crud-page full-height">
                    <FormComponent action={onSubmit}>
                        <div className="card-table">
                            <div className="project-dates-container">
                                <SelectComponent
                                    idInput="projectIndicators"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Indicador de proyecto"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[]}
                                    filter={true}
                                    disabled={ isADisabledInput }
                                />
                                <SelectComponent
                                    idInput="indicatorType"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Tipo de indicador"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[]}
                                    filter={true}
                                    disabled={ isADisabledInput }
                                />
                            </div>
                            <div>
                                <Controller
                                    control={controlIndicatorsPai}
                                    name={"indicatorDesc"}
                                    defaultValue=""
                                    render={({ field }) => {
                                        return (
                                            <TextAreaComponent
                                                id={field.name}
                                                idInput={field.name}
                                                value={`${field.value}`}
                                                label="Descripción del indicador"
                                                className="text-area-basic"
                                                classNameLabel="text-black biggest bold text-required"
                                                rows={4}
                                                placeholder="Escribe aquí"
                                                register={register}
                                                onChange={field.onChange}
                                                errors={errors}
                                                characters={400}
                                                disabled={ isADisabledInput }
                                            ></TextAreaComponent>
                                        );
                                    }}
                                />
                            </div>
                            <div className="project-container">
                                <Controller
                                    control={controlIndicatorsPai}
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
                                                disabled={ isADisabledInput }
                                            />
                                        );
                                    }}
                                />
                                <Controller
                                    control={controlIndicatorsPai}
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
                                                disabled={ isADisabledInput }
                                            />
                                        );
                                    }}
                                />
                            </div>
                            <div className="project-filters-container">
                                <SelectComponent
                                    idInput="process"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Proceso"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[]}
                                    filter={true}
                                    disabled={ isADisabledInput }
                                />
                                <SelectComponent
                                    idInput="localitation"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Localización"
                                    classNameLabel="text-black biggest bold"
                                    data={[]}
                                    disabled={true}
                                    filter={true}
                                />
                                <SelectComponent
                                    idInput="dependency"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Dependencia"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[]}
                                    filter={true}
                                />
                            </div>
                        </div>
                    </FormComponent>
                </div>
            </div>
        </div>
    )
    
}

export default React.memo(IndicatorsPaiPage);
