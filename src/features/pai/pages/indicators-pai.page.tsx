import React from "react";
import {
    FormComponent,
    SelectComponent,
    TextAreaComponent
} from "../../../common/components/Form";
import { Controller } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import useIndicatorsPai from "../hooks/indicators-pai.hook";
import disaggregate from '../../../public/images/icons/disaggregate.svg';
import TableDisaggregate from "../components/table-disaggregate";

interface IIndicatorsPaiProps {
    actionId: number;
    updatePAIForm: () => void;
    editMode?: boolean;
    indicatorId?: number;
}

function IndicatorsPaiPage({ actionId, indicatorId, editMode = false, updatePAIForm }: Readonly<IIndicatorsPaiProps>): React.JSX.Element {
    const { errors,
        PAIData,
        register,
        getValues,
        getFieldState,
        appendProducts,
        fieldsProducts,
        fieldsBimesters,
        onAddDisaggregate,
        indicatorTypeData,
        onChangeBimesters,
        onChangeIndicator,
        appendResponsible,
        fieldsResponsible,
        onShowDisaggregate,
        removeDisaggregate,
        appendCoResponsible,
        fieldsCoResponsible,
        onChangeDisaggregate,
        controlIndicatorsPai,
        projectIndicatorsData,
        indicatorTypeValidation
    } = useIndicatorsPai(actionId, updatePAIForm, indicatorId, editMode);

    return (
        <div className={`${!editMode && "card-table"}`}>
            {!editMode &&
                <div className="title-area">
                    <div className="text-black extra-large bold">Acción No. {actionId} - Agregar indicador</div>
                </div>
            }
            <div className="crud-page full-height">
                <FormComponent action="">
                    <div className="card-table card-form-development">
                        <div className="project-dates-container">
                            {
                                PAIData?.typePAI == 1 &&
                                <SelectComponent
                                    idInput="projectIndicator"
                                    className="select-basic"
                                    control={controlIndicatorsPai}
                                    errors={errors}
                                    label="Indicador de proyecto"
                                    classNameLabel={`text-black biggest bold ${!getValues("indicatorDesc") && "text-required"}`}
                                    data={projectIndicatorsData}
                                    filter={true}
                                    disabled={PAIData?.typePAI !== 1}
                                />
                            }
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
                                            classNameLabel={`text-black biggest bold ${!getValues("projectIndicator") && "text-required"}`}
                                            rows={4}
                                            placeholder="Escribe aquí"
                                            register={register}
                                            onChange={field.onChange}
                                            errors={errors}
                                            characters={400}
                                            disabled={PAIData?.typePAI !== 2}
                                        ></TextAreaComponent>
                                    );
                                }}
                            />
                        </div>

                        <div className='card-table'>
                            <div className="title-area">
                                <div className="text-black extra-large bold">Meta planeada</div>
                            </div>
                            <div className={`${indicatorTypeValidation ? "block-container" : "project-filters-container"}`}>
                                {fieldsBimesters.map((fields, index) => {
                                    const value = getValues(`bimesters.${index}.value`);
                                    return (
                                        <div key={index}>
                                            <div className={`title-area ${indicatorTypeValidation && "title-area-disaggregate"}`}>
                                                <label className="text-black biggest bold text-required">
                                                    Bimestre {index + 1}
                                                </label>
                                                {(indicatorTypeValidation)
                                                    && <div className="title-button text-main large" style={{ "marginTop": 0 }} onClick={() => {
                                                        value > 0 ? onShowDisaggregate(index) : null
                                                    }}>
                                                        Desagregar <img src={disaggregate} alt="Desagregar bimestre" />
                                                    </div>
                                                }
                                            </div>
                                            <InputNumberComponent
                                                idInput={`bimesters.${index}.value`}
                                                control={controlIndicatorsPai}
                                                errors={errors}
                                                classNameLabel="text-black biggest bold text-required"
                                                className={`inputNumber-basic ${indicatorTypeValidation && "inputNumber-disaggregate"}`}
                                                onChange={onChangeBimesters}
                                                useGrouping={false}
                                                suffix={indicatorTypeValidation ? "%" : ""}
                                            />
                                            {indicatorTypeValidation
                                                && <div key={index} className="disaggregate-container">
                                                    <TableDisaggregate
                                                        actionId={actionId}
                                                        indexDisaggregate={index}
                                                        controlIndicatorsPai={controlIndicatorsPai}
                                                        errors={fields.errors}
                                                        register={register}
                                                        sumOfPercentage={fields.sumOfPercentage}
                                                        removeDisaggregate={removeDisaggregate}
                                                        onAddDisaggregate={onAddDisaggregate}
                                                        onChangeDisaggregate={onChangeDisaggregate}
                                                        tableData={fields.disaggregate}
                                                        showDissagregate={(!value || value == 0) ? 0 : fields.showDisaggregate}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    )
                                })}

                                <InputNumberComponent
                                    idInput={`totalPlannedGoal`}
                                    control={controlIndicatorsPai}
                                    label="Meta total planeada"
                                    errors={errors}
                                    classNameLabel="text-black biggest bold"
                                    className={`inputNumber-basic ${indicatorTypeValidation && "inputNumber-disaggregate"}`}
                                    disabled={true}
                                    useGrouping={false}
                                    suffix={indicatorTypeValidation ? "%" : ""}
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
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "El campo es obligatorio"
                                                }
                                            }}
                                            render={({ field }) => {
                                                const isEmpty = !field.value;
                                                const isOverLimit = field.value?.length > 500;
                                                const isFieldDirty = getFieldState(`products.${index}.product`);
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Producto No. ${index + 1}`}
                                                        className={`text-area-basic  ${isEmpty && isFieldDirty.isDirty ? "undefined error" : ""} ${isOverLimit ? "undefined error" : ""} `}
                                                        classNameLabel={`text-black biggest bold text-required`}
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={500}
                                                    >
                                                        {isEmpty && isFieldDirty.isDirty && (
                                                            <p className="error-message bold not-margin-padding">
                                                                El campo es obligatorio
                                                            </p>
                                                        )}
                                                        {isOverLimit && (
                                                            <p className="error-message bold not-margin-padding">
                                                                Solo se permiten 500 caracteres
                                                            </p>
                                                        )}
                                                    </TextAreaComponent>
                                                );
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <div className='card-table'>
                            <div className="title-area">
                                <label className="text-black extra-large bold text-required">
                                    Responsable directo
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
                                            rules={{
                                                required: {
                                                    value: true,
                                                    message: "El campo es obligatorio"
                                                }
                                            }}
                                            render={({ field }) => {
                                                const isEmpty = !field.value;
                                                const isOverLimit = field.value?.length > 100;
                                                const isFieldDirty = getFieldState(`responsibles.${index}.responsible`);
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Responsable No. ${index + 1}`}
                                                        className={`text-area-basic  ${isEmpty && isFieldDirty.isDirty ? "undefined error" : ""} ${isOverLimit ? "undefined error" : ""} `}
                                                        classNameLabel="text-black biggest bold text-required"
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={100}
                                                    >
                                                        {isEmpty && isFieldDirty.isDirty && (
                                                            <p className="error-message bold not-margin-padding">
                                                                El campo es obligatorio
                                                            </p>
                                                        )}
                                                        {isOverLimit && (
                                                            <p className="error-message bold not-margin-padding">
                                                                Solo se permiten 100 caracteres
                                                            </p>
                                                        )}
                                                    </TextAreaComponent>
                                                );
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        <div className='card-table'>
                            <div className="title-area">
                                <label className="text-black extra-large bold">
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
                                                const isOverLimit = field.value?.length > 100;
                                                return (
                                                    <TextAreaComponent
                                                        id={field.name}
                                                        idInput={field.name}
                                                        value={`${field.value}`}
                                                        label={`Corresponsable No. ${index + 1}`}
                                                        className={`text-area-basic ${isOverLimit ? "undefined error" : ""} `}
                                                        classNameLabel="text-black biggest bold"
                                                        rows={4}
                                                        placeholder="Escribe aquí"
                                                        register={register}
                                                        onChange={field.onChange}
                                                        errors={errors}
                                                        characters={100}
                                                    >
                                                        {isOverLimit && (
                                                            <p className="error-message bold not-margin-padding">
                                                                Solo se permiten 100 caracteres
                                                            </p>
                                                        )}
                                                    </TextAreaComponent>
                                                );
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </FormComponent>
            </div>
        </div>
    )

}

export default React.memo(IndicatorsPaiPage);
