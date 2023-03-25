"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Playlist } from "@/components/Playist";
import { Header } from "@/components/Header";
import Loader from "@/components/Loader";

export default function Home() {
    const [message, setMessage] = useState("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<any>([]);
    const [conversation, setConversation] = useState<any>();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSearching(true);
        setConversation("");

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
            const { content } = data;
            try {
                const parsedList = JSON.parse(content);
                setPlaylist(parsedList);
                setConversation("");
                setIsSearching(false);
                setMessage("");
            } catch (e) {
                setConversation(content);
                setPlaylist([]);
                setIsSearching(false);
            }
        });
    };

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            className={styles.textarea}
                            onChange={(_) => setMessage(_.target.value)}
                            disabled={isSearching}
                            value={message}
                        />
                        <button
                            className={styles.button}
                            type="submit"
                            disabled={isSearching || !message}
                        >
                            Generate
                        </button>
                    </form>
                    {conversation && (
                        <div className={styles.conversation}>
                            <p>{conversation}</p>
                        </div>
                    )}

                    {!isSearching &&
                        playlist &&
                        Object.keys(playlist).length > 0 && (
                            <Playlist {...playlist} />
                        )}

                    {!isSearching && conversation && <div>{conversation}</div>}

                    {isSearching && <Loader />}
                </div>
            </div>
            <div className={styles.background__2}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </main>
    );
}
