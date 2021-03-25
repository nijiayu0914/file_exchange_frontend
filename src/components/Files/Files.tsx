import React, { useState, useEffect } from "react";
import "./Files.less";
import { inject, observer } from "mobx-react";
import { BasicStyle } from "../../theme/classic"
import { LeftCircleFilled, RightCircleFilled, SyncOutlined } from '@ant-design/icons';
import {Input, message, Modal, Progress, Upload} from "antd";
import OSS from 'ali-oss'
import UploadIcon from "../../assets/pageicon/Upload.svg";
import Download from "../../assets/pageicon/Download.svg";
import Copy from "../../assets/pageicon/Copy.svg";
import Delete from "../../assets/pageicon/Delete.svg";
import Look from "../../assets/pageicon/Look.svg";
import CreateFolder from "../../assets/pageicon/CreateFolder.svg";
import List from "../../assets/pageicon/List.svg";
import View from "../../assets/pageicon/View.svg";
import File from "../File/File"
const { Search } = Input;

export const Files: React.FC<any> = (props) => {
    const { uuid, libraryName, FileStore } = props
    const [currentFilePath, setCurrentFilePath] = useState<string>('')
    const [currentFileList, setCurrentFileList] = useState<object[]>([])
    const [showMethod, setShowMethod] = useState<boolean>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const changeFilePath = (path: string) => {
        setCurrentFilePath(path)
    }
    const showMethodTrigger = () => {
        setShowMethod((prevState => {
            return !prevState
        }))
    }
    const listFiles = (uuid: string, currentFilePath: string) => {
        FileStore.listFiles(uuid, currentFilePath).then((res) => {
            const data: object = res.data
            let dirs: object[] = data["dirs"] ? data["dirs"] : []
            let files: object[] = data["files"] ? data["files"] : []
            let collectionData = dirs.concat(files)
            let currentFiles: FileProps[] = []
            for(let i = 0; i < collectionData.length; i++){
                let file: FileProps = {
                    'name': '', 'size': 0, 'category': '',
                    'originName': '', 'rename': '', 'versionId': '',
                    'contentType': '', 'modifyTime': '', 'suffix': ''
                }
                if(collectionData[i]['meta']['X-Oss-Meta-Category'][0] === 'folder'){
                    file['name'] = collectionData[i]['basic']
                    file['size'] = 0
                    file['category'] = 'folder'
                    file['suffix'] = ''
                }else if(collectionData[i]['meta']['X-Oss-Meta-Category'][0] === 'file'){
                    file['name'] = collectionData[i]['basic']['Key']
                    file['size'] = collectionData[i]['basic']['Size']
                    file['category'] = 'file'
                    const fileNameSplit = collectionData[i]['meta']['X-Oss-Meta-Origin-Name'][0].split('.')
                    file['suffix'] = decodeURIComponent(fileNameSplit[fileNameSplit.length - 1]).toLowerCase()
                }else{
                    continue
                }
                file['originName'] = decodeURIComponent(collectionData[i]['meta']['X-Oss-Meta-Origin-Name'][0])
                file['rename'] = decodeURIComponent(collectionData[i]['meta']['X-Oss-Meta-Rename'][0])
                file['versionId'] = collectionData[i]['meta']['X-Oss-Version-Id'][0]
                file['contentType'] = collectionData[i]['meta']['Content-Type'][0]
                file['modifyTime'] = collectionData[i]['meta']['Last-Modified'][0]
                currentFiles.push(file)
            }
            setCurrentFileList(currentFiles)
        })
    }
    const createFolderModal = (uuid: string, currentFilePath: string) => {
        if (currentFilePath.length > 0){
            currentFilePath = currentFilePath + '/'
        }
        let folderName = currentFilePath + ''
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
                        listFiles(uuid, currentFilePath)
                    })
                }else{
                    message.warn("文件夹已存在")
                }
            },
        });
    }
    useEffect(() => {
        listFiles(uuid, currentFilePath)
    }, [])
    return (
        <div className="files_container">
            <div className="files_path">
                <div className="files_path_btn">
                    <LeftCircleFilled
                        style={{ color: BasicStyle["@text-color-secondary"], fontSize: 20, cursor: "pointer" }}/>
                    <RightCircleFilled
                        style={{ color: BasicStyle["@text-color-secondary"], fontSize: 20, cursor: "pointer" }} />
                    <SyncOutlined
                        style={{ color: BasicStyle["@text-color-secondary"], fontSize: 20, cursor: "pointer" }} />
                </div>
                <div className="files_path_input">
                    <div className="files_path_library_name"><span>{libraryName}</span></div>
                    <div className="files_path_split"><span>/</span></div>
                    <div className="files_path_library_search">
                        <Search
                            enterButton
                            value={currentFilePath}
                            onChange={(e) =>{
                                changeFilePath(e.target.value)
                                }
                            }
                        />
                    </div>
                </div>
                <div className="files_path_operator">
                    <div className="files_path_icon_container">
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
                                const sts = await FileStore.createSTS()
                                const ossClientParams: AliyunSTSProps = sts.data
                                ossClientParams['secure'] = false

                                let client = new OSS(ossClientParams)
                                let objectName: string;
                                if(currentFilePath.length === 0){
                                    objectName = uuid + '/' + currentFilePath + file.file['name']
                                }else{
                                    objectName = uuid + '/' + currentFilePath + '/' + file.file['name']
                                }
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
                                            console.log(p)
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
                                    listFiles(uuid, currentFilePath)
                                }else{
                                    message.error("上传失败")
                                }
                            }}
                            >
                            <img src={UploadIcon} alt="Upload"/>
                            <span>上传</span>
                        </Upload>
                    </div>
                    <div className="files_path_icon_container">
                        <img src={Download} alt="Download"/>
                        <span>下载</span>
                    </div>
                    <div className="files_path_icon_container">
                        <img src={Copy} alt="Copy"/>
                        <span>复制</span>
                    </div>
                    <div className="files_path_icon_container">
                        <img src={Delete} alt="Delete"/>
                        <span>删除</span>
                    </div>
                    <div className="files_path_icon_container">
                        <img src={Look} alt="Look"/>
                        <span>查看</span>
                    </div>
                    <div
                        className="files_path_icon_container"
                        onClick={() =>createFolderModal(uuid, currentFilePath)}
                    >
                        <img src={CreateFolder} alt="Create Folder"/>
                        <span>新建</span>
                    </div>
                    {showMethod ?
                        (
                            <div
                                className="files_path_icon_container"
                                style={{margin: "0 0 0 10px", minWidth: "30px"}}
                                onClick={showMethodTrigger}
                            >
                                <img src={View} alt="View"/>
                            </div>
                        ) : (
                            <div
                                className="files_path_icon_container"
                                style={{margin: "0 0 0 10px", minWidth: "30px"}}
                                onClick={showMethodTrigger}
                            >
                                <img src={List} alt="List"/>
                            </div>
                        )}
                </div>
            </div>
            <div className="files_show">
                {currentFileList.map((item, idx) => (
                    <File key={idx} file={item} how={showMethod}/>
                ))
                }
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

        </div>
    );
}

export default inject('FileStore')(observer(Files))
