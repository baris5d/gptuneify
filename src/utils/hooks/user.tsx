// create a custom hook to use user information from localstorage

import { User } from "@/types";
import { useEffect, useState } from "react";
import { isExpired } from "../auth/spotify";

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            checkUserExpired();
            setUser(JSON.parse(user));
        }
    }, []);

    const checkUserExpired = () => {
        if (isExpired()) {
            fetch("/api/auth/spotify/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    refresh_token: localStorage.getItem("refresh_token"),
                }),
            }).then((res) => {
                if (res.ok) {
                    res.json().then((data) => {
                        const { access_token, refresh_token, expires_in } =
                            data;
                        localStorage.setItem("access_token", access_token);
                        const expires_at =
                            new Date().getTime() + expires_in * 1000;
                        localStorage.setItem(
                            "expires_at",
                            expires_at.toString()
                        );
                        if (refresh_token)
                            localStorage.setItem(
                                "refresh_token",
                                refresh_token
                            );
                    });
                }
            });
        }
    };

    return user;
}
