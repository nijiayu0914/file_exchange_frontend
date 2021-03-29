import React, {useState} from "react";
import "./File.less"
import {inject, observer} from "mobx-react";
import {Dropdown, Input, Menu, Modal, Tag} from 'antd';
import FileIcon from "../FileIcon/FileIcon";
import Icon, {SyncOutlined} from "@ant-design/icons";
import {ReactComponent as Look} from "../../assets/pageicon/Look.svg";
import {BasicStyle} from "../../theme/classic";
import {ReactComponent as Rename} from "../../assets/pageicon/Rename.svg";
import {ReactComponent as CreateFolder} from "../../assets/pageicon/CreateFolder.svg";
import {ReactComponent as Copy} from "../../assets/pageicon/Copy.svg";
import {ReactComponent as Paste} from "../../assets/pageicon/Paste.svg";
import {ReactComponent as UploadIcon} from "../../assets/pageicon/Upload.svg";
import {ReactComponent as Download} from "../../assets/pageicon/Download.svg";
import {ReactComponent as Share} from "../../assets/pageicon/Share.svg";
import {ReactComponent as RollBack} from "../../assets/pageicon/RollBack.svg";
import {ReactComponent as Delete} from "../../assets/pageicon/Delete.svg";

export const File: React.FC<any> = (props) => {
    const {
        uuid, listIndex, file, how, currentSearchPath, currentFilePath, cauSize,
        shiftAddCheckedFile, FileStore, changeFilePath, uploadComponent,
        clickLook, createFolderModal, listFiles, downloadFile, deleteFile,
        listDeleteMarkers } = props
    const [contextMenuSelected, setContextMenuSelected] = useState<string[]>([])
    const doubleClickFile = () => {
        if(file.category === 'folder'){
            changeFilePath(file.name.replace(uuid + '/', ''))
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
                console.log(info)
                Modal.confirm({
                    title: "历史版本",
                    content: (
                        <div>
                            {info.data.map((item, index) => {
                                return (
                                    <div key={index} className="file_history">
                                        <div>{item.lastModified}</div>
                                        <div>{
                                            item.isLatest?
                                                <Tag color="green">最新</Tag>
                                                :
                                                <Tag color="volcano">历史</Tag>
                                        }</div>
                                        {!item.isLatest? <div><span>回档</span></div> : <div><span></span></div>}
                                        {!item.isLatest? <div><span>删除</span></div> : <div><span></span></div>}
                                    </div>
                                )
                            })}
                        </div>)
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
                        createFolderModal()
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
            <Menu.Item key="重命名" icon={<Icon component={Rename} style={{fontSize: 18}}/>}>重命名</Menu.Item>
            <Menu.Item key="新建文件夹" icon={<Icon component={CreateFolder}
                                               style={{fontSize: 22}}/>}>新建文件夹</Menu.Item>
            <Menu.Item key="复制" icon={<Icon component={Copy} style={{fontSize: 18}}/>}>复制</Menu.Item>
            <Menu.Item key="粘贴" icon={<Icon component={Paste} style={{fontSize: 18}}/>}>粘贴</Menu.Item>
            <Menu.Item key="上传" icon={<Icon component={UploadIcon} style={{fontSize: 18}}/>}>上传</Menu.Item>
            <Menu.Item key="下载" icon={<Icon component={Download} style={{fontSize: 18}}/>}>下载</Menu.Item>
            <Menu.Item key="分享" icon={<Icon component={Share} style={{fontSize: 18}}/>}>分享</Menu.Item>
            <Menu.Item key="查看历史版本" icon={
                <Icon component={RollBack} style={{fontSize: 18}}/>}>查看历史版本</Menu.Item>
            <Menu.Item key="删除" icon={<Icon component={Delete} style={{fontSize: 18}}/>}>删除</Menu.Item>
            <Menu.Item key="刷新" icon={<SyncOutlined
                style={{fontSize: 18, color: BasicStyle["@primary-color"]}}/>}>刷新</Menu.Item>
        </Menu>
    );
    return (
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
                             onDoubleClick={() => {doubleClickFile()}}
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
                             onClick={(e) => {
                                 e.stopPropagation()
                                 if (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) {
                                     FileStore.addCheckedFile(file.name, false)
                                 }else if(e.shiftKey){
                                     shiftAddCheckedFile(listIndex)
                                 }else{
                                     FileStore.addCheckedFile(file.name)
                                 }
                                 cauSize()
                             }}
                             onDoubleClick={() => {doubleClickFile()}}
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
            </div>
        </Dropdown>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(File));
