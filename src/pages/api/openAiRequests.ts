import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const text = req.body.text;

  if (!text) res.status(400).send("Please provide text");

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: text }],
    model: "gpt-3.5-turbo",
  });

  res.status(200).send(completion.choices[0].message.content);
}
