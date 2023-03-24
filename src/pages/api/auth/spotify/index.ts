import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
    }

    const { code } = req.body;

    const body = {
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
    };

    try {
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

        token.json().then((data) => {
            if (data.error) {
                return res.status(500).send(data);
            }

            return res.status(200).send(data);
        });
    } catch (error: any) {
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
