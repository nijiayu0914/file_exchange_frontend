/**
 * @description: 资料夹相关业务接口及操作逻辑
 */
import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import { message } from 'antd';

export default class LibraryStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable libraryList: LibraryProps[] = [] // 用户资料夹数组

    @observable showLibraryList: LibraryProps[] = [] // 页面展示的用户资料夹数组

    @observable openLibraryList: [string, string][] = [] // 打开的用户资料夹数组

    /**
     * 根据关键词搜索用户资料夹，并在页面筛选展示
     * @param {string} keyword 关键词
     */
    @action search(keyword: string){
        let newList: LibraryProps[] = []
        this.libraryList.forEach(item => {
            if(item.file_name.indexOf(keyword) !== -1){
                newList.push(item)
            }
        })
        this.showLibraryList = newList.slice(0)
    }

    /**
     * 清空用户资料夹数组
     */
    @action clearLibraryList(){
        this.libraryList = []
    }

    /**
     * 清空展示的用户资料夹
     */
    @action clearShowLibraryList(){
        this.showLibraryList = []
    }

    /**
     * 清空打开的用户资料夹
     */
    @action clearOpenLibraryList(){
        this.openLibraryList = []
    }

    /**
     * 打开资料夹
     * @param {string} uuid 资料夹uuid
     * @param {string} libraryName 资料夹名称
     */
    @action openLibrary(uuid: string, libraryName: string){
        let listLen = this.openLibraryList.length
        for(let i = 0; i < listLen; i++){
            if(this.openLibraryList[i][0] === uuid){
                return
            }
        }
        this.openLibraryList.push([uuid, libraryName])
    }

    /**
     * 关闭资料夹
     * @param {string} uuid 资料夹uuid
     */
    @action closeLibrary(uuid: string){
        let listLen = this.openLibraryList.length
        for(let i = 0; i < listLen; i++){
            if(this.openLibraryList[i][0] === uuid){
                this.openLibraryList.splice(i, 1)
                return
            }
        }
    }

    /**
     * 创建资料夹
     * @param {string} libraryName 资料夹名称
     */
    @action createLibrary(libraryName: string){
        return new Promise((resolve,reject)=>{
            instance.post(API.createLibrary, {
                "file_name": libraryName
            }).then(res => {
                resolve(res)
                runInAction(() => {
                    this.listLibrary().then()
                })
            }).catch(error => {
                message.error("创建失败").then()
                reject(error);
            });
        })
    }

    /**
     * 获取用户资料夹数据
     */
    @action listLibrary(){
        return new Promise((resolve, reject)=>{
            instance.get(API.listLibrary).then(res => {
                this.libraryList = res.data || []
                this.showLibraryList = res.data || []
                resolve(res)
            }).catch(error => {
                message.error("查询失败").then()
                reject(error);
            });
        })
    }

    /**
     * 重命名资料夹
     * @param {string} uuid 资料夹uuid
     * @param {string} newName 资料夹名称
     */
    @action renameLibrary(uuid: string, newName: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.changeLibraryName, {
                params:{
                    "uuid": uuid,
                    "file_name": newName
                }
            }).then(res => {
                runInAction(() => {
                    this.listLibrary().then()
                })
                resolve(res)
            }).catch(error => {
                message.error("修改失败").then()
                reject(error);
            });
        })
    }

    /**
     * 删除资料夹
     * @param {string} uuid 资料夹uuid
     */
    @action deleteLibrary(uuid: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.deleteLibrary, {
                params:{"uuid": uuid}
            }).then(res => {
                runInAction(() => {
                    this.listLibrary().then()
                })
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }

    /**
     * 获取所有资料夹信息，分页模式。
     * @param {number} page 页码
     * @param {number} pageSize 每页条数
     * @param {string} keyWord 关键词
     */
    @action readAllFiles(page: number = 1, pageSize: number = 10,
                         keyWord: string = ''){
        return new Promise((resolve, reject)=>{
            instance.get(API.filesAll, {
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
     * 读取资料夹下所有文件的大小总和
     * @param {string} uuid 资料夹uuid
     */
    @action readAllFilesSize(uuid: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.readAllFilesSize, {
                params:{"uuid": uuid}
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("读取失败").then()
                reject(error);
            });
        })
    }
}
