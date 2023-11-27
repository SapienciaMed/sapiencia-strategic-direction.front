import { useFieldArray, useForm, useWatch } from "react-hook-form";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { ICreatePlanAction,IAddAction } from "../interfaces/CreatePlanActionInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { schedulePAIValidator } from "../../../common/schemas";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useContext, useEffect, useState } from "react";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import useRoleService from "../../../common/hooks/role-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { DateTime } from "luxon";
import { AppContext } from "../../../common/contexts/app.context";
import { useSchedulesService } from "./schedules-service.hook";
import { useNavigate } from "react-router";
import { useEntitiesService } from "./entities-service.hook";
import { IEntities } from "../interfaces/Entities";


export default function usePlanActionPAIData() {
    useBreadCrumb({
        isPrimaryPage: true,
        name: "Cronograma del plan de acción institucional",
        url: "/direccion-estrategica/pai/cronogramas",
    });

    


    const [rolData, setRolData] = useState<IDropdownProps[]>([]);
    const [statusData, setStatusData] = useState<IDropdownProps[]>([]);
    const [editSchedule, setEditSchedule] = useState<number>(null);
    const [riskPAIData, setRiskPAIData] = useState<IDropdownProps[]>(null);
    const [NamePAIData, setNamePAIData] = useState<IDropdownProps[]>(null);
    const [objectivePAIData, setObjectivePAIData] = useState<IDropdownProps[]>(null);
    const [processPAIData, setProcessPAIData] = useState<IDropdownProps[]>(null);
    const [CreatePlanActionFormData, setCreatePlanActionFormData] = useState<ICreatePlanAction>(null)
    const { getRiskPAI,getProcessPAI,getObjectivesPAI } = useEntitiesService();

    const { getOptions } = useRoleService();
    const { getScheduleStatuses, getSchedules, crudSchedules } = useSchedulesService();
    const { authorization, setMessage } = useContext(AppContext);

    const createPermission = authorization?.allowedActions?.find(action => action === "CREAR_PLAN");
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(schedulePAIValidator);
    const {
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        getValues,
        register,
        getFieldState,
        watch,
        trigger
    } = useForm<ICreatePlanAction>({ resolver, mode: "all" });

    const onSubmitCreate = handleSubmit(async (data: ICreatePlanAction) => {
        
        setTimeout(() => {
            reset();
        }, 100);
    });

    const onSubmitEdit = handleSubmit(async (data: ICreatePlanAction) => {
        
    });

    const resetForm = () => {
        reset();
        setEditSchedule(null);
    }

    useEffect(() => {
        getRiskPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setRiskPAIData(arrayEntities);
            }
        }).catch(() => { });

        getProcessPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setProcessPAIData(arrayEntities);
            }
        }).catch(() => { });

        getObjectivesPAI().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const entities: IEntities[] = response.data;
                const arrayEntities: IDropdownProps[] = entities.map((entity) => {
                    return { name: entity.description, value: entity.id };
                });
                setObjectivePAIData(arrayEntities);
            }
        }).catch(() => { });

    }, []);

 

    const yearsArray: IDropdownProps[] = [];

    // Generar un array de objetos para representar los años
    for (let year = 2024; year <= 2100; year++) {
      yearsArray.push({ name: year.toString(), value: year });
    }

    useEffect(() => {
        const subscription = watch((value: ICreatePlanAction) => setCreatePlanActionFormData(prev => { return { ...prev, ...value } }));
        return () => subscription.unsubscribe();
    }, [watch]);
    
    const changeActionsPAi = (data: IAddAction, row?: IAddAction) => {
        if (row) {
            const CreateActionData = getValues("actionsPAi").filter(item => item !== row).concat(data);
            setValue("actionsPAi", CreateActionData);
            setCreatePlanActionFormData(prev => {
                return { ...prev, actionsPAi: CreateActionData };
            });
        } else {
            const CreateActionData = getValues("actionsPAi");
            setValue("actionsPAi", CreateActionData ? CreateActionData.concat(data) : [data]);
            setCreatePlanActionFormData(prev => {
                return { ...prev, actionsPAi: CreateActionData ? CreateActionData.concat(data) : [data] };
            });
        }
        trigger("actionsPAi");
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "linePAI",
      });
    
      const { fields: riskFields, append: appendRisk, remove: removeRisk } = useFieldArray({
        control,
        name: "risksPAI",
      });
    

    
    const TypePAIData: IDropdownProps[] = [
        {
            name: "Proyecto",
            value: 1
        },
        {
            name: "Proceso",
            value: 2
        },
    ];

    const idType = watch("typePAI")

    useEffect(() => {
        if (idType == 1) {
           
            
        } else if (idType == 2){
            setNamePAIData(processPAIData);
        } 

    }, [idType]);

    const idName = watch("namePAI")

    useEffect(() => {
        if (idName == 1) {
           
            
        } else if (idName == 2){
            setNamePAIData(processPAIData);
        } 
        
    }, [idName]);


    const cancelAction = () => {
            navigate("./../..");
        
    }

    const saveAction = () => {
       
    }

    return { errors,fields, append, NamePAIData,remove,changeActionsPAi, riskFields, TypePAIData, appendRisk,riskPAIData, getFieldState,resetForm,register, yearsArray, control, setMessage, navigate,onSubmitCreate, rolData, statusData, createPermission, editSchedule, onSubmitEdit, getValues, setValue, cancelAction, saveAction };
}