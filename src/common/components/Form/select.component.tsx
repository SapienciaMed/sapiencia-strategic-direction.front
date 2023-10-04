import React, { useEffect, useState } from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";

import { Control, Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { IDropdownProps } from "../../interfaces/select.interface";

interface ISelectProps<T> {
  idInput: string;
  control: Control<any>;
  className?: string;
  placeholder?: string;
  data?: Array<IDropdownProps>;
  promiseData?: Promise<IDropdownProps[]>;
  label?: string | React.JSX.Element;
  classNameLabel?: string;
  direction?: EDirection;
  children?: React.JSX.Element | React.JSX.Element[];
  errors?: any;
  disabled?: boolean;
  fieldArray?: boolean;
  filter?: boolean;
  emptyMessage?: string;
  onChange?: () => void;
}

function LabelElement({ label, idInput, classNameLabel }): React.JSX.Element {
  if (!label) return <></>;
  return (
    <LabelComponent
      htmlFor={idInput}
      className={classNameLabel}
      value={label}
    />
  );
}

export function SelectComponent({
  idInput,
  control,
  className = "select-basic",
  placeholder = "Seleccione",
  data = [],
  promiseData = null,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors = {},
  disabled,
  fieldArray,
  filter,
  emptyMessage = "Sin resultados.",
  onChange = () => {}
}: ISelectProps<any>): React.JSX.Element {
  const [selectData, setSelectData] = useState<IDropdownProps[]>(null);
  useEffect(() => {
    if (data?.length > 0) {
      const seleccione: IDropdownProps = { name: placeholder, value: null };
      const dataSelect = data.find(
        (item) => item.name === seleccione.name && item.value === seleccione.value
      );
      if(!Reflect.has(data[0],"value")) {
        data = [seleccione];
      } else if (!dataSelect) data.unshift(seleccione);
      setSelectData(data)
    }
    else if (promiseData !== null) {
      promiseData.then(response => {
        const dataRes = response;
        const seleccione: IDropdownProps = { name: placeholder, value: null };
        const dataSelect = dataRes.find(
          (item) => item.name === seleccione.name && item.value === seleccione.value
        );
        if (!dataSelect) dataRes.unshift(seleccione);
        dataRes.unshift()
        setSelectData(dataRes);
      }).catch(() => { });
    } else {
      const seleccione: IDropdownProps[] = [{ name: placeholder, value: null }];
      setSelectData(seleccione);
    }
  }, [data, promiseData]);


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
      <LabelElement
        label={label}
        idInput={idInput}
        classNameLabel={classNameLabel}
      />
      <div>
        <Controller
          name={idInput}
          control={control}
          render={({ field }) => (
            <Dropdown
              id={field.name}
              value={selectData ? selectData.find((row) => row.value === field.value)?.value : null}
              onChange={(e) => {
                field.onChange(e.value);
                onChange();
              }}
              options={selectData}
              optionLabel="name"
              placeholder={placeholder}
              className={`${className} ${messageError() ? "p-invalid" : ""}`}
              disabled={disabled}
              filter={filter}
              emptyMessage={emptyMessage}
              emptyFilterMessage={emptyMessage}
              virtualScrollerOptions={{ itemSize: 38}}
            />
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
