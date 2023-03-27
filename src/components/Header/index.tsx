import styles from "./header.module.css";
import Image from "next/image";

export const Header = () => {
    return (
        <div className={styles.header__wrapper}>
            <h1 className={styles.header__title}>GPTuneify</h1>
            <p className={styles.header__description}>
                Transform your listening experience with GPTuneify; the
                intelligent playlist creator that adapts to your mood in
                real-time.
            </p>
            <div className={styles.links}>
                <a href="https://github.com/baris5d/gptuneify" target="_blank">
                    <Image
                        src="/github-mark.svg"
                        alt="Github"
                        width={30}
                        height={30}
                    />
                </a>
            </div>
        </div>
    );
};
