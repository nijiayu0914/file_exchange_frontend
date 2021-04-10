/**
 * @description: 文件操作组件容器
 */
import React, { useEffect, useState } from "react";
import "./FinderContainer.less";
import { inject, observer } from "mobx-react";
import { Collapse } from 'antd';
import { SyncOutlined, ClearOutlined } from '@ant-design/icons';
import Files from "../Files/Files";
import CopyPanel from "../CopyPanel/CopyPanel";
import RecycleBin from "../recycleBinPanel/RecycleBin";
const { Panel } = Collapse;

export const FinderContainer: React.FC<any> = (props) => {
    const { uuid, libraryName, FileStore } = props
    const [RecycleBinList, setRecycleBinList] = useState<RecycleBinProps[]>([])
    // 通过状态决定文件列表页面是否需要强制刷新，避免初始化时多次调用接口
    const [BinChange, setBinChange] = useState<boolean>(false)
    /**
     * 刷新按钮
     */
    const genSyncOutlined = () => (
        <SyncOutlined onClick={
            event => {
                event.stopPropagation()
                listDeleteMarkers(false, true)
            }}/>
        )
    /**
     * 清空按钮
     */
    const genClearOutlined = () => (
        <ClearOutlined onClick={
            event => {
                event.stopPropagation()
                FileStore.clearCopiedFile()
            }}/>
        )
    /**
     * 列举删除标记
     * @param {boolean} refresh 是否刷新页面
     * @param {boolean} force 是否强制刷新回收站缓存，默认false，如果接口存在缓存，则读取缓存
     */
    const listDeleteMarkers = (refresh: boolean=false, force: boolean=false) => {
        FileStore.listDeleteMarkers(uuid, force).then(res =>{
            let binData: RecycleBinProps[] = []
            res.data && res.data.forEach(item => {
                item['uuid'] = uuid
                item['libraryName'] = libraryName
                item['showName'] = item['key'].replace(uuid + "/", "")
                binData.push(item)
            })
            setRecycleBinList(binData)
            if(refresh){
                setBinChange(pre => {return !pre})
            }
        })
    }
    useEffect(() => {
        listDeleteMarkers()
        // eslint-disable-next-line
    }, [])

    return (
        <div className="finderContainer_container">
            <div className="finderContainer_left">
                <Files
                    uuid={uuid}
                    libraryName={libraryName}
                    RecycleBinList={RecycleBinList}
                    listDeleteMarkers={listDeleteMarkers}
                    BinChange={BinChange}
                    setBinChange={setBinChange}
                />
            </div>
            <div className="finderContainer_right">
                <Collapse
                    defaultActiveKey={['copy', 'recycle']}
                    expandIconPosition="left"
                    ghost={true}
                >
                    <Panel
                        header="复制板"
                        key="copy"
                        extra={genClearOutlined()}
                    >
                        <CopyPanel uuid={uuid} libraryName={libraryName}/>
                    </Panel>
                    <Panel
                        header="回收站"
                        key="recycle"
                        extra={genSyncOutlined()}>
                        <RecycleBin
                            RecycleBinList={RecycleBinList}
                            listDeleteMarkers={listDeleteMarkers}
                            setBinChange={setBinChange}
                        />
                    </Panel>
                </Collapse>
            </div>
        </div>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(FinderContainer));
