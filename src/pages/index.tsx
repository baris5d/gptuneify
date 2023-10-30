"use client";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Playlist } from "@/components/Playist";
import { Header } from "@/components/Header";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { Prompts } from "@/components/Prompts";
import { addPlaylistToLocalStorage, getPlaylistsFromLocalStorage } from "@/utils/playlist";
import { PreviousPlaylists } from "@/components/PreviousPlaylists";

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
    const [previousPlaylists, setPreviousPlaylists] = useState<string[]>([]);
    const [showPreviousPlaylists, setShowPreviousPlaylists] = useState<boolean>(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsSearching(true);
        setShowPrompts(false);
        setShowPreviousPlaylists(false)
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
            }
        });
    };

    const handlePromptClick = (prompt: string) => {
        setMessage(prompt);
    }
    
    useEffect(() => {
        const playlists = getPlaylistsFromLocalStorage();
        setPreviousPlaylists(playlists);
    }, [])

    const handlePlaylistCreated = (playlistId: string) => {
        addPlaylistToLocalStorage(playlistId);
        if (!previousPlaylists.includes(playlistId)) {
            setPreviousPlaylists([...previousPlaylists, playlistId]);
        }
    }

    return (
        <main>
            <Header />
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <div className={styles.action_bar}>
                        {previousPlaylists.length > 0 && (
                            <button className={styles.previous_playlists__button} onClick={() => setShowPreviousPlaylists(!showPreviousPlaylists)}>
                                <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="24" fill="none"/>
                                    <path d="M9.682,18.75a.75.75,0,0,1,.75-.75,8.25,8.25,0,1,0-6.189-2.795V12.568a.75.75,0,0,1,1.5,0v4.243a.75.75,0,0,1-.751.75H.75a.75.75,0,0,1,0-1.5H3a9.75,9.75,0,1,1,7.433,3.44A.75.75,0,0,1,9.682,18.75Zm2.875-4.814L9.9,11.281a.754.754,0,0,1-.22-.531V5.55a.75.75,0,1,1,1.5,0v4.889l2.436,2.436a.75.75,0,1,1-1.061,1.06Z" transform="translate(1.568 2.25)"/>
                                </svg>
                                {showPreviousPlaylists ? 'Hide' : 'Show'} Previous Playlists
                            </button>
                        )}
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
                    </div>

                    {showPreviousPlaylists && (
                        <PreviousPlaylists playlistIdList={previousPlaylists} />
                    )}

                    {!isSearching &&
                        playlist &&
                        Object.keys(playlist).length > 0 && (
                            <Playlist 
                                {...playlist} 
                                onPlaylistCreated={handlePlaylistCreated}
                            />
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
            {(showPrompts && !showPreviousPlaylists) && <Prompts onPromptClick={handlePromptClick}/> }
            <div className={styles.background__2}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </main>
    );
}
