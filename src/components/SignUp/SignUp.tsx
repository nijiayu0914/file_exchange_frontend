import React from "react";
import "./SignUp.less"
import { useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { Input, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const SignUp: React.FC<any> = ({UserInfoStore}) => {
    const history: useHistory = useHistory();
    const setUserName = (e) => {
        UserInfoStore.setUserName(e.target.value)
    }
    const setPassword = (e) => {
        UserInfoStore.setPassword(e.target.value)
    }
    const setPasswordAgain = (e) => {
        UserInfoStore.setPasswordAgain(e.target.value)
    }
    const register = () => {
        UserInfoStore.register(() => {
            history.replace('/repository')
        })
    }
    return (
        <div className="signup_container">
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
            <Input.Password
                placeholder="请再次确认密码"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                value = {UserInfoStore.passwordAgain}
                onChange = {setPasswordAgain}
            />
            <Button
                type="primary" shape="round" size="large" onClick={register}>
                注册
            </Button>
        </div>
    );
};

export default inject('UserInfoStore')(observer(SignUp))
