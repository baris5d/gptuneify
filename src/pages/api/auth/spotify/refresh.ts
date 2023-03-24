import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    return refreshToken(req.body.refresh_token)
        .then((data) => {
            console.log("data:", data);
            res.status(200).send(data);
        })
        .catch((error) => {
            res.status(500).send({
                error: "Something went wrong",
            });
        });
}

const refreshToken = async (refresh_token: string) => {
    const body = {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
    };

    const token = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(
                `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString("base64")}`,
        },
        body: new URLSearchParams(body as any).toString(),
    });
    return token.json();
};
