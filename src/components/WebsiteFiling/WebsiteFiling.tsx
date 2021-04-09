import React, {useEffect, useState} from "react";
import "./WebsiteFiling.less"
import { inject, observer } from "mobx-react";


export const WebsiteFiling: React.FC<any> = ({ UserInfoStore }) => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [icp, setIcp] = useState<string>('')
    const [police, setPolice] = useState<string>('')
    useEffect(()=>{
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
