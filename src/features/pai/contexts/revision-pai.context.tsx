import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { ICreatePlanAction, IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { IProject } from "../interfaces/ProjectsInterfaces";

interface IRevisionPAIContext {
    revisionPAI: IRevisionFormPAI[];
    setRevisionPAI: Dispatch<SetStateAction<IRevisionFormPAI[]>>;
    pai: ICreatePlanAction;
    setPai: Dispatch<SetStateAction<ICreatePlanAction>>;
    projectPAI: IProject;
    setProjectPAI: Dispatch<SetStateAction<IProject>>;
}

interface IProps {
    children: ReactElement | ReactElement[];
}

export const RevisionPAIContext = createContext<IRevisionPAIContext>({
    revisionPAI: [],
    setRevisionPAI: () => {},
    pai: null,
    setPai: () => {},
    projectPAI: null,
    setProjectPAI: () => {},
})

export function RevisionPAIContextProvider({ children }: Readonly<IProps>) {
    const [revisionPAI, setRevisionPAI] = useState<IRevisionFormPAI[]>([]);
    const [pai, setPai] = useState<ICreatePlanAction>(null);
    const [projectPAI, setProjectPAI] = useState<IProject>(null);
    const values = useMemo<IRevisionPAIContext>(() => {
        return {
            revisionPAI,
            setRevisionPAI,
            pai,
            setPai,
            projectPAI,
            setProjectPAI
        };
    }, [revisionPAI, pai, projectPAI, setProjectPAI])

    return <RevisionPAIContext.Provider value={values}>{children}</RevisionPAIContext.Provider>;
}