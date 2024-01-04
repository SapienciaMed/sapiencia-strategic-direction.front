import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

interface IProps {
    className?: string;
    components: React.JSX.Element[];
    orientation?: "top" | "bottom";
}

interface IRef {
    
}

const PaginatorComponent = ({ first, setFirst, totalRecords }) => {
    const rows = 1;
    function onPageChange(event: PaginatorPageChangeEvent): void {
        setFirst(event.first);
    }
    const template = {
        layout: 'PrevPageLink PageLinks NextPageLink',
    };
    return <Paginator template={template} first={first} rows={rows} totalRecords={totalRecords} onPageChange={(e) => onPageChange(e)} className="justify-content-center" />
}

const ComponentPagination = forwardRef<IRef, IProps>((props, ref) => {
    const { className, components, orientation = "top"} = props;
    const [first, setFirst] = useState(0);
    return (
        <div className={className}>
            {orientation === "top" && <PaginatorComponent first={first} setFirst={setFirst} totalRecords={components.length}/>}
            {components[first]}
            {orientation === "bottom" && <PaginatorComponent first={first} setFirst={setFirst} totalRecords={components.length}/>}
        </div>
    )
});

export default ComponentPagination;