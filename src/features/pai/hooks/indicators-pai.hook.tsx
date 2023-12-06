import { useFieldArray, 
         useForm, 
         useWatch } from "react-hook-form";
import { useContext, 
         useEffect, 
         useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IIndicatorsPAI, 
         IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { indicatorsPAIValidator} from "../../../common/schemas";
import { PAIContext } from "../contexts/pai.context";
import { useEntitiesService } from "./entities-service.hook";
import { IIndicatorIndicative, IIndicatorAction, IProject } from '../interfaces/ProjectsInterfaces';
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AppContext } from "../../../common/contexts/app.context";
import { useProjectsService } from "./projects-service.hook";
export default function useIndicatorsPai(actionId:number) {
    const resolver = useYupValidationResolver(indicatorsPAIValidator);
    const { PAIData, 
            setPAIData, 
            setActionCancel,
            setDisableTempBtn,
            setTempButtonText, 
            setSaveButtonText,
            setTempButtonAction, 
            setSaveButtonAction,
            setDisableSaveButton,
            setIndicatorsFormComponent } = useContext(PAIContext);
    const [ indicatorTypeData, setIndicatorTypeData ] = useState<IPAIIndicatorType[]>();
    const [ indicators, setIndicators ] = useState<Array<IIndicatorIndicative | IIndicatorAction>>();
    const [ projectData, setProjectData ] = useState<IProject>();
    const [ projectIndicatorsData, setProjectIndicatorsData ] = useState<IDropdownProps[]>();
    const { setMessage } = useContext(AppContext);
    const [ indicatorType, setIndicatorType ] = useState<IPAIIndicatorType>()
    const { getIndicatorsType, getProjectIndicators } = useEntitiesService();
    const { GetProjectById } = useProjectsService()
    const {
        getValues,
        register,
        formState: { errors, isValid },
        control: controlIndicatorsPai,
        setValue,
        reset,
        watch: watchIndicators,
        trigger
    } = useForm<IIndicatorsPAI>({
        resolver,
        mode: "all",
        defaultValues: {
            typePAI: PAIData?.typePAI,
            totalPlannedGoal: 0,
            actionId: actionId,
            bimesters: [
                {bimester: "first",  value: null },
                {bimester: "second", value: null},
                {bimester: "third",  value: null},
                {bimester: "fourth", value: null},
                {bimester: "fifth",  value: null},
                {bimester: "sixth",  value: null}
            ]
        }
    });

    useEffect(() => {
        const subscription = watchIndicators(( values: IIndicatorsPAI ) => setPAIData(prev => {
            if(values?.indicatorDesc?.length > 0) trigger("projectIndicator");
            if(values?.projectIndicator) trigger("indicatorDesc");
            return { ...prev, indicators: prev?.indicators ? [ ...prev.indicators ] :  [] }
        }));
        return () => subscription.unsubscribe();
    }, [watchIndicators]);

    useEffect(()=>{
        if(isValid){
           setSaveButtonAction( () => onSubmit );
           setTempButtonAction( () => onAddNewIndicator )
        }
        setDisableSaveButton(!isValid);
        setDisableTempBtn(!isValid);
    },[isValid])

    useEffect(() => {
        getIndicatorsType().then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const indicatorType: IPAIIndicatorType[] = response.data;
                const arrayIndicatorsType: IPAIIndicatorType[] = indicatorType.map((indicator) => {
                    return { name: indicator?.description, value: indicator?.id };
                });
                setIndicatorTypeData(arrayIndicatorsType);
            }
        }).catch(() => { });
        getProjectIndicators(PAIData?.namePAI).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                const indicatorsData = response.data;
                const indicators = indicatorsData.indicatorsAction.concat(indicatorsData.indicatorsIndicative);
                setIndicators(indicators)
            }
        }).catch(() => { });
    }, []);

    useEffect(()=>{
        setTimeout(()=>{
            setActionCancel(()=>onCancel);
            setTempButtonText("Agregar otro indicador"); 
            setSaveButtonText("Guardar"); 
            setDisableTempBtn(!isValid);
            setDisableSaveButton(!isValid);
        },50)
    },[])

    useEffect(()=>{
        GetProjectById(`${PAIData?.namePAI}`).then( response => {
            if (response.operation.code === EResponseCodes.OK) {
                const project: IProject = response.data;
                setProjectData(project)
            }
        }).catch(()=>{})
    },[indicators])

    useEffect(()=>{
        if(projectData){
            let arrayIndicators= [];
            for(let i = 0; i < indicators?.length; i++){
                const indicator = projectData.activities
                ?.find( activity => activity.productMGA === indicators[i].productMGA);
                arrayIndicators.push({ 
                    name: `${indicator?.productMGA} - ${indicator?.productDescriptionMGA}`, 
                    value: indicators[i].type 
                })
            }
            setProjectIndicatorsData(arrayIndicators);
        }
    },[projectData])

    const onSaveIndicator = () => {
        if(isValid){
            const values = getValues();
            setPAIData( prev => {
                return { ...prev, 
                    indicators: prev?.indicators ?  [ ...prev.indicators, { ...values, actionId: actionId }] :  [{ ...values, actionId: actionId }]
                }
            });
        }
    }
    
    const onSubmit = () => {
        setMessage({
            title: "Crear indicador",
            description: "¿Deseas guardar el indicador?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                onSaveIndicator();
                setIndicatorsFormComponent(null)
                setSaveButtonText("Guardar y regresar");
                setMessage({
                    title: "Datos guardados",
                    description: "¡Indicador guardado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    }
                });
            }
        })
    }
    const onCancel = () => {
        setMessage({
            title: "Cancelar acción",
            description: "¿Deseas cancelar la creación del indicador?",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: () => {
                setIndicatorsFormComponent(null)
                setSaveButtonText("Guardar y regresar");
                setMessage({});
                setTempButtonText("Guardar temporalmente");
            }
        })
    }
    const onAddNewIndicator = () => {
        if(isValid){
            onSaveIndicator();
            reset();
        }
    }
    const onChangeBimesters = () => {
        const bimesters = getValues("bimesters");
        const sumOfBimesters = bimesters?.reduce( ( accumulator, currentValue ) => accumulator + currentValue.value, 0 );
        const indicatorType = indicatorTypeData?.find( indicator => indicator.value == getValues("indicatorType"));
        const validateFullFill = bimesters?.find( bimester => !bimester.value );
        setValue("totalPlannedGoal",sumOfBimesters);
        setIndicatorType(indicatorType);
        if( indicatorType?.name == "Porcentaje"){
            setValue("totalPlannedGoal",sumOfBimesters / 100);
        }else if( indicatorType?.name == "A demanda"){
            setValue("totalPlannedGoal",sumOfBimesters / 6);
        } 
        if(!validateFullFill) trigger("totalPlannedGoal"); 
    }

    const onChangeIndicator = () => onChangeBimesters();

    const { fields: fieldsBimesters, remove: removeBimesters} = useFieldArray({
        control: controlIndicatorsPai,
        name: "bimesters",
    });
    const bimestersFieldArray = useWatch({
        control: controlIndicatorsPai,
        name: "bimesters"
    });

    const { fields: fieldsProducts, append: appendProducts} = useFieldArray({
        control: controlIndicatorsPai,
        name: "products",
    });
    const productsFieldArray = useWatch({
        control: controlIndicatorsPai,
        name: "products"
    });
    const { fields: fieldsResponsible, append: appendResponsible} = useFieldArray({
        control: controlIndicatorsPai,
        name: "responsibles",
    });
    const responsibleFieldArray = useWatch({
        control: controlIndicatorsPai,
        name: "responsibles"
    });
    const { fields: fieldsCoResponsible, append: appendCoResponsible} = useFieldArray({
        control: controlIndicatorsPai,
        name: "coresponsibles",
    });
    const coResponsibleFieldArray = useWatch({
        control: controlIndicatorsPai,
        name: "coresponsibles"
    });
    
    return {
        errors,
        PAIData,
        register,
        getValues,
        indicatorType,
        fieldsProducts,
        appendProducts,
        fieldsBimesters,
        removeBimesters,
        onChangeBimesters,
        indicatorTypeData,
        onChangeIndicator,
        appendResponsible,
        fieldsResponsible,
        productsFieldArray,
        appendCoResponsible,
        bimestersFieldArray,
        fieldsCoResponsible,
        controlIndicatorsPai,
        projectIndicatorsData,
        responsibleFieldArray,
        coResponsibleFieldArray,
    }
}