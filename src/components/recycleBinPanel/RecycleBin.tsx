import React from "react";
import "./RecycleBin.less";
import { inject, observer } from "mobx-react";
import { BasicStyle } from "../../theme/classic"
import { message, Tag, Tooltip} from "antd";

export const RecycleBin: React.FC<any> = (props) => {
    const { RecycleBinList, listDeleteMarkers, FileStore } = props
    const restoreFile = (uuid: string, path: string) => {
        FileStore.restoreFile(uuid, path).then(() => {
            listDeleteMarkers(true, true)
            message.success("还原成功").then()
        })
    }
    const DeleteFilesForever = (uuid: string, fileNames: string[]) => {
        FileStore.deleteFilesForever(uuid, fileNames).then(() => {
            listDeleteMarkers(true, true)
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
                            "删除日期:" + item.lastModified
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

export default inject('FileStore')(observer(RecycleBin))
