import { Tooltip } from "primereact/tooltip";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiTrash } from "react-icons/pi";
import { Navigate, useNavigate } from "react-router-dom";
import "../style/formulation.scss"; 

interface IAntiCorruptionExpansibleTableProps {
    index: any;
    description: string,
    onDelete: () => void;
}

const AntiCorruptionGeneralExpansibleTable = ({ index, description, onDelete }: IAntiCorruptionExpansibleTableProps) => {

    return (
        <tr>
            <td className="p-datatable-PAA">No. Componente {index}</td>
            <td className="p-datatable-PAA">
                <input type="text" className="input-PAA" placeholder="Escribe aquí" defaultValue={description} />
            </td>
            <td className="p-datatable-PAA">
                <div className="icon-content">
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

export default AntiCorruptionGeneralExpansibleTable;
