import React, { useState, useEffect, useRef } from "react";
import "./Files.less";
import { REACT_APP_HTTPS } from "../../config"
import { inject, observer } from "mobx-react";
import { BasicStyle } from "../../theme/classic"
import Icon, { LeftCircleFilled, RightCircleFilled, SyncOutlined } from '@ant-design/icons';
import {Drawer, Select, Input, message, Modal, Progress, Tooltip, Upload, Dropdown, Menu} from "antd";
import OSS from 'ali-oss'
import { ReactComponent as UploadIcon } from "../../assets/pageicon/Upload.svg";
import { ReactComponent as Download } from "../../assets/pageicon/Download.svg";
import { ReactComponent as Copy } from "../../assets/pageicon/Copy.svg";
import { ReactComponent as Delete } from "../../assets/pageicon/Delete.svg";
import { ReactComponent as Look } from "../../assets/pageicon/Look.svg";
import { ReactComponent as CreateFolder } from "../../assets/pageicon/CreateFolder.svg";
import { ReactComponent as List } from "../../assets/pageicon/List.svg";
import { ReactComponent as View } from "../../assets/pageicon/View.svg";
import { ReactComponent as Folder } from "../../assets/fileicon/File.svg";
import File from "../File/File"
import {ReactComponent as Paste} from "../../assets/pageicon/Paste.svg";
const { Option } = Select;

