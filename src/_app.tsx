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

function App() {
  const HomePage = lazy(() => import("./features/home/home.page"));
  const ProjectsPage = lazy(() => import("./features/projects/pages/projects.page"));
  const TestPage = lazy(() => import("./features/home/test.page"));
  const ProjectsCrud = lazy(() => import("./features/projects/pages/projects-crud.page"));
  const AttachmentsPage = lazy(() => import("./features/projects/pages/attachments.page"));
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
              <Route path={"/direccion-estrategica/proyectos"} element={<ProjectsPage />} />;
              <Route path={"/direccion-estrategica/test"} element={<TestPage />} />;
              <Route path={"/direccion-estrategica/proyectos/crear-proyecto"} element={<ProjectsContextProvider><ProjectsCrud action = "new" /></ProjectsContextProvider>} />;
              <Route path={"/direccion-estrategica/proyectos/adjuntos/:id"} element={<AttachmentsPage />} />;
              <Route path={"/direccion-estrategica/proyectos/edit/:id"} element={<ProjectsContextProvider><ProjectsCrud action = "edit" /></ProjectsContextProvider>} />;
            </Routes>
          </Suspense>
        </Router>
      </ApplicationProvider>
    </AppContextProvider>
  );
}

export default React.memo(App);
