/**
 * @description: 用户相关业务接口及操作逻辑
 */
import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import md5 from "js-md5";
import { message } from "antd";

export default class UserInfoStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable userName: string = ''; // 用户名

    @observable password: string = ''; // 密码

    @observable passwordAgain: string = ''; // 第二次确认密码

    @observable token: string = ''; // token

    @observable maxLibrary: number = 0; // 最大资料夹数量

    @observable permission: number = 0; // 用户权限等级

    @observable adminName: string = ""; // 后台超级管理员用户名

    /**
     * 设置更新用户名
     * @param {string} userName 用户名
     */
    @action setUserName(userName: string){
        this.userName = userName
    }

    /**
     * 设置更新密码
     * @param {string} password 密码
     */
    @action setPassword(password: string){
        this.password = password
    }

    /**
     * 设置更新确认密码
     * @param password {string} password 密码
     */
    @action setPasswordAgain(password: string){
        this.passwordAgain = password
    }

    /**
     * 设置更新token
     * @param {string} token 后端token
     */
    @action setToken(token: string){
        this.token = token
    }

    /**
     * 字符串长度检查，注册，登录用户名合法性检查
     * @param {string} content 检查的内容
     * @param {string} warn 如果检查不通过，警告的内容
     * @param {number} len 字符串允许的最小长度
     */
    @action check(content: string, warn: string, len: number=0){
        if (content.length <= len){
            message.warn(warn).then()
            return false
        }
        return true
    }

    /**
     * 从后端获取配置信息，比如备案号等
     */
    @action getPlugins(){
        return new Promise((resolve, reject)=>{
            instance.get(API.plugins).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    /**
     * 用户登录
     */
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
                    this.readPlugin().then().catch(() => {
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

    /**
     * 用户注册
     */
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
                    this.readPlugin().then().catch(() => {
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

    /**
     * 删除token,用于注销登录
     */
    @action delToken(){
        return new Promise((resolve, reject)=>{
            instance.delete(API.delToken).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    /**
     * 获取用户配置信息，比如用户权限等级，许可使用量等
     */
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

    /**
     * 获取所有用户配置信息，接口为分页模式
     * @param {number} page 页码
     * @param {number} pageSize 每页展示数量
     * @param {string} keyWord 搜索关键词
     */
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

    /**
     * 更新用户权限
     * @param {string} userName 用户名
     * @param {string} permission 更新的权限等级
     */
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

    /**
     * 更新用户最大资料夹可使用数量
     * @param {string} userName 用户名
     * @param {number} maxLibrary 更新的最大资料夹数量
     */
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
