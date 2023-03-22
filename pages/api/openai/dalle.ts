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
  if (req.method === "POST") {
    const { queryPrompt } = req.body;
    const response = await openai.createImage({
      // prompt for the image
      prompt: queryPrompt,
      // number of images to return
      n: 1,
      // 256x256 is the smallest size
      size: "256x256",
    });
    res.status(200).json(response.data);
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
