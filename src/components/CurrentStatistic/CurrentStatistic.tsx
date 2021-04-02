import React, {useEffect, useState} from "react";
import "./CurrentStatistic.less";
import { BasicStyle } from "../../theme/classic"
import { inject, observer } from "mobx-react";
import { Progress, Statistic, Tag} from "antd";

export const CurrentStatistic: React.FC<any> = (props) => {
    const { LibraryStore, FileStore } = props
    const [nowTime, setNowTime] = useState<string>()
    const [usage, setUsage] = useState<[number, number]>([0, 0])

    const readUsage = () => {
        for(let i = 0; i < LibraryStore.libraryList.length; i ++){
            if(LibraryStore.libraryList[i].uuid === FileStore.activeLibrary){
                setUsage([LibraryStore.libraryList[i]['usage_capacity'],
                    LibraryStore.libraryList[i]['capacity']])
                return
            }
        }
    }

    const refreshUsage = async () => {
        const readRes = await LibraryStore.readAllFilesSize(FileStore.activeLibrary)
        const size = readRes.data['size']
        FileStore.updateUsage(FileStore.activeLibrary, size, "overwrite").then(() => {
            LibraryStore.listLibrary()
        })
    }

    useEffect(() => {
        let ivt = setInterval(() => {
            let time = new Date()
            setNowTime(time.toLocaleDateString() + '  ' + time.toLocaleTimeString())
        }, 200)
        return () => {
            clearInterval(ivt)
        }
    }, [])
    useEffect(() => {
        readUsage()
        // eslint-disable-next-line
    }, [FileStore.activeLibrary, LibraryStore.libraryList])
    return (
        <div className="current_statistic_container">
            <div className="current_statistic_content">
                <Statistic title="文件夹数量"
                           style={{display: "flex", flexDirection: "row",
                               justifyContent: "space-around", width: "100%"}}
                           valueStyle={{ fontSize: 14, color: BasicStyle["@text-color"]}} value={
                    FileStore.currentStatisticData[FileStore.activeLibrary] ?
                        FileStore.currentStatisticData[FileStore.activeLibrary][0] : 0
                } suffix="个" />
            </div>
            <div className="current_statistic_content">
                <Statistic title="文件数量"
                           style={{display: "flex", flexDirection: "row",
                               justifyContent: "space-around", width: "100%"}}
                           valueStyle={{ fontSize: 14, color: BasicStyle["@text-color"]}} value={
                    FileStore.currentStatisticData[FileStore.activeLibrary] ?
                        FileStore.currentStatisticData[FileStore.activeLibrary][1] : 0
                } suffix="个" />
            </div>
            <div className="current_statistic_content" style={{width: 250,
                display: "flex", justifyContent: "space-between"}}>
                <span>使用量:</span>
                <Progress percent={
                    Number.parseFloat((usage[0] / usage[1] * 100).toFixed(2))}
                          steps={5} strokeColor={BasicStyle["@level3"]} />
                <Tag
                    color="purple"
                    onClick={refreshUsage}
                    style={{cursor: "pointer"}}
                >刷新</Tag>
            </div>
            <div className="current_statistic_content">
                <span>{nowTime}</span>
            </div>
        </div>
    )
}

export default inject('LibraryStore', 'FileStore')(observer(CurrentStatistic));