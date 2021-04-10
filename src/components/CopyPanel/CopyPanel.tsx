/**
 * @description: 复制板
 */
import React from "react";
import "./CopyPanel.less";
import { inject, observer } from "mobx-react";
import { Tag } from "antd";

export const CopyPanel: React.FC<any> = (props) => {
    const { LibraryStore, FileStore } = props
    return (
        <div className="copy_panel_collapse">
            {FileStore.copiedFile.map((item, index) => {
                const uuid: string = item.split('/')[0]
                let libraryName: string = ''
                for(let i: number = 0; i < LibraryStore.libraryList.length; i ++){
                    let library: LibraryProps = LibraryStore.libraryList[0]
                    if(uuid === library.uuid){
                        libraryName = library.file_name
                        break
                    }
                }
                const showContent: string = item.replace(uuid, libraryName)
                return (
                    <div className="copy_panel_collapse_main" key={index}>
                        <Tag color="gold">{index}</Tag>
                        <span className="copy_panel_collapse_content">{showContent}</span>
                    </div>
                )
            })}
        </div>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(CopyPanel));
