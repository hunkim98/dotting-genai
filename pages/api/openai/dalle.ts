// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
    const { queryPrompt } = req.body;
    const response = await openai.createImage({
      // prompt for the image
      prompt: queryPrompt,
      // number of images to return
      n: 1,
      // 256x256 is the smallest size
      size: "256x256",
    });
    const urls = response.data.data.map((item) => item.url);
    // we filter out any undefined values
    const filterdUrls = urls.filter((url) => url) as string[];
    const multipleImageBlobs = await Promise.all(
      filterdUrls.map((url) =>
        axios.get(url, {
          responseType: "arraybuffer",
        })
      )
    );
    const buffers = multipleImageBlobs.map((response) => {
      const buffer = Buffer.from(response.data, "utf-8");
      return buffer.toJSON().data;
    });
    res.status(200).json({ buffers: buffers });
    // const imageUrl = response.data.data[0].url;
    // let blob = null;
    // if (imageUrl) {
    //   const response = await axios.get(imageUrl, {
    //     responseType: "arraybuffer",
    //   });
    //   // send buffer instead since image url is not working due to CORS error
    //   const buffer = Buffer.from(response.data, "utf-8");
    //   // res.send(buffer)
    //   // res.status(200).b
    //   res.status(200).json({
    //     buffer: buffer.toJSON().data,
    //   });
    // }
    // res.status(200).json({ ...response.data, blob: blob?.arrayBuffer });
  } else {
    res.status(400).json({ error: "Invalid request method" });
  }
}
