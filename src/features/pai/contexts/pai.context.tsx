import {
  createContext,
  useMemo,
  ReactElement,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { ICreatePlanAction } from "../interfaces/PAIInterfaces";

interface IPAIContext {
  disableSaveButton: boolean;
  setDisableSaveButton: Dispatch<SetStateAction<boolean>>;
  PAIData: ICreatePlanAction;
  setPAIData: Dispatch<SetStateAction<ICreatePlanAction>>;
  tempButtonText: string;
  setTempButtonText: Dispatch<SetStateAction<string>>;
  tempButtonAction: () => void;
  setTempButtonAction: Dispatch<SetStateAction<() => void>>;
  IndicatorsFormComponent: React.JSX.Element | null;
  setIndicatorsFormComponent: Dispatch<SetStateAction<React.JSX.Element | null>>;
  saveButtonText: string;
  setSaveButtonText: Dispatch<SetStateAction<string>>;
  saveButtonAction: () => void;
  setSaveButtonAction: Dispatch<SetStateAction<() => void>>;
  disableTempBtn: boolean;
  setDisableTempBtn: Dispatch<SetStateAction<boolean>>;
  actionCancel: () => void;
  setActionCancel: Dispatch<SetStateAction<() => void>>;
  showCancel: boolean;
  setShowCancel: Dispatch<SetStateAction<boolean>>;
  isValidIndicator: boolean;
  setIsValidIndicator: Dispatch<SetStateAction<boolean>>;
  formAction: string;
  setFormAction: Dispatch<SetStateAction<string>>;
}
interface IProps {
  children: ReactElement | ReactElement[];
}

export const PAIContext = createContext<IPAIContext>({
  disableSaveButton: true,
  setDisableSaveButton: () => { },
  PAIData: null,
  setPAIData: () => { },
  tempButtonText: null,
  setTempButtonText: () => { },
  IndicatorsFormComponent: null,
  setIndicatorsFormComponent: () => { },
  tempButtonAction: () => { },
  setTempButtonAction: () => { },
  saveButtonText: null,
  setSaveButtonText: () => { },
  saveButtonAction: () => { },
  setSaveButtonAction: () => { },
  disableTempBtn: true,
  setDisableTempBtn: () => { },
  actionCancel: () => { },
  setActionCancel: () => { },
  showCancel: true,
  setShowCancel: () => { },
  isValidIndicator: true,
  setIsValidIndicator: () => { },
  formAction: null,
  setFormAction: () => { },
});

export function PAIContextProvider({ children }: Readonly<IProps>) {
  const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true);
  const [disableTempBtn, setDisableTempBtn] = useState<boolean>(true);
  const [IndicatorsFormComponent, setIndicatorsFormComponent] = useState<React.JSX.Element | null>(null)
  const [PAIData, setPAIData] = useState<ICreatePlanAction>(null);
  const [tempButtonText, setTempButtonText] = useState<string>(null);
  const [tempButtonAction, setTempButtonAction] = useState<() => void>(() => { });
  const [saveButtonText, setSaveButtonText] = useState<string>(null);
  const [saveButtonAction, setSaveButtonAction] = useState<() => void>(() => { });
  const [actionCancel, setActionCancel] = useState<() => void>(() => { });
  const [showCancel, setShowCancel] = useState<boolean>(true);
  const [isValidIndicator, setIsValidIndicator] = useState<boolean>(true);
  const [formAction, setFormAction] = useState<string>(null);
  const values = useMemo<IPAIContext>(() => {
    return {
      disableSaveButton,
      setDisableSaveButton,
      PAIData,
      setPAIData,
      tempButtonText,
      setTempButtonText,
      tempButtonAction,
      IndicatorsFormComponent,
      setIndicatorsFormComponent,
      setTempButtonAction,
      saveButtonText,
      setSaveButtonText,
      saveButtonAction,
      setSaveButtonAction,
      disableTempBtn,
      setDisableTempBtn,
      actionCancel,
      setActionCancel,
      showCancel,
      setShowCancel,
      isValidIndicator,
      setIsValidIndicator,
      formAction,
      setFormAction,
    };
  }, [disableSaveButton, IndicatorsFormComponent, isValidIndicator, disableTempBtn, PAIData, tempButtonText, tempButtonAction, saveButtonText, saveButtonAction, actionCancel, showCancel, formAction]);

  return <PAIContext.Provider value={values}>{children}</PAIContext.Provider>;
}
