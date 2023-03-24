import { useRouter } from "next/navigation";
import styles from "./spotify.module.css";

const SCOPE: string[] = [
    "user-read-private",
    "user-read-email",
    "user-library-modify",
    "user-library-read",
];

const SPOTIFY_CLIENT_ID: string = process.env.SPOTIFY_CLIENT_ID!;
const SPOTIFY_REDIRECT_URI: string = process.env.SPOTIFY_REDIRECT_URI!;

export default function SpotifyConnect() {
    //https://accounts.spotify.com/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URI}&scope=user-read-private%20user-read-email%20user-library-modify%20user-library-read

    const router = useRouter();

    const generateURL = () => {
        const url = new URL("https://accounts.spotify.com/authorize");
        url.searchParams.append("client_id", SPOTIFY_CLIENT_ID);
        url.searchParams.append("response_type", "code");
        url.searchParams.append("redirect_uri", SPOTIFY_REDIRECT_URI);
        url.searchParams.append("scope", SCOPE.join(" "));
        return url.toString();
    };
    const handleClick = () => {
        router.push(generateURL());
    };

    return (
        <main>
            <div className={styles.container}>
                <div className={styles.wrapper}>
                    <button className={styles.button} onClick={handleClick}>
                        Connect to Spotify
                    </button>
                </div>
            </div>
        </main>
    );
}
