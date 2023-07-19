import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

type Data = string;
interface ExtendedNextApiRequest extends NextApiRequest {
    body: {
      prompt: string;
      qrCodeContent: string;
    };
  }

export default async function handler(
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Data>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(500).json("Login to upload.");
  }

  const prompt = req.body.prompt;
  const qrCodeContent = req.body.qrCodeContent;
  let startResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Token " + process.env.REPLICATE_API_KEY,
    },
    body: JSON.stringify({
      version:
        "9cdabf8f8a991351960c7ce2105de2909514b40bd27ac202dba57935b07d29d4",
      input: { prompt: prompt, qr_code_content: qrCodeContent },
    }),
  });

  let jsonStartResponse = await startResponse.json();

  if (startResponse.status != 201) {
    res.status(500).json("Error from model");
    return;
  }

  let endpointUrl = jsonStartResponse.urls.get;
  let generatedImage: string | null = null;
  while (!generatedImage) {
    console.log("polling for result...");
    let finalResponse = await fetch(endpointUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + process.env.REPLICATE_API_KEY,
      },
    });
    let jsonFinalResponse = await finalResponse.json();

    if (jsonFinalResponse.status === "succeeded") {
        generatedImage = jsonFinalResponse.output[0];
    } else if (jsonFinalResponse.status === "failed") {
      break;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  if (generatedImage) {
    res.status(200).json(generatedImage);
  } else {
    res.status(500).json("Failed to generate image")
  }
}