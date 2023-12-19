import { useContext } from "react";
import { PAIContext } from "../contexts/pai.context";
import { AppContext } from "../../../common/contexts/app.context";
import { useNavigate } from "react-router-dom";
import { usePaiService } from "./pai-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

export default function useCrudPAIData({ status }) {
    const {
        disableSaveButton,
        tempButtonText,
        tempButtonAction,
        saveButtonText,
        saveButtonAction,
        actionCancel,
        disableTempBtn,
        IndicatorsFormComponent,
        PAIData,
        setPAIData
    } = useContext(PAIContext);
    const { setMessage, authorization } = useContext(AppContext);
    const { CreatePAI, UpdatePAI } = usePaiService();
    const navigate = useNavigate();

    const onSubmitSave = () => {
        setMessage({
            title: "Crear plan",
            description: "¿Deseas enviar el plan de acción institucional para revisión? ",
            show: true,
            background: true,
            cancelTitle: "Cancelar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onOk: async () => {
                if (PAIData?.id) {
                    const formData = {
                        ...PAIData,
                        user: authorization.user.numberDocument,
                        status: 2,
                    };
                    const res = await UpdatePAI(PAIData.id, formData);
                    if (res.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: "Plan de acción institucional",
                            description: "¡Enviado exitosamente!",
                            show: true,
                            background: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                navigate('/direccion-estrategica/pai');
                                setMessage({});
                            }
                        })
                    } else {
                        setMessage({
                            title: "¡Ha ocurrido un error!",
                            description: <p className="text-primary biggest">{res.operation.message}</p>,
                            background: true,
                            show: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                            },
                            onClose: () => {
                                setMessage({});
                            }
                        });
                    }
                } else {
                    const formData = { ...PAIData, user: authorization.user.numberDocument, status: 2 };
                    const res = await CreatePAI(formData);
                    setPAIData(prev => {
                        return { ...prev, id: res.data.id }
                    });
                    if (res.operation.code === EResponseCodes.OK) {
                        setMessage({
                            title: " Crear plan ",
                            description: "¿Deseas enviar el plan de acción institucional para revisión? ",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            OkTitle: "Aceptar",
                            onCancel: () => {
                                setMessage({});
                            },
                            onOk: () => {
                                setMessage({
                                    title: "Plan de acción institucional",
                                    description: "¡Enviado exitosamente!",
                                    show: true,
                                    background: true,
                                    OkTitle: "Aceptar",
                                    onOk: () => {
                                        navigate('/direccion-estrategica/pai');
                                        setMessage({});
                                    }
                                })
                            }
                        });
                    } else {
                        setMessage({
                            title: "¡Ha ocurrido un error!",
                            description: <p className="text-primary biggest">{res.operation.message}</p>,
                            background: true,
                            show: true,
                            OkTitle: "Aceptar",
                            onOk: () => {
                                setMessage({});
                            },
                            onClose: () => {
                                setMessage({});
                            }
                        });
                    }
                }
            }
        });
    };

    const onSubmitTemp = async () => {
        const data = PAIData;
        if (PAIData.id) {
            const dataPai = { ...data, user: authorization.user.numberDocument, status: 1, id: Number(PAIData.id) };
            const res = await UpdatePAI(dataPai.id, dataPai);
            if (res.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado temporal realizado con éxito",
                    description: <p className="text-primary biggest">Podrás continuar la formulación del plan en cualquier momento</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else if (res.operation.message === ("Error: id.")) {
                setMessage({
                    title: "Validación ID.",
                    description: <p className="text-primary biggest">Ya existe un plan con el id ingresado, por favor verifique.</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                setMessage({
                    title: "¡Ha ocurrido un error!",
                    description: <p className="text-primary biggest">{res.operation.message}</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }
        } else {
            const dataPai = { ...data, user: authorization.user.numberDocument, status: 1 };
            const res = await CreatePAI(dataPai);
            setPAIData(prev => {
                return { ...prev, id: res.data.id }
            });
            if (res.operation.code === EResponseCodes.OK) {
                setMessage({
                    title: "Guardado temporal realizado con éxito",
                    description: <p className="text-primary biggest">Podrás continuar la formulación del plan en cualquier momento</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else if (res.operation.message === ("Error: Ya existe un plan con este id.")) {
                setMessage({
                    title: "Validación id.",
                    description: <p className="text-primary biggest">Ya existe un plan con este id , por favor verifique.</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            } else {
                setMessage({
                    title: "¡Ha ocurrido un error!",
                    description: <p className="text-primary biggest">{res.operation.message}</p>,
                    background: true,
                    show: true,
                    OkTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    },
                    onClose: () => {
                        setMessage({});
                    }
                });
            }
        }
    };

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
        saveButtonAction,
        onSubmitSave,
        onSubmitTemp
    };
}