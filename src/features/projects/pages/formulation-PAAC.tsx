import React, { useContext, useEffect, useState } from "react";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { ButtonComponent, SelectComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";
import "../../anticorruption-plan/style/formulation.scss";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const FormulationPAAC = () => {
    const { navigate,
        control,
        statusData,
        errors } = useAntiCorruptionPlanData();
    const [components, setComponents] = useState([]);
    const [componentCount, setComponentCount] = useState(1);
    const [deleteConfirmation, setDeleteConfirmation] = useState({});
    const { setMessage } = useContext(AppContext);

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
                    title: "Acción del PAI",
                    description: "¡Eliminada exitosamente!",
                    show: true,
                    background: true,
                    OkTitle: "Aceptar",
                    onClose: () => {
                        setMessage({});
                    },
                });

                deleteRow(idToDelete); // Llamada para eliminar el componente
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

    const Navigate = useNavigate();
    const handleClick = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion');
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
                                data={statusData}
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
                                    {components.map((component) => (
                                        <AntiCorruptionExpansibleTable
                                            key={component.id}
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
                            />
                        </div>
                        <div className="buttons-bot">
                            <span className="bold text-center button" onClick={handleClick}>
                                Cancelar
                            </span>
                            <ButtonComponent
                                className={`button-main huge hover-three button-save`}
                                value={"Guardar y regresar"}
                                type="button"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormulationPAAC;





