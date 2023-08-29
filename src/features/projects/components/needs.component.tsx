import React from "react";

interface IProps {
    disableNext: () => void;
    enableNext: () => void;
}

export function NeedsComponent({ disableNext, enableNext }: IProps): React.JSX.Element {
    return(
        <div>Mi Componente</div>
    )
}

export default React.memo(NeedsComponent);