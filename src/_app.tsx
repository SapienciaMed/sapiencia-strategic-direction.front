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
import PrivateRoute from "./common/utils/auth-private-guard";

function App() {
  const HomePage = lazy(() => import("./features/home/pages/home.page"));
  const ProjectsPage = lazy(() => import("./features/projects/pages/projects.page"));
  const TestPage = lazy(() => import("./features/home/test.page"));
  const ProjectsCrud = lazy(() => import("./features/projects/pages/projects-crud.page"));
  const AttachmentsPage = lazy(() => import("./features/projects/pages/attachments.page"));
  const FinishProjectPage = lazy(() => import("./features/projects/pages/finish-project.page"));
  const HistoricalProjectsPage = lazy(() => import("./features/projects/pages/historical-projects.page"));
  const { publish } = useAppCominicator();
 
  // Effect que cominica la aplicacion actual
  useEffect(() => {
    localStorage.setItem("currentAplication", process.env.aplicationId);
    setTimeout(
      () => publish("currentAplication", process.env.aplicationId),
      500
    );
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
                    element={<ProjectsPage/>}
                    allowedAction={"PROYECTO_CONSULTAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/crear-proyecto"}
                element={
                  <PrivateRoute
                    element={<ProjectsContextProvider><ProjectsCrud/></ProjectsContextProvider>}
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
                    element={<ProjectsContextProvider><ProjectsCrud/></ProjectsContextProvider>}
                    allowedAction={"PROYECTO_EDITAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos/finalizar-proyecto/:id"}
                element={
                  <PrivateRoute
                    element={<FinishProjectPage/>}
                    allowedAction={"PROYECTO_FINALIZAR"}
                  />
                }
              />
              <Route
                path={"/direccion-estrategica/proyectos-historicos"}
                element={
                  <PrivateRoute
                    element={<HistoricalProjectsPage/>}
                    allowedAction={"PROYECTO_HISTORICOS"}
                  />
                }
              />
              <Route path={"/direccion-estrategica/test"} element={<TestPage />} />;
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default React.memo(App);
