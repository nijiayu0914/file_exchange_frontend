import { makeAutoObservable, observable, action } from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import md5 from "js-md5";
import { message } from "antd";

export default class UserInfoStore {
    constructor() {
        makeAutoObservable(this);
    }
    @observable userName: string='';

    @observable password: string='';

    @observable passwordAgain: string='';

    @observable token: string='';

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

    @action login(callback){
        if (!this.check(this.userName, '用户名不能为空')) return
        if (!this.check(this.password, '密码不能为空')) return
        return instance.post(API.login, {
            "user_name": this.userName,
            "password": md5(this.password)
        }).then(res => {
            let token = res.data.token
            localStorage.setItem("UserName", this.userName)
            localStorage.setItem("Token", token)
            this.token = token
            callback()
        }).catch(err => {
            if (err.response.status === 401){
                message.error("用户名或密码错误").then(() => {})
            }else{
                message.error(err.response.data.message).then(() => {})
            }
        })
    }

    @action register(callback){
        if (!this.check(this.userName, '用户名不能为空')) return
        if (!this.check(this.password, '密码不能为空')) return
        if (!this.check(this.password, '密码不能少于6位', 5)) return
        if (!this.check(this.passwordAgain, '密码不能为空')) return
        if (this.password !== this.passwordAgain){
            message.warn("密码不一致").then(() => {})
            return
        }
        return instance.post(API.register, {
            "user_name": this.userName,
            "password": md5(this.password)
        }).then(res => {
            let token = res.data.token
            localStorage.setItem("UserName", this.userName)
            localStorage.setItem("Token", token)
            this.token = token
            callback()
        }).catch(err => {
            message.error(err.response.data.message).then(() => {})
        })
    }

    @action delToken(){
        return new Promise((resolve,reject)=>{
            instance.delete(API.delToken).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }
}
