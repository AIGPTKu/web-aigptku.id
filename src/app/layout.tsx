import type { Metadata } from "next";
import "@/styles/globals.css";
import { GlobalProvider } from "@/context/global";
import { Suspense } from "react";

// const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: any): Promise<Metadata> {
  try {
    return {
      title: "AIGPTku",
      description: "Assisten kerja kamu!",
      icons: "/aigptku.id-logo-min1.png",
      openGraph: {
        title: "AIGPTku",
        description: "Assisten kerja kamu!",
        images: "/aigptku.id-logo-min1.png",
      },
    };
  } catch (error) {
    return {
      title: "AIGPTku",
      description: "Assisten kerja kamu!",
      icons: "/aigptku.id-logo-min1.png",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#10001b" />
      </head>
      <GlobalProvider>
        <body>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </body>
      </GlobalProvider>
    </html>
  );
}
