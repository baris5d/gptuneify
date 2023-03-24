"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUser } from "@/utils/auth/spotify";
export default function SpotifyCallback() {
    const router = useSearchParams();
    const navigate = useRouter();

    useEffect(() => {
        const code = router.get("code");
        if (code) {
            getAccessToken(code);
        }
    }, [router]);

    async function getAccessToken(code: string) {
        const connection = await fetch("/api/auth/spotify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code,
            }),
        });
        if (connection.ok) {
            const { access_token, refresh_token, expires_in } =
                await connection.json();

            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            const expires_at = new Date().getTime() + expires_in * 1000;
            localStorage.setItem("expires_at", expires_at.toString());

            const user = await getUser(access_token);

            if (user) localStorage.setItem("user", JSON.stringify(user));

            navigate.push("/");
        }
    }

    return <></>;
}
