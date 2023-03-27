import { useEffect, useState } from "react";
import styles from "./loader.module.css";
interface LoaderProps {
    loaderMessages: string[];
}
const Loader = (props: LoaderProps) => {
    const { loaderMessages } = props;

    return (
        <>
            <div className={styles.loader__wrapper}>
                <LoaderMessages loaderMessages={loaderMessages} />
                <div className={styles.loader}>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.circle}></div>
                    <div className={styles.shadow}></div>
                    <div className={styles.shadow}></div>
                    <div className={styles.shadow}></div>
                </div>
            </div>
        </>
    );
};

const LoaderMessages = (props: LoaderProps) => {
    const { loaderMessages } = props;
    const [currentMessage, setCurrentMessage] = useState(
        loaderMessages[0] || ""
    );

    useEffect(() => {
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % loaderMessages.length;
            setCurrentMessage(loaderMessages[currentIndex]);
        }, 10000);

        return () => clearInterval(interval);
    }, [loaderMessages]);

    return (
        <div className={styles.loader__messages}>
            <div className={styles.loader__message}>{currentMessage}</div>
        </div>
    );
};

export default Loader;
