import { Tooltip } from "primereact/tooltip";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiTrash } from "react-icons/pi";
import { Navigate, useNavigate } from "react-router-dom";
import "../style/formulation.scss"; 

interface IAntiCorruptionExpansibleTableProps {
    index: any;
    onDelete: () => void;
}

const AntiCorruptionExpansibleTable = ({ index, onDelete }: IAntiCorruptionExpansibleTableProps) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/direccion-estrategica/planes/plan-anticorrupcion/formular-plan');
    };
    return (
        <tr>
            <td className="p-datatable-PAA">No. Componente {index}</td>
            <td className="p-datatable-PAA">
                <input type="text" className="input-PAA" placeholder="Escribe aquí" />
            </td>
            <td className="p-datatable-PAA">
                <div className="icon-content">
                    <><Tooltip target=".create-action" /><div
                        className="create-action"
                        data-pr-tooltip="Agregar actividad"
                        data-pr-position="bottom"
                        style={{ 'color': '#D72FD1', cursor: 'pointer' }}
                        onClick={handleClick}
                    >
                        <AiOutlinePlusCircle />
                    </div></>
                    <><Tooltip target=".delete-action" /><div
                        className="delete-action"
                        data-pr-tooltip="Eliminar Acción"
                        data-pr-position="bottom"
                        style={{ 'color': '#e53935' }}
                        onClick={onDelete}
                    >
                        <PiTrash className="button grid-button button-delete" />
                    </div></>
                </div>
            </td>
        </tr>
    );
};

export default AntiCorruptionExpansibleTable;
