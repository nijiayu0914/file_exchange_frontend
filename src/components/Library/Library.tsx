import React, { useState, useEffect } from "react";
import "./Library.less"
import { BasicStyle } from "../../theme/classic"
import { inject, observer } from "mobx-react";
import { FolderAddFilled, ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons"
import {Avatar, Dropdown, Input, List, Menu, message, Modal} from 'antd';
const { Search } = Input;

export const Library: React.FC<any> = ({LibraryStore, FileStore}) => {
    const [libraryName, setlibraryName] = useState('');

    useEffect(() => {
        LibraryStore.listLibrary()
        // eslint-disable-next-line
    }, [])
    const CreatelibraryNameChange = (e) => {
        setlibraryName(e.target.value)
    }
    const createLibrary = (libraryName: string) => {
        if(!libraryName || libraryName.length === 0){
            message.warn("资料夹名称不能为空").then()
        }else{
            LibraryStore.createLibrary(libraryName)
        }
    }
    const openLibrary = (uuid: string, libraryName: string) => {
        LibraryStore.openLibrary(uuid, libraryName)
        FileStore.clearCheckedFile()
        FileStore.setActiveLibrary(uuid)
    }
    const modalRename = (uuid: string, originName: string) => {
        let newName: string = originName
        Modal.info({
            title: "文件名: " + originName,
            content: (
                <div>
                    <span>重命名:</span>
                    <Input
                        onChange={(e) =>{
                            newName = e.target.value
                        }}
                    />
                </div>
            ),
            onOk: () => {
                LibraryStore.renameLibrary(uuid, newName)
            },
        });
    }
    const modalDelete = (uuid: string, originName: string) => {
        Modal.confirm({
            title: "确定删除资料夹:" + originName + "?",
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <span>资料夹里所有文件将被删除且不可恢复！</span>
                </div>
            ),
            onOk: () => {
                LibraryStore.deleteLibrary(uuid)
            },
        });
    }
    return (
        <div className="library_container">
            <div className="library_title">
                <span>资料夹</span>
            </div>
            <Search
                allowClear
                style={{ width: "90%", margin: "5px 0 5px 0" }}
                onSearch={(keyword: string) => {
                    LibraryStore.search(keyword)
                }}
            />
            <div className="library_list">
                <List
                    itemLayout="horizontal"
                    dataSource={LibraryStore.showLibraryList}
                    renderItem={(item: LibraryProps) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar
                                style={{backgroundColor: BasicStyle["@primary-color"]}}
                                >{item.file_name[0].toLocaleUpperCase()}</Avatar>}
                                title={item.file_name}
                                description={
                                    "容量:" + (item.capacity / 1024).toFixed(2) +
                                    "Gb 已使用:" + (item.usage_capacity).toFixed(2) + "Mb"}
                            />
                            <div className="library_link">
                                <div className="library_link_btn" onClick={() => {
                                    openLibrary(item.uuid, item.file_name)
                                }}><span>打开</span></div>
                                <div className="library_link_btn">
                                    <div>
                                        <Dropdown overlay={() => {
                                            return (
                                                <Menu>
                                                    <Menu.Item onClick={() => {
                                                        modalRename(item.uuid, item.file_name)
                                                    }}>
                                                    <span>重命名</span>
                                                    </Menu.Item>
                                                    <Menu.Item onClick={() => {
                                                        modalDelete(item.uuid, item.file_name)
                                                    }}>
                                                    <span style={{color: "#f5222d"}}>删除</span>
                                                    </Menu.Item>
                                                </Menu>
                                            )
                                        }} arrow>
                                            <span>更多</span>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />
            </div>
            <div className="library_create">
                <Input placeholder="输入新资料夹名称"
                       style={{width: "85%"}}
                       onChange={CreatelibraryNameChange}/>
                <FolderAddFilled
                    style={{fontSize: 30, color: BasicStyle["@level4"],
                        cursor: "pointer", marginLeft: "5px"}}
                    onClick={() => {
                        createLibrary(libraryName)
                    }}
                />
                <SyncOutlined style={{color: BasicStyle["@text-color"],
                    fontSize: 16, marginLeft: "5px", cursor: "pointer"}}
                              onClick={() => {
                                  LibraryStore.listLibrary()
                              }}
                />
            </div>
        </div>
    );
};

export default inject('LibraryStore', 'FileStore')(observer(Library));
