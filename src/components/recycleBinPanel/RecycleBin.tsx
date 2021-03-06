/**
 * @description: 回收站
 */
import React from "react";
import "./RecycleBin.less";
import { inject, observer } from "mobx-react";
import { BasicStyle } from "../../theme/classic"
import { message, Tag, Tooltip} from "antd";

export const RecycleBin: React.FC<any> = (props) => {
    const { RecycleBinList, listDeleteMarkers, LibraryStore, FileStore } = props
    /**
     * 回收站操作后，更新相关页面列举文件缓存
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件名称
     */
    const refreshFilesCache = (uuid: string, fileName: string) => {
        if(fileName[fileName.length - 1] === '/'){
            fileName = fileName.slice(0, fileName.length - 1)
        }
        if(fileName.indexOf('/') !== -1){
            FileStore.listFiles(uuid, fileName.slice(0, fileName.lastIndexOf('/') + 1), '/', true)
        }
    }
    /**
     * 还原文件
     * @param {string} uuid 资料夹uuid
     * @param {string} path 文件路径
     */
    const restoreFile = (uuid: string, path: string) => {
        FileStore.restoreFile(uuid, path).then(() => {
            listDeleteMarkers(true, true)
            refreshFilesCache(uuid, path)
            message.success("还原成功").then()
        })
    }
    /**
     * 永久删除文件
     * @param {string} uuid 资料夹uuid
     * @param {string[]} fileNames 文件名称数组
     */
    const DeleteFilesForever = (uuid: string, fileNames: string[]) => {
        for(let i = 0; i < fileNames.length; i ++){
            let key: string = fileNames[i]
            if(key[key.length - 1] === '/'){
                let keySplit: string[] = key.split('/')
                let keyWord: string = keySplit[keySplit.length - 2]
                for(let j = 0; j < RecycleBinList.length; j ++){
                    let item: RecycleBinProps = RecycleBinList[j]
                    if(item.key.replace(
                        item.uuid + '/', '') === key){
                        continue
                    }
                    if(item.key.indexOf(keyWord) !== -1){
                        message.warn(
                            "请先删除文件夹中的文件，再删除文件夹", 3).then()
                        return
                    }
                }
            }
        }
        FileStore.deleteFilesForever(uuid, fileNames).then(() => {
            listDeleteMarkers(true, true)
            fileNames.forEach(fileName => {
                refreshFilesCache(uuid, fileName)
            })
            LibraryStore.listLibrary()
            message.success("删除成功").then()
        })
    }
    return (
        <div className="recycle_bin_panel_collapse">
            {RecycleBinList.map((item: RecycleBinProps, index) => {
                return (
                    <div className="recycle_bin_panel_collapse_main" key={index}>
                        {item.isLatest ?
                            <Tag color="green">Latest</Tag>
                            :
                            <Tag color="volcano">History</Tag>
                        }
                        <Tooltip title={
                            "文件名:" + item.showName
                        } placement="topLeft"
                                 color={BasicStyle["@level5"]}>
                            <span className="recycle_bin_panel_collapse_content">{item.showName}</span>
                        </Tooltip>
                        <div
                            className="recycle_bin_panel_collapse_restore"
                            onClick={() =>{restoreFile(item.uuid, item.showName)}}
                        >
                            <Tag color="geekblue">还原</Tag>
                        </div>
                        <div
                            className="recycle_bin_panel_collapse_delete"
                            onClick={() =>{DeleteFilesForever(item.uuid, [item.showName])}}
                        >
                            <Tag color="magenta">删除</Tag>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default inject('LibraryStore', 'FileStore')(observer(RecycleBin))
