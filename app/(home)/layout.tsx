import type { Metadata } from 'next';
import {Space_Grotesk,Raleway } from 'next/font/google';
import '../globals.css';
import { StoreConfigaration } from '@/constant';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';

const fontSetup=Space_Grotesk({
  weight:"400",
  style:"normal",
  subsets:["vietnamese"]
})

const { title, doamin, description, name, locale, keywords, authors } =
  StoreConfigaration.storeInfo;

export const metadata: Metadata = {
  title: {
    default: ` ${name} – Small Ecommerce Site`,
    template: '%s |' + name,
  },
  description: description,
  keywords: keywords,
  authors: [{ name: authors }],
  creator: name,
  publisher: name,
  openGraph: {
    title: title,
    description:
      'Discover and shop amazing products at Store, your trusted small ecommerce site.',
    url: 'https://yourdomain.com',
    siteName: 'Store',
    images: [
      {
        url: `${doamin}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${name} – Small Ecommerce Site`,
      },
    ],
    locale: locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${name} – Small Ecommerce Site`,
    description,
    images: [`${doamin}/og-image.jpg`],
    creator: '@yourtwitter',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(doamin),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`${fontSetup.className} `}
      >
      <Header/>
      <div className='w-[90%] mx-auto '>
        
          {children}

      </div>

  <Toaster
          position="top-right"
          reverseOrder={false}
        
        />

      </body>
    </html>
  );
}
