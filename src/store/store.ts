/**
 * @description: 初始化Mobx Store
 */
import { configure } from 'mobx';

// 用户信息
import UserInfoStore from './modules/UserInfoStore/UserInfoStore';
// 用户文件仓库信息
import LibraryStore from "./modules/LibraryStore/LibraryStore";
// 文件夹信息
import FileStore from "./modules/FileStore/FileStore";

configure({ enforceActions: 'observed' }); // 限制在动作之外进行状态修改

const MobxObject = {
    UserInfoStore: new UserInfoStore(),
    LibraryStore: new LibraryStore(),
    FileStore: new FileStore()
};

export default MobxObject


