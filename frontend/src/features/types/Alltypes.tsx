export type registerType = {
    email: string,
    password: string,
    cPassword: string
}
export interface thunkType {
    rejectValue?: string
}
export type loginType = {
    email: string,
    password: string
}
export type SignUpUserType = {
    email: string,
    password: string,
    cPassword: string
}
export type responseSuccessType = {
    name: string,
    picture: string,
    email: string,
    _id: string
}
export type loginProviderType = {
    name: string,
    icon: JSX.Element,
    id: number
}
//============================Socket Type=====================
export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}
export interface ClientToServerEvents {
    hello: () => void;
}
// ===============================ROOM Type========================
export interface userType {
    name: string,
    id: string,
    room: string
}
export interface roomType { id: number, roomName: string, admin: string, users: userType[] }
export type groupUserType = { name: string, userID: string, pic: string, sid: string }
export type groupAdminType = { name: string, isAdmin: boolean, pic: string, time: string, userID: string }
export type roomInterface =
    {
        roomName: string,
        roomId: string,
        members: string,
        admin: groupAdminType,
        userInRoom: groupUserType[]
    }
export interface messageType {
    text: string,
    name: string | null,
    senderId: string | null,
    pic: string | null,
    roomId: string | null,
    roomName: string | null,
    time: string,
    file?: FileList,
    files?: { url: string, type: string }[],
    msgId:string,
    deliverd:boolean
}
export type profileObject = { id: number, name: string, icon: JSX.Element }
export type profileArrayType = profileObject[]