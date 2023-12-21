import React from "react";
import { useNavigate } from "react-router-dom";
import { useApplicationsData } from "../hooks/applications-container.hook";
import { IMenuAccess } from "../../../common/interfaces/menuaccess.interface";

function HomePage(): React.JSX.Element {
  const navigate = useNavigate();
  const { applications } = useApplicationsData();
  return (
    <div className="dashboard-margin full-height">
      <div style={{ marginTop: '10%', height: "100%" }}>
        <section className="welcome-container">
          <span className="text-dasboard huge text-center">Bienvenid@ al</span>
        </section>
        <div className="applications-cards" style={{overflow: "hidden", height: "20rem", padding: "10px"}}>
          {
            applications.map((app: IMenuAccess) => {
              let imagePath: string | undefined;
              try {
                imagePath = require(`../../../public/images/application-icon-${app.id}.svg`);
              } catch {
                imagePath = require('../../../public/images/application-image-default.png');
              }
              return (
                <div className="card-body" key={app.id} style={{cursor: "initial"}} onClick={() => { navigate(`${window.location.pathname}${app.url}`) }}>
                  <div className="card-header">
                    <img
                      src={imagePath}
                    />
                  </div>
                  <div className="card-footer" style={{marginTop: "2rem"}}>
                    <p className="text-dasboard-name-applications biggest text-center weight-500">{app.name}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    </div>

  );
}

export default React.memo(HomePage);