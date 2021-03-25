import React, { useEffect } from "react";
import "./File.less"
import {inject, observer} from "mobx-react";
import { Menu, Dropdown } from 'antd';
import FileIcon from "../FileIcon/FileIcon";

export const File: React.FC<any> = (props) => {
    const { uuid, libraryName, file, how, LibraryStore, FileStore } = props
    const menu = (
        <Menu>
            <Menu.Item key="1">1st menu item</Menu.Item>
            <Menu.Item key="2">2nd menu item</Menu.Item>
            <Menu.Item key="3">3rd menu item</Menu.Item>
        </Menu>
    );
    return (
        <Dropdown overlay={menu} trigger={['contextMenu']}>
            <div className={how ? "file_container_view": "file_container_list"}>
                {
                    how ?
                        <div className="file_detail">
                            <FileIcon fileType={file.suffix} size={64} />
                            <div className="file_name"><span>{file.rename.replace('/', '')}</span></div>
                        </div>
                        :
                        <div className="file_detail">
                            <div className="file_icon" style={{marginRight: "10px"}}>
                                <FileIcon fileType={file.suffix} size={28}/>
                            </div>
                            <div className="file_name file_normal">
                                <span>{file.rename.replace('/', '')}</span>
                            </div>
                            <div className="file_content_type file_normal">
                                <span>{file.category === 'folder' ? 'folder': file.suffix}</span>
                            </div>
                            <div className="file_size file_normal">
                                <span>{
                                    file.size <= 1024 ? file.size + 'b' :
                                        ((file.size / 1024) <= 1024 ?
                                            (file.size / 1024).toFixed(2) + 'Kb' :
                                                (file.size / 1024 / 1024) <= 1024 ?
                                                    (file.size / 1024 / 1024).toFixed(2) + 'Mb' :
                                                    (file.size / 1024 / 1024 / 1024).toFixed(2) + 'Gb'
                                        )
                                }</span>
                            </div>
                            <div className="file_modifytime file_normal">
                                <span>{file.modifyTime}</span>
                            </div>
                        </div>
                }
            </div>
        </Dropdown>
    );
};

export default inject('LibraryStore', 'FileStore')(observer(File));
