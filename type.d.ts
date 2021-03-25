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

interface  FileProps {
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
