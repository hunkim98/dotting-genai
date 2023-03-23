// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { imageUrl } = req.body;
    if (imageUrl) {
      let blob = await fetch(imageUrl).then((r) => r.blob());
      res.status(200).json({ blob: blob });
    }
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
