import { Html, Head, Main, NextScript } from 'next/document'

  
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Generate QR code in any style"
        />
        <meta
          property="og:description"
          content="Generate QR code in any style"
        />
        <meta property="og:title" content="QR Code Styler" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QR Code Styler" />
        <meta
          name="twitter:description"
          content="Generate QR code in any style"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}