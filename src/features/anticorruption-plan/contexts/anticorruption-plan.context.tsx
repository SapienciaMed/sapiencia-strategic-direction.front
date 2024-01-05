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
    deletedComponentIds: string[];
    deletedIndicatorIds: string[];
    deletedResponsibleIds: string[];
    deletedActivityIds: string[];
    setDeletedComponentIds: Dispatch<SetStateAction<string[]>>;
    setDeletedIndicatorIds: Dispatch<SetStateAction<string[]>>;
    setDeletedResponsibleIds: Dispatch<SetStateAction<string[]>>;
    setDeletedActivityIds: Dispatch<SetStateAction<string[]>>;

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
    deletedComponentIds: [],
    deletedActivityIds: [],
    deletedIndicatorIds: [],
    deletedResponsibleIds: [],
    setDeletedComponentIds: () => {},
    setDeletedIndicatorIds: () => {},
    setDeletedResponsibleIds: () => {},
    setDeletedActivityIds: () => {},
})



export function AntiCorruptionPlanContextProvider({ children }: Readonly<IProps>) {
    const [components, setComponents] = useState<IComponent[]>([]);
    const [indicators, setIndicators] = useState<IIndicator[]>([]);
    const [responsibles, setResponsibles] = useState<IResponsible[]>([]);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [deletedComponentIds, setDeletedComponentIds] = useState<string[]>([]);
    const [deletedActivityIds, setDeletedActivityIds] = useState<string[]>([]);
    const [deletedIndicatorIds, setDeletedIndicatorIds] = useState<string[]>([]);
    const [deletedResponsibleIds, setDeletedResponsibleIds] = useState<string[]>([]);

    const values = useMemo<IContext>(() => {
        return {
            components,
            indicators,
            responsibles,
            activities,
            deletedComponentIds,
            deletedActivityIds,
            deletedIndicatorIds,
            deletedResponsibleIds,
            setComponents,
            setIndicators,
            setResponsibles,
            setActivities,
            setDeletedComponentIds,
            setDeletedIndicatorIds,
            setDeletedResponsibleIds,
            setDeletedActivityIds,
        };
    }, [components, indicators, responsibles, activities, setComponents, setIndicators, setResponsibles, setActivities,
        setDeletedComponentIds, setDeletedIndicatorIds, setDeletedResponsibleIds, setDeletedActivityIds
    ])

    return <AntiCorruptionPlanContext.Provider value={values}>{children}</AntiCorruptionPlanContext.Provider>;
}