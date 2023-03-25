import styles from "./spotify.module.css";
import { UserCard } from "@/components/UserCard";
import { useEffect, useState } from "react";
import { User } from "@/types";

const SCOPE: string[] = [
    "user-read-private",
    "user-read-email",
    "user-library-modify",
    "user-library-read",
    "playlist-modify-private",
    "playlist-modify-public",
];

const SPOTIFY_CLIENT_ID: string = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_REDIRECT_URI: string = process.env.SPOTIFY_REDIRECT_URI!;

export default function SpotifyConnect() {
    const [user, setUser] = useState<User>();

    const generateURL = () => {
        const url = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("redirect_uri", SPOTIFY_REDIRECT_URI);
        url.searchParams.append("scope", SCOPE.join(" "));
        return url.toString();
    };
    function handleStorage(event: any) {
        const localUser = localStorage.getItem("user");
        if (localUser) {
            setUser(JSON.parse(localUser));
        }
    }
    const handleClick = () => {
        window.open(generateURL(), "_blank");
        window.addEventListener("storage", handleStorage);
    };

    useEffect(() => {
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
            {!user && (
                <div className={styles.container}>
                    <div className={styles.wrapper}>
                        <button className={styles.button} onClick={handleClick}>
                            Login to Spotify
                        </button>
                    </div>
                </div>
            )}

            {user && <UserCard {...user} />}
        </>
    );
}
