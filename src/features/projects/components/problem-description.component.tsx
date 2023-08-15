import React, { useEffect } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { problemDescriptionValidator } from "../../../common/schemas";
import { useForm } from "react-hook-form";
import { FormComponent, InputComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";

interface IProblemDescriptionForm {

}

export function ProblemDescriptionComponent(): React.JSX.Element {
    const resolver = useYupValidationResolver(problemDescriptionValidator);
    const {
        handleSubmit,
        register,
        formState: { errors, isValid},
        control: controlRegister,
    } = useForm<IProblemDescriptionForm>({ resolver });

    useEffect(() => {
        console.log(isValid)
    }, [isValid]);
    return (
        <div className="card-form">
            <FormComponent action={undefined}>
                <InputComponent
                    idInput="Prueba1"
                    className="input-basic"
                    typeInput="text"
                    register={register}
                    label="Descripción detallada del problema central, sus causas y efectos"
                    classNameLabel="text-black biggest bold"
                    direction={EDirection.row}
                    errors={errors}
                />
                <InputComponent
                    idInput="Prueba2"
                    className="input-basic"
                    typeInput="text"
                    register={register}
                    label="Magnitud del problema"
                    classNameLabel="text-black biggest bold"
                    direction={EDirection.row}
                    errors={errors}
                />
            </FormComponent>
        </div>
    )
}

export default React.memo(ProblemDescriptionComponent);