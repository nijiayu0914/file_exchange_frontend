import React, { useState } from "react";
import "./File.less"
import { inject, observer } from "mobx-react";
import { REACT_APP_HTTPS } from "../../config"
import { Dropdown, Input, Menu, Modal, Spin, Tag } from 'antd';
import FileIcon from "../FileIcon/FileIcon";
import Icon, { SyncOutlined } from "@ant-design/icons";
import {ReactComponent as Look} from "../../assets/pageicon/Look.svg";
import { BasicStyle } from "../../theme/classic";
import {ReactComponent as Rename} from "../../assets/pageicon/Rename.svg";
import {ReactComponent as CreateFolder} from "../../assets/pageicon/CreateFolder.svg";
import {ReactComponent as Copy} from "../../assets/pageicon/Copy.svg";
import {ReactComponent as Paste} from "../../assets/pageicon/Paste.svg";
import {ReactComponent as UploadIcon} from "../../assets/pageicon/Upload.svg";
import {ReactComponent as Download} from "../../assets/pageicon/Download.svg";
import {ReactComponent as Share} from "../../assets/pageicon/Share.svg";
import {ReactComponent as RollBack} from "../../assets/pageicon/RollBack.svg";
import {ReactComponent as Delete} from "../../assets/pageicon/Delete.svg";
const FileViewer = React.lazy(() => import('react-file-viewer'));

