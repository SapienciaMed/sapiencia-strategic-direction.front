import React, { useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useWidth } from "../../../common/hooks/use-width";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import { FaChevronDown, FaChevronRight, FaLink } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import { PiTrash } from "react-icons/pi";
import { Paginator, PaginatorCurrentPageReportOptions, PaginatorNextPageLinkOptions, PaginatorPageChangeEvent, PaginatorPageLinksOptions, PaginatorPrevPageLinkOptions, PaginatorRowsPerPageDropdownOptions, PaginatorTemplateOptions } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { AiOutlineEye } from "react-icons/ai";

interface IProps<T> {
    columns: ITableElement<T>[];
    actions?: ITableAction<T>[];
    data?: T[];
    widthTable?: string;
    hidePagination?: boolean;
    horizontalScroll?: boolean;
    title?: string;
    hideActions?: boolean;
}

const TableExpansibleComponent = ({ columns, actions, data, widthTable, hideActions, hidePagination = false, horizontalScroll = false, title = "" }: IProps<any>): React.JSX.Element => {
    const [first, setFirst] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const { width } = useWidth();
    const activeColumns = columns.filter( column => !column.hideColumn );
    const widthColumns = width / ((activeColumns.length + 1) * 2);
    const [expandedRows, setExpandedRows] = useState(null);
    const [expandedRowsMobile, setExpandedRowsMobile] = useState({});
    const allowExpansion = (rowData) => {
        return rowData.childrens?.length > 0;
    };
    function onPageChange(event: PaginatorPageChangeEvent): void {
        setPerPage(event.rows);
        setFirst(event.first);
        setPage(event.page);
    }
    const rowExpansionTemplate = (data) => {
        const rows = data.childrens;
        return (
            <table className="p-datatable-table">
                {rows.map((item) => {
                    return (
                        <tr key={item} style={{ background: "transparent" }}>
                            <td style={{ maxWidth: `50px`, minHeight: `50px`, width: `50px` }}></td>
                            {activeColumns.map((column) => {
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
                            { ( actions && !hideActions ) && (
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
                    <FaChevronDown />
                </div>
            )
        }
        return (
            <div onClick={() => {
                let _expandedRowsMobile = {};
                (_expandedRowsMobile[`${item.consecutive}`] = true);
                setExpandedRowsMobile({ ...expandedRowsMobile, ..._expandedRowsMobile });
            }}>
                <FaChevronRight />
            </div>
        )
    }
    const mobilTemplate = (item) => {
        const childrens = item.childrens;
        const actionsMob = actions?.filter(action => {
            return action.hideRow ? !action.hideRow(item) : true;
        });
        return (
            <>
                <div className="card-grid-item">
                    <div className="card-header">
                        {!item.childrens ? <></> :
                            getExpansible(item)
                        }
                        {activeColumns.map((column) => {
                            const properties = column.fieldName.split(".");
                            let field = properties.length === 2 ? item[properties[0]][properties[1]] : item[properties[0]];
                            return (
                                <div key={item} className="item-value-container">
                                    <p className="text-black-2 bold">{column.header}</p>
                                    <p className="auto-size-column">
                                        {" "}
                                        {column.renderCell
                                            ? column.renderCell(item)
                                            : field}{" "}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="card-footer-strategic-direction">
                        {actionsMob && actionsMob.map((action, index) => {
                            return (
                                <div key={index} onClick={() => action.onClick(item)} style={{ margin: "0px 0.3rem" }}>
                                    {action.customIcon ? (
                                        <div className="button grid-button button-link">
                                            {action.customIcon(item)}
                                        </div>
                                    ) : (
                                        getIconElement(action.icon, "src")
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
                {expandedRowsMobile[`${item.consecutive}`] && childrens ? childrens.map((children) => {
                    return (
                        <div className="card-grid-item" key={children}>
                            <div className="card-header">
                                {activeColumns.map((column) => {
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
                                {actions && actions.map((action, index) => {
                                    return (
                                        <div key={index} onClick={() => action.onClick(item)} style={{ margin: "0px 0.3rem" }}>
                                            {action.customIcon ? (
                                                <div className="button grid-button button-link">
                                                    {action.customIcon(item)}
                                                </div>
                                            ) : (
                                                getIconElement(action.icon, "src")
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                }) : <></>}
            </>
        );
    };
    let expansibleCount = 0;
    data.forEach(item => {
        if (item.childrens?.length > 0) expansibleCount++;
    })
    return (
        <div className="spc-common-table expansible card-table">
            {!hidePagination && <Paginator
                className="between spc-table-paginator"
                template={paginatorHeader}
                leftContent={width > 830 ? leftContent(title) : null}
                first={first}
                rows={perPage}
                totalRecords={data?.length || 0}
                onPageChange={onPageChange}
            />}
            {width > 830 ? (
                <DataTable
                    value={[...data].slice(perPage * page, (perPage * page) + perPage)}
                    expandedRows={expandedRows}
                    rowExpansionTemplate={rowExpansionTemplate}
                    dataKey="consecutive"
                    onRowToggle={(e) => setExpandedRows(e.data)}
                    scrollable={true}
                    style={{ maxWidth: widthTable }}
                    emptyMessage={" "}
                >
                    {expansibleCount > 0 && <Column expander={allowExpansion} style={{ maxWidth: `50px`, minHeight: `50px`, width: `50px` }} />}
                    {activeColumns.map((col) => (
                        <Column
                            key={col.fieldName}
                            field={col.fieldName}
                            header={col.header}
                            body={col.renderCell}
                            sortable={col.sorteable}
                            style={horizontalScroll ? {} : { maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                        />
                    ))}

                    { (actions && !hideActions) && (
                        <Column style={horizontalScroll ? {} : { maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
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
                    value={[...data].slice(perPage * page, (perPage * page) + perPage)}
                    itemTemplate={mobilTemplate}
                    emptyMessage={" "}
                />
            )}
            {!hidePagination && <Paginator
                className="spc-table-paginator"
                template={paginatorFooter}
                first={first}
                rows={perPage}
                totalRecords={data?.length || 0}
                onPageChange={onPageChange}
            />}
        </div>
    )
}

const leftContent = (title) => {
    return (
        <p className="header-information text-black bold biggest">
            {title}
        </p>
    )
};

const paginatorHeader: PaginatorTemplateOptions = {
    layout: "CurrentPageReport RowsPerPageDropdown",
    CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
        return (
            <div className="information">
                <p className="header-information text-black bold big">
                    Total de resultados
                </p>
                <p className="header-information text-main bold big">
                    {options.totalRecords}
                </p>
            </div>
        );
    },
    RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
        const dropdownOptions = [
            { label: 10, value: 10 },
            { label: 30, value: 30 },
            { label: 50, value: 50 },
            { label: 100, value: 100 },
        ];

        return (
            <div className="information">
                <p className="header-information text-black bold big">
                    Registros por página{" "}
                </p>
                <Dropdown
                    value={options.value}
                    className="header-information"
                    options={dropdownOptions}
                    onChange={options.onChange}
                />
            </div>
        );
    },
};

const paginatorFooter: PaginatorTemplateOptions = {
    layout: "PrevPageLink PageLinks NextPageLink",
    PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
        return (
            <button
                type="button"
                className={classNames(options.className, "border-round")}
                onClick={options.onClick}
                disabled={options.disabled}
            >
                <span className="p-3 table-previus"></span>
            </button>
        );
    },
    NextPageLink: (options: PaginatorNextPageLinkOptions) => {
        return (
            <button
                type="button"
                className={classNames(options.className, "border-round")}
                onClick={options.onClick}
                disabled={options.disabled}
            >
                <span className="p-3 table-next"></span>
            </button>
        );
    },
    PageLinks: (options: PaginatorPageLinksOptions) => {
        if (
            (options.view.startPage === options.page &&
                options.view.startPage !== 0) ||
            (options.view.endPage === options.page &&
                options.page + 1 !== options.totalPages)
        ) {
            const className = classNames(options.className, { "p-disabled": true });

            return (
                <span className={className} style={{ userSelect: "none" }}>
                    ...
                </span>
            );
        }

        return (
            <button
                type="button"
                className={options.className}
                onClick={options.onClick}
            >
                {options.page + 1}
            </button>
        );
    },
};

export const ActionComponent = (props: {
    row: any;
    actions: ITableAction<any>[];
}): React.JSX.Element => {
    const actions = props.actions.filter(action => {
        return action.hideRow ? !action.hideRow(props.row) : true;
    });
    return (
        <div className="spc-table-action-button">
            {actions.map((action, index) => {
                if (!action) return;
                return (
                    <div
                        style={{ display: action.hide ? "none" : "block" }}
                        key={index}
                        onClick={() => action.onClick(props.row)}
                    >
                        {action.customIcon ? (
                            <div className="button grid-button button-link">
                                {action.customIcon(props.row)}
                            </div>
                        ) : (
                            getIconElement(action.icon, "src")
                        )}
                    </div>
                )
            })}
        </div>
    );
};

// Metodo que retorna el icono o nombre de la accion
export function getIconElement(icon: string, element: "name" | "src") {
    switch (icon) {
        case "Detail":
            return element == "name" ? (
                "Detalle"
            ) : (
                <AiOutlineEye className="button grid-button button-detail" />
            );
        case "Edit":
            return element == "name" ? (
                "Editar"
            ) : (
                <RiPencilLine className="button grid-button button-edit" />
            );
        case "Delete":
            return element == "name" ? (
                "Eliminar"
            ) : (
                <PiTrash className="button grid-button button-delete" />
            );
        case "Link":
            return element == "name" ? (
                "Vincular"
            ) : (
                <FaLink className="button grid-button button-link" />
            );
        default:
            return "";
    }
}

export default React.memo(TableExpansibleComponent);