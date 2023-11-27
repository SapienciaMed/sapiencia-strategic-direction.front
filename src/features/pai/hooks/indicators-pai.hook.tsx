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

export default function useIndicatorsPai() {
    
    const resolver = useYupValidationResolver(indicatorsPAIValidator);
    const { PAIData, setPAIData } = useContext(PAIContext);
    const [ indicatorTypeData, setIndicatorTypeData ] = useState<IPAIIndicatorType[]>([{
        name: "Número",
        value: "43"
    },
    {
        name: "Porcentaje",
        value: "21"
    },
    {
        name: "A demanda",
        value: "101"
    }]);
    const [ indicatorType, setIndicatorType ] = useState<IPAIIndicatorType>()
    const {
        handleSubmit,
        getValues,
        register,
        formState: { errors, isValid },
        control: controlIndicatorsPai,
        setValue,
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

    const onSubmit = () => {

    }
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
        onSubmit,
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
        responsibleFieldArray,
        coResponsibleFieldArray,
    }
}