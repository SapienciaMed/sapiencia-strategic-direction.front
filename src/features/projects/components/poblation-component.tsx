import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import {
  poblationValidator
} from "../../../common/schemas";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import {
  FormComponent,
  InputComponent,
  SelectComponent,
  TextAreaComponent,
} from "../../../common/components/Form";
import {
} from "../../../common/interfaces/table.interfaces";
import {
  IPoblationForm
} from "../interfaces/ProjectsInterfaces";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IDropdownProps } from "../../../common/interfaces/select.interface";
import { ProjectsContext } from "../contexts/projects.context";
import { useGenericListService } from "../../../common/hooks/generic-list-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";
import { FaTrashAlt } from "react-icons/fa";
import { IGenericList } from "../../../common/interfaces/global.interface";
import { ApiResponse } from "../../../common/utils/api-response";
import { AppContext } from "../../../common/contexts/app.context";
import { InputNumberComponent } from "../../../common/components/Form/input-number.component";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function PoblationComponent({
  disableNext,
  enableNext
}: Readonly<IProps>): React.JSX.Element {
  const [PoblationData, setPoblationData] = useState<IPoblationForm>();
  const [regionData, setRegionData] = useState<IDropdownProps[]>([]);
  const [districtList, setDistrictList] = useState([]);
  const [deparmentList, setDeparmentList] = useState([]);
  const { setProjectData, projectData, setDisableContinue, formAction, isADisabledInput, setDisableStatusUpdate } = useContext(ProjectsContext);
  const resolver = useYupValidationResolver(poblationValidator);
  const { setMessage } = useContext(AppContext);
  const { getListByGrouper, getListByParent } = useGenericListService();

  const {
    formState: { errors, isValid },
    watch,
    register,
    setValue,
    getValues,
    control
  } = useForm<IPoblationForm>({
    resolver,
    mode: "all",
    defaultValues: {
      objectivePeople: projectData?.identification?.poblation?.objectivePeople ? projectData.identification.poblation.objectivePeople : null,
      informationSource: projectData?.identification?.poblation?.informationSource ? projectData.identification.poblation.informationSource : "",
      region: projectData?.identification?.poblation?.region ? projectData.identification.poblation.region : null,
      departament: projectData?.identification?.poblation?.departament ? projectData.identification.poblation.departament : null,
      district: projectData?.identification?.poblation?.district ? projectData.identification.poblation.district : null,
      shelter: projectData?.identification?.poblation?.shelter ? projectData.identification.poblation.shelter : "",
      demographic: projectData?.identification?.poblation?.demographic ? projectData.identification.poblation.demographic : [],
    },
  });

  const idRegion = watch("region")
  const idDepartament = watch("departament")
  // const detail = watch("demographic.${number}.detail")

  const { fields, append, remove } = useFieldArray({
    control,
    name: "demographic",
  });

  const demographicFieldArray = useWatch({
    control,
    name: "demographic"
  });

  const clasificationActions = {
    1: "GENEROS",
    2: "RANGOS_DE_EDAD ",
    3: "GRUPOS_ETNICOS",
    4: "LGE_LISTADOS_GENERICOS",
  }

  const clasificationData: IDropdownProps[] = [
    {
      name: "Género",
      value: 1,
    },
    {
      name: "Rango de edad",
      value: 2,
    },
    {
      name: "Grupo étnico",
      value: 3,
    },
    {
      name: "Población vulnerable",
      value: 4,
    }
  ];

  useEffect(() => {
    if (projectData) setPoblationData(projectData.identification?.poblation);
  }, []);


  useEffect(() => {
    getListByGrouper("REGION").then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.itemDescription, value: Number(data.itemCode) }
        })
        setRegionData(data);
      }
    })
  }, []);

  useEffect(() => {
    setDeparmentList([{}])
    setDistrictList([{}])
    if (idRegion) {
      getListByParent({ grouper: "DEPARTAMENTOS", parentItemCode: idRegion.toString(), fieldName: "regionId" })
        .then((response: ApiResponse<IGenericList[]>) => {
          if (response && response?.operation?.code === EResponseCodes.OK) {
            setDeparmentList(
              response.data.map((item) => {
                const list = {
                  name: item.itemDescription,
                  value: Number(item.itemCode),
                };
                return list;
              })
            );
          }
        })
        .catch((e) => { });
    }
  }, [idRegion]);


  useEffect(() => {
    setDistrictList([{}])
    if (idDepartament) {
      getListByParent({ grouper: "MUNICIPIOS", parentItemCode: idDepartament.toString(), fieldName: "departmentId" })
        .then((response: ApiResponse<IGenericList[]>) => {
          if (response && response?.operation?.code === EResponseCodes.OK) {
            setDistrictList(
              response.data.map((item) => {
                const list = {
                  name: item.itemDescription,
                  value: Number(item.itemCode),
                };
                return list;
              })
            );
          }
        })
        .catch((e) => { });
    }
  }, [idDepartament]);


  useEffect(() => {
    const subscription = watch((value: IPoblationForm) =>
      setPoblationData((prev) => {
        return { ...prev, ...value };
      })
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (isValid && formAction === "new") {
      enableNext();
    } else if (!isValid && formAction === "new") {
      disableNext();
    } else if (isValid && formAction === "edit") {
      enableNext();
      setDisableContinue(false);
    } else {
      setDisableContinue(true);
    }
    setDisableStatusUpdate(!isValid);
  }, [isValid]);

  const getSelectsData = async (clasificationSelected: number): Promise<IDropdownProps[]> => {
    if (!clasificationSelected) return [];
    const response = await getListByGrouper(Reflect.get(clasificationActions, clasificationSelected))
    if (response.operation.code === EResponseCodes.OK) {
      const data: IDropdownProps[] = response.data.map(data => {
        return { name: data.itemDescription, value: Number(data.id) }
      });
      return data;
    } else {
      return [];
    }
  }

  useEffect(() => {
    if (PoblationData)
      setProjectData((prev) => {
        const identification = prev
          ? { ...prev.identification, poblation: { ...PoblationData } }
          : { poblation: { ...PoblationData } };
        return { ...prev, identification: { ...identification } };
      });
  }, [PoblationData]);

  return (
    <FormComponent
      action={undefined}
      className="card-form-development">
      <div className="card-table">
        <label className="text-black biggest bold">
          Población objetivo de la intervención
        </label>
        <div className="poblation-container">
          <div>
            <Controller
                control={control}
                name={"objectivePeople"}
                defaultValue={0}
                render={({ field }) => {
                    return (
                        <InputNumberComponent
                            idInput={field.name}
                            control={control}
                            label="Número de personas objetivo"
                            errors={errors}
                            classNameLabel="text-black biggest bold text-required "
                            className="inputNumber-basic background-textArea"
                            placeholder="Escribe aquí"
                            minFractionDigits={0} />
                    );
                }} />

          </div>
          <div>
            <Controller
              control={control}
              name={"informationSource"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Fuente de la información"
                    className="text-area-basic"
                    classNameLabel="text-black biggest bold text-required"
                    rows={1}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                    characters={100}
                  >
                  </TextAreaComponent>
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="card-table">
        <label className="text-black biggest bold">
          Localización
        </label>
        <div className="poblation-container-2">
          <div>
            <Controller
              control={control}
              name={"region"}
              render={({ field }) => {
                return (
                  <SelectComponent
                    control={control}
                    idInput={field.name}
                    className="select-basic"
                    label="Región"
                    classNameLabel="text-black biggest bold text-required"
                    data={regionData}
                    errors={errors}
                    filter={true}
                    disabled={isADisabledInput}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"departament"}
              render={({ field }) => {
                return (
                  <SelectComponent
                    control={control}
                    idInput={field.name}
                    className="select-basic"
                    label="Departamento"
                    classNameLabel="text-black biggest bold text-required"
                    data={deparmentList}
                    errors={errors}
                    filter={true}
                    disabled={isADisabledInput}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"district"}
              render={({ field }) => {
                return (
                  <SelectComponent
                    control={control}
                    idInput={field.name}
                    className="select-basic"
                    label="Distrito/Municipio"
                    classNameLabel="text-black biggest bold text-required"
                    data={districtList}
                    errors={errors}
                    filter={true}
                    disabled={isADisabledInput}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              control={control}
              name={"shelter"}
              defaultValue=""
              render={({ field }) => {
                return (
                  <TextAreaComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Resguardo"
                    className="text-area-basic"
                    classNameLabel="text-black biggest bold"
                    rows={2}
                    placeholder="Escribe aquí"
                    register={register}
                    onChange={field.onChange}
                    errors={errors}
                    characters={100}
                    disabled={isADisabledInput}
                  >
                  </TextAreaComponent>
                );
              }}
            />
          </div>
        </div>
        <div></div>

        <div className="card_table">
          <div className="title-area">
            <label className="text-black biggest bold text-required">
              Características demográficas de la población
            </label>

            <div className="title-button text-main large" onClick={() => {
              append({ clasification: null, detail: null, numPerson: null });
            }}>
              Añadir clasificación <AiOutlinePlusCircle />
            </div>
          </div>
        </div>
        {fields.map((fields, index) => {
          return (
            <div key={fields.id}>
              <div className="poblation-container-3">
                <div>

                  <Controller
                    control={control}
                    name={`demographic.${index}.clasification`}
                    defaultValue={null}
                    render={({ field }) => {
                      const isEmptyClasification = !field.value;
                      const [isFieldDirty, setIsFieldDirty] = useState(false);
                      return (
                        <SelectComponent
                          control={control}
                          idInput={`demographic.${index}.clasification`}
                          className={`select-basic span-width ${isEmptyClasification && isFieldDirty ? "undefined error" : ""}`}
                          label="Clasificación"
                          classNameLabel="text-black biggest bold text-required"
                          data={clasificationData}
                          errors={errors}
                          onChange={() => {
                            setValue(`demographic.${index}.detail`, null);
                            setIsFieldDirty(true);
                          }}
                          fieldArray
                          filter={true}
                        >
                          {isEmptyClasification && isFieldDirty && (<p className="error-message bold not-margin-padding">Debe seleccionar una opción</p>)}

                        </SelectComponent>
                      );
                    }}
                  />

                </div>
                <div>
                  <Controller
                    control={control}
                    name={`demographic.${index}.clasification`}
                    defaultValue={null}
                    render={({ field }) => {
                      const isEmptyDetail = getValues(`demographic.${index}.detail`) === null
                      const [isFieldDirty, setIsFieldDirty] = useState(false);
                      return (
                        <SelectComponent
                          control={control}
                          idInput={`demographic.${index}.detail`}
                          className={`select-basic span-width ${isEmptyDetail && isFieldDirty ? "undefined error" : ""}`}
                          label="Detalle"
                          classNameLabel="text-black biggest bold text-required"
                          promiseData={getSelectsData(demographicFieldArray[index]?.clasification).then(response => response)}
                          errors={errors}
                          onChange={() => {
                            setIsFieldDirty(true);
                          }}
                          fieldArray
                          filter={true}
                        >
                          {isEmptyDetail && isFieldDirty && (<p className="error-message bold not-margin-padding">Debe seleccionar una opción</p>)}

                        </SelectComponent>
                      );
                    }}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name={`demographic.${index}.numPerson`}
                    defaultValue={index}
                    render={({ field }) => {
                      return (
                        <InputComponent
                          id={field.name}
                          idInput={field.name}
                          value={`${field.value}`}
                          label="No. de personas"
                          className="input-basic"
                          classNameLabel="text-black biggest bold"
                          typeInput={"number"}
                          register={register}
                          onChange={field.onChange}
                          errors={errors} />
                      );
                    }}
                  />
                </div>
                <div className="div-acciones">
                  <label className="text-black biggest bold">Acciones</label>
                  <div onClick={() => {
                    setMessage({
                      title: "Eliminar registro",
                      description: "¿Deseas continuar?",
                      show: true,
                      background: true,
                      OkTitle: "Aceptar",
                      cancelTitle: "Cancelar",
                      onOk: () => {
                        remove(index);
                        setMessage({
                          title: "Registro eliminado",
                          description: "¡Registro eliminado exitosamente!",
                          show: true,
                          background: true,
                          OkTitle: "Aceptar",
                          onOk: () => {
                            setMessage({});
                          }
                        })
                      },
                      onCancel: () => {
                        setMessage({});
                      }
                    })
                  }} className="div-acciones">
                    <div className="actions-poblations ">
                      <FaTrashAlt className="button grid-button button-delete" />
                    </div>
                  </div>

                </div>
                <div className="grid-span-4-columns">
                  <Controller
                    control={control}
                    name={`demographic.${index}.infoSource`}
                    defaultValue=""
                    render={({ field }) => {
                      return (
                        <TextAreaComponent
                          id={field.name}
                          idInput={field.name}
                          label={"Fuente de Información"}
                          classNameLabel="text-black biggest bold"
                          value={`${field.value}`}
                          className="text-area-basic"
                          placeholder="Escribe aquí"
                          register={register}
                          fieldArray={true}
                          onChange={field.onChange}
                          errors={errors}
                          characters={100}
                        >
                          {getValues(`demographic.${index}.infoSource`)?.length > 100 ? <p className="error-message bold not-margin-padding">Solo se permiten 100 caracteres</p> : <></>}
                        </TextAreaComponent>
                      );
                    }}
                  />
                </div>
                <div className="div-acciones-mobile">
                  <div onClick={() => {
                    setMessage({
                      title: "Eliminar registro",
                      description: "¿Deseas continuar con la eliminación?",
                      show: true,
                      background: true,
                      OkTitle: "Aceptar",
                      cancelTitle: "Cancelar",
                      onOk: () => {
                        remove(index);
                        setMessage({
                          title: "Registro eliminado",
                          description: "¡Registro eliminado exitosamente!",
                          show: true,
                          background: true,
                          OkTitle: "Aceptar",
                          onOk: () => {
                            setMessage({});
                          }
                        })
                      },
                      onCancel: () => {
                        setMessage({});
                      }
                    })
                  }} className="div-acciones-mobile">
                    <div className="actions-poblations ">
                      <FaTrashAlt className="button grid-button button-delete" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </FormComponent>
  );
}

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}



export default React.memo(PoblationComponent);