/**
 * @description: 网站备案信息展示组件
 */
import React, { useEffect, useState } from "react";
import "./WebsiteFiling.less"
import { inject, observer } from "mobx-react";

export const WebsiteFiling: React.FC<any> = ({ UserInfoStore }) => {
    const [isShow, setIsShow] = useState<boolean>(false) // 是否显示备案信息
    const [icp, setIcp] = useState<string>('') // ICP备案号
    const [police, setPolice] = useState<string>('') // 公安备案号
    useEffect(()=>{
        // 通过接口获取备案信息，以及是否展示
        UserInfoStore.getPlugins().then(res => {
            setIsShow(res["record_info"])
            setIcp(res["icp"])
            setPolice(res["police"])
        })
        // eslint-disable-next-line
    }, []);
    return (
        <div className="website_filing" style={{display: isShow ? 'flex' : 'none'}}>
            <div className="website_filing_center">
                <span>portal</span>
                <a href="http://www.beian.miit.gov.cn">{icp}</a>
                <a href="http://www.beian.gov.cn/portal/registerSystemInfo">
                    {police}
                </a>
            </div>
        </div>
    );
};

export default inject('UserInfoStore')(observer(WebsiteFiling));
