interface LibraryProps {
    uuid: string
    file_name: string,
    id: int,
    capacity: number,
    usage_capacity: number,
    create_at: string,
    delete_at: string | null,
    update_at: string,
    user_name: string,
    secure: boolean,
}

interface AliyunSTSProps {
    AccessKeyId: string,
    AccessKeySecret: string,
    Expiration: string,
    SecurityToken: string,
    bucket: string,
    region: string
}

interface FileProps {
    name: string,
    size: number,
    category: string,
    originName: string,
    rename: string,
    versionId: string,
    contentType: string,
    modifyTime: any,
    suffix: string
}

interface CopyFileProps {
    file_uuid: string,
    origin_file: string,
    dest_file: string,
    versionid: string
}

interface MultiCopyFileProps {
    file_uuid: string,
    copy_list: CopyFileProps[]
}

interface RecycleBinProps {
    uuid: string,
    libraryName: string,
    isLatest: boolean,
    key: string,
    showName: string,
    lastModified: string,
    versionId: string
}

interface HistoryFileProps {
    etag: string,
    isLatest: boolean,
    key: string,
    lastModified: string,
    size: number,
    versionId: string
}

interface UserPluginProps {
    key: string,
    userName: string,
    permissionCode: number,
    permission: string,
    maxLibrary: string,
    createTime: string,
    updateTime: string
}

interface UserPluginsReadProps {
    count: number,
    keyWord: string,
    page: number,
    page_size: number,
    user_plugins: UserPluginProps[]
}

interface FileTableProps {
    key: string,
    userName: string,
    fileName: string,
    uuid: string,
    usageCapacity: number,
    capacity: number,
    createTime: string,
    updateTime: string
}

interface FileTableAllProps {
    count: number,
    keyWord: string,
    page: number,
    page_size: number,
    files: FileTableProps[]
}

interface BucketInfoProps {
    historyclear_days: number
}
