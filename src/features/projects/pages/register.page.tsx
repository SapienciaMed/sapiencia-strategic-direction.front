import React, { useState } from "react";
import { FormComponent, InputComponent, SelectComponent, TextAreaComponent } from "../../../common/components/Form";
import { useRegisterData } from "../hooks/register.hook";
import { EDirection } from "../../../common/constants/input.enum";



function RegisterPage(): React.JSX.Element {

    const [textInput, setTextInput] = useState('');

    const handleInputChange = (event) => {
        const newText = event.target.value;
        setTextInput(newText);
    };


    const { register, errors, controlRegister, onSubmit, localitationData, DependecyData, processData } = useRegisterData();
    return (
        <div className="crud-page full-height">
            <FormComponent action={onSubmit}>
                <div className="card-form">
                    <div className="project-container">
                        <InputComponent
                            idInput="bpin"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Código BPIN"
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            errors={errors}
                        />
                        <InputComponent
                            idInput="project"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label="Nombre Proyecto"
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            errors={errors}

                        />
                    </div>
                    <div className="project-dates-container">
                        <InputComponent
                            idInput="dateFrom"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label={"Periodo inicial"}
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            onChange={handleInputChange}
                            value={textInput}
                        />
                        <InputComponent
                            idInput="dateTo"
                            className="input-basic"
                            typeInput="text"
                            register={register}
                            label={"Periodo final"}
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required"
                            direction={EDirection.row}
                            disabled={textInput.trim() == ''}
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
                        <TextAreaComponent
                            idInput="object"
                            register={register}
                            errors={errors}
                            label="Objeto"
                            classNameLabel="text-black biggest bold text-required"
                            className="text-area-basic"
                            rows={4}
                        />
                    </div>
                </div>
            </FormComponent>
        </div>
    )
}

export default React.memo(RegisterPage);