import { useRef } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";

export default function useAttachmentsData(idProject: string) {
    const tableComponentRef = useRef(null);
    const tableColumns: ITableElement<any>[] = [

    ];
    const tableActions: ITableAction<any>[] = [
        
    ];
    return { tableComponentRef, tableColumns, tableActions };
}