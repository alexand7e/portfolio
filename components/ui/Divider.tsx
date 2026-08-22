import React from "react";

const Divider = ({ className = "" }: { className?: string }) => {
    return <div className={`h-px w-full bg-hairline ${className}`} />;
};

export default Divider;
