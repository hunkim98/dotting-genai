// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/utils/db/mongodb";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    // const { stroke } = req.body;
    const client = await clientPromise;
    const db = client.db("stroke");
    const collection = db.collection("record");
    collection.insertOne({
      data: "hi",
    });
    res.status(200).json({ message: "Successful" });
  } else {
    res.status(400).json({ message: "Invalid request method" });
  }
}
