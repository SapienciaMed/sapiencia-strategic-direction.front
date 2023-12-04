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
import { useNavigate } from "react-router-dom";
import { IIndicatorAction } from '../interfaces/ProjectsInterfaces';
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AppContext } from "../../../common/contexts/app.context";

export default function useIndicatorsPai() {
    const navigate = useNavigate();
    const resolver = useYupValidationResolver(indicatorsPAIValidator);
    const { PAIData, 
            setPAIData, 
            setTempButtonText, 
            setSaveButtonText, 
            setSaveButtonAction,
            setDisableSaveButton,
            setActionCancel,
            setDisableTempBtn } = useContext(PAIContext);
    const [ indicatorTypeData, setIndicatorTypeData ] = useState<IPAIIndicatorType[]>();
    const [ projectIndicatorsData, setProjectIndicatorsData ] = useState<IDropdownProps[]>();
    const { setMessage } = useContext(AppContext);
    const [ indicatorType, setIndicatorType ] = useState<IPAIIndicatorType>()
    const { getIndicatorsType, getProjectIndicators } = useEntitiesService();
    const {
        getValues,
        register,
        formState: { errors, isValid },
        control: controlIndicatorsPai,
        setValue,
        watch,
    } = useForm<IIndicatorsPAI>({
        resolver,
        mode: "all",
        defaultValues: {
            totalPlannedGoal: 0,
            bimesters: [
                {bimester: "first",  value: null},
                {bimester: "second", value: null},
                {bimester: "third",  value: null},
                {bimester: "fourth", value: null},
                {bimester: "fifth",  value: null},
                {bimester: "sixth",  value: null}
            ]
        }
    });

    useEffect(()=>{
        if(isValid){
           setSaveButtonAction( () => onSubmit );
           setDisableSaveButton(!isValid);
           setDisableTempBtn(!isValid);
        }
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
                const indicatorType: IIndicatorAction[] = response.data;
                const arrayIndicators: IDropdownProps[] = indicatorType.map((indicator) => {
                    return { name: indicator?.productMGA, value: indicator?.id };
                });
                setProjectIndicatorsData(arrayIndicators);
            }
        }).catch(() => { });
        setSaveButtonText("Guardar");
        setTempButtonText("Agregar otro indicador");
        setActionCancel(()=>onCancel);
    }, []);

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
                navigate(-1)
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
                navigate(-1)
                setMessage({});
                setTempButtonText("Guardar temporalmente");
            }
        })
    }
    const onChangeBimesters = () => {
        const bimesters = getValues("bimesters");
        const sumOfBimesters = bimesters.reduce( ( accumulator, currentValue ) => accumulator + currentValue.value, 0 );
        const indicatorType = indicatorTypeData.find( indicator => indicator.value == getValues("indicatorType"));
        setIndicatorType(indicatorType)
        if( indicatorType.name == "Porcentaje"){
            return setValue("totalPlannedGoal",sumOfBimesters / 100);
        }else if( indicatorType.name == "A demanda"){
            return setValue("totalPlannedGoal",sumOfBimesters / 6);
        } 
        setValue("totalPlannedGoal",sumOfBimesters);
    }

    const onChangeIndicator = () => onChangeBimesters();

    useEffect(() => {
        const subscription = watch((value: IIndicatorsPAI ) => setPAIData(prev => {
            return { ...prev, indicators: [value] }
        }));
        return () => subscription.unsubscribe();
    }, [watch]);


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