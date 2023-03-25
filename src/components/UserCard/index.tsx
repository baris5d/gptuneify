import { User } from "@/types";
import Image from "next/image";
import { FC } from "react";
import styles from "./userCard.module.css";

export const UserCard: FC<User> = (props) => {
    const { display_name, email, images } = props;

    return (
        <>
            <div className={styles.user__card}>
                <div className={styles.user__image_wrapper}>
                    <Image
                        src={images[0].url}
                        alt="User profile picture"
                        width={200}
                        height={200}
                        className={styles.user__image}
                    />
                </div>
                <h1 className={styles.user__name}>{display_name}</h1>
            </div>
        </>
    );
};
