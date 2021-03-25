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
