
export function getAccessToken() {
    const accessToken = localStorage.getItem('accessToken')
    return accessToken ?? ""
}

export function getRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken')
    return refreshToken ?? ""
}


