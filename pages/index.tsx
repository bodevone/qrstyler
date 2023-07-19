import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";


const Home: NextPage = () => {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>QR Code Styler</title>
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-28 mt-20">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-slate-900 sm:text-7xl">
          Generate QR code in different styles{" "}
          <span className="relative whitespace-nowrap text-[#3290EE]">
            <span className="relative">using AI</span>
          </span>{" "}
          for everyone.
        </h1>

        <p className="mx-auto mt-10 max-w-xl text-lg text-slate-700 leading-7">
          Want to customize your QR codes? Let our AI do it so 
          you can enjoy it now. 100% free – generate them today.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            className="bg-black rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-8 hover:bg-black/80"
            href="/generate"
          >
            Get Started
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Home;
