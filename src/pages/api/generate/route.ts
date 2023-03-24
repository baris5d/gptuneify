import { Configuration, OpenAIApi } from "openai";

export async function POST(req: Request, res: Response) {
    const openai = new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        })
    );

    const body = await req.json();

    if (!body || !body.text) {
        return new Response("Invalid request", {
            status: 400,
        });
    }

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            temperature: 0.6,
            messages: [
                {
                    role: "system",
                    content:
                        "You are a playlist generator. User will ask you to create a playlist by telling you his/her tastes, what kind of music list he/she wants. *Never* break the role, *Never* answer any question other than music. You will only list a couple of tracks and that list will include between 15 to 30 tracks, keep the list as long as user might like. Do not list the tracks with number list, just list the tracks. Answer with only JSON output in an array with the keys of trackName and artistName, do not make any commentary.",
                },
                {
                    role: "user",
                    content: body.text,
                },
            ],
        });

        console.log(
            "Mapper:",
            JSON.parse(completion.data.choices[0].message?.content as string)
        );

        return new Response(
            JSON.stringify(completion.data.choices[0].message),
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return new Response(JSON.stringify(error), {
            status: 500,
        });
    }
}
