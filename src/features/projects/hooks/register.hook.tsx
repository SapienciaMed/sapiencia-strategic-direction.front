import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { IRegisterForm } from "../interfaces/ProjectsInterfaces";
import { registerValidator } from "../../../common/schemas";
import { ProjectsContext } from "../contexts/projects.context";


export function useRegisterData() {
    const { setDisableContinue, setActionContinue, setStep, setProjectData, projectData } = useContext(ProjectsContext);
    const [ charged, setCharged ] = useState<boolean>(false);
    const processData: IDropdownProps[] = [
        {
            name: "Proceso 1",
            value: 1,
        },
        {
            name: "Proceso 2",
            value: 2,
        }
    ];

    const localitationData: IDropdownProps[] = [
        {
            name: "Localizacion 1",
            value: 1,
        },
        {
            name: " Localizacion 2",
            value: 2,
        }
    ];

    const DependecyData: IDropdownProps[] = [
        {
            name: "Dependencia 1",
            value: 1,
        },
        {
            name: "Dependencia 2",
            value: 2,
        }
    ];

    const resolver = useYupValidationResolver(registerValidator);

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        control: controlRegister,
        watch,
        setValue,
        clearErrors,
        trigger
    } = useForm<IRegisterForm>({ resolver, mode: "all", defaultValues: {
        bpin: projectData?.register?.bpin ? projectData.register.bpin : null,
        dateFrom: projectData?.register?.dateFrom ? projectData.register.dateFrom : "",
        dateTo: projectData?.register?.dateTo ? projectData.register.dateTo : "",
        dependency: projectData?.register?.dependency ? projectData.register.dependency : null,
        localitation: projectData?.register?.localitation ? projectData.register.localitation : Number(localitationData[0].value),
        object: projectData?.register?.object ? projectData.register.object : "",
        process: projectData?.register?.process ? projectData.register.process : null,
        project: projectData?.register?.project ? projectData.register.project : "",
    }});

    const watchDateFrom = watch("dateFrom"); 

    useEffect(() =>{
        if(!watchDateFrom){
            setValue("dateTo","")
            clearErrors("dateTo")
        }
    },[watchDateFrom])

    useEffect(() => {
        const subscription = watch((value: IRegisterForm) => setProjectData(prev => {
            return { ...prev, register: { ...value } }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit = handleSubmit(async (data: IRegisterForm) => {
        setStep(1);
    });

    useEffect(() => {
        setDisableContinue(!isValid);
        setActionContinue(isValid ? () => onSubmit : () => { });
    }, [isValid]);

    useEffect(() => {
        if(!charged) if(projectData?.register) {
            setCharged(true);
            setValue("bpin", projectData.register.bpin);
            setValue("dateFrom", projectData.register.dateFrom);
            setValue("dateTo", projectData.register.dateTo);
            setValue("dependency", projectData.register.dependency);
            setValue("object", projectData.register.object);
            setValue("process", projectData.register.process);
            setValue("project", projectData.register.project);
            setValue("localitation", projectData.register.localitation);
            trigger("localitation");
        }
    }, [projectData]);


    return { register, errors, controlRegister, onSubmit, processData, DependecyData, localitationData , watchDateFrom};
}