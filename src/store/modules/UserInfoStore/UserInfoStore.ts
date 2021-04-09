import {makeAutoObservable, observable, action, runInAction} from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import md5 from "js-md5";
import { message } from "antd";

export default class UserInfoStore {
    constructor() {
        makeAutoObservable(this);
    }
    @observable userName: string = '';

    @observable password: string = '';

    @observable passwordAgain: string = '';

    @observable token: string = '';

    @observable maxLibrary: number = 0;

    @observable permission: number = 0;

    @observable adminName: string = "";

    @action setUserName(userName: string){
        this.userName = userName
    }

    @action setPassword(password: string){
        this.password = password
    }

    @action setPasswordAgain(password: string){
        this.passwordAgain = password
    }

    @action setToken(token: string){
        this.token = token
    }

    @action check(content: string, warn: string, len:number=0){
        if (content.length <= len){
            message.warn(warn).then(() => {})
            return false
        }
        return true
    }

    @action getPlugins(){
        return new Promise((resolve, reject)=>{
            instance.get(API.plugins).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    @action login(){
        if (!this.check(this.userName, '用户名不能为空')) return
        if (!this.check(this.password, '密码不能为空')) return
        return new Promise((resolve, reject)=>{
            return instance.post(API.login, {
                "user_name": this.userName,
                "password": md5(this.password)
            }).then(res => {
                let token = res.data.token
                localStorage.setItem("UserName", this.userName)
                localStorage.setItem("Token", token)
                this.token = token
                runInAction(() => {
                    this.readPlugin().then().catch(err => {
                        message.error("配置信息读取失败").then()
                    })
                })
                resolve(res)
            }).catch(error => {
                if (error.response.status === 401){
                    message.error("用户名或密码错误").then()
                }else{
                    message.error(error.response.data.message).then()
                }
                reject(error);
            })
        })
    }

    @action register(){
        if (!this.check(this.userName, '用户名不能为空')) return
        if (!this.check(this.password, '密码不能为空')) return
        if (!this.check(this.password, '密码不能少于6位', 5)) return
        if (!this.check(this.passwordAgain, '密码不能为空')) return
        if (this.password !== this.passwordAgain){
            message.warn("密码不一致").then(() => {})
            return
        }
        return new Promise((resolve, reject)=>{
            return instance.post(API.register, {
                "user_name": this.userName,
                "password": md5(this.password)
            }).then(res => {
                let token = res.data.token
                localStorage.setItem("UserName", this.userName)
                localStorage.setItem("Token", token)
                this.token = token
                runInAction(() => {
                    this.readPlugin().then().catch(err => {
                        message.error("配置信息读取失败").then()
                    })
                })
                resolve(res)
            }).catch(error => {
                message.error(error.response.data.message).then(() => {})
                reject(error);
            })
        })
    }

    @action delToken(){
        return new Promise((resolve, reject)=>{
            instance.delete(API.delToken).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    @action readPlugin(){
        return new Promise((resolve, reject)=>{
            instance.get(API.userPlugin).then(res => {
                runInAction(() => {
                    let data = res.data
                    this.adminName = data["admin_name"]
                    this.maxLibrary = data["user_plugin"] ? data["user_plugin"]['max_library'] : 0
                    this.permission = data["user_plugin"] ? data["user_plugin"]['permission'] : 1001
                })
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    @action readAllPlugins(page: number = 1, pageSize: number = 10,
                           keyWord: string = ''){
        return new Promise((resolve, reject)=>{
            instance.get(API.userPluginsAll, {
                params:{
                    "page": page,
                    "page_size": pageSize,
                    "key_word": keyWord
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    @action updatePermission(userName: string, permission: number){
        return new Promise((resolve,reject)=>{
            instance.put(API.updatePermission, {
                "user_name": userName,
                "permission": permission
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("更新失败").then()
                reject(error);
            });
        })
    }

    @action updateMaxLibrary(userName: string, maxLibrary: number){
        return new Promise((resolve,reject)=>{
            instance.put(API.updateMaxLibraryCapacity, {
                "user_name": userName,
                "max_library": maxLibrary
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("更新失败").then()
                reject(error);
            });
        })
    }
}
