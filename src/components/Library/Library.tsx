/**
 * @description: 资料夹列举组件
 */
import React, { useState, useEffect } from "react";
import "./Library.less"
import { BasicStyle } from "../../theme/classic"
import { inject, observer } from "mobx-react";
import { FolderAddFilled, ExclamationCircleOutlined, SyncOutlined } from "@ant-design/icons"
import {Avatar, Dropdown, Input, List, Menu, message, Modal} from 'antd';
const { Search } = Input;

export const Library: React.FC<any> = ({ UserInfoStore, LibraryStore, FileStore }) => {
    const [libraryName, setlibraryName] = useState('');
    /**
     * 更新将被创建资料夹的名称
     * @param e
     */
    const CreatelibraryNameChange = (e) => {
        setlibraryName(e.target.value)
    }
    /**
     * 创建资料夹
     * @param {string} libraryName 创建资料夹名称
     */
    const createLibrary = (libraryName: string) => {
        if(!libraryName || libraryName.length === 0){
            message.warn("资料夹名称不能为空").then()
        }else if(UserInfoStore.maxLibrary <= LibraryStore.libraryList.length){
            message.warn("已达到可用上限").then()
        }else{
            LibraryStore.createLibrary(libraryName)
        }
    }
    /**
     * 打开资料夹
     * @param {string} uuid 资料夹uuid
     * @param {string} libraryName 资料夹名称
     */
    const openLibrary = (uuid: string, libraryName: string) => {
        LibraryStore.openLibrary(uuid, libraryName)
        FileStore.clearCheckedFile()
        FileStore.setActiveLibrary(uuid)
    }
    /**
     * 弹窗更改资料夹名称
     * @param {string} uuid 资料夹uuid
     * @param {string} originName 资料夹原名
     */
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
    /**
     * 弹窗确认删除资料夹
     * @param {string} uuid 资料夹uuid
     * @param {string} originName 资料夹名称
     */
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
                LibraryStore.deleteLibrary(uuid).then(() => {
                    LibraryStore.clearOpenLibraryList()
                    FileStore.setActiveLibrary('')
                })
            },
        });
    }
    useEffect(() => {
        LibraryStore.listLibrary()
        // eslint-disable-next-line
    }, [])
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

export default inject('UserInfoStore', 'LibraryStore', 'FileStore')(observer(Library));
