import React from "react";

export const ChildComponent = React.memo(
  ({ onClick }: { onClick: () => void }) => {
    console.log("ChildComponent renderizado");
    return <button onClick={onClick}>Hijo</button>;
  }
);
