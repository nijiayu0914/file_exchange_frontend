import React, { useState }  from "react";
import "./Login.less";
import SignIn  from "../../components/SignIn/SignIn";
import SignUp from "../../components/SignUp/SignUp";
import WebsiteFiling from "../../components/WebsiteFiling/WebsiteFiling";
import { ReactComponent as Logo } from "../../assets/LOGO.svg";
import Icon from "@ant-design/icons";

export const Login: React.FC = () => {
    const [tab, setTab] = useState(true);
    const trigger = (_e, status) => {
        setTab(status)
    }
    return (
        <>
            <div className="login_page">
                <div className="login_container">
                    <div className="login_title">
                        <Icon component={Logo} />
                    </div>
                    <div className="login_tab">
                        <div className="login_btn_container">
                            <div className="login_btn" onClick={(e
                            ) =>{trigger(e, true)}}><span>登录</span></div>
                            <div className={tab? "login_gap login_gap_enable": "login_gap login_gap_disable"}/>
                        </div>
                        <div className="login_btn_container">
                            <div className="login_btn" onClick={(e
                            ) =>{trigger(e, false)}}><span>注册</span></div>
                            <div className={tab? "login_gap login_gap_disable": "login_gap login_gap_enable"}/>
                        </div>
                    </div>
                    <div className="login_user">
                        {tab? <SignIn />: <SignUp />}
                    </div>
                </div>
                <WebsiteFiling />
            </div>

        </>
    );
};
