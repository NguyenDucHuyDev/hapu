export const setAccessToken = token =>({
    type: 'SET_ACCESS_TOKEN',
    payload: token
})

export const setUserInfo = info => ({
    type: 'SET_USER_INFO',
    payload: info
})