import React, { useState } from "react";
import { EDirection } from "../../constants/input.enum";

import { Control, Controller } from "react-hook-form";
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputNumber } from "primereact/inputnumber";

interface IInputNumberInplace {
  idInput: string;
  control: Control<any>;
  className?: string;
  placeholder?: string;
  label?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: any;
  disabled?: boolean;
  fieldArray?: boolean;
  mode?: "decimal" | "currency";
  minFractionDigits?: number;
  maxFractionDigits?: number;
  prefix?: string;
  suffix?: string;
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  useGrouping?: boolean;
  optionsRegister?: {};
  shouldUnregister?: boolean;
}

export function InputNumberInplaceComponent({
  idInput,
  control,
  className = "select-basic",
  placeholder = "0",
  label,
  direction = EDirection.column,
  children,
  errors = {},
  disabled,
  fieldArray,
  mode,
  minFractionDigits,
  maxFractionDigits,
  prefix,
  suffix,
  currency,
  locale,
  min,
  max,
  useGrouping = true,
  optionsRegister,
  shouldUnregister,
}: IInputNumberInplace): React.JSX.Element {
  const [active, setActive] = useState(null);
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
  const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  })
  return (
    <div
      className={
        messageError() ? `${direction} container-icon_error` : direction
      }
    >
      <div>
        <Controller
          name={idInput}
          control={control}
          rules={optionsRegister}
          shouldUnregister={shouldUnregister}
          render={({ field }) => (
            <Inplace active={active} onToggle={() => setActive(!active)}>
              <InplaceDisplay><span>{formatterPeso.format(field.value) ?? label}</span></InplaceDisplay>
              <InplaceContent>
                <InputNumber
                  id={field.name}
                  onChange={(e) => field.onChange(e.value)}
                  onBlur={(e) => {
                    setActive(false);
                    field.onBlur()
                  }}
                  placeholder={placeholder}
                  value={field.value}
                  className={`${className} ${messageError() ? "p-invalid" : ""}`}
                  disabled={disabled}
                  mode={mode}
                  minFractionDigits={minFractionDigits}
                  maxFractionDigits={maxFractionDigits}
                  prefix={prefix}
                  suffix={suffix}
                  currency={currency}
                  locale={locale}
                  min={min}
                  max={max}
                  useGrouping={useGrouping}
                  autoFocus
                />
              </InplaceContent>
            </Inplace>
          )}
        />
        {messageError() && <span className="icon-error"></span>}
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
