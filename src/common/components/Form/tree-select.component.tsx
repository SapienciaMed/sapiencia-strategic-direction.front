import React, { useEffect, useState } from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";

import { Control, Controller } from "react-hook-form";
import { TreeSelect } from "primereact/treeselect";
import { IDropdownProps } from "../../interfaces/select.interface";
import { TreeNode } from "primereact/treenode";

interface ISelectProps<T> {
  idInput: string;
  control: Control<any>;
  className?: string;
  placeholder?: string;
  data?: TreeNode[];
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
  value?: any;
  onChange?: () => void;
  style?: any;
  labelStyle?: React.CSSProperties;
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

export function TreeSelectComponent({
  idInput,
  control,
  className = "select-basic",
  placeholder = "Seleccione",
  data = [],
  value,
  label,
  classNameLabel = "text-main",
  direction = EDirection.column,
  children,
  errors = {},
  disabled,
  fieldArray,
  filter,
  emptyMessage = "Sin resultados.",
  onChange = () => { }
}: Readonly<ISelectProps<any>>): React.JSX.Element {
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
            <TreeSelect
              id={field.name}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.value);
                onChange();
              }}
              options={data}
              placeholder={placeholder}
              className={`${className} ${messageError() ? "p-invalid" : ""}`}
              disabled={disabled}
              filter={filter}
              emptyMessage={emptyMessage}
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
