import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import '@solana/wallet-adapter-react-ui/styles.css';
import { ReduxProvider } from "@/components/provider/ReduxProvider";
import ToasterClient from "./ToasterClient";
import { ProductsProvider } from "@/context/ProductContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { WalletProvider } from "@/context/WalletContext";
// import { SolanaProvider } from "@/context/Web3Context";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XXING",
  description: "Streamline your business with XXING.",
  icons: {
    icon: "/xxing-logo-colored.svg",
    shortcut: "/ .svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css"
        />
        <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
      </head>
      <body className={inter.className}>
        {/* <SolanaProvider> */}
          <SidebarProvider>
            <ProductsProvider>
              <ReduxProvider>
                {/* <WalletProvider> */}
                  <ToasterClient />
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js" />
                  {children}
                {/* </WalletProvider> */}
              </ReduxProvider>
            </ProductsProvider>
          </SidebarProvider>
        {/* </SolanaProvider> */}
      </body>
    </html>
  );
}
