export const initialState = null

export const reducer = (state,action) => {
    if(action.type === "USER"){

        return action.payload
    }
    if(action.type === "CLEAR"){
        return null
    }
    if(action.type === "PROFILE-UPDATE"){
        return {
            //...state means same as previous but adding exta info
            ...state,
            isProfile : action.payload.isProfile
        }
    }
    if(action.type === "UPDATE-PIC"){
        return{
            ...state,
            profilePicture : action.payload
        }
    }
    if(action.type === "UPDATE"){
        return {
            //...state means same as previous but adding exta info
            ...state,
            followers:action.payload.followers,
            following : action.payload.following
        }
    }
    
    return state
    
}