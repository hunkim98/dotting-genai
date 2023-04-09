// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DIFFUSION_URL } from "@/constants/urls";
import axios from "axios";
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
    const { prompt } = req.body;
    const responses = await Promise.all([
      axios.post(
        `${DIFFUSION_URL}`,
        { prompt },
        { responseType: "arraybuffer" }
      ),
      axios.post(
        `${DIFFUSION_URL}`,
        { prompt },
        { responseType: "arraybuffer" }
      ),
    ]);
    const buffers = responses.map((response) => {
      const buffer = Buffer.from(response.data, "utf-8");
      return buffer.toJSON().data;
    });

    res.status(200).json({ buffers: buffers });
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
