import React, { useEffect, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useWidth } from "../../../common/hooks/use-width";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import * as Icons from "react-icons/fa";

interface IProps<T> {
    columns: ITableElement<T>[];
    actions?: ITableAction<T>[];
    data?: object[];
}

const TableExpansibleComponent = ({ columns, actions, data }: IProps<any>): React.JSX.Element => {
    const { width } = useWidth();
    const widthColumns = width / ((columns.length + 1) * 2);
    const [expandedRows, setExpandedRows] = useState(null);
    const [expandedRowsMobile, setExpandedRowsMobile] = useState({});
    const allowExpansion = (rowData) => {
        return rowData.childrens?.length > 0;
    };
    const rowExpansionTemplate = (data) => {
        const rows = data.childrens;
        return (
            <table className="p-datatable-table">
                {rows.map((item) => {
                    return (
                        <tr key={item} style={{ background: "transparent" }}>
                            <td style={{ maxWidth: `50px`, minHeight: `50px`, width: `50px` }}></td>
                            {columns.map((column) => {
                                const properties = column.fieldName.split(".");
                                let field = properties.length === 2 ? item[properties[0]][properties[1]] : item[properties[0]];
                                return (
                                    <td key={item} style={{ maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}>
                                        {" "}
                                        {column.renderCell
                                            ? column.renderCell(item)
                                            : field}{" "}
                                    </td>
                                );
                            })}
                            {actions && (
                                <td className="spc-table-actions" style={{ maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}>
                                    <ActionComponent row={item} actions={actions} />
                                </td>
                            )}
                        </tr>
                    )
                })}

            </table>
        );
    };
    const getExpansible = (item) => {
        if (expandedRowsMobile[`${item.consecutive}`]) {
            return (
                <div onClick={() => {
                    let _expandedRowsMobile = {};
                    (_expandedRowsMobile[`${item.consecutive}`] = false);
                    setExpandedRowsMobile({ ...expandedRowsMobile, ..._expandedRowsMobile });
                }}>
                    <Icons.FaChevronDown />
                </div>
            )
        }
        return (
            <div onClick={() => {
                let _expandedRowsMobile = {};
                (_expandedRowsMobile[`${item.consecutive}`] = true);
                setExpandedRowsMobile({ ...expandedRowsMobile, ..._expandedRowsMobile });
            }}>
                <Icons.FaChevronRight />
            </div>
        )
    }
    const mobilTemplate = (item) => {
        const childrens = item.childrens;
        return (
            <>
                <div className="card-grid-item">
                    <div className="card-header">
                        {!item.childrens ? <></> :
                            getExpansible(item)
                        }
                        {columns.map((column) => {
                            const properties = column.fieldName.split(".");
                            let field = properties.length === 2 ? item[properties[0]][properties[1]] : item[properties[0]];
                            return (
                                <div key={item} className="item-value-container">
                                    <p className="text-black bold">{column.header}</p>
                                    <p>
                                        {" "}
                                        {column.renderCell
                                            ? column.renderCell(item)
                                            : field}{" "}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="card-footer">
                        {actions.map((action) => (
                            <div key={action.icon} onClick={() => action.onClick(item)}>
                                {getIconElement(action.icon, "src")}
                            </div>
                        ))}
                    </div>
                </div>
                {expandedRowsMobile[`${item.consecutive}`] && childrens ? childrens.map((children) => {
                    return (
                        <div className="card-grid-item" key={children}>
                            <div className="card-header">
                                {columns.map((column) => {
                                    const properties = column.fieldName.split(".");
                                    let field = properties.length === 2 ? children[properties[0]][properties[1]] : children[properties[0]];
                                    return (
                                        <div key={children} className="item-value-container">
                                            <p className="text-black bold">{column.header}</p>
                                            <p>
                                                {" "}
                                                {column.renderCell
                                                    ? column.renderCell(children)
                                                    : field}{" "}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="card-footer">
                                {actions.map((action) => (
                                    <div key={action.icon} onClick={() => action.onClick(item)}>
                                        {getIconElement(action.icon, "src")}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }) : <></>}
            </>
        );
    };
    return (
        <div className="spc-common-table expansible card-form">
            {width > 830 ? (
                <DataTable
                    value={data}
                    expandedRows={expandedRows}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="id"
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    scrollable={true}
                >
                    <Column expander={allowExpansion} style={{ maxWidth: `50px`, minHeight: `50px`, width: `50px` }} />
                    {columns.map((col) => (
                        <Column
                            key={col.fieldName}
                            field={col.fieldName}
                            header={col.header}
                            body={col.renderCell}
                            sortable={col.sortable}
                            style={{ maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                        />
                    ))}

                    {actions && (
                        <Column style={{ maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                            className="spc-table-actions"
                            header={
                                <div>
                                    <div className="spc-header-title">Acciones</div>
                                </div>
                            }
                            body={(row) => <ActionComponent row={row} actions={actions} />}
                        />
                    )}
                </DataTable>
            ) : (
                <DataView
                    value={data}
                    itemTemplate={mobilTemplate}
                    emptyMessage={""}
                />
            )}
        </div>
    )
}

const ActionComponent = (props: {
    row: any;
    actions: ITableAction<any>[];
}): React.JSX.Element => {
    return (
        <div className="spc-table-action-button">
            {props.actions.map((action) => (
                <div key={action.icon} onClick={() => action.onClick(props.row)}>
                    {getIconElement(action.icon, "src")}
                </div>
            ))}
        </div>
    );
};

// Metodo que retorna el icono o nombre de la accion
function getIconElement(icon: string, element: "name" | "src") {
    switch (icon) {
        case "Detail":
            return element == "name" ? (
                "Detalle"
            ) : (
                <Icons.FaEye className="button grid-button button-detail" />
            );
        case "Edit":
            return element == "name" ? (
                "Editar"
            ) : (
                <Icons.FaPencilAlt className="button grid-button button-edit" />
            );
        case "Delete":
            return element == "name" ? (
                "Eliminar"
            ) : (
                <Icons.FaTrashAlt className="button grid-button button-delete" />
            );
        case "Link":
            return element == "name" ? (
                "Vincular"
            ) : (
                <Icons.FaLink className="button grid-button button-link" />
            );
        default:
            return "";
    }
}

export default React.memo(TableExpansibleComponent);