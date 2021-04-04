import React from "react";
import "./Management.less";
import Navigation from "../../components/Navigation/Navigation";
import Manage from "../../components/Manage/Manage";

export const Management: React.FC<any> = () => {
    return (
        <div className="management_container">
            <Navigation />
            <div className="management_body">
                <Manage />
            </div>
        </div>
    );
};
