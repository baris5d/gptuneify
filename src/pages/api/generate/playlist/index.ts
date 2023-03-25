import { isLoggedIn } from "@/utils/auth/spotify";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const { user, playlistName, playlist, playlistDescription } = req.body;

    if (!user) {
        return res.status(400).send("Missing user_id");
    }

    if (!playlistName) {
        return res.status(400).send("Missing playlist name");
    }

    if (!req.headers.authorization) {
        return res.status(400).send("Unauthorized");
    }

    const playlistInfo = {
        name: playlistName,
        description: `${playlistDescription} Created by GPTuneify.`,
        public: true,
    };

    const createdPlaylist = await fetch(
        `https://api.spotify.com/v1/users/${user.id}/playlists`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization,
            },
            body: JSON.stringify(playlistInfo),
        }
    );

    createdPlaylist.json().then((data: { id: string }) => {
        getUris(playlist, req.headers.authorization as string).then((uris) => {
            addTracksToPlaylist(
                data.id,
                user.id,
                uris,
                req.headers.authorization as string
            );
        });

        res.status(200).send(data);
    });
}

const addTracksToPlaylist = async (
    playlistId: string,
    userId: string,
    uriList: string[],
    authorization: string
) => {
    const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
            body: JSON.stringify({
                uris: uriList,
            }),
        }
    );

    response.json().then((data) => {
        return data;
    });
};

const getUris = async (playlist: string[], authorization: string) => {
    let uris: string[] = [];

    await Promise.all(
        playlist.map(async (track) => {
            const data = await findTrack(track, authorization);
            uris.push(data.tracks.items[0].uri);
        })
    );
    return uris;
};

const findTrack = async (track: any, authorization: string) => {
    const trackFound = await fetch(
        `https://api.spotify.com/v1/search?q=${
            track.artistName + " " + track.trackName
        }&type=track`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: authorization,
            },
        }
    ).then((res) => res.json());

    return trackFound;
};
