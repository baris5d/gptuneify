const localStorageKey = "playlistList"

export const getPlaylistsFromLocalStorage = (): string[] => {
  if (typeof window !== "undefined") {
    const playlistsList = localStorage.getItem(localStorageKey)
    if (playlistsList) {
      try {
        return JSON.parse(playlistsList)
      } catch (error) {
        console.error(error)
        return []
      }
    }
  }
  return []
}

export const addPlaylistToLocalStorage = (playlistId: string) => {
  if (typeof window !== "undefined") {
    const playlistsList = getPlaylistsFromLocalStorage()
    if (playlistsList.includes(playlistId)) {
      return
    }
    playlistsList.push(playlistId)
    localStorage.setItem(localStorageKey, JSON.stringify(playlistsList))
  }
}