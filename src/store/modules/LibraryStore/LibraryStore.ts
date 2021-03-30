import {makeAutoObservable, observable, action, runInAction} from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import { message } from 'antd';

export default class LibraryStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable libraryList: LibraryProps[] = []

    @observable showLibraryList: LibraryProps[] = []

    @observable openLibraryList: [string, string][] = []

    @action search(keyword: string){
        let newList: LibraryProps[] = []
        this.libraryList.forEach(item => {
            if(item.file_name.indexOf(keyword) !== -1){
                newList.push(item)
            }
        })
        this.showLibraryList = newList.slice(0)
    }

    @action clearLibraryList(){
        this.libraryList = []
    }

    @action clearShowLibraryList(){
        this.showLibraryList = []
    }

    @action clearOpenLibraryList(){
        this.openLibraryList = []
    }

    @action openLibrary(uuid: string, libraryName: string){
        let listLen = this.openLibraryList.length
        for(let i = 0; i < listLen; i++){
            if(this.openLibraryList[i][0] === uuid){
                return
            }
        }
        this.openLibraryList.push([uuid, libraryName])
    }

    @action closeLibrary(uuid: string){
        let listLen = this.openLibraryList.length
        for(let i = 0; i < listLen; i++){
            if(this.openLibraryList[i][0] === uuid){
                this.openLibraryList.splice(i, 1)
                return
            }
        }
    }

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
}
