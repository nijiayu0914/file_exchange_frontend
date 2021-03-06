/**
 * @description: 用户登录
 */
import React from "react";
import "./SignIn.less";
import { useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const SignIn: React.FC<any> = ({UserInfoStore}) => {
    const history: useHistory = useHistory();
    /**
     * 更新用户名
     * @param e
     */
    const setUserName = (e) => {
        UserInfoStore.setUserName(e.target.value)
    }
    /**
     * 更新密码
     * @param e
     */
    const setPassword = (e) => {
        UserInfoStore.setPassword(e.target.value)
    }
    /**
     * 登录函数
     */
    const login = () => {
        UserInfoStore.login().then(() => {
            history.replace('/repository') // 登录成功进入主页面
        })
    }
    return (
        <div className="signin_container">
                <Input placeholder="请输入用户名"
                       prefix={<UserOutlined />}
                       value = {UserInfoStore.userName}
                       onChange = {setUserName}
                />
                <Input.Password
                    placeholder="请输入密码"
                    iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    value = {UserInfoStore.password}
                    onChange = {setPassword}
                />
                <Button
                    type="primary" shape="round" size="large" onClick={login}>
                    登录
                </Button>
        </div>
    );
};

export default inject('UserInfoStore')(observer(SignIn));
