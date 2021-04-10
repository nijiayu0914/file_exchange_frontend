/**
 * @description: 文件相关业务接口及操作逻辑
 */
import { makeAutoObservable, observable, action, runInAction } from 'mobx';
import instance from "../../../network/axios/instance";
import * as API from "../../../network/api";
import { message } from 'antd';

export default class FileStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable activeLibrary: string = '' // 当前激活的资料夹

    @observable checkedFile: Set<string> = new Set<string>() // 选中的文件

    @observable copiedFile: string[] = [] // 在复制板中的文件

    @observable currentStatisticData: object = {} // 当前激活的资料夹当前路径下文件夹，文件数量统计

    /**
     * 设置激活的资料夹
     * @param {string} uuid 资料夹uuid
     */
    @action setActiveLibrary(uuid: string){
        this.activeLibrary = uuid
    }

    /**
     * 添加当前资料夹当前路径下文件，文件夹数量统计
     * @param {string} uuid 资料夹uuid
     * @param {number} folderCount 文件夹数量
     * @param {number} fileCount 文件数量
     */
    @action addCurrentStatisticData(uuid: string, folderCount: number, fileCount: number){
        this.currentStatisticData[uuid] = [folderCount, fileCount]
    }

    /**
     * 添加选中的文件
     * @param {string} name 文件夹名称,oss object key name
     * @param {boolean} isClear 是否清空已选中的文件
     * @param {boolean} isShift 是否使用shift批量选中功能
     */
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

    /**
     * 清空选中的文件
     */
    @action clearCheckedFile(){
        this.checkedFile.clear()
    }

    /**
     * 增加复制的文件
     */
    @action addCopiedFile(){
        this.copiedFile = Array.from(this.checkedFile)
    }

    /**
     * 清空复制的文件
     */
    @action clearCopiedFile(){
        this.copiedFile = []
    }

    /**
     * 从后端获取OSS临时授权
     */
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

    /**
     * 获取OSS bucket相关配置信息
     */
    @action bucketInfo(){
        return new Promise((resolve, reject)=>{
            instance.get(API.bucketInfo).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error);
            });
        })
    }

    /**
     * 创建文件夹
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件夹名称
     */
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

    /**
     * 判断文件是否存在
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件夹名称
     */
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

    /**
     * 获取资料夹允许容量
     * @param {string} uuid 资料夹uuid
     */
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

    /**
     * 更新资料夹已使用容量
     * @param {string} uuid 资料夹uuid
     * @param {number} usageCapacity 更新的容量
     * @param {string} how 更新方式，increase, decrease, overwrite
     */
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

    /**
     * 更新允许容量
     * @param {string} uuid 资料夹uuid
     * @param {number} capacity 更新的容量
     */
    @action updateCapacity(uuid: string, capacity: number){
        return new Promise((resolve, reject)=>{
            instance.put(API.updateCapacity, {
                "file_uuid": uuid,
                "capacity": capacity,
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

    /**
     * 列举文件
     * @param {string} uuid 资料夹uuid
     * @param {string} path 子路径
     * @param {string} delimiter 列举终止位置(详见阿里云OSS)
     * @param {boolean} force 是否强制刷新，默认false，如果存在缓存，接口会返回缓存内容
     */
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

    /**
     * 下载文件
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件夹名称
     */
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

    /**
     * 删除文件
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件夹名称
     */
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

    /**
     * 删除文件夹
     * @param {string} uuid 资料夹uuid
     * @param {string} path 文件夹路径
     */
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

    /**
     * 列举文件版本
     * @param {string} uuid 资料夹uuid
     * @param {string} path 文件夹路径
     */
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

    /**
     * 复制文件
     * @param {string} uuid 资料夹uuid
     * @param {string} origin 原始路径，包含文件名
     * @param {string} dest 目标路径，包含文件名
     * @param {string} versionId 复制文件的版本号
     */
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

    /**
     * 批量复制文件
     * @param {string} uuid 资料夹uuid
     * @param {string} dest 目标路径，不包含文件名
     */
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
            if(fileVersions['data']){
                let versionId: string = fileVersions['data'][0]['versionId']
                let copyFile: CopyFileProps = {
                    "file_uuid": uuid,
                    "origin_file": item,
                    "dest_file": dest + name,
                    "versionid": versionId
                }
                copyList['copy_list'].push(copyFile)
            }
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

    /**
     * 列举删除标记
     * @param {string} uuid 资料夹uuid
     * @param {boolean} force 是否强制刷新，默认false，如果接口有缓存，则返回缓存
     * @param {string} delimiter 查询终止位置，详见阿里云OSS文档
     */
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

    /**
     * 还原回收站的文件
     * @param {string} uuid 资料夹uuid
     * @param {string} path 文件夹路径
     */
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

    /**
     * 永久删除文件
     * @param {string} uuid 资料夹uuid
     * @param {string} fileName 文件名称
     */
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

    /**
     * 批量永久删除文件
     * @param {string} uuid 资料夹uuid
     * @param {string[]} fileNames 文件名称数组
     */
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

    /**
     * 文件重命名
     * @param {string} uuid 资料夹uuid
     * @param {string} objectName 文件原始名称 oss object key
     * @param {string} newName 新名称
     */
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

    /**
     * 删除历史版本
     * @param {string} uuid 资料夹uuid
     * @param {string} path 文件路径
     * @param {string} versionId 文件版本号
     */
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