export const File: React.FC<any> = (props) => {
    const {
        uuid, listIndex, file, how, currentSearchPath, currentFilePath, cauSize,
        shiftAddCheckedFile, LibraryStore, FileStore, changeFilePath, uploadComponent,
        clickLook, createFolderModal, listFiles, downloadFile, deleteFile,
        listDeleteMarkers } = props
    const [contextMenuSelected, setContextMenuSelected] = useState<string[]>([])
    const [previewShow, setPreviewShow] =useState<boolean>(false)
    const [fileUrl, setFileUrl] =useState<string>('')
    const doubleClickFile = async () => {
        if (file.category === 'folder') {
            changeFilePath(file.name.replace(uuid + '/', ''))
        } else {
            const fileUrlData: object = await FileStore.downloadFile(
                uuid, file.name.replace(uuid + '/', ''))
            if(REACT_APP_HTTPS){
                setFileUrl(fileUrlData['data'].replace('http://', 'https://'))
            }else{
                setFileUrl(fileUrlData['data'].replace('https://', 'http://'))
            }

            setPreviewShow(true)
        }
    }
    const click = (e) => {
        e.stopPropagation()
        if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
            FileStore.addCheckedFile(file.name, false)
        }else if(e.shiftKey){
            shiftAddCheckedFile(listIndex)
        }else{
            FileStore.addCheckedFile(file.name)
        }
        cauSize()
    }
    const renameFile = (uuid: string, objectName: string) => {
        let newName: string
        Modal.confirm({
            title: "重命名？",
            content: (
                <div>
                    <span>文件夹名称:</span>
                    <Input
                        onChange={(e) =>{
                            let FileNameSplit: string[] = file.name.split('.')
                            newName = e.target.value + '.' + FileNameSplit[FileNameSplit.length - 1]
                        }}
                    />
                </div>
            ),
            onOk: () => {
                FileStore.Rename(uuid, objectName, newName).then(() => {
                    listFiles(uuid, currentFilePath, true)
                })
            },
        });
    }

    const historyVersion = () => {
        FileStore.listFileVersion(
            uuid, file.name.replace(uuid + '/', '')).then(info => {
                const model = Modal.confirm({
                    title: "历史版本",
                    content: (
                        <div className="file_history_container">
                            {info.data.map((item: HistoryFileProps, index) => {
                                return (
                                    <div key={index} className="file_history">
                                        <div className="file_history_time">
                                            {new Date(item.lastModified).toLocaleString()}
                                        </div>
                                        <div>{
                                            item.isLatest?
                                                <Tag color="green">最新</Tag>
                                                :
                                                <Tag color="volcano">历史</Tag>
                                        }</div>
                                        {!item.isLatest?
                                            <div
                                                className="file_history_btn"
                                                onClick={() => {
                                                    FileStore.copyFile(
                                                        uuid, item.key, item.key,
                                                        item.versionId).then(() => {
                                                        FileStore.listFileVersion(
                                                            uuid, file.name.replace(uuid + '/', ''))
                                                        model.destroy()
                                                    })
                                                }}
                                            >
                                                <Tag color="geekblue">回档</Tag>
                                            </div> : null}
                                        {!item.isLatest ?
                                            <div
                                                className="file_history_btn"
                                                onClick={() => {
                                                    FileStore.deleteHistoryFile(
                                                        uuid, item.key.replace(
                                                            uuid + '/', ''),
                                                        item.versionId
                                                    ).then(() => {
                                                        LibraryStore.listLibrary()
                                                        FileStore.listFileVersion(
                                                            uuid, file.name.replace(uuid + '/', ''))
                                                        model.destroy()
                                                        historyVersion()
                                                    })
                                                }}
                                            >
                                                <Tag color="magenta">删除</Tag>
                                            </div> : null}
                                    </div>
                                )
                            })}
                        </div>
                    )
            })}
        )
    }
    const menu = (
        <Menu
            selectable
            selectedKeys={contextMenuSelected}
            className="context_menu_icon_theme_color"
            style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                backgroundColor: BasicStyle["@body-background"]
            }}
            onSelect={(info) => {
                switch(info.key){
                    case "详情":
                        clickLook()
                        setContextMenuSelected([])
                        break
                    case "重命名":
                        renameFile(uuid, file.name)
                        setContextMenuSelected([])
                        break
                    case "新建文件夹":
                        createFolderModal(uuid, currentFilePath)
                        setContextMenuSelected([])
                        break
                    case "复制":
                        FileStore.addCopiedFile()
                        setContextMenuSelected([])
                        break
                    case "粘贴":
                        FileStore.copyFiles(uuid, uuid + '/' + currentFilePath).then(
                            () => {
                            listFiles(uuid, currentFilePath, true)
                        })
                        setContextMenuSelected([])
                        break
                    case "下载":
                        downloadFile()
                        setContextMenuSelected([])
                        break
                    case "分享":
                        downloadFile(false).then(res => {
                            Modal.info({
                                title: "复制链接地址进行分享:",
                                content: (
                                    <textarea
                                        cols={45} rows={7} style={{border: 0, resize: "none"}}>{res}
                                    </textarea>)})
                        })
                        setContextMenuSelected([])
                        break
                    case "上传":
                        uploadComponent.current.getElementsByTagName("INPUT")[0].click()
                        setContextMenuSelected([])
                        break
                    case "查看历史版本":
                        historyVersion()
                        break
                    case "删除":
                        deleteFile().then(() => {
                            listDeleteMarkers(true, true)
                        })
                        setContextMenuSelected([])
                        break
                    case "刷新":
                        listFiles(uuid, currentFilePath, true)
                        break
                    default:
                        break
                }
            }}

        >
            <Menu.Item key="详情" icon={<Icon component={Look} style={{fontSize: 18}}/>}>文件详情</Menu.Item>
            <Menu.Item disabled={file.category === "folder"} key="重命名" icon={<Icon component={Rename} style={{fontSize: 18}}/>}>重命名</Menu.Item>
            <Menu.Item key="新建文件夹" icon={<Icon component={CreateFolder}
                                               style={{fontSize: 22}}/>}>新建文件夹</Menu.Item>
            <Menu.Item key="复制" icon={<Icon component={Copy} style={{fontSize: 18}}/>}>复制</Menu.Item>
            <Menu.Item key="粘贴" icon={<Icon component={Paste} style={{fontSize: 18}}/>}>粘贴</Menu.Item>
            <Menu.Item key="上传" icon={<Icon component={UploadIcon} style={{fontSize: 18}}/>}>上传</Menu.Item>
            <Menu.Item key="下载" disabled={file.category === "folder"}
                       icon={<Icon component={Download} style={{fontSize: 18}}/>}>下载</Menu.Item>
            <Menu.Item key="分享" disabled={file.category === "folder"}
                       icon={<Icon component={Share} style={{fontSize: 18}}/>}>分享</Menu.Item>
            <Menu.Item key="查看历史版本" disabled={file.category === "folder"} icon={
                <Icon component={RollBack} style={{fontSize: 18}}/>}>查看历史版本</Menu.Item>
            <Menu.Item key="删除" icon={<Icon component={Delete} style={{fontSize: 18}}/>}>删除</Menu.Item>
            <Menu.Item key="刷新" icon={<SyncOutlined
                style={{fontSize: 18, color: BasicStyle["@primary-color"]}}/>}>刷新</Menu.Item>
        </Menu>
    );
    return (
        <React.Suspense fallback={<Spin tip="loading....."/>}>
            <Dropdown overlay={menu} trigger={['contextMenu']}>
            <div
                className={how ? "file_container_view": "file_container_list"}
                style={
                    file.originName.indexOf(
                        currentSearchPath.split('/')[currentSearchPath.split('/').length - 1]) >= 0
                    || file.rename.indexOf(
                        currentSearchPath.split('/')[currentSearchPath.split('/').length - 1]) >= 0 ?
                        {display: "flex"} : {display: "none"}
                }
            >
                {
                    how ?
                        <div className={FileStore.checkedFile.has(file.name)
                            ? "file_detail checked" : "file_detail file_hover"}
                             onClick={click}
                             onMouseDown={(e) =>{
                                 if(e.button === 2){
                                     click(e)
                                 }
                             }}
                             onDoubleClick={() => {doubleClickFile().then()}}
                        >
                            <FileIcon fileType={file.suffix} size={64} />
                            <div className="file_name"><span>{
                                file.category === 'folder' ?
                                    file.rename.split('/')[file.rename.split('/').length - 2]
                                    :
                                    file.rename.replace('/', '')
                            }</span></div>
                        </div>
                        :
                        <div className={FileStore.checkedFile.has(file.name)
                            ? "file_detail checked" : "file_detail file_hover"}
                             onClick={click}
                             onDoubleClick={() => {doubleClickFile().then()}}
                        >
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
                <Modal
                    title="文件预览"
                    destroyOnClose={true}
                    width="90%"
                    bodyStyle={{minHeight: 700}}
                    visible={previewShow}
                    onOk={() => {setPreviewShow(false)}}
                    onCancel={() => {setPreviewShow(false)}}>
                    <div style={{width: "100%", height: 700}}>
                        {
                            file.originName.substr(
                                file.originName.lastIndexOf(".") + 1) === 'pdf' ?
                                <iframe width = "100%" height="700" src={fileUrl} />
                                :
                                <FileViewer
                                    fileType={file.originName.substr(
                                        file.originName.lastIndexOf(".") + 1)}
                                    filePath={fileUrl}
                                    errorComponent={<div>此格式无法预览</div>}/>
                        }
                    </div>
                </Modal>
            </div>
        </Dropdown>
        </React.Suspense>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(File))
