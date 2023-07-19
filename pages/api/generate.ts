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
    return res.status(500).json("Error from model");
  }

  let endpointUrl = jsonStartResponse.urls.get;

  res.status(200).json(endpointUrl);
}