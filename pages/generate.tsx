import { NextPage } from "next";
import { useState } from "react";
import Image from 'next/image';
import Head from "next/head";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StyleSelector from "@/components/StyleSelector";
import { LoadingDots } from "@/components/LoadingDots";
import { useSession, signIn } from "next-auth/react";
import { themeType, themes, themeToPrompt } from "@/utils/styleSelectorTypes";
import downloadPhoto from "@/utils/downloadPhoto"


const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [generatedLoaded, setGeneratedLoaded] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Anime");
  const [text, setText] = useState<string>("");

  const { data: session, status } = useSession();

  const onSubmit = (e: any) => {
    e.preventDefault();
    setError(null);
    generateQRCode();
  };

  async function generateQRCode() {
    if (!text) {
      setError("Empty input text")
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);

    const prompt = themeToPrompt[theme];
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt, qrCodeContent: text}),
    });

    let newPhoto = await res.json();

    if (res.status !== 200) {
      setError(newPhoto);
    } else {
      setGeneratedImage(newPhoto);
    }
    setLoading(false);
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>QR Code Styler</title>
      </Head>
      <Header/>
      <main className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-4 sm:mb-0 mb-8">
        
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal text-slate-900 sm:text-6xl mb-5">
          Generate QR code in any style
        </h1>

        {status === "unauthenticated" && (
          <div className="h-[250px] flex flex-col items-center space-y-6 max-w-[670px] mt-8">
            <div className="max-w-xl text-gray-600">
              Sign in below with Google to create a free account and restore
              your photos today
            </div>
            <button
              onClick={() => signIn("google")}
              className="bg-gray-200 text-black font-semibold py-3 px-6 rounded-2xl flex items-center space-x-2"
            >
              <Image
                src="/google.png"
                width={20}
                height={20}
                alt="google's logo"
              />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}

        {status === "authenticated" && !generatedImage && (
          <form className="max-w-xl w-full" onSubmit={onSubmit}>
            <div className="flex mt-10 items-center space-x-3">
              <Image
                src="/1-black.png"
                width={30}
                height={30}
                alt="1 icon"
                className="mb-5 sm:mb-0"
              />
              <p className="text-left font-medium">
                Your text to generate
              </p>
            </div>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm my-5 p-2"
              placeholder={'http://example.com/'}
            />
            <div className="flex mt-5 items-center space-x-3">
              <Image
                src="/2-black.png"
                width={30}
                height={30}
                alt="2 icon"
                className="mb-5 sm:mb-0"
              />
              <p className="text-left font-medium">
                Select your style
              </p>
            </div>

            <StyleSelector 
              theme={theme}
              setTheme={(newTheme) => setTheme(newTheme as typeof theme)}
              themes={themes}
            />

            {loading && (
              <div>
                <p>Generation might take up to several minutes</p>
              </div>
            )}

            {loading ? (
              <button
                disabled
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              >
                <span className="pt-4">
                  <LoadingDots/>
                </span>
              </button>
            ) : (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                type="submit"
              >
                Generate your QR code &rarr;
              </button>
            )}
          </form>
        )}

        {generatedImage && (
          <div>
            <h2 className="mb-1 font-medium text-lg">Generated QR Code</h2>
          </div>
        )}
        
        {generatedImage && (
          <Image
            alt="original photo"
            src={generatedImage}
            className="rounded-2xl"
            width={475}
            height={475}
            onLoadingComplete={() => setGeneratedLoaded(true)}
          />
        )}

        <div className="flex space-x-2 justify-center">
          {generatedImage && (
            <button
              onClick={() => {
                setGeneratedImage(null);
                setGeneratedLoaded(false);
                setError(null);
                setText("");
                setTheme("Anime");
              }}
              className="bg-blue-500 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-blue-500/80 transition"
            >
              Generate New QR Code
            </button>
          )}
          {generatedImage && generatedLoaded && (
            <button
              onClick={() => {
                downloadPhoto(generatedImage!);
              }}
              className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
            >
              Download Generated QR Code
            </button>
          )}
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
};

export default Home;
