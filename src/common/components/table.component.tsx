import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from "react";
import { ITableAction, ITableElement } from "../interfaces/table.interfaces";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { DataView } from "primereact/dataview";
import {
  Paginator,
  PaginatorCurrentPageReportOptions,
  PaginatorNextPageLinkOptions,
  PaginatorPageChangeEvent,
  PaginatorPageLinksOptions,
  PaginatorPrevPageLinkOptions,
  PaginatorRowsPerPageDropdownOptions,
  PaginatorTemplateOptions,
} from "primereact/paginator";
import { IPagingData } from "../utils/api-response";
import useCrudService from "../hooks/crud-service.hook";
import { EResponseCodes } from "../constants/api.enum";
import { classNames } from "primereact/utils";
import { FaLink } from "react-icons/fa";
import { RiPencilLine } from "react-icons/ri";
import { PiTrash } from "react-icons/pi";
import { Dropdown } from "primereact/dropdown";
import { useWidth } from "../hooks/use-width";
import { AppContext } from "../contexts/app.context";
import { AiOutlineEye } from "react-icons/ai";

interface IProps<T> {
  url?: string;
  emptyMessage?: string;
  title?: string;
  columns: ITableElement<T>[];
  actions?: ITableAction<T>[];
  isShowModal: boolean;
  titleMessageModalNoResult?: string;
  descriptionModalNoResult?: string;
  data?: T[];
  hideActions?: boolean;
}

interface IRef {
  loadData: (newSearchCriteria?: object) => void;
}

