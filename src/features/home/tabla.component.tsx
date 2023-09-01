import { DataTable } from "primereact/datatable";
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { IGroupTableElement, ITableAction } from "../../common/interfaces/table.interfaces";
import { useWidth } from "../../common/hooks/use-width";
import React from "react";

interface IProps<T> {
    columns: IGroupTableElement<T>[];
    actions?: ITableAction<T>[];
    data?: object[];
    groupRowsBy: string;
}

const TableTestComponent = ({ columns, actions, data, groupRowsBy }: IProps<any>): React.JSX.Element => {
    const { width } = useWidth();
    const widthColumns = width / ((columns.length + 1) * 2);
    const parentHeaders = columns.filter(column => column.parent).map(column => column.parent).filter((column, index, self) => {
        return self.indexOf(column) === index;
    });
    const headerGroup = (
        <ColumnGroup>
            <Row>
                {columns.filter(column => !column.parent).map(column => {
                    return (
                        <Column header={column.header} rowSpan={2} key={column.header} />
                    )
                })}
                {parentHeaders.map(parent => {
                    return (
                        <Column header={parent} colSpan={columns.filter(column => column.parent === parent).length} key={parent} />
                    )
                })}
            </Row>
            <Row>
                {columns.filter(column => column.parent).map(col => {
                    return (
                        <Column
                            key={col.fieldName}
                            field={col.fieldName}
                            header={col.header}
                        />
                    )
                })}
            </Row>
        </ColumnGroup>
    );
    return (
        <div className="spc-common-table expansible card-table">
            <DataTable
                value={data}
                scrollable={true}
                emptyMessage={" "}
                headerColumnGroup={headerGroup}
                rowGroupMode="rowspan" 
                groupRowsBy={groupRowsBy}
                sortMode="multiple"
            >
                {columns.map((col) => (
                    <Column
                        key={col.fieldName}
                        field={col.fieldName}
                        body={col.renderCell}
                        style={{ maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                    />
                ))}
            </DataTable>
        </div>
    )
}

export default React.memo(TableTestComponent);