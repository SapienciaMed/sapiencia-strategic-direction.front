import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import { ProjectsCreateValidator} from "../../../common/schemas/project-create-schemas"
import { IProjects } from "../../interfaces/projects"
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";


export function useProjectCreateData() {
    const [entitiesData, setEntitiesData] = useState<IDropdownProps[]>(null);
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


    return { register, errors, controlRegister,  onSubmit ,entitiesData };
}