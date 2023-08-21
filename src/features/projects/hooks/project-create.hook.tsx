import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import { ProjectsCreateValidator} from "../../../common/schemas/project-create-schemas"
import { IProjects } from "../../interfaces/projects"
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";


export function useProjectCreateData() {


    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);

    const processData:IDropdownProps[] =[ {
        name: "proceso 1",
        value : "1",
    },
    {   
        name: "proceso 2",
        value : "2",
    }]
    
    const localitationData:IDropdownProps[] =[ {
        name: "Localizacion 1",
        value : "1",
    
    },
    {
        name: " Localizacion 2",
        value : "2",
    }]

    const DependecyData:IDropdownProps[] = [{
        name: "Dependencia 1",
        value : "1",
    },
    {
        name: "Dependencia 2",
        value : "2",
    }]
    const resolver = useYupValidationResolver(ProjectsCreateValidator);
    
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue: setValueRegister,
        control: controlRegister
    } = useForm<IProjects>({ resolver,mode:"all"});
    
    const navigate = useNavigate();

    const onSubmit = handleSubmit(async (data: IProjects) => {
        debugger;
        console.log(data);
    });

    useEffect(() => {
       setValueRegister("localitation",localitationData[1].value?.toString())
  }, []);
    return { register, errors, controlRegister,  onSubmit ,entitiesData,processData,DependecyData,localitationData };
}