import { Controller, UseFieldArrayRemove, useFieldArray, 
         useForm, 
         useWatch } from "react-hook-form";
import { useCallback, useContext, 
         useEffect, 
         useState } from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { IBimester, IDisaggregate, IIndicatorsPAI, 
         IIndicatorsPAITemp, 
         IPAIIndicatorType } from "../interfaces/IndicatorsPAIInterfaces";
import { indicatorsPAIValidator} from "../../../common/schemas";
import { PAIContext } from "../contexts/pai.context";
import { useEntitiesService } from "./entities-service.hook";
import { IIndicatorIndicative, IIndicatorAction, IProject } from '../interfaces/ProjectsInterfaces';
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { AppContext } from "../../../common/contexts/app.context";
import { useProjectsService } from "./projects-service.hook";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { InputInplaceComponent } from "../../../common/components/Form";
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
    const [ indicatorTypeValidation, setIndicatorTypeValidation ] = useState<boolean>(false);
    const [ projectData, setProjectData ] = useState<IProject>();
    const [ projectIndicatorsData, setProjectIndicatorsData ] = useState<IDropdownProps[]>();
    const [ tableData, setTableData ] = useState<IDisaggregate[]>([]);
    const [ disaggregateColumns, setDisaggregateColumns] = useState<ITableElement<IDisaggregate>[]>([]);
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
        trigger,
        getFieldState
    } = useForm<IIndicatorsPAITemp>({
        resolver,
        mode: "all",
        defaultValues: {
            typePAI: PAIData?.typePAI,
            totalPlannedGoal: 0,
            actionId: actionId,
            bimesters: [
                {bimester: "first",  value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []},
                {bimester: "second", value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []},
                {bimester: "third",  value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []},
                {bimester: "fourth", value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []},
                {bimester: "fifth",  value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []},
                {bimester: "sixth",  value: null, disaggregate: [], showDisaggregate: 0, sumOfPercentage: 0, errors: []}
            ]
        }
    });

    useEffect(() => {
        const subscription = watchIndicators(( values: IIndicatorsPAITemp ) => setPAIData(prev => {
            if(values?.indicatorDesc?.length > 0) trigger("projectIndicator");
            if(values?.projectIndicator) trigger("indicatorDesc");
            return { ...prev }
        }));
        return () => subscription.unsubscribe();
    }, [watchIndicators]);

    useEffect(()=>{
        setIndicatorTypeValidation(!(indicatorType?.name != "Porcentaje"));
    },[indicatorType])

    useEffect(()=>{
        setDisableSaveButton(!isValid);
        setDisableTempBtn(!isValid);
        if(!isValid) return;
        setSaveButtonAction( () => onSubmit );
        setTempButtonAction( () => onAddNewIndicator )
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
        if(!projectData) return;
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
    },[projectData])

    const onSaveIndicator = () => {
        if(!isValid) return;
        const values = getValues();
        setPAIData( prev => {
            prev?.actionsPAi.map( action => {
                if((action?.id | action?.action ) === actionId){
                    action.indicators = action?.indicators 
                    ?  [ ...action.indicators, { ...values, actionId: actionId }] 
                    :  [{ ...values, actionId: actionId }]
                }
            });
            return { ...prev }
        });
    }
    
    const onSubmit = () => {
        if(indicatorTypeValidation && onValidateMinimumDisaggregated()) return;
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
        if(!isValid) return;
        if(indicatorTypeValidation && onValidateMinimumDisaggregated()) return;
        onSaveIndicator();
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
        reset();
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

    const { fields: fieldsBimesters, remove: removeBimesters } = useFieldArray({
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

    const updatedDisaggregate = ( disaggregate: IDisaggregate[] ) => {
        return disaggregate.map((item, itemIndex) => ({
            ...item,
            index: itemIndex
        }));
    }

    const onChangeDisaggregate = ( indexBimester: number, indexDisaggregate: number ) => {
        const disaggregate = getValues(`bimesters.${indexBimester}.disaggregate`);
        const sumOfPercentage = disaggregate?.reduce ? disaggregate?.reduce( ( accumulator, currentValue ) => accumulator + currentValue.percentage, 0 ) : 0;
        const disaggregateUpdated = updatedDisaggregate(disaggregate);
        fieldsBimesters.at(indexBimester).sumOfPercentage = sumOfPercentage;
        fieldsBimesters.at(indexBimester).disaggregate = [...disaggregateUpdated];
        setValue(`bimesters.${indexBimester}.disaggregate`, [...disaggregateUpdated]);
        setValue(`bimesters.${indexBimester}.disaggregate.${indexDisaggregate}.percentage`, disaggregate.at(indexDisaggregate).percentage);
        setValue(`bimesters.${indexBimester}.disaggregate.${indexDisaggregate}.description`, disaggregate.at(indexDisaggregate).description);
        trigger("bimesters")
        validateBimester(getValues(`bimesters.${indexBimester}`),indexBimester,sumOfPercentage);
    }

    const onAddDisaggregate = ( index: number ) => {
        const disaggregate = getValues(`bimesters.${index}.disaggregate`);
        const newDisaggregate = {
          indexBimester: index,
          index: disaggregate.length === 0 ? 0 : disaggregate.length,
          percentage: 0,
          description: ""
        };
        const disaggregateUpdated = updatedDisaggregate(disaggregate);
        fieldsBimesters.at(index).disaggregate = [...disaggregateUpdated, newDisaggregate];
        setValue(`bimesters.${index}.disaggregate`,[...disaggregateUpdated, newDisaggregate]);
    }

    const removeDisaggregate = ( indexBimester: number, index: number ) => {
        const disaggregate = getValues(`bimesters.${indexBimester}.disaggregate`);
        const filtered = disaggregate?.filter(disaggregate => (disaggregate.index !== index)) || [];
        const disaggregateUpdated = updatedDisaggregate(filtered);
        fieldsBimesters.at(indexBimester).disaggregate = [...disaggregateUpdated];
        setValue(`bimesters.${indexBimester}.disaggregate`, [...disaggregateUpdated]);
        trigger("bimesters")
    }

    const onShowDisaggregate = ( index:number ) => {
        setValue(`bimesters.${index}.showDisaggregate`,1);
        fieldsBimesters.at(index).showDisaggregate = 1;
        trigger("bimesters")
    }

    const validateBimester = ( validationBimester: IBimester, indexBimester: number, sumOfPercentage: number ) => {
        let errors = [];
        if(sumOfPercentage + validationBimester?.value > 100 || sumOfPercentage + validationBimester?.value < 100 ){
            errors.push(`Los porcentajes no coinciden. No pueden ser ${sumOfPercentage + validationBimester?.value > 100 ? "superior" : "inferior"} al total del bimestre.`)
        }
        fieldsBimesters.at(indexBimester).errors = errors;
        setValue(`bimesters.${indexBimester}.errors`, errors);
    }

    const onValidateMinimumDisaggregated = ():boolean => {
        const bimesters = getValues("bimesters");
        const minimumDisaggregated = bimesters.filter(bimester => bimester.disaggregate.length > 0);
        const validationResult = minimumDisaggregated.length < 2;
        if(validationResult) {
            setMessage({
                title: "Validación bimestres",
                description: "Se debe realizar la desagregación del bimestre mínimo en dos registros.",
                show: true,
                background: true,
                OkTitle: "Aceptar",
                onOk: () => {
                    setMessage({});
                }
            });  
        }
        return validationResult;
    }

    return {
        errors,
        trigger,
        PAIData,
        setValue,
        register,
        getValues,
        tableData,
        setMessage,
        getFieldState,
        indicatorType,
        fieldsProducts,
        appendProducts,
        fieldsBimesters,
        removeBimesters,
        onChangeBimesters,
        indicatorTypeData,
        onChangeIndicator,
        appendResponsible,
        onAddDisaggregate,
        fieldsResponsible,
        onShowDisaggregate,
        productsFieldArray,
        removeDisaggregate,
        disaggregateColumns,
        appendCoResponsible,
        bimestersFieldArray,
        fieldsCoResponsible,
        controlIndicatorsPai,
        onChangeDisaggregate,
        projectIndicatorsData,
        responsibleFieldArray,
        setDisaggregateColumns,
        coResponsibleFieldArray,
        indicatorTypeValidation,
    }
}