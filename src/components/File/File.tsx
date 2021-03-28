import React from "react";
import "./File.less"
import {inject, observer} from "mobx-react";
import {Dropdown, Menu} from 'antd';
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
        uuid, listIndex, file, how, currentSearchPath, cauSize,
        shiftAddCheckedFile, FileStore, changeFilePath } = props
    const doubleClickFile = () => {
        if(file.category === 'folder'){
            changeFilePath(file.name.replace(uuid + '/', ''))
        }
    }
    const menu = (
        <Menu
            selectable
            className="context_menu_icon_theme_color"
            style={{
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                backgroundColor: BasicStyle["@body-background"]
            }}
            onSelect={(e) => {
                console.log(e)
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
            <Menu.Item key="回滚" icon={<Icon component={RollBack} style={{fontSize: 18}}/>}>回滚</Menu.Item>
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
