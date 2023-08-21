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
  actionContinue: () => void;
  setActionContinue: Dispatch<SetStateAction<() => void>>;
}
interface IProps {
  children: ReactElement | ReactElement[];
}

export const ProjectsContext = createContext<IProjectsContext>({
  step: 0,
  setStep: () => {},
  disableContinue: true,
  setDisableContinue: () => {},
  projectData: null,
  setProjectData: () => {},
  actionContinue: () => {},
  setActionContinue: () => {},
});

export function ProjectsContextProvider({ children }: IProps) {
  const [step, setStep] = useState<number>(0);
  const [disableContinue, setDisableContinue] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<IProjectTemp>(null);
  const [actionContinue, setActionContinue] = useState<() => void>(() => {});
  const values = useMemo<IProjectsContext>(() => {
    return {
      step,
      setStep,
      disableContinue,
      setDisableContinue,
      projectData,
      setProjectData,
      actionContinue,
      setActionContinue
    };
  }, [step, disableContinue, projectData, actionContinue]);

  return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>;
}
