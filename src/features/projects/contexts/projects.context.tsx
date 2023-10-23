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
import { IProjectTemp, IProject } from "../interfaces/ProjectsInterfaces";
import { useProjectsService } from "../hooks/projects-service.hook";
import { useParams } from "react-router-dom";
import { EResponseCodes } from "../../../common/constants/api.enum";

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
  projectDataOnEdit: IProject;
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
  projectDataOnEdit: null
});

export function ProjectsContextProvider({ children }: IProps) {
  const location = useLocation();
  const { id } = useParams();
  const [step, setStep] = useState<number>(0);
  const { GetProjectById } = useProjectsService();
  const [disableContinue, setDisableContinue] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<IProjectTemp>(null);
  const [textContinue, setTextContinue] = useState<string>(null);
  const [actionContinue, setActionContinue] = useState<() => void>(() => {});
  const [actionCancel, setActionCancel] = useState<() => void>(() => {});
  const [showCancel, setShowCancel] = useState<boolean>(true);
  const [ projectDataOnEdit, setProjectDataOnEdit] = useState<IProject>()
  const formAction = location.pathname.includes('/edit/') ? "edit" : "new";

  useEffect(() => {
    if (Number(id) && !projectDataOnEdit ) {
        GetProjectById(id).then(response => {
          if (response.operation.code === EResponseCodes.OK) {
              setProjectDataOnEdit(response.data);
          }
        })
    }
  }, [id]);


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
      projectDataOnEdit
    };
  }, [step, disableContinue, projectData, textContinue, actionContinue, actionCancel, showCancel]);

  return <ProjectsContext.Provider value={values}>{children}</ProjectsContext.Provider>;
}
