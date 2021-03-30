import {makeAutoObservable, observable, action, runInAction } from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import { message } from 'antd';

export default class FileStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable activeLibrary: string = ''

    @observable checkedFile: Set<string> = new Set<string>()

    @observable copiedFile: string[] = []

    @action setActiveLibrary(uuid: string){
        this.activeLibrary = uuid
    }

    @action addCheckedFile(name: string, isClear: boolean = true, isShift: boolean = false){
        if(isClear){
            this.checkedFile.clear()
            this.checkedFile.add(name)
        }else{
            if(this.checkedFile.has(name) && !isShift){
                this.checkedFile.delete(name)
            }else{
                this.checkedFile.add(name)
            }
        }
    }

    @action clearCheckedFile(){
        this.checkedFile.clear()
    }

    @action addCopiedFile(){
        this.copiedFile = Array.from(this.checkedFile)
    }

    @action clearCopiedFile(){
        this.copiedFile = []
    }

    @action createSTS(){
        return new Promise((resolve, reject)=>{
            instance.get(API.getGrant).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("获取失败").then()
                reject(error);
            });
        })
    }

    @action createFolder(uuid: string, fileName: string){
        return new Promise((resolve, reject)=>{
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
        return new Promise((resolve, reject)=>{
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

    @action checkCapacity(uuid: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.checkCapacity, {
                params:{
                    "uuid": uuid
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("查询失败").then()
                reject(error);
            });
        })
    }

    @action updateUsage(uuid: string, usageCapacity: number, how: string){
        return new Promise((resolve, reject)=>{
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

    @action listFiles(uuid: string, path: string, delimiter: string = '/', force: boolean=false){
        return new Promise((resolve, reject)=>{
            instance.post(API.listFiles, {
                "file_uuid": uuid,
                "path": path,
                "delimiter": delimiter,
                "force": force
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("查询失败").then()
                reject(error);
            });
        })
    }

    @action downloadFile(uuid: string, fileName: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.downloadFile, {
                params:{
                    "uuid": uuid,
                    "file_name": fileName
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("下载链接获取失败").then()
                reject(error);
            });
        })
    }

    @action deleteFile(uuid: string, fileName: string){
        return new Promise((resolve, reject)=>{
            instance.delete(API.deleteFile, {
                params:{
                    "uuid": uuid,
                    "file_name": fileName
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }

    @action deleteFolder(uuid: string, path: string){
        return new Promise((resolve, reject)=>{
            instance.post(API.deleteFolder, {
                "file_uuid": uuid,
                "path": path
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }

    @action listFileVersion(uuid: string, path: string){
        return new Promise((resolve, reject)=>{
            instance.get(API.listFileVersion, {
                params:{
                    "uuid": uuid,
                    "path": path
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("获取失败").then()
                reject(error);
            });
        })
    }

    @action copyFile(uuid: string, origin: string,
                     dest: string, versionId: string) {
        let copyFile: CopyFileProps = {
            "file_uuid": uuid,
            "origin_file": origin,
            "dest_file": dest,
            "versionid": versionId
        }
        return new Promise((resolve, reject)=>{
            instance.post(API.copyFile, copyFile).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("拷贝失败").then()
                reject(error);
            });
        })
    }

    @action async copyFiles(uuid: string, dest: string) {
        let copyList: MultiCopyFileProps = {file_uuid: uuid, copy_list: []}
        for (const item of this.copiedFile) {
            let name: string
            let fileUuid: string
            if (item.charAt(item.length - 1) === '/') {
                let nameSplit: string[] = item.split('/')
                fileUuid = nameSplit[0]
                name = nameSplit.slice(nameSplit.length - 2)[0] + '/'
            } else {
                let nameSplit: string[] = item.split('/')
                fileUuid = nameSplit[0]
                name = nameSplit[nameSplit.length - 1]
            }
            const fileVersions: any = await this.listFileVersion(
                fileUuid, item.replace(fileUuid + '/', ''))
            let versionId: string = fileVersions['data'][0]['versionId']
            let copyFile: CopyFileProps = {
                "file_uuid": uuid,
                "origin_file": item,
                "dest_file": dest + name,
                "versionid": versionId
            }
            copyList['copy_list'].push(copyFile)
        }
        return new Promise((resolve, reject)=>{
            instance.post(API.copyFiles, copyList).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("复制失败").then()
                reject(error);
            });
        })
    }

    @action listDeleteMarkers(uuid: string, force: boolean=false, delimiter: string = ''){
        return new Promise((resolve, reject)=>{
            instance.get(API.listDeleteMarkers, {
                params:{
                    "uuid": uuid,
                    "delimiter": delimiter,
                    "force": force
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("获取失败").then()
                reject(error);
            });
        })
    }

    @action restoreFile(uuid: string, path: string){
        return new Promise((resolve, reject)=>{
            instance.put(API.restoreFile, null, {
                params:{
                    "uuid": uuid,
                    "path": path
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("还原失败").then()
                reject(error);
            });
        })
    }

    @action deleteFileForever(uuid: string, fileName: string){
        return new Promise((resolve, reject)=>{
            instance.delete(API.deleteFileForever, {
                params: {
                    "uuid": uuid,
                    "file_name": fileName
                }
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }

    @action deleteFilesForever(uuid: string, fileNames: string[]){
        return new Promise((resolve, reject)=>{
            instance.post(API.deleteFilesForever, {
                "file_uuid": uuid,
                "file_names": fileNames
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }

    @action Rename(uuid:string, objectName: string, newName: string){
        return new Promise((resolve, reject)=>{
            instance.put(API.rename,{
                "file_uuid": uuid,
                "object_name": objectName,
                "new_name": newName
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("重命名失败").then()
                reject(error);
            });
        })
    }

    @action deleteHistoryFile(uuid: string, path: string, versionId: string){
        return new Promise((resolve, reject)=>{
            instance.post(API.deleteHistoryFile, {
                "file_uuid": uuid,
                "path": path,
                "version_id": versionId
            }).then(res => {
                resolve(res)
            }).catch(error => {
                message.error("删除失败").then()
                reject(error);
            });
        })
    }
}
