export interface ITableElement<T> {
  header: string | React.JSX.Element;
  fieldName: string;
  required?: boolean;
  sorteable?: boolean;
  dataList?: IListTableElement[];
  renderCell?: (row: T) => JSX.Element;
  width?: string | number;
  hideColumn?: boolean;
}

export interface IGroupTableElement<T> {
  header: string;
  fieldName: string;
  parent?: string
  required?: boolean;
  dataList?: IListTableElement[];
  renderCell?: (row: T) => JSX.Element;
  width?: string | number;
}

export interface IListTableElement {
  id: string | number;
  value: string;
}

export interface ITableAction<T> {
  icon?: "Detail" | "Edit" | "Delete" | "Link";
  onClick?: (row: T) => void;
  customName?: string;
  customIcon?: (row: T) => JSX.Element;
  hide?: boolean;
  hideRow?: (row: T) => boolean;
}
