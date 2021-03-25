import React, {useState} from "react";
import "./FinderContainer.less";
import { inject, observer } from "mobx-react";
import { Collapse } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import Files from "../Files/Files";
const { Panel } = Collapse;


export const FinderContainer: React.FC<any> = (props) => {
    const { uuid, libraryName, LibraryStore, FileStore } = props
    const genSyncOutlined = () => (<SyncOutlined onClick={event => {event.stopPropagation();}}/>)
    return (
        <div className="finderContainer_container">
            <div className="finderContainer_left">
                <Files uuid={uuid} libraryName={libraryName}/>
            </div>
            <div className="finderContainer_right">
                <Collapse
                    defaultActiveKey={['2']}
                    expandIconPosition="left"
                    ghost={true}
                >
                    <Panel header="复制板" key="1" extra={genSyncOutlined()}>
                        <div>111</div>
                    </Panel>
                    <Panel
                        header="回收站"
                        key="2"
                        extra={genSyncOutlined()}>

                    </Panel>
                </Collapse>
            </div>
        </div>
    );
}

export default inject('LibraryStore', 'FileStore')(observer(FinderContainer));
