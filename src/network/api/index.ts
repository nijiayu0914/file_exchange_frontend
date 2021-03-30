import { REACT_APP_BASE_URL } from "../../config"

// 用户登录
export const login = REACT_APP_BASE_URL + "/user/login"

// 用户注册
export const register = REACT_APP_BASE_URL + "/user/create"

// 删除登录状态缓存
export const delToken = REACT_APP_BASE_URL + "/user/deltoken"

// 创建library
export const createLibrary = REACT_APP_BASE_URL + "/file/create_library"

// 列举library
export const listLibrary = REACT_APP_BASE_URL + "/file/find_libraries/byuserName"

// 重命名library
export const changeLibraryName = REACT_APP_BASE_URL + "/file/change_library_name"

// 删除library
export const deleteLibrary = REACT_APP_BASE_URL + "/file/delete_library"

// 创建文件夹
export const createFolder = REACT_APP_BASE_URL + "/file/create_folder"

// 列举文件
export const listFiles = REACT_APP_BASE_URL + "/file/list_files"

// 判断文件是否存在
export const fileExist = REACT_APP_BASE_URL + "/file/file_exist"

// 判断文件是否存在
export const getGrant = REACT_APP_BASE_URL + "/file/grant"

// 更新用量
export const updateUsage = REACT_APP_BASE_URL + "/file/update_usage"

// 下载文件
export const downloadFile = REACT_APP_BASE_URL + "/file/download"

// 删除文件
export const deleteFile = REACT_APP_BASE_URL + "/file/delete_file"

// 删除文件夹
export const deleteFolder = REACT_APP_BASE_URL + "/file/delete_child_file"

// 列举文件版本
export const listFileVersion = REACT_APP_BASE_URL + "/file/list_file_version"

// 拷贝文件
export const copyFile = REACT_APP_BASE_URL + "/file/copy_file"

// 拷贝多个文件
export const copyFiles = REACT_APP_BASE_URL + "/file/copy_multi_files"

// 列举删除标记
export const listDeleteMarkers = REACT_APP_BASE_URL + "/file/list_delete_markers"

// 永久删除文件
export const deleteFileForever = REACT_APP_BASE_URL + "/file/delete_file_forever"

// 永久删除多个文件
export const deleteFilesForever = REACT_APP_BASE_URL + "/file/delete_files_forever"

// 还原文件
export const restoreFile = REACT_APP_BASE_URL + "/file/restore_file"

// 检查用量
export const checkCapacity = REACT_APP_BASE_URL + "/file/check_capacity"

// 重命名
export const rename = REACT_APP_BASE_URL + "/file/rename_file"

// 删除历史版本
export const deleteHistoryFile = REACT_APP_BASE_URL + "/file/delete_history_file"
