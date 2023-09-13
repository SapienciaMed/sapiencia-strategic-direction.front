import React from "react";

interface IProps {
  disableNext: () => void;
  enableNext: () => void;
}

function ActivitiesComponent({disableNext, enableNext}: IProps): React.JSX.Element {
    return (
        <div>
            activitis c:
        </div>
    )
}

export default React.memo(ActivitiesComponent);
