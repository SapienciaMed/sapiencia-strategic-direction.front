import { Tooltip } from "primereact/tooltip";
import React, { Component, useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiTrash } from "react-icons/pi";
import { Navigate, useNavigate } from "react-router-dom";
import "../style/formulation.scss"; 

interface IAntiCorruptionExpansibleTableProps {
    id?: number;
    index: any;
    _id?: string;
    description: string,
    onDelete: () => void;
    onChange?: (component_id, value: string) => void
    handleAddActivity?: (component_id: string) => void
}

const AntiCorruptionExpansibleTable = ({ _id, index, description, onDelete, onChange, handleAddActivity }: IAntiCorruptionExpansibleTableProps) => {

    return (
        <tr>
            <td className="p-datatable-PAA stacked-table-item1">No. Componente {index}</td>
            <td className="p-datatable-PAA stacked-table-item2">
                <input onChange={(e) => onChange(_id, e.target.value)} type="text" className="input-PAA" placeholder="Escribe aquí" defaultValue={description} />
            </td>
            <td className="p-datatable-PAA stacked-table-item3">
                <div className="icon-content">
                    <><Tooltip target=".create-action" /><div
                        className="create-action"
                        data-pr-tooltip="Agregar actividad"
                        data-pr-position="bottom"
                        style={{ 'color': '#D72FD1', cursor: 'pointer' }}
                        onClick={() => handleAddActivity(_id)}
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
