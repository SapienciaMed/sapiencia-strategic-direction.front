import { useForm } from "react-hook-form";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { useContext, useEffect, useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { Itransfers } from "../interfaces/ProjectsInterfaces";
import { transfersValidator } from "../../../common/schemas";
import { ProjectsContext } from "../contexts/projects.context";
import { useEntitiesService } from "./entities-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IEntities } from "../interfaces/Entities";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";


export function useTransferData() {
    const { GetEntities , GetEntitiesDependency } = useEntitiesService();
    const [ locationData, setLocationData] = useState<IDropdownProps[]>([]);
    const [ processData, setprocessData] = useState<IDropdownProps[]>(null);
    const [ dependecyData , setDependencyData] = useState<IDropdownProps[]>(null);
    const { getListByGrouper, getListByParent } = useGenericListService();
    const { setDisableContinue, setActionContinue, setStep, setProjectData, projectData } = useContext(ProjectsContext);
    const [ charged, setCharged ] = useState<boolean>(false);
    

    const localitationData: IDropdownProps[] = [
        {
            name: "Postsecundaria - SAPIENCIA",
            value: 1,
        },
        {
            name: " Localizacion 2",
            value: 2,
        }
    ];
  

    const resolver = useYupValidationResolver(transfersValidator);

    const {
        handleSubmit,
        register,
        formState: { errors, isValid },
        control,
        watch,
        setValue,
        clearErrors,
        trigger
    } = useForm<Itransfers>({ resolver, mode: "all", defaultValues: {
        bpin: projectData?.transfers?.bpin ? projectData.transfers.bpin : "",
        project : projectData?.transfers?.project ? projectData.transfers.project  : "" ,
        dependency: projectData?.transfers?.dependency ? projectData.transfers.dependency : "",
        formulation: projectData?.transfers?.formulation ? projectData.transfers.formulation : "",
        rol: projectData?.transfers?.rol ? projectData.transfers.rol : "",
        order: projectData?.transfers?.order ? projectData.transfers.order : "",
        tecniques:projectData?.transfers?.tecniques ? projectData.transfers.tecniques : null,
        ambiental:projectData?.transfers?.ambiental ? projectData.transfers.ambiental : null,
        sociocultural:projectData?.transfers?.sociocultural ? projectData.transfers.sociocultural : null,
        observations: projectData?.transfers?.observations ? projectData.transfers.observations : "",
    }});


    useEffect(() => {
        GetEntitiesDependency().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setDependencyData(arrayEntities);
            }
        }).catch(() => { });
    }, [])

    useEffect(() => {
        const subscription = watch((value: Itransfers) => setProjectData(prev => {
            return { ...prev, transfers: { ...value } }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);

    const onSubmit = handleSubmit(async (data: Itransfers) => {
        setStep(1);
    });




    const bpn = projectData.register.bpin;
    const project = projectData.register.project;
    const dependency = projectData.register.dependency;
    
    const dependencia = dependecyData?.find(data =>data.value === dependency);

    useEffect(() => {
      setValue("bpin",bpn);
      setValue("project",project);
      setValue("dependency",dependencia?.name);
   
    }, [bpn,project,dependencia])
    


    useEffect(() => {
        debugger;
        setDisableContinue(!isValid);
        setActionContinue(isValid ? () => onSubmit : () => { });
    }, [isValid]);


    return { register, errors, control, onSubmit, processData, bpn, dependency, project , isValid, watch };
}