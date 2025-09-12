import WalletProvider from '@/components/WalletProvider';
import { Geist, Geist_Mono } from "next/font/google";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'PixelBirds: Cleaner',
  description: 'Catch seeds, avoid trash, grow your forest.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <WalletProvider>
          <Header />
          <main className="flex-grow-1">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
