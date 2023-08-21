import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { IRegisterForm } from "../interfaces/ProjectsInterfaces";
import { registerValidator } from "../../../common/schemas";
import { ProjectsContext } from "../contexts/projects.context";


export function useRegisterData() {
    const { setDisableContinue, setActionContinue, setStep, step, setProjectData } = useContext(ProjectsContext);
    const processData: IDropdownProps[] = [
        {
            name: "proceso 1",
            value: "1",
        },
        {
            name: "proceso 2",
            value: "2",
        }
    ];

    const localitationData: IDropdownProps[] = [
        {
            name: "Localizacion 1",
            value: "1",
        },
        {
            name: " Localizacion 2",
            value: "2",
        }
    ];

    const DependecyData: IDropdownProps[] = [
        {
            name: "Dependencia 1",
            value: "1",
        },
        {
            name: "Dependencia 2",
            value: "2",
        }
    ];

    const resolver = useYupValidationResolver(registerValidator);

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        setValue: setValueRegister,
        control: controlRegister
    } = useForm<IRegisterForm>({ resolver, mode: "all" });

    const onSubmit = handleSubmit(async (data: IRegisterForm) => {
        setProjectData(prev => {
            return { ...prev, register: { ...data } }
        })
        setStep(step + 1);
    });

    useEffect(() => {
        setValueRegister("localitation", localitationData[1].value?.toString());
    }, []);

    useEffect(() => {
        setDisableContinue(!isValid);
        setActionContinue(isValid ? () => onSubmit : () => { });

    }, [isValid]);


    return { register, errors, controlRegister, onSubmit, processData, DependecyData, localitationData };
}