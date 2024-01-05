import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { IComponent, IActivity,IResponsible, IIndicator } from "../../projects/interfaces/AntiCorruptionPlanInterfaces";

interface IContext {
    components: IComponent[];
    indicators: IIndicator[];
    responsibles: IResponsible[];
    activities: IActivity[];
    setComponents: Dispatch<SetStateAction<IComponent[]>>;
    setIndicators: Dispatch<SetStateAction<IIndicator[]>>;
    setResponsibles: Dispatch<SetStateAction<IResponsible[]>>;
    setActivities: Dispatch<SetStateAction<IActivity[]>>;
}

interface IProps {
    children: ReactElement | ReactElement[];
}

export const AntiCorruptionPlanContext = createContext<IContext>({
    components: [],
    indicators: [],
    responsibles: [],
    activities: [],
    setComponents: () => {},
    setIndicators: () => {},
    setResponsibles: () => {},
    setActivities: () => {},
})



export function AntiCorruptionPlanContextProvider({ children }: Readonly<IProps>) {
    const [components, setComponents] = useState<IComponent[]>([]);
    const [indicators, setIndicators] = useState<IIndicator[]>([]);
    const [responsibles, setResponsibles] = useState<IResponsible[]>([]);
    const [activities, setActivities] = useState<IActivity[]>([]);

    const values = useMemo<IContext>(() => {
        return {
            components,
            indicators,
            responsibles,
            activities,
            setComponents,
            setIndicators,
            setResponsibles,
            setActivities,
        };
    }, [components,
        indicators,
        responsibles, activities, setComponents, setIndicators, setResponsibles, setActivities])

    return <AntiCorruptionPlanContext.Provider value={values}>{children}</AntiCorruptionPlanContext.Provider>;
}