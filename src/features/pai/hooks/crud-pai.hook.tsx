import { useContext, useEffect, useState } from "react";
import { PAIContext } from "../contexts/pai.context";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";

export default function useCrudPAIData({ status }) {
    const {
        disableSaveButton,
        tempButtonText,
        tempButtonAction,
        saveButtonText,
        saveButtonAction,
        actionCancel,
        disableTempBtn,
        IndicatorsFormComponent
    } = useContext(PAIContext);
    const { setMessage } = useContext(AppContext);
    const navigate = useNavigate();
    return {
        IndicatorsFormComponent,
        setMessage,
        saveButtonText,
        tempButtonText,
        tempButtonAction,
        disableTempBtn,
        actionCancel,
        navigate,
        disableSaveButton,
        saveButtonAction
    };
}