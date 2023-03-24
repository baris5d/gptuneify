const getUser = async (accessToken: string) => {
    if (!accessToken) return;
    const user = await fetch("https://api.spotify.com/v1/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return user.json();
};

const isLoggedIn = () => {
    const access_token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    const refresh_token = localStorage.getItem("refresh_token");
    if (access_token && user && refresh_token) {
        return { user, access_token, refresh_token };
    }

    return false;
};

export const isExpired = () => {
    return true;
    const now = new Date();
    const expiration = new Date(localStorage.getItem("expires_at") as string);
    return expiration < now;
};

export { getUser, isLoggedIn };
