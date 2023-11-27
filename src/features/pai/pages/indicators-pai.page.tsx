import React from "react";
import { FormComponent, 
         SelectComponent, 
         TextAreaComponent } from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import useIndicatorsPai from "../hooks/indicators-pai.hook";
import disaggregate from '../../../public/images/icons/disaggregate.svg';

function IndicatorsPaiPage(): React.JSX.Element {

    const { errors,
            PAIData,
            onSubmit, 
            register,
            indicatorType,
            appendProducts,
            fieldsProducts,
            indicatorTypeData,
            onChangeBimesters,
            onChangeIndicator,
            appendResponsible,
            fieldsResponsible,
            appendCoResponsible,
            fieldsCoResponsible,
            controlIndicatorsPai,
            fieldsBimesters } = useIndicatorsPai();

    return (
        <div className="main-page full-height">
            <div className='card-table'>
                <div className="title-area">
                    <div className="text-black extra-large bold">Acción No. 1 - Agregar indicador</div>
                </div>
                <div className="crud-page full-height">
                    <FormComponent action={onSubmit}>
                        <div className="card-table card-form-development">
                            <div className="project-dates-container">
                                {/* {
                                    PAIData?.PAIType === "project" &&
                                    <SelectComponent
                                        idInput="projectIndicator"
                                        className="select-basic"
                                        control={controlIndicatorsPai}
                                        errors={errors}
                                        label="Indicador de proyecto"
                                        classNameLabel="text-black biggest bold text-required"
                                        data={[]}
                                        filter={true}
                                    />
                                } */}
                                <SelectComponent
                                    idInput="projectIndicator"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Indicador de proyecto"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={[]}
                                    filter={true}
                                />
                                <SelectComponent
                                    idInput="indicatorType"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Tipo de indicador"
                                    classNameLabel="text-black biggest bold text-required"
                                    data={indicatorTypeData}
                                    filter={true}
                                    onChange={onChangeIndicator}
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
                                            ></TextAreaComponent>
                                        );
                                    }}
                                />
                            </div>

                            <div className='card-table'>
                                <div className="title-area">
                                    <div className="text-black extra-large bold">Meta planeada</div>
                                </div>
                                <div className="project-filters-container">
                                    {fieldsBimesters.map((fields, index) => {
                                    return (
                                        <div key={index}>
                                            <div className="title-area">
                                                <label className="text-black biggest bold text-required">
                                                    Bimestre {index+1}
                                                </label>
                                                { indicatorType?.name == "Porcentaje" 
                                                    && <div className="title-button text-main large" style={{"marginTop": 0}} onClick={() =>{}}>
                                                        Desagregar <img src={disaggregate} alt="Desagregar bimestre"/>
                                                    </div>
                                                }
                                            </div>
                                            <InputNumberComponent
                                                idInput={`bimesters.${index}.value`}
                                                control={controlIndicatorsPai}
                                                errors={errors}
                                                classNameLabel="text-black biggest bold text-required"
                                                className={`inputNumber-basic`}
                                                onChange={onChangeBimesters}
                                                useGrouping={false}
                                                suffix="%"
                                            />
                                        </div>
                                    )})}

                                    <InputNumberComponent
                                        idInput={`totalPlannedGoal`}
                                        control={controlIndicatorsPai}
                                        label="Meta total planeada"
                                        errors={errors}
                                        classNameLabel="text-black biggest bold"
                                        className={`inputNumber-basic`}
                                        disabled={true}
                                        useGrouping={false}
                                        suffix="%"
                                    />
                                </div>
                            </div>

                            <div className='card-table'>
                                <div className="title-area">
                                    <label className="text-black extra-large bold text-required">
                                        Productos
                                    </label>

                                    <div className="title-button text-main large" onClick={() => {
                                    appendProducts({ product: null });
                                    }}>
                                     Agregar producto <AiOutlinePlusCircle />
                                    </div>
                                </div>
                                
                                {fieldsProducts.map((fields, index) => {
                                return (
                                    <div key={fields.id}>
                                        <Controller
                                            control={controlIndicatorsPai}
                                            name={`products.${index}.product`}
                                            defaultValue=""
                                            render={({ field }) => {
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Producto No. ${index+1}`}
                                                        className="text-area-basic"
                                                        classNameLabel={`text-black biggest bold text-required`}
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={500}
                                                    ></TextAreaComponent>
                                                );
                                            }}
                                        />
                                    </div>
                                )})}
                            </div>
                            
                            <div className='card-table'>
                                <div className="title-area">
                                    <label className="text-black extra-large bold text-required">
                                        Responsable
                                    </label>

                                    <div className="title-button text-main large" onClick={() => {
                                    appendResponsible({ responsible: null });
                                    }}>
                                     Agregar responsable <AiOutlinePlusCircle />
                                    </div>
                                </div>
                                {fieldsResponsible.map((fields, index) => {
                                return (
                                    <div key={fields.id}>
                                        <Controller
                                            control={controlIndicatorsPai}
                                            name={`responsibles.${index}.responsible`}
                                            defaultValue=""
                                            render={({ field }) => {
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Responsable No. ${index+1}`}
                                                        className="text-area-basic"
                                                        classNameLabel="text-black biggest bold text-required"
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={500}
                                                    ></TextAreaComponent>
                                                );
                                            }}
                                        />
                                    </div>
                                )})}
                            </div>

                            <div className='card-table'>
                                <div className="title-area">
                                    <label className="text-black extra-large bold text-required">
                                        Corresponsable
                                    </label>

                                    <div className="title-button text-main large" onClick={() => {
                                    appendCoResponsible({ coresponsible: null });
                                    }}>
                                     Agregar corresponsable <AiOutlinePlusCircle />
                                    </div>
                                </div>
                                {fieldsCoResponsible.map((fields, index) => {
                                return (
                                    <div key={fields.id}>
                                        <Controller
                                            control={controlIndicatorsPai}
                                            name={`coresponsibles.${index}.coresponsible`}
                                            defaultValue=""
                                            render={({ field }) => {
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Corresponsable No. ${index+1}`}
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
                                )})}
                            </div>
                        </div>
                    </FormComponent>
                </div>
            </div>
        </div>
    )
    
}

export default React.memo(IndicatorsPaiPage);
