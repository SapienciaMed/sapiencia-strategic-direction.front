import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";
import "./styles/_app.scss";
import "./styles/_theme-prime.css";
import "primereact/resources/primereact.min.css";
import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";
import useAppCominicator from "./common/hooks/app-communicator.hook";
import { ProjectsContextProvider } from "./features/projects/contexts/projects.context";
import { AntiCorruptionPlanContextProvider } from "./features/anticorruption-plan/contexts/anticorruption-plan.context";
import PrivateRoute from "./common/utils/auth-private-guard";
import { addLocale } from 'primereact/api';
import { PAIContextProvider } from "./features/pai/contexts/pai.context";
import { RevisionPAIContextProvider } from "./features/pai/contexts/revision-pai.context";
import CheckAntiCorruption from "./features/projects/pages/check-anti-corruption";
import FormulationPAAC from "./features/projects/pages/formulation-PAAC";
import FormulationPAACEdition from "./features/projects/pages/formulation-PAAC-edition";

function App() {
  const HomePage = lazy(() => import("./features/home/pages/home.page"));
  const ProjectsPage = lazy(() => import("./features/projects/pages/projects.page"));
  const TestPage = lazy(() => import("./features/home/test.page"));
  const ProjectsCrud = lazy(() => import("./features/projects/pages/projects-crud.page"));
  const AttachmentsPage = lazy(() => import("./features/projects/pages/attachments.page"));
  const FinishProjectPage = lazy(() => import("./features/projects/pages/finish-project.page"));
  const HistoricalProjectsPage = lazy(() => import("./features/projects/pages/historical-projects.page"));
  const SchedulesPAIPage = lazy(() => import("./features/pai/pages/schedules-pai.page"));
  const PlanAction = lazy(() => import("./features/pai/pages/planAction-pai.page"));
  const CrudPAIPage = lazy(() => import("./features/pai/pages/crud-pai.page"));
  const RevisionPAIPage = lazy(() => import("./features/pai/pages/revision-pai.page"));

  const { publish } = useAppCominicator();

  // Effect que cominica la aplicacion actual
  useEffect(() => {
    localStorage.setItem("currentAplication", process.env.aplicationId);
    setTimeout(
      () => publish("currentAplication", process.env.aplicationId),
      500
    );
    addLocale('es', {
      firstDayOfWeek: 1,
      dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
      today: 'Hoy',
      clear: 'Limpiar',
    });
  }, []);

  return (
    <AppContextProvider>
      <ModalMessageComponent />
      <ApplicationProvider>
        <Router>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path={"/direccion-estrategica/*"} element={<HomePage />} />;
              <Route
                path={"/direccion-estrategica/proyectos"}
                element={
                  <PrivateRoute
                    element={<ProjectsPage />}
                    allowedAction={"PROYECTO_CONSULTAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/crear-proyecto"}
                element={
                  <PrivateRoute
                    element={<ProjectsContextProvider><ProjectsCrud /></ProjectsContextProvider>}
                    allowedAction={"PROYECTO_CREAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/adjuntos/:id"}
                element={
                  <PrivateRoute
                    element={<AttachmentsPage />}
                    allowedAction={"PROYECTO_DESCARGA"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/edit/:id"}
                element={
                  <PrivateRoute
                    element={<ProjectsContextProvider><ProjectsCrud /></ProjectsContextProvider>}
                    allowedAction={"PROYECTO_EDITAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/finalizar-proyecto/:id"}
                element={
                  <PrivateRoute
                    element={<FinishProjectPage />}
                    allowedAction={"PROYECTO_FINALIZAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos-historicos"}
                element={
                  <PrivateRoute
                    element={<HistoricalProjectsPage />}
                    allowedAction={"PROYECTO_HISTORICOS"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/pai/cronogramas"}
                element={
                  <SchedulesPAIPage />
                  /*<PrivateRoute
                    element={<SchedulesPAIPage/>}
                    allowedAction={"PROYECTO_HISTORICOS"}
                  />*/
                }
              />
              <Route path={"/direccion-estrategica/test"} element={<TestPage />} />;

              <Route
                path={"/direccion-estrategica/pai/crear-pai"}
                element={
                  <PrivateRoute
                    element={<PAIContextProvider><CrudPAIPage status="new"/></PAIContextProvider>}
                    allowedAction={"CREAR_PLAN"}
                  />
                }
              />

              <Route
                path={"/direccion-estrategica/pai/edit/:id"}
                element={
                  <PrivateRoute
                    element={<PAIContextProvider><CrudPAIPage status="edit"/></PAIContextProvider>}
                    allowedAction={"EDITAR_PLAN"}
                  />
                }
              />


              <Route
                path={"/direccion-estrategica/pai/"}
                element={
                  <PrivateRoute
                    element={<PlanAction />}
                    allowedAction={"CONSULTAR_PLAN"}
                  />
                }
              />

              <Route
                path={"/direccion-estrategica/planes/plan-anticorrupcion"}
                element={
                  <PrivateRoute
                    element={<CheckAntiCorruption />}
                    allowedAction={"CONSULTAR_PLAN"}
                  />
                }
              />

              <Route
                path={"/direccion-estrategica/planes/plan-anticorrupcion/formular-plan"}
                element={<AntiCorruptionPlanContextProvider><FormulationPAAC /></AntiCorruptionPlanContextProvider>}
              />

              <Route
                path={"/direccion-estrategica/planes/plan-anticorrupcion/formular-plan/editar/:id"}
                element={<AntiCorruptionPlanContextProvider><FormulationPAAC /></AntiCorruptionPlanContextProvider>}
              />

              <Route
                path={"/direccion-estrategica/pai/revision/:id"}
                element={
                  <PrivateRoute
                    element={<RevisionPAIContextProvider><RevisionPAIPage status="revision" /></RevisionPAIContextProvider>}
                    allowedAction={"REVISAR_PLAN"}
                  />
                }
              />

              <Route
                path={"/direccion-estrategica/pai/correction/:id"}
                element={
                  <PrivateRoute
                    element={<RevisionPAIContextProvider><RevisionPAIPage status="correction" /></RevisionPAIContextProvider>}
                    allowedAction={"CORREGIR_PLAN"}
                  />
                }
              />

              <Route
                path={"/direccion-estrategica/pai/adjustment/:id"}
                element={
                  <PrivateRoute
                    element={<RevisionPAIContextProvider><RevisionPAIPage status="adjustment" /></RevisionPAIContextProvider>}
                    allowedAction={"REVISAR_PLAN"}
                  />
                }
              />

            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default React.memo(App);
