import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";

// Headings and big numbers
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Body text
const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// IDs, codes, times
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cevrynt",
  description: "Underwriting platform for merchant cash advance funders.",
  icons: { icon: "/brand/cevrynt-mark-solid.png" },
};

// Runs before the first paint so a remembered collapsed sidebar never flashes
// open, and a closed Ask Cevrynt popup never flashes back. Without a saved
// choice, the sidebar starts as the icon rail on screens under 900px wide.
const sidebarBootScript = `var d=document.documentElement,v=null;try{v=localStorage.getItem("cevrynt-sidebar");if(localStorage.getItem("cevrynt-ask-seen")==="1")d.setAttribute("data-ask","seen")}catch(e){}if(v==="collapsed"||(v!=="open"&&window.innerWidth<900))d.setAttribute("data-sidebar","collapsed")`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} ${plexMono.variable} h-full`}
    >
      <body className="h-full overflow-hidden">
        <script dangerouslySetInnerHTML={{ __html: sidebarBootScript }} />
        {children}
      </body>
    </html>
  );
}
