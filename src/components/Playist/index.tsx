import SpotifyConnect from "@/pages/auth/spotify";
import styles from "./playlist.module.css";
import { useEffect, useState } from "react";
import { isExpired } from "@/utils/auth/spotify";
import { Error } from "@/components/Error";

interface Audio {
    trackName: string;
    artistName: string;
    duration: string;
}

interface Playlist {
    playlistName: string;
    playlistDescription: string;
    tracks: Audio[];
    user?: string;
}

const Audio = (props: Audio) => {
    const { trackName, artistName, duration } = props;
    return (
        <div className={styles.audio}>
            <div className={styles.audio__wrapper}>
                <div className={styles.audio__title}>{trackName}</div>
                <div className={styles.audio__signer}>{artistName}</div>
            </div>
            <div className={styles.audio__duration}>{duration}</div>
        </div>
    );
};

const LoginWarning = () => {
    return (
        <div className={styles.login__warning}>
            <h2 className={styles.login__warning_title}>
                You need to login to Spotify to see the playlist
            </h2>
        </div>
    );
};

const AddToPlaylist = (props: Playlist) => {
    const { playlistName, playlistDescription, tracks, user } = props;
    const [isAdded, setIsAdded] = useState<boolean>(false);
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [playlistUri, setPlaylistUri] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            checkUserExpired();
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

    const add = async () => {
        setIsAdding(true);
        fetch("/api/generate/playlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
                playlist: tracks,
                playlistName: playlistName,
                playlistDescription: playlistDescription,
                user: user,
            }),
        }).then((res) => {
            if (res.status === 200) {
                setIsAdded(true);
                setIsAdding(false);
                res.json().then((data) => {
                    setPlaylistUri(data.uri);
                })
            } else {
                setIsAdded(false);
                setIsAdding(false);
                setErrorMessage(
                    "Something went wrong, please try again later."
                );
            }
        });
    };

    return (
        <>
            {isAdded ? (
                <a className={`${styles.add__button} ${styles.add__button_added}`} href={playlistUri}>
                    <svg
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className={styles.add__icon}
                    >
                        <path
                            fill="currentColor"
                            d="M8,5.14V19.14L19,12.14L8,5.14Z"
                        />
                    </svg>
                    Ready to Listen on Spotify
                </a>
            ) : (
            <button
                className={styles.add__button}
                onClick={add}
                disabled={isAdded}
            >
                {/** Spinning */}
                {isAdding && !isAdded && (
                    <span className={styles.spinner}></span>
                )}
                {!isAdded && !isAdding && !errorMessage && (
                    <>
                        <svg
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            className={styles.add__icon}
                        >
                            <path
                                fill="currentColor"
                                d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,13H6V11H11V6H13V11H18V13H13V18H11V13Z"
                            />
                        </svg>
                        Add to Library
                    </>
                )}
            </button>)}

            {!isAdded && !isAdding && errorMessage && (
                <Error message={errorMessage} />
            )}
        </>
    );
};

export const Playlist = (props: Playlist) => {
    const { playlistName, playlistDescription, tracks } = props;

    const [user, setUser] = useState<any>();

    function handleStorage(event: any) {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
    }

    useEffect(() => {
        window.addEventListener("storage", handleStorage);
        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    useEffect(() => {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
    }, []);

    return (
        <>
            {Object.keys(tracks).length && <SpotifyConnect />}
            <div className={styles.playlist}>
                <div className={styles.playlist__header}>
                    <div className={styles.playlist__header_wrapper}>
                        <h2 className={styles.playlist__title}>
                            {playlistName}
                        </h2>
                        <h3 className={styles.playlist__description}>
                            {playlistDescription}
                        </h3>
                    </div>
                    <AddToPlaylist
                        {...{
                            playlistName: playlistName,
                            playlistDescription: playlistDescription,
                            tracks: tracks,
                            user: user,
                        }}
                    />
                </div>
                {user && (
                    <div className={styles.audio__container}>
                        {tracks &&
                            tracks.map((track: any, index) => {
                                return <Audio {...track} key={index} />;
                            })}
                    </div>
                )}
                {!user && <LoginWarning />}
                <div className={styles.background}>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>
    );
};

export default Playlist;
