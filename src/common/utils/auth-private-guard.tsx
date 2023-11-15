import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
const PrivateRoute = ({ element, allowedAction }) => {
  const { authorization, setMessage, validateActionAccess } = useContext(AppContext);

  if (!authorization?.allowedActions) {
    return <div>Loading...</div>;
  }
  if (
    validateActionAccess(allowedAction)
  ) {
    return element;
  } else {
    setMessage({
      title: "¡Acceso no autorizado!",
      description: "Consulte con el admimistrador del sistema.",
      show: true,
      OkTitle: "Aceptar",
      onOk: () => setMessage({}),
    });
    return <Navigate to={"/direccion-estrategica/*"} replace />;
  }
};

export default PrivateRoute;
