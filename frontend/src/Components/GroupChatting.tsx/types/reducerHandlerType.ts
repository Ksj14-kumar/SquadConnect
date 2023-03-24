import { groupUserType } from "../../../features/types/Alltypes"
export enum ACTION_TYPE {
    SIDEBAR = "SIDEBAR",
    USER_IN_CURRENT_ROOM = "USER_IN_CURRENT_ROOM"
}
export type groupChatReducerActionType =
    |
    { type: ACTION_TYPE.SIDEBAR, payload: { showSideBar: boolean } }
    |
    {
        type: ACTION_TYPE.USER_IN_CURRENT_ROOM, payload: { newUser: groupUserType[] }
    }
export type initialStateType = {
    showSideBar: boolean,
    UserIncurrentRoom: groupUserType[]
}
