import React, {useEffect, useState} from "react";
import "./Manage.less"
import { BasicStyle } from "../../theme/classic"
import { inject, observer } from "mobx-react";
import {
    Alert, Space, Input, Spin, Table, Tag,
    Modal, Select, InputNumber, message
} from "antd";
const { Search } = Input;
const { Option } = Select;

export const Manage: React.FC<any> = ({ UserInfoStore, LibraryStore, FileStore }) => {
    const [isShow, setIsShow] =useState<boolean>(true)
    const [userPlugins, setUserPlugins] = useState<UserPluginsReadProps>(
        {count: 0, keyWord: '', page: 1, page_size: 10, user_plugins: []})
    const [files, setFiles] = useState<FileTableAllProps>(
        {count: 0, keyWord: '', page: 1, page_size: 10, files: []})
    const [userPluginsKeyWord, setUserPluginsKeyWord] = useState<string>('')
    const [filesKeyWord, setFilesKeyWord] = useState<string>('')
    const readAllPlugins = (page: number = 1, pageSize: number = 10,
                            keyWord: string = userPluginsKeyWord) => {
        UserInfoStore.readAllPlugins(page, pageSize, keyWord).then(res => {
            let userPluginsNew: any[] = []
            let data: UserPluginsReadProps = res.data
            data["user_plugins"].forEach((item, idx) => {
                userPluginsNew.push({
                    key: String(idx + 1),
                    userName: item["user_name"],
                    permissionCode: item["permission"],
                    permission: permissionMap[item["permission"]],
                    maxLibrary: item["max_library"],
                    createTime: new Date(item["CreatedAt"]).toLocaleString(),
                    updateTime: new Date(item["UpdatedAt"]).toLocaleString()
                })
            })
            data["user_plugins"] = userPluginsNew
            setUserPlugins(data)
        }).catch(error => {
            if(error.response.status === 403){
                setIsShow(false)
            }
        })
    }
    const readAllFiles = (page: number = 1, pageSize: number = 10,
                            keyWord: string = filesKeyWord) => {
        FileStore.readAllFiles(page, pageSize, keyWord).then(res => {
            let filesNew: any[] = []
            let data: FileTableAllProps = res.data
            data["files"].forEach((item, idx) => {
                filesNew.push({
                    key: String(idx + 1),
                    userName: item["user_name"],
                    fileName: item["file_name"],
                    uuid: item['uuid'],
                    usageCapacity: item["usage_capacity"],
                    capacity: item["capacity"],
                    createTime: new Date(item["CreatedAt"]).toLocaleString(),
                    updateTime: new Date(item["UpdatedAt"]).toLocaleString()
                })
            })
            data["files"] = filesNew
            setFiles(data)
        }).catch(error => {
            if(error.response.status === 403){
                setIsShow(false)
            }
        })
    }
    const userPluginsTablePageChange = (page: number, pageSize:number) => {
        readAllPlugins(page, pageSize, userPluginsKeyWord)
    }
    const filesTablePageChange = (page: number, pageSize:number) => {
        readAllFiles(page, pageSize, filesKeyWord)
    }
    const changePermission = (record) => {
        let permission: number = record.permissionCode
        const model = Modal.confirm({
            title: "修改用户权限等级",
            maskClosable: true,
            keyboard: true,
            onOk: () => {
                UserInfoStore.updatePermission(
                    record.userName, permission).then(() => {
                    readAllPlugins(
                        userPlugins.page, userPlugins.page_size, userPluginsKeyWord)
                    model.destroy()
                })
            },
            onCancel: () => {
                model.destroy()
            },
            content: (
                <div className="manage_modal">
                    <div className="manage_model_line">
                        <span>用户名:</span>
                        <Tag color={BasicStyle["@primary-color"]}>{record["userName"]}</Tag>
                    </div>
                    <div className="manage_model_line">
                        <span>权限:</span>
                        <Select
                            defaultValue={record.permission}
                            size="small"
                            style={{ width: 100, fontSize: 12}}
                            onChange={(value: string) => {
                                permission = Number.parseInt(value)
                            }}
                        >
                            <Option value="1001" style={{fontSize: 12}}>低权限</Option>
                            <Option value="1002" style={{fontSize: 12}}>中权限</Option>
                            <Option value="1003" style={{fontSize: 12}}>高权限</Option>
                            <Option value="1004" style={{fontSize: 12}}>管理员</Option>
                        </Select>
                    </div>
                </div>
            )
        })
    }
    const changeMaxLibrary = (record) => {
        let maxLibrary: number = record.maxLibrary
        const model = Modal.confirm({
            title: "修改用户资料夹配额",
            maskClosable: true,
            keyboard: true,
            onOk: () => {
                UserInfoStore.updateMaxLibrary(
                    record.userName, maxLibrary).then(() => {
                    readAllPlugins(
                        userPlugins.page, userPlugins.page_size, userPluginsKeyWord)
                    model.destroy()
                })
            },
            onCancel: () => {
                model.destroy()
            },
            content: (
                <div className="manage_modal">
                    <div className="manage_model_line">
                        <span>用户名:</span>
                        <Tag color={BasicStyle["@primary-color"]}>{record["userName"]}</Tag>
                    </div>
                    <div className="manage_model_line">
                        <span>资料夹配额:</span>
                        <InputNumber
                            defaultValue={record.maxLibrary}
                            size="small"
                            min="1"
                            max="100"
                            style={{ width: 100, fontSize: 12}}
                            onChange={(value: string) => {
                                maxLibrary = Number.parseInt(value)
                            }}/>
                    </div>
                </div>
            )
        })
    }
    const changeCapacity = (record) => {
        let capacity: number = record.capacity
        const model = Modal.confirm({
            title: "修改资料夹最大用量",
            maskClosable: true,
            keyboard: true,
            onOk: () => {
                FileStore.updateCapacity(
                    record.uuid, capacity).then(() => {
                    readAllFiles(
                        files.page, files.page_size, filesKeyWord)
                    model.destroy()
                })
            },
            onCancel: () => {
                model.destroy()
            },
            content: (
                <div className="manage_modal">
                    <div className="manage_model_line">
                        <span>资料夹名称:</span>
                        <Tag color={BasicStyle["@primary-color"]}>{record["fileName"]}</Tag>
                    </div>
                    <div className="manage_model_line">
                        <span>资料夹配额:</span>
                        <InputNumber
                            defaultValue={record.capacity}
                            size="small"
                            min="1024"
                            step="1024"
                            style={{ width: 100, fontSize: 12}}
                            onChange={(value: string) => {
                                capacity = Number.parseInt(value)
                            }}/>
                    </div>
                </div>
            )
        })
    }
    const refreshUsage = async (uuid: string) => {
        const readRes = await LibraryStore.readAllFilesSize(uuid)
        const size = readRes.data['size']
        FileStore.updateUsage(uuid, size, "overwrite").then(() => {
            LibraryStore.listLibrary()
        })
    }
    const permissionMap: object = {
        1001: "低权限",
        1002: "中权限",
        1003: "高权限",
        1004: "管理员权限"
    }
    const UserPluginTableColumns = [
        {
            title: "序号",
            key: "key",
            dataIndex: "key",
        },
        {
            title: "用户名",
            key: "userName",
            dataIndex: "userName",
        },
        {
            title: "权限",
            key: "permission",
            dataIndex: "permission",
        },
        {
            title: "权限编号",
            key: "permissionCode",
            dataIndex: "permissionCode",
        },
        {
            title: "资料夹数量",
            key: "maxLibrary",
            dataIndex: "maxLibrary",
        },
        {
            title: "创建时间",
            key: "createTime",
            dataIndex: "createTime",
        },
        {
            title: "更新时间",
            key: "updateTime",
            dataIndex: "updateTime",
        },
        {
            title: "操作",
            key: "operator",
            dataIndex: "operator",
            render: (_text, record) => (
                <Space size="middle">
                    <Tag
                        color={BasicStyle["@primary-color"]}
                        style={{cursor: "pointer"}}
                        onClick = {() => {
                            changePermission(record)
                        }}
                    >修改权限</Tag>
                    <Tag
                        color={BasicStyle["@primary-color"]}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            changeMaxLibrary(record)
                        }}
                    >修改配额</Tag>
                </Space>
            )
        }
    ]
    const FileTableColumns = [
        {
            title: "序号",
            key: "key",
            dataIndex: "key",
            width: 50
        },
        {
            title: "资料夹名称",
            key: "fileName",
            dataIndex: "fileName",
            ellipsis: true,
            width: 150
        },
        {
            title: "资料夹编号",
            key: "uuid",
            dataIndex: "uuid",
            ellipsis: true,
            width: 200
        },
        {
            title: "已用容量",
            key: "usageCapacity",
            dataIndex: "usageCapacity",
            width: 150,
            render: (text: number) => {
                return text.toFixed(2) + "Mb"
            }
        },
        {
            title: "总容量",
            key: "capacity",
            dataIndex: "capacity",
            width: 100
        },
        {
            title: "用户名",
            key: "userName",
            dataIndex: "userName",
            width: 100
        },
        {
            title: "创建时间",
            key: "createTime",
            dataIndex: "createTime",
            width: 200
        },
        {
            title: "更新时间",
            key: "updateTime",
            dataIndex: "updateTime",
            width: 200
        },
        {
            title: "操作",
            key: "operator",
            dataIndex: "operator",
            width: 200,
            render: (_text, record) => (
                <Space size="middle">
                    <Tag
                        color={BasicStyle["@primary-color"]}
                        style={{cursor: "pointer"}}
                        onClick = {() => {
                            refreshUsage(record.uuid).then(() => {
                                message.success("校准成功!").then()
                                readAllPlugins(
                                    files.page, files.page_size, filesKeyWord)
                            })
                        }}
                    >校准用量</Tag>
                    <Tag
                        color={BasicStyle["@primary-color"]}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            changeCapacity(record)
                        }}
                    >修改总容量</Tag>
                </Space>
            )
        }
    ]
    useEffect(() => {
        if(UserInfoStore.adminName !== UserInfoStore.UserName
            && UserInfoStore.permission !== 1004){
            setIsShow(false)
        }else{
            setIsShow(true)
            readAllPlugins()
        }
        // eslint-disable-next-line
    }, [UserInfoStore.adminName, UserInfoStore.permission, userPluginsKeyWord])

    useEffect(() => {
        if(UserInfoStore.adminName !== UserInfoStore.UserName
            && UserInfoStore.permission !== 1004){
            setIsShow(false)
        }else{
            setIsShow(true)
            readAllFiles()
        }
        // eslint-disable-next-line
    }, [UserInfoStore.adminName, UserInfoStore.permission, filesKeyWord])

    return (
        <div className="manage_container">
            {
                isShow ?
                    <div className="manage_detail">
                        <div className="manage_userInfo_title manage_table_title">
                            <span>用户信息:</span>
                            <Search
                                placeholder="用户名查询"
                                style={{ width: 200, marginRight: 50}}
                                onSearch={(value: string) => {
                                    setUserPluginsKeyWord(value)
                                }}
                            />
                        </div>
                        <Table
                            columns={UserPluginTableColumns}
                            dataSource={userPlugins["user_plugins"]}
                            pagination={{
                                size: "small",
                                pageSizeOptions: ["5", "10", "20", "50", "100", "300"],
                                total: userPlugins.count,
                                pageSize: userPlugins.page_size,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onChange: (page: number, pageSize: number | undefined) => {
                                    if(!pageSize){
                                        pageSize = 1
                                    }
                                    userPluginsTablePageChange(page, pageSize)
                                },
                                onShowSizeChange: (current: number, size: number) => {
                                    userPluginsTablePageChange(current, size)
                                }
                            }}
                        />
                        <div className="manage_fileInfo_title manage_table_title">
                            <span>资料夹信息:</span>
                            <Search
                                placeholder="用户名,资料夹名，资料夹编号查询"
                                style={{ width: 200, marginRight: 50}}
                                onSearch={(value: string) => {
                                    setFilesKeyWord(value)
                                }}
                            />
                        </div>
                        <Table
                            columns={FileTableColumns}
                            dataSource={files["files"]}
                            pagination={{
                                size: "small",
                                pageSizeOptions: ["5", "10", "20", "50", "100", "300"],
                                total: files.count,
                                pageSize: files.page_size,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onChange: (page: number, pageSize: number | undefined) => {
                                    if(!pageSize){
                                        pageSize = 1
                                    }
                                    filesTablePageChange(page, pageSize)
                                },
                                onShowSizeChange: (current: number, size: number) => {
                                    filesTablePageChange(current, size)
                                }
                            }}
                        />
                    </div>
                    :
                    <div style={{margin: 20, width: "100%"}}>
                        <Spin
                            tip="权限确认中..."
                        >
                            <Alert
                                message="管理员权限验证"
                                description="后台管理需要管理员权限，请申请权限查看"
                                type="info"
                            />
                        </Spin>
                    </div>
            }

        </div>
    );
}

export default inject('UserInfoStore', 'LibraryStore', 'FileStore')(observer(Manage));