const TableComponent = forwardRef<IRef, IProps<any>>((props, ref) => {
  const {
    title = "Resultados de búsqueda",
    columns,
    actions,
    url,
    titleMessageModalNoResult,
    isShowModal,
    emptyMessage = "No hay resultados.",
    descriptionModalNoResult = "No hay resultado para la búsqueda",
    data = [],
    hideActions
  } = props;

  // States
  const [charged, setCharged] = useState<boolean>(false);
  const [resultData, setResultData] = useState<IPagingData<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [perPage, setPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [first, setFirst] = useState<number>(0);
  const [searchCriteria, setSearchCriteria] = useState<object>();
  const { width } = useWidth();
  const { setMessage } = useContext(AppContext);

  // Declaraciones
  const { post } = useCrudService(url);
  useImperativeHandle(ref, () => ({
    loadData: loadData,
  }));

  // Metodo que hace la peticion para realizar la carga de datos
  async function loadData(
    newSearchCriteria?: object,
    currentPage?: number
  ): Promise<void> {
    setLoading(true);
    if (newSearchCriteria) {
      setSearchCriteria(newSearchCriteria);
    }
    const body = newSearchCriteria || searchCriteria || {};
    if(url) {
      const res = await post<IPagingData<any>>(url, {
        ...body,
        page: currentPage || 1,
        perPage: perPage,
      });
      if (res.operation.code === EResponseCodes.OK) {
        setResultData(res.data);
  
        if (res.data.array.length <= 0 && isShowModal) {
          setMessage({
            title: `${titleMessageModalNoResult || ""}`,
            show: true,
            description: descriptionModalNoResult,
            OkTitle: "Aceptar",
            background: true,
          });
        }
      } else {
        setMessage({
          title: `Error en la consulta de datos`,
          show: true,
          description: res.operation.message,
          OkTitle: "Aceptar",
          background: true,
          onOk: () => {
            setMessage({});
          },
        });
      }
    } else {
      setResultData(null);
    }
    setLoading(false);
  }

  // Metodo que alamacena el el estado del paginador
  function onPageChange(event: PaginatorPageChangeEvent): void {
    setPerPage(event.rows);
    setFirst(event.first);
    setPage(event.page);
  }

  useEffect(() => {
    if (charged) loadData(undefined, page + 1);
  }, [perPage, first, page]);

  useEffect(() => {
    setCharged(true);

    return () => {
      setCharged(false);
    };
  }, []);

  const mobilTemplate = (item) => {
    const actionsMob = props.actions?.filter(action => {
      return action.hideRow ? !action.hideRow(item) : true;
    }) || [];
    return (
      <div className="card-grid-item">
        <div className="card-header">
          {columns.map((column) => {
            const properties = column.fieldName.split(".");
            let field =
              properties.length === 2
                ? item[properties[0]][properties[1]]
                : item[properties[0]];
            return (
              <div key={item} className="item-value-container">
                <p className="text-black bold">{column.header}</p>
                <p> {column.renderCell ? column.renderCell(item) : field} </p>
              </div>
            );
          })}
        </div>
        <div className="card-footer-strategic-direction">
          {actionsMob.map((action, index) => {
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
    );
  };

  useImperativeHandle(ref, () => ({
    loadData: loadData,
    emptyData: EmptyData,
  }));

  async function EmptyData(): Promise<void> {
    setLoading(true);
    setResultData({ array: [], meta: { total: 0 } });
    setLoading(false);
  }

  return (
    <div className="spc-common-table expansible">
      <Paginator
        className="between spc-table-paginator"
        template={paginatorHeader}
        first={first}
        rows={perPage}
        totalRecords={resultData?.meta?.total || data?.length ||0}
        onPageChange={onPageChange}
        leftContent={leftContent(title)}
      />

      {width > 830 ? (
        <DataTable
          className="spc-table full-height"
          value={resultData?.array || [...data].slice(perPage * page, (perPage * page) + perPage) || []}
          loading={loading}
          scrollable={true}
          emptyMessage={emptyMessage}
        >
          {columns.map((col) => (
            <Column
              key={col.fieldName}
              field={col.fieldName}
              header={col.header}
              body={col.renderCell}
              sortable={col.sorteable}
            />
          ))}

          {actions && !hideActions && (
            <Column
              className="spc-table-actions"
              header={
                <div>
                  <div className="spc-header-title">Acciones</div>
                </div>
              }
              body={(row) => <ActionComponent row={row} actions={actions} />}
            />
          )}
        </DataTable>
      ) : (
        <DataView
          value={resultData?.array || [...data].slice(perPage * page, (perPage * page) + perPage) || []}
          itemTemplate={mobilTemplate}
          rows={5}
          emptyMessage={emptyMessage}
        />
      )}
      <Paginator
        className="spc-table-paginator"
        template={paginatorFooter}
        first={first}
        rows={perPage}
        totalRecords={resultData?.meta?.total || data?.length || 0}
        onPageChange={onPageChange}
      />
    </div>
  );
});

// Metodo que retorna el icono o nombre de la accion
function getIconElement(icon: string, element: "name" | "src") {
  switch (icon) {
    case "Detail":
      return element == "name" ? (
        "Detalle"
      ) : (
        <AiOutlineEye className="button grid-button button-detail" />
      );
    case "Edit":
      return element == "name" ? (
        "Editar"
      ) : (
        <RiPencilLine className="button grid-button button-edit" />
      );
    case "Delete":
      return element == "name" ? (
        "Eliminar"
      ) : (
        <PiTrash className="button grid-button button-delete" />
      );
    case "Link":
      return element == "name" ? (
        "Vincular"
      ) : (
        <FaLink className="button grid-button button-link" />
      );
    default:
      return "";
  }
}

const leftContent = (title) => {
  return (
    <p className="header-information text-black bold biggest">
      {title}
    </p>
  )
};

const paginatorHeader: PaginatorTemplateOptions = {
  layout: "CurrentPageReport RowsPerPageDropdown",
  CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
    return (
      <>
        <p className="header-information text-black bold big">
          Total de resultados
        </p>
        <p className="header-information text-three bold big">
          {options.totalRecords}
        </p>
      </>
    );
  },
  RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
    const dropdownOptions = [
      { label: 10, value: 10 },
      { label: 30, value: 30 },
      { label: 50, value: 50 },
      { label: 100, value: 100 },
    ];

    return (
      <React.Fragment>
        <p className="header-information text-black bold big">
          Registros por página{" "}
        </p>
        <Dropdown
          value={options.value}
          className="header-information"
          options={dropdownOptions}
          onChange={options.onChange}
        />
      </React.Fragment>
    );
  },
};

const paginatorFooter: PaginatorTemplateOptions = {
  layout: "PrevPageLink PageLinks NextPageLink",
  PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
    return (
      <button
        type="button"
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="p-3 table-previus"></span>
      </button>
    );
  },
  NextPageLink: (options: PaginatorNextPageLinkOptions) => {
    return (
      <button
        type="button"
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className="p-3 table-next"></span>
      </button>
    );
  },
  PageLinks: (options: PaginatorPageLinksOptions) => {
    if (
      (options.view.startPage === options.page &&
        options.view.startPage !== 0) ||
      (options.view.endPage === options.page &&
        options.page + 1 !== options.totalPages)
    ) {
      const className = classNames(options.className, { "p-disabled": true });

      return (
        <span className={className} style={{ userSelect: "none" }}>
          ...
        </span>
      );
    }

    return (
      <button
        type="button"
        className={options.className}
        onClick={options.onClick}
      >
        {options.page + 1}
      </button>
    );
  },
};

// Metodo que genera el elemento del icono
const ActionComponent = (props: {
  row: any;
  actions: ITableAction<any>[];
}): React.JSX.Element => {
  const actions = props.actions.filter(action => {
    return action.hideRow ? !action.hideRow(props.row) : true;
  });
  return (
    <div className="spc-table-action-button">
      {actions.map((action, index) => {
        if (!action) return;
        return (
          <div
            style={{ display: action.hide ? "none" : "block" }}
            key={index}
            onClick={() => action.onClick(props.row)}
          >
            {action.customIcon ? (
              <div className="button grid-button button-link">
                {action.customIcon(props.row)}
              </div>
            ) : (
              getIconElement(action.icon, "src")
            )}
          </div>
        )
      })}
    </div>
  );
};

export default React.memo(TableComponent);
