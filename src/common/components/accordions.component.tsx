import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { IAccordionTemplate } from "../interfaces/accordions.interfaces";

interface IProps {
    data: IAccordionTemplate[]
    defaultActive?: number;
    multiple?: boolean;
}

interface IRef {
    disableAccordions: (ids: []) => void;
    enableAccordions: (ids: []) => void;
}

const AccordionsComponent = forwardRef<IRef, IProps>((props, ref) => {
    const { data, defaultActive, multiple = false } = props;
    const [ disables, setDisables ] = useState([]);

    useImperativeHandle(ref, () => ({
        disableAccordions: disableAccordions,
        enableAccordions: enableAccordions,
    }));

    function disableAccordions(ids: []) {
        setDisables(ids);
    }
    
    function enableAccordions(ids: any[]) {
        const newDisables = disables.filter((item: any) => !ids.includes(item))
        setDisables(newDisables);
    }

    return (
        <Accordion multiple={multiple} activeIndex={defaultActive || null}>
            {data.map(accordion => {
                return (
                    <AccordionTab header={accordion.name} key={accordion.id} disabled={disables.includes(accordion.id)}>
                        {accordion.content}
                    </AccordionTab>
                );
            })}
        </Accordion>)
});

export default React.memo(AccordionsComponent);