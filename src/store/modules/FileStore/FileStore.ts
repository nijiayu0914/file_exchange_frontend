import {makeAutoObservable, observable, action, runInAction} from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import { message } from 'antd';

export default class FileStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable activeLibrary: string = ''

    @action setActiveLibrary(uuid: string){
        this.activeLibrary = uuid
    }

    @action createSTS(){
        return new Promise((resolve,reject)=>{
            instance.get(API.getGrant).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("获取失败").then()
                reject(error);
            });
        })
    }

    @action createFolder(uuid: string, fileName: string){
        return new Promise((resolve,reject)=>{
            instance.get(API.createFolder, {
                params:{
                    "uuid": uuid,
                    "file_name": fileName
                }
            }).then(res => {
                resolve(res)
                runInAction(() => {
                })
            }).catch(error => {
                message.error("创建失败").then()
                reject(error);
            });
        })
    }

    @action fileExist(uuid: string, fileName: string){
        return new Promise((resolve,reject)=>{
            instance.get(API.fileExist, {
                params:{
                    "uuid": uuid,
                    "file_name": fileName
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("判断失败").then()
                reject(error);
            });
        })
    }

    @action updateUsage(uuid: string, usageCapacity: number, how: string){
        return new Promise((resolve,reject)=>{
            instance.put(API.updateUsage, {
                "file_uuid": uuid,
                "usage_capacity": usageCapacity,
                "how": how,
            }).then(res => {
                resolve(res)
                runInAction(() => {

                })
            }).catch(error => {
                message.error("更新失败").then()
                reject(error);
            });
        })
    }

    @action listFiles(uuid: string, path: string, delimiter: string = '/'){
        return new Promise((resolve,reject)=>{
            instance.post(API.listFiles, {
                "file_uuid": uuid,
                "path": path,
                "delimiter": delimiter,
            }).then(res => {
                resolve(res)
                runInAction(() => {

                })
            }).catch(error => {
                message.error("查询失败").then()
                reject(error);
            });
        })
    }

}
