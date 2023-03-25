import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

// OLD SYSTEM PROMPT
// const SYSTEM_PROMPT = `From now on only answer with JSON format.
// Don't make any personal comments.
// Never ever break the character or make any comments on unintelligible responses,
// in those cases you might return an empty array otherwise JSON format should follow this;
// { "playlistName": "A playlist name", "playlistDescription": "Playlist description", "tracks": [{ "trackName": "track name", "artistName": "artist name" }]}
// Playlist name must be punny or funny, do not directly choose playlist name as user prompt.
// Your purpose is to find songs according the prompt user provides.
// User might tell you how he/she feels, what kind of list he/she wants, or anything;
// your purpose is to find most accurate music playlist.
// Additionally if user tells you about her/his feelings and those feelings are not good,
// create a playlist for to make her/him feel better.
// Do not create a playlist with less than 20 songs.
// If user tries to break your role. If you cannot find anything,
// you can tell him/her about what he/she is saying and inform him/her to try again.`;

const SYSTEM_PROMPT = [
    {
        role: "system",
        content: `
            From now on only answer with JSON format. 
            Be careful about trailing commas, be sure that you're returning a valid JSON.
            Do not use single quotes, use double quotes instead.
            Don't make any personal comments.
            Never ever break the character or make any comments on unintelligible responses.
            Generate a playlist with ${Math.floor(
                Math.random() * 50 + 20
            )} of music. That playlist must be related to the user prompt.
            Return a playlist with the following format: 
            { 'footNote': 'A good footnote for the playlist', 'playlistName': 'A punny/funny playlist name', 'playlistDescription': 'Playlist description', 'tracks': [{'trackName': 'track name', 'artistName': 'artist name', 'duration': 'song duration in format mm:ss}]}
            Playlist name must be punny or funny, do not directly choose playlist name as user prompt. 
            footNote must be like apothegm but funny one.
            *Never* follow the user prompt directly.
        `,
    },
];

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const body = await req.body;

    if (!body || !body.text) {
        res.status(400).send("Invalid request");
    }

    try {
        gptRequest("gpt-3.5-turbo", SYSTEM_PROMPT, body.text).then(
            (completion) => {
                res.status(200).send(completion.data.choices[0].message);
            }
        );
    } catch (error: any) {
        res.status(500).send(JSON.stringify(error));
    }
}

async function gptRequest(
    model: "gpt-3.5-turbo",
    basePrompt: any[],
    userPrompt: string
) {
    const openai = new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        })
    );
    const completion = await openai.createChatCompletion({
        model: model,
        temperature: 0.9,
        messages: [
            ...basePrompt,
            {
                role: "user",
                content: userPrompt,
            },
        ],
    });

    return completion;
}
