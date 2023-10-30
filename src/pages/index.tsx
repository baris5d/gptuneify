"use client";
import React, { useState } from "react";
import styles from "./index.module.css";
import { Playlist } from "@/components/Playist";
import { Header } from "@/components/Header";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { Prompts } from "@/components/Prompts";

const loaderMessages = [
    "Alright, we are trying to find best playlist for you... 👨🏻‍💻",
    "It usually takes around 30 seconds to create a playlist... 🤔",
    "Please wait... 🙇🏻‍♂️",
    "If you think it takes too long, it's all we can do... 😬 ",
    "We are sorry for the inconvenience. Still doing my job... 🚜",
    "Hang on, we're almost there! 🎵",
    "Good things come to those who wait... 🎧",
    "Music is worth waiting for... 🎶",
    "Playlist creation in progress... 🎼",
    "Sit tight, we'll have your playlist ready in no time... 🎹",
    "Creating your perfect playlist... 🎧",
    "Our team of experts is hand-picking the best songs for you... 🎤",
    "Don't worry, we haven't forgotten about you... 🎵",
    "We're working hard to make your playlist awesome... 🎶",
    "Thanks for your patience, we're almost done... 🎧",
];

export default function Home() {
    const [message, setMessage] = useState("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<any>([]);
    const [errorMessage, setErrorMessage] = useState<any>();
    const [showPrompts, setShowPrompts] = useState<boolean>(true);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSearching(true);
        setShowPrompts(false);
        setErrorMessage("");

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
                setErrorMessage("");
                setIsSearching(false);
                setMessage("");
            } catch (e) {
                setErrorMessage(content);
                setPlaylist([]);
                setIsSearching(false);
                setShowPrompts(true);
            }
        });
    };

    const handlePromptClick = (prompt: string) => {
        setMessage(prompt);
    }

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

                    {!isSearching &&
                        playlist &&
                        Object.keys(playlist).length > 0 && (
                            <Playlist {...playlist} />
                        )}

                    {!isSearching && errorMessage && (
                        <Error
                            message={
                                "Whoops! GPTuneify could not generate a playlist for you. You must be more specific with your taste or your mood."
                            }
                        />
                    )}
                    {isSearching && <Loader loaderMessages={loaderMessages} />}
                </div>
            </div>
            {showPrompts && <Prompts onPromptClick={handlePromptClick}/> }
            <div className={styles.background__2}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </main>
    );
}
