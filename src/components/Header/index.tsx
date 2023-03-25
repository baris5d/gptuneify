import styles from "./header.module.css";
export const Header = () => {
    return (
        <div className={styles.header__wrapper}>
            <h1 className={styles.header__title}>GPTuneify</h1>
            <p className={styles.header__description}>
                Transform your listening experience with GPTuneify; the
                intelligent playlist creator that adapts to your mood in
                real-time.
            </p>
        </div>
    );
};
