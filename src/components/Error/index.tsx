import styles from "./error.module.css";

interface Error {
    message: string;
}

export const Error = (props: Error) => {
    const { message } = props;

    return (
        <div className={styles.error}>
            <p className={styles.error__text}>{message}</p>
        </div>
    );
};

export default Error;
