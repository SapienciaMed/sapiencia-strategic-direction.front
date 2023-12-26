import React, { useContext, useEffect, useState } from "react";
import AntiCorruptionExpansibleTable from "../../anticorruption-plan/components/anticorruption-table-expansible.component";
import { AppContext } from "../../../common/contexts/app.context";
import { SelectComponent } from "../../../common/components/Form";
import { useAntiCorruptionPlanData } from "../../anticorruption-plan/hooks/anti-corruption-plan.hook";

const FormulationPAAC = () => {
    const { navigate,
            control, 
            statusData,
            yearsArray,
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

    return (
        <div>
            <h2>Formular Plan Anticorrupción y Atención al Ciudadano (PAAC)</h2>
            <section>
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
            <section>
                <h3>Componentes</h3>
                <button onClick={handleAddComponent}>
                    Agregar componente
                </button>
                <table>
                    <thead>
                        <tr>
                            <th>No. Componente</th>
                            <th>Descripción de componente</th>
                            <th>Acciones</th>
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
            </section>
        </div>
    );
};

export default FormulationPAAC;





