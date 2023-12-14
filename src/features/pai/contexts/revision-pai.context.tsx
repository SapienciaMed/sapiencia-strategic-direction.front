import { Dispatch, ReactElement, SetStateAction, createContext, useMemo, useState } from "react";
import { ICreatePlanAction, IRevisionFormPAI } from "../interfaces/PAIInterfaces";
import { IProject } from "../interfaces/ProjectsInterfaces";
import { IPropsRevisionPAI } from "../pages/revision-pai.page";

interface IRevisionPAIContext {
    revisionPAI: IRevisionFormPAI[];
    setRevisionPAI: Dispatch<SetStateAction<IRevisionFormPAI[]>>;
    pai: ICreatePlanAction;
    setPai: Dispatch<SetStateAction<ICreatePlanAction>>;
    projectPAI: IProject;
    setProjectPAI: Dispatch<SetStateAction<IProject>>;
    status: IPropsRevisionPAI;
    setStatus: Dispatch<SetStateAction<IPropsRevisionPAI>>;
    fieldsChange: string[];
    setFieldsChange: Dispatch<SetStateAction<string[]>>;
    correctionFields: any;
    setCorrectionFields: Dispatch<SetStateAction<any>>;
    fieldsCorrected: string[];
    setFieldsCorrected: Dispatch<SetStateAction<string[]>>;
    fieldsValues: any[];
    setFieldsValues: Dispatch<SetStateAction<any[]>>;
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
    status: null,
    setStatus: () => {},
    fieldsChange: [],
    setFieldsChange: () => {},
    correctionFields: {},
    setCorrectionFields: () => {},
    fieldsCorrected: [],
    setFieldsCorrected: () => {},
    fieldsValues: [],
    setFieldsValues: () => {},
})

export function RevisionPAIContextProvider({ children }: Readonly<IProps>) {
    const [revisionPAI, setRevisionPAI] = useState<IRevisionFormPAI[]>([]);
    const [pai, setPai] = useState<ICreatePlanAction>(null);
    const [projectPAI, setProjectPAI] = useState<IProject>(null);
    const [status, setStatus] = useState<IPropsRevisionPAI>(null);
    const [fieldsChange, setFieldsChange] = useState<string[]>([]);
    const [correctionFields, setCorrectionFields] = useState<any>({});
    const [fieldsCorrected, setFieldsCorrected] = useState<string[]>([]);
    const [fieldsValues, setFieldsValues] = useState<any[]>([]);
    const values = useMemo<IRevisionPAIContext>(() => {
        return {
            revisionPAI,
            setRevisionPAI,
            pai,
            setPai,
            projectPAI,
            setProjectPAI,
            status,
            setStatus,
            fieldsChange,
            setFieldsChange,
            correctionFields,
            setCorrectionFields,
            fieldsCorrected,
            setFieldsCorrected,
            fieldsValues,
            setFieldsValues
        };
    }, [revisionPAI, pai, projectPAI, status, fieldsChange, correctionFields, fieldsCorrected, fieldsValues])

    return <RevisionPAIContext.Provider value={values}>{children}</RevisionPAIContext.Provider>;
}