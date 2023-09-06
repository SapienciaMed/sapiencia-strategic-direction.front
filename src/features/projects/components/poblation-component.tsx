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
import { json } from "react-router-dom";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

export function PoblationComponent({
  disableNext,
  enableNext,
}: IProps): React.JSX.Element {
  const [PoblationData, setPoblationData] = useState<IPoblationForm>();
  const [regionData, setRegionData] = useState<IDropdownProps[]>([]);
  const [departamentData, setDepartamentData] = useState<IDropdownProps[]>([]);
  const [districtData, setDistrictData] = useState<IDropdownProps[]>([]);
  const [deparmentList, setDeparmentList] = useState([]);
  const { setProjectData, projectData } = useContext(ProjectsContext);
  const resolver = useYupValidationResolver(poblationValidator);
  const { getListByGrouper , getListByParent } = useGenericListService();

  const {
    formState: { errors, isValid },
    watch,
    register,
    control,
  } = useForm<IPoblationForm>({
    resolver,
    mode: "all",
    defaultValues: {
      objectivePeople: projectData?.identification?.poblation?.objectivePeople ? projectData.identification.poblation.objectivePeople : "",
      informationSource: projectData?.identification?.poblation?.informationSource ? projectData.identification.poblation.informationSource : "",
      region: projectData?.identification?.poblation?.region ? projectData.identification.poblation.region : null,
      departament: projectData?.identification?.poblation?.departament ? projectData.identification.poblation.departament : null,
      district: projectData?.identification?.poblation?.district ? projectData.identification.poblation.district : null,
      shelter: projectData?.identification?.poblation?.shelter ? projectData.identification.poblation.shelter : "",
      demographic: projectData?.identification?.poblation?.demographic ? projectData.identification.poblation.demographic : [],
    },
  });

  const idRegion = watch("region")

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
          return { name: data.itemDescription, value: data.itemCode }
        })
        setRegionData(data);
      }
    })
  }, []);

  useEffect(() => {
    if(idRegion)
    getListByParent({ grouper: "DEPARTAMENTOS", parentItemCode: idRegion.toString(), fieldName:"regionId" })
      .then((response: ApiResponse<IGenericList[]>) => {
        if (response && response?.operation?.code === EResponseCodes.OK) {
          setDeparmentList(
            response.data.map((item) => {
              const list = {
                name: item.itemDescription,
                value: item.itemCode,
              };
              return list;
            })
          );
        }
      })
      .catch((e) => {});
  }, [idRegion]);


  useEffect(() => {
    getListByGrouper("DEPARTAMENTOS").then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.itemDescription, value: data.itemCode }
        })
        setDepartamentData(data);
      }
    })
  }, []);

  useEffect(() => {
    getListByGrouper("MUNICIPIOS").then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.itemDescription, value: data.itemCode }
        })
        setDistrictData(data);
      }
    })
  }, []);

  useEffect(() => {
    getListByGrouper("MUNICIPIOS").then(response => {
      if (response.operation.code === EResponseCodes.OK) {
        const data: IDropdownProps[] = response.data.map(data => {
          return { name: data.itemDescription, value: data.itemCode }
        })
        setDistrictData(data);
      }
    })
  }, []);



  useEffect(() => {
    const subscription = watch((value: IPoblationForm) =>
      setPoblationData((prev) => {
        return { ...prev, ...value };
      })
    );
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (isValid) {
      enableNext();
    } else {
      disableNext();
    }
  }, [isValid]);

  const getSelectsData = async (clasificationSelected: number): Promise<IDropdownProps[]> => {
    if(!clasificationSelected) return [];
    const response = await getListByGrouper(Reflect.get(clasificationActions, clasificationSelected))
    if (response.operation.code === EResponseCodes.OK) {
      const data: IDropdownProps[] = response.data.map(data => {
        return { name: data.itemDescription, value: data.itemCode }
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
              defaultValue=""
              render={({ field }) => {
                return (
                  <InputComponent
                    id={field.name}
                    idInput={field.name}
                    value={`${field.value}`}
                    label="Número de personas objetivo"
                    className="input-basic"
                    classNameLabel="text-black biggest bold text-required"
                    typeInput={"number"}
                    register={register}
                    onChange={field.onChange}
                    errors={errors} />
                );
              }}
            />
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
                  >
                    <label className="label-max-textarea">
                      Max. 300 caracteres
                    </label>
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
                    data={districtData}
                    errors={errors}
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
                  >
                    <label className="label-max-textarea">
                      Max. 100 caracteres
                    </label>
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
                            append({ clasification: null });
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
                  <SelectComponent
                    control={control}
                    idInput={`demographic.${index}.clasification`}
                    className="select-basic"
                    label="Clasificación"
                    classNameLabel="text-black biggest bold text-required"
                    data={clasificationData}
                    errors={errors}
                    fieldArray
                  />
                </div>
                <div>
                  <SelectComponent
                    control={control}
                    idInput={`demographic.${index}.detail`}
                    className="select-basic"
                    label="Detalle"
                    classNameLabel="text-black biggest bold text-required"
                    promiseData={getSelectsData(demographicFieldArray[index]?.clasification).then(response => response)}
                    errors={errors}
                    fieldArray
                  />
                </div>
                <div>
                <InputComponent
                      id={`demographic.${index}.numPerson`}
                      idInput={`demographic.${index}.numPerson`}
                      label="No. de personas"
                      className="input-basic"
                      classNameLabel="text-black biggest bold"
                      typeInput={"number"}
                      register={register}
                      errors={errors}
                  />
                   
                </div>
                <div className="div-acciones">
                <label className="text-black biggest bold">Acciones</label>
                  <div className="actions-poblations ">
                      <FaTrashAlt className="button grid-button button-delete" onClick={() => { remove(index) }} />
                  </div>
                </div>
                <div className="grid-span-4-columns">  
                <TextAreaComponent
                id={`demographic.${index}.informationSource`}
                idInput={`demographic.${index}.informationSource`}
                label={"Fuente de información"}
                className="text-area-basic"
                classNameLabel="text-black biggest bold"
                rows={2}
                placeholder="Escribe aquí"
                register={register}
                errors={errors}
                fieldArray
              >
              </TextAreaComponent>
                </div>
                <div className="div-acciones-mobile">
                  <div className="actions-poblations ">
                      <FaTrashAlt className="button grid-button button-delete" onClick={() => { remove(index) }} />
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