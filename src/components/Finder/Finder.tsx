import React from "react";
import "./Finder.less";
import { inject, observer } from "mobx-react";
import { Tabs } from "antd";
import { FolderAddFilled } from "@ant-design/icons";
import FinderContainer from "../FinderContainer/FinderContainer";
const { TabPane } = Tabs;

export const Finder: React.FC<any> = ({ LibraryStore, FileStore }) => {
    const triggerLibrary = (uuid: string) => {
        FileStore.setActiveLibrary(uuid)
    }
    const closeLibrary = (uuid: string) => {
        LibraryStore.closeLibrary(uuid)
        if(uuid === FileStore.activeLibrary){
            LibraryStore.openLibraryList.length !==0
            && FileStore.setActiveLibrary(LibraryStore.openLibraryList[0][0])
        }
    }
    return (
        <div className="finder_container">
            <div className="finder_index"/>
            <div className="finder_main">
                <Tabs
                    type="editable-card"
                    hideAdd={true}
                    animated={true}
                    size="small"
                    onChange={triggerLibrary}
                    activeKey={FileStore.activeLibrary}
                    onEdit={(uuid) => {
                        if(typeof uuid === "string"){
                            closeLibrary(uuid)
                        }
                    }}
                >
                    {LibraryStore.openLibraryList.map(pane => (
                        <TabPane tab={
                            <div>
                                <span style={{fontSize: 10, cursor: "pointer"}}><FolderAddFilled
                                    style={{fontSize: 15, cursor: "pointer"}}
                                />{pane[1]}</span>
                            </div>
                        }
                                 key={pane[0]}
                                 style={{width: "100%", height: "100%"}}
                        >
                            <FinderContainer uuid={pane[0]} libraryName={pane[1]}/>
                        </TabPane>
                    ))}
                </Tabs>
            </div>

        </div>
    );
};

export default inject('LibraryStore', 'FileStore')(observer(Finder));
