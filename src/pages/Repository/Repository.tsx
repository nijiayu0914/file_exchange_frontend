import React from "react";
import "./Repository.less";
import Navigation from "../../components/Navigation/Navigation";
import Library from "../../components/Library/Library";
import Finder from "../../components/Finder/Finder";

export const Repository: React.FC = () => {
    return (
        <div className="repository_container">
            <Navigation />
            <div className="repository_body">
                <Library />
                <Finder />
            </div>
        </div>
    );
};
