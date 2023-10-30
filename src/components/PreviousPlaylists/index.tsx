import styles from './previousplaylists.module.css';

interface PreviousPlaylistsProps {
  playlistIdList: string[];
}

export const PreviousPlaylists = (props: PreviousPlaylistsProps) => {
  return (
    <>
      <div>
        <h2 className={styles.previousplaylists__title}>Previous Playlists</h2>
        <p className={styles.previousplaylists__description}>There is a list of playlists you have generated in the past. You can click on any of them to open it in Spotify.</p>
        <div className={styles.previousplaylists__container}>
          {props.playlistIdList.map((playlistId) => (
            <iframe key={playlistId} className={styles.previousplaylists__item} allowTransparency src={`https://open.spotify.com/embed/playlist/${playlistId}`} height="152" frameBorder="0" loading="lazy"></iframe>
          ))}
        </div>
      </div>
    </>
  );
}