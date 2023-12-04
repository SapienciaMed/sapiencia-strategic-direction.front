import React from "react";
import { useParams } from "react-router-dom";
import useRevisionPAIData from "../hooks/revision-pai.hook";

function RevisionPAIPage(): React.JSX.Element {
    const { id: idPAI } = useParams();
    const {} = useRevisionPAIData(idPAI);
    return (
        <div>
            Testing
        </div>
    )
}

export default React.memo(RevisionPAIPage);