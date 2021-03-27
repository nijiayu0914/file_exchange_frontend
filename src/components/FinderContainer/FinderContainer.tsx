import React, {useEffect, useState} from "react";
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
    const genSyncOutlined = () => (
        <SyncOutlined onClick={
            event => {
                event.stopPropagation()
                listDeleteMarkers()
            }}/>
        )
    const genClearOutlined = () => (
        <ClearOutlined onClick={
            event => {
                event.stopPropagation()
                FileStore.clearCopiedFile()
            }}/>
        )
    const listDeleteMarkers = () => {
        FileStore.listDeleteMarkers(uuid).then(res =>{
            let binData: RecycleBinProps[] = []
            res.data && res.data.forEach(item => {
                item['uuid'] = uuid
                item['libraryName'] = libraryName
                item['showName'] = item['key'].replace(uuid + "/", "")
                binData.push(item)
            })
            setRecycleBinList(binData)
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
                        />
                    </Panel>
                </Collapse>
            </div>
        </div>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(FinderContainer));
