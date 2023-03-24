"use client";
import React, { ChangeEvent } from "react";
import styles from "./index.module.css";
import SpotifyConnect from "./auth/spotify";
import useUser from "@/utils/hooks/user";
import { UserCard } from "@/components/UserCard";

export default function Home() {
    const [message, setMessage] = React.useState("");
    const user = useUser();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const result = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: message,
            }),
        });

        result.json().then((data) => {
            console.log(data);
        });
    };

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className={styles.textarea}
                            onChange={(_) => setMessage(_.target.value)}
                        />
                        <button className={styles.button} type="submit">
                            Generate
                        </button>
                    </form>
                    <SpotifyConnect />
                    {user && <UserCard {...user} />}
                </div>
            </div>
        </main>
    );
}
