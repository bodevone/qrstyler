import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    endpointUrl: string;
  };
}

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json("Login to upload.");
  }

  const endpointUrl = req.body.endpointUrl;

  let finalResponse = await fetch(endpointUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
  });

  let jsonFinalResponse = await finalResponse.json();

  if (jsonFinalResponse.status === "succeeded") {
    const generatedImage = jsonFinalResponse.output[0];
    res.status(200).json(generatedImage);
  } else if (jsonFinalResponse.status === "failed") {
    res.status(500).json("Failed to generate image")
  } else {
    res.status(200).json("");
  }
}