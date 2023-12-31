import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { AppContext } from "../../../common/contexts/app.context";
import { ButtonComponent, SelectComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import "../../anticorruption-plan/style/formulation.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";

const FormulationPAACEdition = () => {
    const { navigate,
        control,
        statusData,
        yearsArray,
        antiCorruptionPlan,
        getAllByPlanId,
        deleteAllByIds,
        store,
        id,
        errors } = useAntiCorruptionPlanData();
    const [components, setComponents] = useState([]);
    const [componentCount, setComponentCount] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState({});
    const [deletedComponents, setDeletedComponents] = useState<string[]>([])
    const { setMessage } = useContext(AppContext);

    useBreadCrumb({
        isPrimaryPage: true,
        name: "Editar plan anticorrupción y atención al ciudadano",
        url: "/direccion-estrategica/Editar/",
    });

    const handleAddComponent = () => {
        const newComponent = {
            id: componentCount,
            index: componentCount,
        };

        setComponents((prevComponents) => [...prevComponents, newComponent]);
        setComponentCount((prevCount) => prevCount + 1);
    };

    const handleDeleteComponent = (idToDelete) => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Deseas eliminar la acción y la información que contiene? No se podrá recuperar",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            },
            show: true,
            title: "¿Eliminar acción?",
            onOk: () => {
                setMessage({
                    title: "Componente del PAAC",
                    description: "¡Eliminado exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onClose: () => {
                        setMessage({});
                    },
                });

                deletedComponents.push(idToDelete)
                setDeletedComponents(deletedComponents);
                deleteRow(idToDelete);
            },
        });
    };


    const deleteRow = (idToDelete) => {
        setComponents((prevComponents) =>
            prevComponents.filter(
                (component) => component.id !== idToDelete
            )
        );
    };

    useEffect(() => {
        if (components.length === 0) {
            setComponentCount(1);
        }
    }, [components]);

    
    const handleClick = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion');
    };

    useEffect(() => {
        getAllByPlanId(id).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log('response.data', response.data)
                setComponents([...components, ...response.data]);
            } else {
                console.log(response.operation.message);
            }
        });
    }, [id]);

    const onSave = () => {
        store({ components, planId: Number(id)}).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log('response.data', response.data)
            } else {
                console.log(response.operation.message);
            }
        });

        deleteAllByIds(deletedComponents).then(response => {
            if (response.operation.code === EResponseCodes.OK) {
                console.log('response.data', response.data)
            } else {
                console.log(response.operation.message);
            }
        });
    }

    const handleCancel = () => {
        setMessage({
            background: true,
            cancelTitle: "Cancelar",
            description: "¿Estás seguro de cancelar? No se guardarán los datos.",
            OkTitle: "Aceptar",
            onCancel: () => {
                setMessage({});
            },
            onClose: () => {
                setMessage({});
            },
            show: true,
            title: "Cancelar acción",
            onOk: () => {
                setMessage({});
                handleClick();
            },
        });
    };

    return (
        <>
            <div className="main-page">
                <div className="card-table">
                    <h2>Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)</h2>
                    <div className="card-table">
                        <section className="select_PAAC">
                            <SelectComponent
                                control={control}
                                idInput={"status"}
                                className={`select-basic span-width`}
                                label="Año"
                                classNameLabel="text-black biggest bold"
                                data={yearsArray}
                                errors={errors}
                                filter={true}
                            />
                        </section>
                    </div>
                    <section className="card-table mt-15">
                        <h3>Componentes</h3>
                        <div className="text-buttom-circle" onClick={handleAddComponent}>
                            Agregar componente <AiOutlinePlusCircle />
                        </div>
                        <div className="card-table mt-15">
                            <table className="table-PAA">
                                <thead>
                                    <tr>
                                        <th className="p-datatable-thead-PAA">No. Componente</th>
                                        <th className="p-datatable-thead-PAA">Descripción de componente</th>
                                        <th className="p-datatable-thead-PAA">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {components.length > 0 && components.map((component) => (
                                        <AntiCorruptionExpansibleTable
                                            key={component.id}
                                            description={component.description}
                                            index={component.index}
                                            onDelete={() => handleDeleteComponent(component.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                    <div className="container-button-bot space-between">
                        <div>
                        <ButtonComponent
                                className={`button-main huge hover-three button-save`}
                                value={"Guardar temporalmente"}
                                type="button"
                                action={onSave}
                            />
                        </div>
                        <div className="buttons-bot">
                            <span className="bold text-center button" onClick={handleCancel}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                className={`button-main huge hover-three button-save`}
                                value={"Guardar y regresar"}
                                type="button"
                                action={() => {
                                    onSave();
                                    handleClick();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormulationPAACEdition;





