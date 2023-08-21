import {
  createContext,
  useMemo,
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { IProjectTemp } from "../interfaces/ProjectsInterfaces";

interface IProjectsContext {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  disableContinue: boolean;
  setDisableContinue: Dispatch<SetStateAction<boolean>>;
  projectData: IProjectTemp;
  setProjectData: Dispatch<SetStateAction<IProjectTemp>>;
}
interface IProps {
  children: ReactElement | ReactElement[];
}

export const ProjectsContext = createContext<IProjectsContext>({
  step: null,
  setStep: () => {},
  disableContinue: true,
  setDisableContinue: () => {},
  projectData: null,
  setProjectData: () => {},
});

export function ProjectsContextProvider({ children }: IProps) {
  const [step, setStep] = useState<number>(null);
  const [disableContinue, setDisableContinue] = useState<boolean>(null);
  const [projectData, setProjectData] = useState<IProjectTemp>(null);
  const values = useMemo<IProjectsContext>(() => {
    return {
      step,
      setStep,
      disableContinue,
      setDisableContinue,
      projectData,
      setProjectData
    };
  }, [step, disableContinue, projectData]);

  return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>;
}
