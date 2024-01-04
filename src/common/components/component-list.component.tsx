import { forwardRef, useState } from "react";
import { IComponentListTemplate } from "../interfaces/global.interface";
import { useWidth } from "../hooks/use-width";
import { Dropdown } from "primereact/dropdown";

interface IProps {
    className?: string;
    title?: string;
    components: IComponentListTemplate[];
    orientation?: "left" | "right";
}

interface IRef {

}

const ComponentList = forwardRef<IRef, IProps>((props, ref) => {
    const { className, title, components, orientation = "left" } = props;
    const { width } = useWidth();
    const [step, setStep] = useState(0);
    const listNames = (
        <div className="list-actions">
            <span className="text-black large bold">{title}</span>
            <div className="list-names">
                {components.map((component, index) => {
                    return (
                        <div key={component.id} onClick={() => {
                            setStep(index);
                        }} className={`list-item ${step === index && "selected"}`}>
                            <span className="text-black biggest">{component.name}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
    const listNamesMobile = (
        <Dropdown
              id={"selectAction"}
              value={step}
              onChange={(e) => {
                setStep(e.value)
              }}
              options={components.map((component, index) => {
                return { name: component.name, value: index };
              })}
              optionLabel="name"
              placeholder={title}
              className={"select-basic span-width"}
              virtualScrollerOptions={{ itemSize: 38}}
            />
    );
    return (
        <div className={`list-components ${orientation}`}>
            {width > 830 ?
                <>
                    {orientation === "left" && listNames}
                    <div className={`list-content ${className}`}>
                        {components[step]?.content}
                    </div>
                    {orientation === "right" && listNames}
                </>
                :
                <>
                    {listNamesMobile}
                    <div className={`list-content ${className}`}>
                        {components[step]?.content}
                    </div>
                </>
            }

        </div>
    )
});

export default ComponentList;