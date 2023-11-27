import {
    createContext,
    useMemo,
    ReactElement,
    Dispatch,
    SetStateAction,
    useState
  } from "react";
  import { useLocation } from 'react-router-dom';
  import { IPAI } from "../interfaces/IndicatorsPAIInterfaces";
  
  interface IPAIContext {
    disableSaveButton: boolean;
    setDisableSaveButton: Dispatch<SetStateAction<boolean>>;
    PAIData: IPAI;
    setPAIData: Dispatch<SetStateAction<IPAI>>;
    buttonText: string;
    setButtonText: Dispatch<SetStateAction<string>>;
    saveButtonAction: () => void;
    setSaveButtonAction: Dispatch<SetStateAction<() => void>>;
    actionCancel: () => void;
    setActionCancel: Dispatch<SetStateAction<() => void>>;
    showCancel: boolean;
    setShowCancel: Dispatch<SetStateAction<boolean>>;
    formAction: "new" | "edit";
  }
  interface IProps {
    children: ReactElement | ReactElement[];
  }
  
  export const PAIContext = createContext<IPAIContext>({
    disableSaveButton: true,
    setDisableSaveButton: () => {},
    PAIData: null,
    setPAIData: () => {},
    buttonText: null,
    setButtonText: () => {},
    saveButtonAction: () => {},
    setSaveButtonAction: () => {},
    actionCancel: () => {},
    setActionCancel: () => {},
    showCancel: true,
    setShowCancel: () => {},
    formAction: null,
  });
  
  export function PAIContextProvider({ children }: IProps) {
    const location = useLocation();
    const [disableSaveButton, setDisableSaveButton] = useState<boolean>(true);
    const [PAIData, setPAIData] = useState<IPAI>(null);
    const [buttonText, setButtonText] = useState<string>(null);
    const [saveButtonAction, setSaveButtonAction] = useState<() => void>(() => {});
    const [actionCancel, setActionCancel] = useState<() => void>(() => {});
    const [showCancel, setShowCancel] = useState<boolean>(true);
    const formAction = location.pathname.includes('/edit/') ? "edit" : "new";
  
    const values = useMemo<IPAIContext>(() => {
      return {
        disableSaveButton,
        setDisableSaveButton,
        PAIData,
        setPAIData,
        buttonText,
        setButtonText,
        saveButtonAction,
        setSaveButtonAction,
        actionCancel,
        setActionCancel,
        showCancel,
        setShowCancel,
        formAction
      };
    }, [disableSaveButton, PAIData, buttonText, saveButtonAction, actionCancel, showCancel, formAction]);
  
    return <PAIContext.Provider value={values}>{children}</PAIContext.Provider>;
  }
  