export const Files: React.FC<any> = (props) => {
    const { uuid, libraryName, BinChange, listDeleteMarkers, LibraryStore, FileStore } = props
    const [isInit, setIsInit] = useState<boolean>(true)
    const [currentFilePath, setCurrentFilePath] = useState<string>('')
    const [currentSearchPath, setCurrentSearchPath] = useState<string>('')
    const [currentFileList, setCurrentFileList] = useState<FileProps[]>([])
    const [showMethod, setShowMethod] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const [checkedSize, setCheckedSize] = useState<string>('0b')
    const [look, setLook] = useState<boolean>(false)
    const [lookedFile, setlookedFile] = useState<FileProps[]>([])
    const [controlClick, setControlClick] = useState<boolean>(false)
    const [historyPath, setHistoryPath] = useState<string[]>([''])
    const [historyPathCursor, setHistoryPathCursor] = useState<number>(0)
    const [contextMenuSelected, setContextMenuSelected] = useState<string[]>([])
    const uploadComponent = useRef(null)

    const copyKeyboardEvent = (e) => {
        if(e.keyCode === 67){
            if(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey){
                FileStore.addCopiedFile()
            }
        }else if(e.keyCode === 86){
            if(navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey){
                FileStore.copyFiles(uuid, uuid + '/' + currentFilePath).then(() => {
                    listFiles(uuid, currentFilePath, true)
                    LibraryStore.listLibrary()
                })
            }
        }
    }
    const addHistoryPath = (path: string) => {
        if(historyPathCursor === 0){
            let oldPath = historyPath.slice(0)
            if(oldPath[0] !== path){
                oldPath.unshift(path)
                setHistoryPath(oldPath)
            }
        }else{
            let oldPath = historyPath.slice(
                historyPathCursor, historyPath.length)
            if(oldPath[0] !== path){
                oldPath.unshift(path)
                setHistoryPath(oldPath)
            }
            setHistoryPathCursor(0)
        }
    }
    const historyBackward = () => {
        if(historyPathCursor < historyPath.length - 1){
            let path: string = historyPath[historyPathCursor + 1]
            setHistoryPathCursor(historyPathCursor + 1)
            changeFilePath(path, false)
        }
    }
    const historyForward = () => {
        if(historyPathCursor > 0){
            let path: string = historyPath[historyPathCursor - 1]
            setHistoryPathCursor(historyPathCursor - 1)
            changeFilePath(path, false)
        }
    }
    const changeSearchPath = (path: string) => {
        setCurrentSearchPath(path)
    }
    const changeFilePath = (path: string, addHistory: boolean = true) => {
        setCurrentFilePath(path)
        setCurrentSearchPath(path)
        if(addHistory){
            addHistoryPath(path)
        }
    }
    const showMethodTrigger = () => {
        setShowMethod((prevState => {
            return !prevState
        }))
    }
    const listFiles = (uuid: string, currentFilePath: string, force: boolean = false) => {
        setControlClick(true)
        FileStore.listFiles(uuid, currentFilePath, '/', force).then((res) => {
            const data: object = res.data
            let dirs: object[] = data["dirs"] ? data["dirs"] : []
            let files: object[] = data["files"] ? data["files"] : []
            let folderCount: number = 0
            let fileCount: number = 0
            let collectionData = dirs.concat(files)
            let currentFiles: FileProps[] = []
            for(let i = 0; i < collectionData.length; i++){
                let file: FileProps = {
                    'name': '', 'size': 0, 'category': '',
                    'originName': '', 'rename': '', 'versionId': '',
                    'contentType': '', 'modifyTime': '', 'suffix': ''
                }
                if(collectionData[i]['meta']['X-Oss-Meta-Category'] &&
                    collectionData[i]['meta']['X-Oss-Meta-Category'][0] === 'folder'){
                    file['name'] = collectionData[i]['basic']
                    file['size'] = 0
                    file['category'] = 'folder'
                    file['suffix'] = ''
                    folderCount += 1
                }else if(collectionData[i]['meta']['X-Oss-Meta-Category'] &&
                    collectionData[i]['meta']['X-Oss-Meta-Category'][0] === 'file'){
                    file['name'] = collectionData[i]['basic']['Key']
                    file['size'] = collectionData[i]['basic']['Size']
                    file['category'] = 'file'
                    const fileNameSplit = collectionData[i]['meta']['X-Oss-Meta-Origin-Name'][0].split('.')
                    file['suffix'] = decodeURIComponent(fileNameSplit[fileNameSplit.length - 1]).toLowerCase()
                    fileCount += 1
                }else if(!collectionData[i]['meta']['X-Oss-Meta-Category']){
                    file['name'] = collectionData[i]['basic']
                    file['size'] = 0
                    file['category'] = 'folder'
                    file['suffix'] = ''
                    folderCount += 1
                }else{
                    continue
                }
                file['originName'] = decodeURIComponent(
                    collectionData[i]['meta']['X-Oss-Meta-Origin-Name'] ?
                        collectionData[i]['meta']['X-Oss-Meta-Origin-Name'][0] : '')
                file['rename'] = decodeURIComponent(
                    collectionData[i]['meta']['X-Oss-Meta-Rename'] ?
                        collectionData[i]['meta']['X-Oss-Meta-Rename'][0] : '')
                file['versionId'] = collectionData[i]['meta']['X-Oss-Version-Id'] ?
                    collectionData[i]['meta']['X-Oss-Version-Id'][0] : ''
                file['contentType'] = collectionData[i]['meta']['Content-Type'] ?
                    collectionData[i]['meta']['Content-Type'][0] : ''
                file['modifyTime'] = collectionData[i]['meta']['Last-Modified'] ?
                    collectionData[i]['meta']['Last-Modified'][0] : ''
                if(file.originName !== currentFilePath){
                    currentFiles.push(file)
                }
            }
            setCurrentFileList(currentFiles)
            if(currentFilePath.indexOf('/') !== -1){
                folderCount -= 1
            }
            if(folderCount < 0){
                folderCount = 0
            }
            FileStore.addCurrentStatisticData(
                uuid, folderCount || 0, fileCount || 0)
            setTimeout(() => {
                setControlClick(false)
            }, 5000)
        })
    }
    const createFolderModal = (uuid: string, currentFilePath: string) => {
        let folderName: string
        Modal.confirm({
            title: "创建新文件夹？",
            content: (
                <div>
                    <span>文件夹名称:</span>
                    <Input
                        onChange={(e) =>{
                            folderName = currentFilePath + e.target.value
                        }}
                    />
                </div>
            ),
            onOk: async () => {
                const isExistRes: any = await FileStore.fileExist(uuid, folderName + '/')
                const isExist: boolean = isExistRes.data
                if(!isExist){
                    FileStore.createFolder(uuid, folderName).then(() => {
                        message.success("创建成功")
                        listFiles(uuid, currentFilePath, true)
                    })
                }else{
                    message.warn("文件夹已存在")
                }
            },
        });
    }
    const cauSize = () => {
        let sizeAll: number = 0
        currentFileList.forEach(item => {
            if(FileStore.checkedFile.has(item['name'])){
                sizeAll += item['size']
            }
        })
        let res: string
        if(sizeAll <= 1024){
            res = sizeAll + 'b'
        }else if(sizeAll <= 1024 * 1024){
            res = (sizeAll / 1024).toFixed(2) + 'Kb'
        }else if(sizeAll <= 1024 * 1024 * 1024){
            res = (sizeAll / 1024 / 1024).toFixed(2) + 'Mb'
        }else{
            res = (sizeAll / 1024 / 1024 / 1024).toFixed(2) + 'Gb'
        }
        setCheckedSize(res)
    }
    const clickLook = () => {
        setLook((pre: boolean) => {
            return !pre
        })
        let lookedFile: FileProps[] = []
        currentFileList.forEach(item => {
            if(FileStore.checkedFile.has(item.name)){
                lookedFile.push(item)
            }
        })
        setlookedFile(lookedFile)
    }
    const downloadFile = async (download: boolean = true) => {
        for (const item of currentFileList) {
            if (FileStore.checkedFile.has(item.name)) {
                const downloadRes = await FileStore.downloadFile(
                    uuid, item.name.replace(uuid + '/', ''))
                if(downloadRes['code'] === 200){
                    if(download){
                        window.open(downloadRes['data']);
                    }else{
                        return downloadRes['data']
                    }
                }else{
                    message.info(item.rename + ",下载失败")
                }
            }
        }
    }
    const deleteFile = async () => {
        for (const item of currentFileList) {
            if (FileStore.checkedFile.has(item.name)) {
                if(item.category === 'folder'){
                    await FileStore.deleteFolder(
                        uuid, item.name.replace(uuid + '/', ''))
                }else{
                    await FileStore.deleteFile(
                        uuid, item.name.replace(uuid + '/', ''))
                }
                message.success(item.rename + ',删除成功')
            }
        }
        listFiles(uuid, currentFilePath, true)
    }
    const shiftAddCheckedFile = (key: number) => {
        let gap: number[] = [key]
        let hasChecked = Array.from(FileStore.checkedFile)
        for(let i = 0; i < currentFileList.length; i++){
            if(currentFileList[i].name === hasChecked[hasChecked.length - 1]){
                gap.push(i)
                gap.sort((a: number, b: number) => {return a - b})
                break
            }
        }
        for(let i = gap[0]; i <= gap[gap.length - 1]; i++){
            FileStore.addCheckedFile(currentFileList[i].name, false, true)
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", copyKeyboardEvent)
        return () => {
            window.removeEventListener("keydown", copyKeyboardEvent)
        }
        // eslint-disable-next-line
    }, [currentFilePath])
    useEffect(() => {
        listFiles(uuid, currentFilePath, false)
        // eslint-disable-next-line
    }, [currentFilePath])
    useEffect(() => {
        if(isInit){
            setIsInit(false)
        }else{
            listFiles(uuid, currentFilePath, true)
        }
        // eslint-disable-next-line
    }, [BinChange])
    useEffect(() => {
        setControlClick(false)
        return () => {
            setControlClick(false)
        }
    }, []);
    const menu = (
        <Menu
            selectable
            selectedKeys={contextMenuSelected}
            className="context_menu_icon_theme_color"
            style={
                FileStore.checkedFile.size === 0 ?
                {
                width: "200px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                backgroundColor: BasicStyle["@body-background"]
                } : {display: 'none'}
            }
            onSelect={(info) => {
                switch(info.key){
                    case "新建文件夹":
                        createFolderModal(uuid, currentFilePath)
                        setContextMenuSelected([])
                        break
                    case "粘贴":
                        FileStore.copyFiles(uuid, uuid + '/' + currentFilePath).then(
                            () => {
                                listFiles(uuid, currentFilePath, true)
                                LibraryStore.listLibrary()
                            })
                        setContextMenuSelected([])
                        break
                    case "上传":
                        // @ts-ignore
                        uploadComponent.current.getElementsByTagName("INPUT")[0].click()
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
            <Menu.Item key="新建文件夹" icon={<Icon component={CreateFolder}
                                               style={{fontSize: 22}}/>}>新建文件夹</Menu.Item>
            <Menu.Item key="粘贴" icon={<Icon component={Paste} style={{fontSize: 18}}/>}>粘贴</Menu.Item>
            <Menu.Item key="上传" icon={<Icon component={UploadIcon} style={{fontSize: 18}}/>}>上传</Menu.Item>
            <Menu.Item key="刷新" icon={<SyncOutlined
                style={{fontSize: 18, color: BasicStyle["@primary-color"]}}/>}>刷新</Menu.Item>
        </Menu>
    );
    return (
        <div className="files_container">
            <div className="files_path">
                <div className="files_path_btn">
                    <LeftCircleFilled
                        className="files_btn_style"
                        style={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => {
                            historyBackward()
                        }}
                    />
                    <RightCircleFilled
                        className="files_btn_style"
                        style={{ fontSize: 20, cursor: "pointer" }}
                        onClick={() => {
                            historyForward()
                        }}
                    />
                    <SyncOutlined
                        className="files_btn_style"
                        style={{ color: BasicStyle["@primary-color"], fontSize: 20, cursor: "pointer" }}
                        onClick = {() => {
                            if(controlClick){
                                message.info("点击过于频繁").then()
                            }else{
                                listFiles(uuid, currentFilePath, true)
                            }
                        }}
                    />
                </div>
                <div className="files_path_input">
                    <div className="files_path_library_name"><span>{libraryName}</span></div>
                    <div className="files_path_split"><span>/</span></div>
                    <div className="files_path_library_search">
                        <Select
                            showSearch
                            value={currentSearchPath}
                            style={{ width: "100%" }}
                            onSearch={(value: string) => {
                                changeSearchPath(value)
                                }
                            }
                            onSelect={(value: string) => {
                                changeFilePath(value)
                            }}
                        >
                            {currentFileList.map(item => {
                                if(item.category === 'folder'){
                                    return (
                                        <Option key={item.originName} value={item.originName}>
                                            <Icon component={Folder} style={{fontSize: 16}}/>
                                            {item.rename}
                                        </Option>
                                    )
                                }
                                return null
                            })}
                        </Select>
                    </div>
                </div>
                <div className="files_path_operator">
                    <div className="files_path_icon_container" ref={uploadComponent}>
                        <Upload
                            name="upload_file"
                            multiple={true}
                            showUploadList={false}
                            beforeUpload={
                                (file, fileList) => {
                                    if(fileList.length === 1){
                                        if(file.name.indexOf("/") !== -1){
                                            message.warn("文件名称不能含有'/'").then()
                                            return false
                                        }
                                        if(file.size / 1024 / 1024 >= 2048){
                                            message.warn("文件必须小于2Gb").then()
                                            return false
                                        }
                                        return true
                                    }else{
                                        for (let i = 0; i < fileList.length; i++){
                                            if(fileList[i].name.indexOf("/") !== -1){
                                                message.warn("文件名称不能含有'/'").then()
                                                return false
                                            }
                                            if(fileList[i].size / 1024 / 1024 >= 2048){
                                                message.warn("文件必须小于2Gb").then()
                                                return false
                                            }
                                        }
                                        return true
                                    }
                                }
                            }
                            customRequest={async (file) => {
                                const capCheck = await FileStore.checkCapacity(uuid)
                                if(file.file['size'] / 1024 / 1024 > capCheck['data']['free']){
                                    message.warning("已超限额，无法上传")
                                    return
                                }
                                const sts = await FileStore.createSTS()
                                const ossClientParams: AliyunSTSProps = sts.data
                                ossClientParams['secure'] = REACT_APP_HTTPS ? JSON.parse(REACT_APP_HTTPS) : false

                                let client = new OSS(ossClientParams)
                                let objectName: string;
                                objectName = uuid + '/' + currentFilePath + file.file['name']
                                let uploadRes = await client.multipartUpload(
                                    objectName,
                                    file.file,
                                    {
                                        meta: {
                                            "category": "file",
                                            "origin-name": encodeURIComponent(file.file['name']),
                                            "rename": encodeURIComponent(file.file['name']),
                                        },
                                        progress: (p, _checkpoint) => {
                                            setUploadProgress(p)
                                        }
                                    }
                                    )
                                if(uploadRes.res.status === 200){
                                    FileStore.updateUsage(
                                        uuid, file.file['size'] / 1024 / 1024, "increase").then(
                                            () => {
                                                message.success("上传成功")
                                                setUploadProgress(0)
                                    })
                                    listFiles(uuid, currentFilePath, true)
                                    LibraryStore.listLibrary()
                                }else{
                                    message.error("上传失败")
                                }
                            }}
                            >
                            <div className="files_path_icon_container files_path_icon_theme_color"
                                 style={{height: "100%", paddingTop: "6px"}}>
                                <Icon component={UploadIcon} style={{fontSize: 24}}/>
                                <span>上传</span>
                            </div>
                        </Upload>
                    </div>
                    <div className="files_path_icon_container files_path_icon_theme_color"
                         style={
                             FileStore.checkedFile.size === 0 ?
                                 {opacity: 0.4, pointerEvents: "none"} : {opacity: 1}}
                         onClick={() => {downloadFile().then()}}
                    >
                        <Icon component={Download} style={{fontSize: 24}}/>
                        <span>下载</span>
                    </div>
                    <div className="files_path_icon_container  files_path_icon_theme_color"
                         style={
                             FileStore.checkedFile.size === 0 ?
                                 {opacity: 0.4, pointerEvents: "none"} : {opacity: 1}}
                         onClick={() => {FileStore.addCopiedFile()}}
                    >
                        <Icon component={Copy} style={{fontSize: 24}}/>
                        <span>复制</span>
                    </div>
                    <div className="files_path_icon_container files_path_icon_theme_color"
                         style={
                             FileStore.checkedFile.size === 0 ?
                                 {opacity: 0.4, pointerEvents: "none"} : {opacity: 1}}
                         onClick={() => {
                             deleteFile().then(() => {
                                 listDeleteMarkers(true, true)
                             })
                         }}
                    >
                        <Icon component={Delete} style={{fontSize: 24}}/>
                        <span>删除</span>
                    </div>
                    <div className="files_path_icon_container files_path_icon_theme_color"
                         style={
                             FileStore.checkedFile.size === 0 ?
                                 {opacity: 0.4, pointerEvents: "none"} : {opacity: 1}}
                         onClick={() => {clickLook()}}
                    >
                        <Icon component={Look} style={{fontSize: 20}}/>
                        <span>查看</span>
                    </div>
                    <div
                        className="files_path_icon_container files_path_icon_theme_color"
                        onClick={() =>createFolderModal(uuid, currentFilePath)}
                    >
                        <Icon component={CreateFolder} style={{fontSize: 32}}/>
                        <span>新建</span>
                    </div>
                    {showMethod ?
                        (
                            <div
                                className="files_path_icon_container"
                                style={{margin: "0 0 0 10px", minWidth: "30px"}}
                                onClick={showMethodTrigger}
                            >
                                <Icon component={View} style={{fontSize: 20}}/>
                            </div>
                        ) : (
                            <div
                                className="files_path_icon_container"
                                style={{margin: "0 0 0 10px", minWidth: "30px"}}
                                onClick={showMethodTrigger}
                            >
                                <Icon component={List} style={{fontSize: 20}}/>
                            </div>
                        )}
                </div>
            </div>
            <Dropdown overlay={menu} trigger={['contextMenu']}>
                <div
                    className="files_show"
                    onClick={() => {
                        FileStore.clearCheckedFile()
                        cauSize()
                    }}
                    onMouseDown={(e) => {
                        if(e.button === 2){
                            FileStore.clearCheckedFile()
                            cauSize()
                        }
                    }}
                >
                    {currentFileList.map((item, index) => {
                        return <File
                            key={index}
                            listIndex={index}
                            uuid = {uuid}
                            currentFilePath={currentFilePath}
                            file={item}
                            how={showMethod}
                            currentSearchPath={currentSearchPath}
                            uploadComponent={uploadComponent}
                            listFiles={listFiles}
                            shiftAddCheckedFile={shiftAddCheckedFile}
                            changeFilePath={changeFilePath}
                            cauSize={cauSize}
                            clickLook={clickLook}
                            createFolderModal={createFolderModal}
                            downloadFile={downloadFile}
                            deleteFile={deleteFile}
                            listDeleteMarkers={listDeleteMarkers}
                        />
                    })}
                </div>
            </Dropdown>
            <div className="files_info">
                <div><span>选中文件:</span><span>{FileStore.checkedFile.size}</span><span>个</span></div>
                <div><span>总大小:</span><span>{checkedSize}</span></div>
            </div>
            <div className="files_progress">
                <Progress
                    percent={uploadProgress * 100}
                    showInfo={false}
                    strokeColor={{
                        '0%': BasicStyle["@level1"],
                        '100%': BasicStyle["@level5"],
                    }}
                    trailColor="transparent"
                />
            </div>
            <Drawer
                title="文件信息"
                placement="right"
                closable={false}
                visible={look}
                onClose={clickLook}
                getContainer={false}
                width="20%"
                headerStyle={{backgroundColor: BasicStyle["@level2"]}}
                bodyStyle={{backgroundColor: BasicStyle["@component-background"]}}
            >
                {lookedFile.map(item => (
                    <div className="files_look_container">
                        <div className="files_look_row">
                            <span className="files_look_tag">文件原名:</span>
                            <Tooltip title={item.originName} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{item.originName}</span>
                            </Tooltip>
                        </div>
                        <div className="files_look_row">
                            <span className="files_look_tag">文件重命名:</span>
                            <Tooltip title={item.rename} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{item.rename}</span>
                            </Tooltip>
                        </div>
                        <div className="files_look_row">
                            <span className="files_look_tag">文件类型:</span>
                            <Tooltip title={item.suffix} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{item.suffix || item.category}</span>
                            </Tooltip>
                        </div>
                        <div className="files_look_row">
                            <span className="files_look_tag">文件大小:</span>
                            <Tooltip title={item.size} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{item.size}</span>
                            </Tooltip>
                        </div>
                        <div className="files_look_row">
                            <span className="files_look_tag">文件版本:</span>
                            <Tooltip title={item.versionId} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{item.versionId}</span>
                            </Tooltip>
                        </div>
                        <div className="files_look_row">
                            <span className="files_look_tag">最新修改时间:</span>
                            <Tooltip title={
                                new Date(item.modifyTime).toLocaleString()} placement="topLeft"
                                     color={BasicStyle["@level5"]}>
                                <span className="files_look_content">{
                                    new Date(item.modifyTime).toLocaleString()}</span>
                            </Tooltip>
                        </div>
                    </div>
                ))}
            </Drawer>
        </div>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(Files))
