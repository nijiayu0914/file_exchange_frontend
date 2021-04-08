import React, { useEffect } from "react";
import "./Navigation.less"
import { ReactComponent as Logo } from "../../assets/LOGO.svg";
import { useHistory } from 'react-router-dom';
import { inject, observer } from "mobx-react";
import { Menu, Dropdown, message } from 'antd';
import Icon, { DownOutlined } from '@ant-design/icons';

export const Navigation: React.FC<any> = ({ UserInfoStore, FileStore, LibraryStore }) => {
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
        UserInfoStore.readPlugin()
    }
    const signOut = () => {
        LibraryStore.clearLibraryList()
        LibraryStore.clearShowLibraryList()
        LibraryStore.clearOpenLibraryList()
        FileStore.setActiveLibrary('')
        localStorage.removeItem('UserName')
        localStorage.removeItem('Token')
        history.replace('/login')
    }
    const signOutDelToken = () => {
        UserInfoStore.delToken().then(() => {
            LibraryStore.clearLibraryList()
            LibraryStore.clearShowLibraryList()
            LibraryStore.clearOpenLibraryList()
            FileStore.setActiveLibrary('')
            localStorage.removeItem('UserName')
            localStorage.removeItem('Token')
            history.replace('/login')
        }).catch(error => {
            message.error(error).then()
        })
    }
    const clickRepository = () => {
        history.replace('/repository')
    }
    const clickMangement = () => {
        history.replace('/mangement')
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
                <Icon component={Logo} style={{fontSize: 160}}/>
            </div>
            <div className="navigation_items">
                <div
                    className="navigation_repository"
                    onClick = {clickRepository}
                >
                    <span>我的网盘</span>
                </div>
                <div
                    className="navigation_bms"
                    onClick = {clickMangement}
                >
                    <span>进入后台</span>
                </div>
            </div>
            <div className="navigation_user">
                <Dropdown overlay={menu} placement="bottomCenter">
                    <div><span>{UserInfoStore.userName}  </span><DownOutlined /></div>
                </Dropdown>
            </div>
        </div>
    );
};

export default inject('UserInfoStore', 'LibraryStore', 'FileStore')(observer(Navigation));
