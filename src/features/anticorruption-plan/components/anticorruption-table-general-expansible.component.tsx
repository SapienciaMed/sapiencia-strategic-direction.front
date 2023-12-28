import { Tooltip } from "primereact/tooltip";
import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiTrash } from "react-icons/pi";
import { Navigate, useNavigate } from "react-router-dom";
import "../style/formulation.scss"; 

interface IAntiCorruptionExpansibleTableProps {
    index: any;
    description: string,
}

const AntiCorruptionGeneralExpansibleTable = ({ index, description}: IAntiCorruptionExpansibleTableProps) => {

    return (
        <tr>
            <td className="p-datatable-PAA">
                <input type="text" className="input-PAA" placeholder="Escribe aquí" defaultValue={description} />
            </td>
        </tr>
    );
};

export default AntiCorruptionGeneralExpansibleTable;
