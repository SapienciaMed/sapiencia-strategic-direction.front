import {
  createContext,
  useMemo,
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { useLocation } from 'react-router-dom';
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
  formAction: "new" | "edit";
  statusesForDisabledInputs: number[];
  setStatusForDisabledInputs: Dispatch<SetStateAction<number[]>>;
  isADisabledInput: boolean;
  disableStatusUpdate: boolean;
  setDisableStatusUpdate:  Dispatch<SetStateAction<boolean>>;
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
  formAction: null,
  statusesForDisabledInputs: [],
  setStatusForDisabledInputs: () => {},
  isADisabledInput: false,
  disableStatusUpdate: true,
  setDisableStatusUpdate:  () => {}
});

export function ProjectsContextProvider({ children }: IProps) {
  const location = useLocation();
  const [step, setStep] = useState<number>(0);
  const [disableContinue, setDisableContinue] = useState<boolean>(true);
  const [disableStatusUpdate, setDisableStatusUpdate] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<IProjectTemp>(null);
  const [textContinue, setTextContinue] = useState<string>(null);
  const [actionContinue, setActionContinue] = useState<() => void>(() => {});
  const [actionCancel, setActionCancel] = useState<() => void>(() => {});
  const [showCancel, setShowCancel] = useState<boolean>(true);
  const [statusesForDisabledInputs, setStatusForDisabledInputs] = useState<number[]>([2,3]);
  const formAction = location.pathname.includes('/edit/') ? "edit" : "new";
  const isADisabledInput = statusesForDisabledInputs.includes(projectData?.status) && formAction === "edit";

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
      setShowCancel,
      formAction,
      isADisabledInput,
      statusesForDisabledInputs,
      setStatusForDisabledInputs,
      disableStatusUpdate,
      setDisableStatusUpdate
    };
  }, [step, disableContinue, projectData, textContinue, actionContinue, actionCancel, showCancel, formAction]);

  return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>;
}
