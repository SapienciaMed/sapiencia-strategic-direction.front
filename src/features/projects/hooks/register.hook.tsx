import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { IRegisterForm } from "../interfaces/ProjectsInterfaces";
import { registerValidator } from "../../../common/schemas";
import { ProjectsContext } from "../contexts/projects.context";


export function useRegisterData() {
    const { setDisableContinue, setActionContinue, setStep, step, setProjectData, projectData } = useContext(ProjectsContext);
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
        control: controlRegister,
        watch
    } = useForm<IRegisterForm>({ resolver, mode: "all", defaultValues: {
        bpin: projectData?.register?.bpin ? projectData.register.bpin : 0,
        dateFrom: projectData?.register?.dateFrom ? projectData.register.dateFrom : "",
        dateTo: projectData?.register?.dateTo ? projectData.register.dateTo : "",
        dependency: projectData?.register?.dependency ? projectData.register.dependency : null,
        localitation: projectData?.register?.localitation ? projectData.register.localitation : localitationData[0].value?.toString(),
        object: projectData?.register?.object ? projectData.register.object : "",
        process: projectData?.register?.process ? projectData.register.process : null,
        project: projectData?.register?.project ? projectData.register.project : "",
    }});

    useEffect(() => {
        const subscription = watch((value: IRegisterForm) => setProjectData(prev => {
            return { ...prev, register: { ...value } }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit = handleSubmit(async (data: IRegisterForm) => {
        setStep(step + 1);
    });

    useEffect(() => {
        setDisableContinue(!isValid);
        setActionContinue(isValid ? () => onSubmit : () => { });
    }, [isValid]);


    return { register, errors, controlRegister, onSubmit, processData, DependecyData, localitationData };
}