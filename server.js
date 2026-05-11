import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { convertToModelMessages, streamText } from "ai";
import { google } from "@ai-sdk/google";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.post('/text', async (req, res) => {

    try {

        const { messages } = req.body ?? {};

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: "Messages are required"
            });
        }

        const modelMessages = await convertToModelMessages(
            messages.map(({ id, ...rest }) => rest),
        );

        const result = await streamText({
            model: google("gemini-1.5-flash"),
            system: "You are a helpful assistant",
            messages: modelMessages,
        });

        result.pipeUIMessageStreamToResponse(res);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

app.listen(3000, () => {
    console.log(`Example app listening on port 3000`)
})