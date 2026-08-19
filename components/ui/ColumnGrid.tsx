import React from "react";

const ColumnGrid = ({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`relative grid grid-cols-1 md:grid-cols-4 ${className}`}>
            {children}
        </div>
    );
};

export default ColumnGrid;
