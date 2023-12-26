import React from "react";

interface IAntiCorruptionExpansibleTableProps {
    index: any;
    onDelete: () => void;
}

const AntiCorruptionExpansibleTable = ({ index, onDelete }: IAntiCorruptionExpansibleTableProps) => {
    return (
        <tr>
            <td>No. Componente {index}</td>
            <td>
                <input type="text" placeholder="Descripción de componente" />
            </td>
            <td>
                <button onClick={onDelete}>
                    {/* Icono de eliminación */}
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default AntiCorruptionExpansibleTable;
