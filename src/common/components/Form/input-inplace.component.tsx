import React, { useState } from "react";
import { EDirection } from "../../constants/input.enum";
import { UseFormRegister } from "react-hook-form";
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';

import { MdOutlineError } from "react-icons/md";

interface IInputProps<T> {
    idInput: string;
    typeInput: string;
    register?: UseFormRegister<T>;
    className?: string;
    placeholder?: string;
    value?: string;
    defaultValue?: string;
    label?: string;
    direction?: EDirection;
    children?: React.JSX.Element | React.JSX.Element[];
    errors?: any;
    disabled?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    id?: string;
    fieldArray?: boolean;
    optionsRegister?: {};
    max?: number;
    min?: number;
}

function InputInplaceElement({
    typeInput,
    idInput,
    className,
    placeholder,
    register,
    value,
    label,
    disabled,
    onChange,
    defaultValue,
    id,
    optionsRegister,
    max,
    min
}): React.JSX.Element {
    const [active, setActive] = useState(null);
    return (
        <Inplace active={active} onToggle={() => setActive(!active)}>
            <InplaceDisplay><span>{value === "null" || value === "undefined" ? label : value}</span></InplaceDisplay>
            <InplaceContent>
                <input
                    {...(register ? register(idInput, optionsRegister) : {})}
                    id={id}
                    name={idInput}
                    type={typeInput}
                    className={className}
                    placeholder={placeholder}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    onChange={onChange}
                    onBlur={() => setActive(false)}
                    value={value}
                    max={max}
                    min={min}
                    autoFocus 
                />
            </InplaceContent>
        </Inplace>
    );
}

export function InputInplaceComponent({
    idInput,
    typeInput,
    register,
    className = "input-basic",
    placeholder,
    value,
    label,
    direction = EDirection.column,
    children,
    errors,
    disabled,
    onChange,
    defaultValue,
    id,
    fieldArray,
    optionsRegister = {},
    max,
    min
}: Readonly<IInputProps<any>>): React.JSX.Element {
    const messageError = () => {
        const keysError = idInput.split(".");
        let errs = errors;

        if (fieldArray) {
            const errorKey = `${keysError[0]}[${keysError[1]}].${keysError[2]}`;
            return errors[errorKey]?.message;
        } else {
            for (let key of keysError) {
                errs = errs?.[key];
                if (!errs) {
                    break;
                }
            }
            return errs?.message ?? null;
        }
    };

    return (
        <div
            className={
                messageError() ? `${direction} container-icon_error` : direction
            }
        >
            <div className="flex-container-input">
                <InputInplaceElement
                    typeInput={typeInput}
                    idInput={idInput}
                    className={messageError() ? `${className} error` : className}
                    placeholder={placeholder}
                    register={register}
                    value={value}
                    disabled={disabled}
                    onChange={onChange}
                    label={label}
                    defaultValue={defaultValue}
                    id={id}
                    optionsRegister={optionsRegister}
                    max={max}
                    min={min}
                />
                {messageError() && (
                    <MdOutlineError
                        className="icon-error"
                        fontSize={"22px"}
                        color="#ff0000"
                    />
                )}
            </div>
            {messageError() && (
                <p className="error-message bold not-margin-padding">
                    {messageError()}
                </p>
            )}
            {children}
        </div>
    );
}
