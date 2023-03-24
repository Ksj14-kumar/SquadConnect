import { ACTION_TYPE, groupChatReducerActionType, initialStateType } from "../types/reducerHandlerType"
export const initialState: initialStateType = {
    showSideBar: false,
    UserIncurrentRoom: []
}
export function ChatGroupComponentReducerHandler(state: initialStateType, action: groupChatReducerActionType) {
    const {type,payload}=action
    switch (type) {
        case ACTION_TYPE.SIDEBAR:
            return {
                ...state,
                showSideBar: payload.showSideBar
            }
        case ACTION_TYPE.USER_IN_CURRENT_ROOM:
            return {
                ...state,
                UserIncurrentRoom: [...payload.newUser,...state.UserIncurrentRoom]
            }
        default:
            return state
    }
}