import React, { useEffect, useState } from "react";
import { ITableAction, ITableElement } from "../../../common/interfaces/table.interfaces";
import { useWidth } from "../../../common/hooks/use-width";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import { IDisaggregate, IIndicatorsPAITemp } from "../interfaces/IndicatorsPAIInterfaces";
import { ActionComponent, getIconElement } from "../../projects/components/table-expansible.component";
import { Control, Controller, FieldErrors, UseFieldArrayRemove, UseFormRegister } from "react-hook-form";
import { AiOutlinePlusCircle } from "react-icons/ai";
import useIndicatorsPai from "../hooks/indicators-pai.hook";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";
import { InputInplaceComponent } from "../../../common/components/Form";
import { IAddAction } from "../interfaces/PAIInterfaces";
interface IProps<T> {
    indexDisaggregate?: number;
    actionId: number;
    horizontalScroll?: boolean
    widthTable?: string;
    controlIndicatorsPai: Control<IIndicatorsPAITemp, any>,
    errors: FieldErrors<IIndicatorsPAITemp>,
    register: UseFormRegister<IIndicatorsPAITemp>,
    sumOfPercentage: number,
    removeDisaggregate: Function,
    onAddDisaggregate: Function,
    onChangeDisaggregate: Function,
    tableData: IDisaggregate[],
    showDissagregate: number,
}

const TableDisaggregate = ({ actionId, sumOfPercentage, showDissagregate, controlIndicatorsPai, errors, register, removeDisaggregate, onAddDisaggregate, onChangeDisaggregate, indexDisaggregate, tableData, widthTable, horizontalScroll = false }: IProps<any>): React.JSX.Element => {
    
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const { width } = useWidth();
    const [ footer, setFooter ] = useState<string>("Total: 0%");
    
    useEffect(()=>{
        if(tableData.length === 0) setFooter(`Total: 0 %`);
    },[tableData])
    
    useEffect(()=>{
        setFooter(`Total: ${sumOfPercentage} %`)
    },[sumOfPercentage])

    const disaggregateColumns: ITableElement<IDisaggregate>[] = [
        {
            fieldName: "percentage",
            header: "Porcentaje",
            renderCell: (row) => {
                return (
                    <InputNumberComponent
                        idInput={`bimesters.${row.indexBimester}.disaggregate.${row.index}.percentage`}
                        control={controlIndicatorsPai}
                        errors={errors}
                        classNameLabel="text-black biggest bold text-required"
                        className={`inputNumber-basic`}
                        onChange={() => onChangeDisaggregate(row.indexBimester,row.index)}
                        useGrouping={false}
                        suffix="%"
                    />
                )
            }
        },
        {
            fieldName: "description",
            header: "Descripción",
            renderCell: (row) => {
                return (
                    <Controller
                        control={controlIndicatorsPai}
                        name={`bimesters.${row.indexBimester}.disaggregate.${row.index}.description`}
                        defaultValue={""}
                        render={({ field }) => {
                            return (
                                <InputInplaceComponent
                                    id={field.name}
                                    idInput={field.name}
                                    value={`${field.value}`}
                                    label=""
                                    className="input-basic"
                                    typeInput={"text"}
                                    register={register}
                                    onChange={field.onChange}
                                    errors={errors}
                                />
                            );
                        }}
                    />
                )
            }
        },
    ];

    const actions: ITableAction<IDisaggregate>[] = [
        {
          icon: "Delete",
          onClick: (row) => {
            removeDisaggregate(row.indexBimester,row.index)
          },
        },
    ];

    const widthColumns = width / ((disaggregateColumns.length + 1) * 2);

    if(showDissagregate === 0) return (<></>);
    
    const mobilTemplate = (item) => {
        const childrens = item.childrens;
        const actionsMob = actions?.filter(action => {
            return action.hideRow ? !action.hideRow(item) : true;
        });
        return (
            <>
                <div className="card-grid-item">
                    <div className="card-header">
                        {disaggregateColumns.map((column) => {
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
            </>
        );
    };

    return (
        <div key={indexDisaggregate}>
            <div className="disaggregate-container">
                <div className="title-area" style={{marginBottom: "-25px", marginTop: "15px"}}>
                    <label></label>
                    <div>
                        <div className="title-button text-main large" onClick={()=>{
                            onAddDisaggregate(indexDisaggregate);
                        }}>
                            Agregar porcentaje <AiOutlinePlusCircle />
                        </div>
                    </div>
                </div>
            </div>
            <div className="spc-common-table expansible card-table">
            {width > 830 ? (
                    <DataTable
                        value={[...tableData].slice(perPage * page, (perPage * page) + perPage)}
                        dataKey="consecutive"
                        className="footer-disaggregate"
                        scrollable={true}
                        emptyMessage={" "}
                        footer={footer}
                        style={{ maxWidth: widthTable }}
                    >
                        {disaggregateColumns.map((col) => (
                            <Column
                                key={col.fieldName}
                                field={col.fieldName}
                                header={col.header}
                                body={col.renderCell}
                                sortable={col.sorteable}
                                style={horizontalScroll ? {} : { maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                            />
                        ))}

                        { 
                            <Column
                                style={horizontalScroll ? {} : { maxWidth: `${widthColumns}px`, minHeight: `${widthColumns}px`, width: `${widthColumns}px` }}
                                className="spc-table-actions"
                                header={
                                    <div>
                                        <div className="spc-header-title">Acciones</div>
                                    </div>
                                }
                                body={(row) => 
                                <div
                                    style={{ display: "block" }}
                                    onClick={() => { removeDisaggregate(row.indexBimester,row.index)}}
                                >
                                    { getIconElement("Delete", "src") }
                                </div>
                            }
                        />  
                        }
                    </DataTable>
                ) : (
                    <DataView
                        value={[...tableData].slice(perPage * page, (perPage * page) + perPage)}
                        itemTemplate={mobilTemplate}
                        emptyMessage={" "}
                        footer={footer}
                    />
                )}
            </div>
        </div>
    )
}

export default React.memo(TableDisaggregate);