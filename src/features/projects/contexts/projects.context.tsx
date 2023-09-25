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
  textContinue: string;
  setTextContinue: Dispatch<SetStateAction<string>>;
  actionContinue: () => void;
  setActionContinue: Dispatch<SetStateAction<() => void>>;
  actionCancel: () => void;
  setActionCancel: Dispatch<SetStateAction<() => void>>;
  showCancel: boolean;
  setShowCancel: Dispatch<SetStateAction<boolean>>;
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
  textContinue: null,
  setTextContinue: () => {},
  actionContinue: () => {},
  setActionContinue: () => {},
  actionCancel: () => {},
  setActionCancel: () => {},
  showCancel: true,
  setShowCancel: () => {},
});

export function ProjectsContextProvider({ children }: IProps) {
  const [step, setStep] = useState<number>(0);
  const [disableContinue, setDisableContinue] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<IProjectTemp>(null);
  const [textContinue, setTextContinue] = useState<string>(null);
  const [actionContinue, setActionContinue] = useState<() => void>(() => {});
  const [actionCancel, setActionCancel] = useState<() => void>(() => {});
  const [showCancel, setShowCancel] = useState<boolean>(true);
  const values = useMemo<IProjectsContext>(() => {
    return {
      step,
      setStep,
      disableContinue,
      setDisableContinue,
      projectData,
      setProjectData,
      textContinue,
      setTextContinue,
      actionContinue,
      setActionContinue,
      actionCancel,
      setActionCancel,
      showCancel,
      setShowCancel
    };
  }, [step, disableContinue, projectData, textContinue, actionContinue, actionCancel, showCancel]);

  return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>;
}
