import React from "react";

const SiaContainer = ({
    children,
    className = "",
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={`relative mx-4 md:mx-14 xl:mx-16 ${className}`}>
            {children}
        </div>
    );
};

export default SiaContainer;
