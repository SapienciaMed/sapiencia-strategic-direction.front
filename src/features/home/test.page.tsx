import React from "react";
import { IGroupTableElement } from "../../common/interfaces/table.interfaces";
import TableTestComponent from "./tabla.component";

function TestPage(): React.JSX.Element {
    const columnas: IGroupTableElement<any>[] = [
        {
            fieldName: "customer.id",
            header: "Customer ID",
        },
        {
            fieldName: "customer.name",
            header: "Customer",
        },
        {
            fieldName: "customer.age",
            header: "Customer",
        },
        {
            fieldName: "objetive",
            parent: "prueba1",
            header: "Objetivo",
        },
        {
            fieldName: "interventionActions",
            parent: "prueba1",
            header: "Acciones de intervención",
        },
        {
            fieldName: "estatesService",
            parent: "prueba2",
            header: "Bienes/Servicios",
        },
        {
            fieldName: "quantification",
            parent: "prueba2",
            header: "Cuantificación",
        },
    ];
    const data = [
        {
            objetive: "objetivo1",
            interventionActions: "testing",
            estatesService: "ipsum",
            quantification: 7,
            customer: {
                id: 1,
                name: "Customer1",
                age: 30
            }
        },
        {
            objetive: "objetivo2",
            interventionActions: "lorem",
            estatesService: "asbbbbb",
            quantification: 4,
            customer: {
                id: 1,
                name: "Customer1",
                age: 30
            }
        },
        {
            objetive: "objetivo3",
            interventionActions: "prueba",
            estatesService: "darem",
            quantification: 14,
            customer: {
                id: 2,
                name: "Customer2",
                age: 40
            }
        },
        {
            objetive: "objetivo4",
            interventionActions: "test",
            estatesService: "obj",
            quantification: 5,
            customer: {
                id: 2,
                name: "Customer2",
                age: 40
            }
        },
    ]
    return <div className="main-page">
        <TableTestComponent columns={columnas} data={data} groupRowsBy="customer.id"/>
    </div>;
}

export default React.memo(TestPage);