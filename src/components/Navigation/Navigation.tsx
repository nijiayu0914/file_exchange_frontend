import React, { useEffect } from "react";
import "./Navigation.less"
import { ReactComponent as Logo } from "../../assets/LOGO.svg";
import { useHistory } from 'react-router-dom';
import {inject, observer} from "mobx-react";
import { Menu, Dropdown } from 'antd';
import Icon, { DownOutlined } from '@ant-design/icons';

export const Navigation: React.FC<any> = ({UserInfoStore}) => {
    const history: useHistory = useHistory();
    const initUser = () => {
        const userName:string | null = localStorage.getItem('UserName')
        const token:string | null = localStorage.getItem('Token')
        if (!userName || !token){
            history.replace('/login')
            return
        }
        if (userName.length === 0 || token.length === 0){
            history.replace('/login')
            return
        }
        UserInfoStore.setUserName(userName)
        UserInfoStore.setToken(token)
    }
    const signOut = () => {
        localStorage.removeItem('UserName')
        localStorage.removeItem('Token')
        history.replace('/login')
    }
    const signOutDelToken = () => {
        UserInfoStore.delToken().then(res => {
            console.log(res)
            localStorage.removeItem('UserName')
            localStorage.removeItem('Token')
            history.replace('/login')
        }).catch(error => {
            console.log(error)
        })
    }
    useEffect(()=>{
        initUser()
        // eslint-disable-next-line
    }, []);

    const menu = (
        <Menu>
            <Menu.Item>
                <div className="navigation_user_item" onClick={signOut}>
                    <span>退出登录</span>
                </div>
            </Menu.Item>
            <Menu.Item>
                <div className="navigation_user_item" onClick={signOutDelToken}>
                    <span>多点注销</span>
                </div>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="navigation_container">
            <div className="navigation_logo">
                <Icon component={Logo} style={{fontSize: 153}}/>
            </div>
            <div className="navigation_user">
                <Dropdown overlay={menu} placement="bottomCenter">
                    <div><span>{UserInfoStore.userName}  </span><DownOutlined /></div>
                </Dropdown>
            </div>
        </div>
    );
};

export default inject('UserInfoStore')(observer(Navigation));
