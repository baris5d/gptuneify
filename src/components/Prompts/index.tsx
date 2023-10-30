import styles from "./prompts.module.css";

interface PromptProps {
  order: number;
  description: string;
  onPromptClick: (prompt: string) => void;
}

const Prompt = (props: PromptProps) => {
    return (
        <button className={`${styles.prompt__wrapper} ${styles.prompt__wrapper__anim}`}
          style={{"--animation-order": props.order } as React.CSSProperties} 
          onClick={() => props?.onPromptClick(props.description)}
          >
            <p className={styles.prompt__description}>{props.description}</p>
        </button>
    );
}

const promptList = [
  "Road trip with songs that can make the journey unforgettable",
  "Morning routine to kickstart my day with the right energy",
  "Cozy evening at home, perfect for unwinding and relaxation",
  "Workout playlist to keep me motivated during my fitness sessions",
  "Romantic dinner date with a special someone",
  "'Throwback Thursday' playlist featuring hits from the 80s and 90s",
  "Disco themed party with friends",
  "Study session, tailored to enhance focus and productivity",
  "Songs that reflect the winter mood",
  "Celebrating a birthday with friends and family",
];


interface PromptsProps {
  onPromptClick: (prompt: string) => void;
}

export const Prompts = (props: PromptsProps) => {
    return (
        <div className={styles.prompts__wrapper}>
            <h1 className={styles.prompts__title}>Need some inspiration?</h1>
            <p className={styles.prompts__description}>You can try out some of these prompts to get you started!</p>

            <div className={styles.prompts__container}>
                {promptList.map((prompt, index) => (
                    <Prompt key={index} order={index} description={prompt} onPromptClick={props.onPromptClick}/>
                ))}
            </div>
        </div>
    );
};