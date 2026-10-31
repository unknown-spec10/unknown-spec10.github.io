import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-var.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/jbmono-var.woff2",
  variable: "--font-jetbrains",
  weight: "100 800",
  display: "swap",
});

const serif = localFont({
  src: "./fonts/serif-italic.woff2",
  variable: "--font-serif",
  weight: "400",
  style: "italic",
  display: "swap",
});

const description =
  "Backend and AI engineer in Kolkata building production-grade RAG systems, async FastAPI backends, and cloud-integrated data pipelines.";

export const metadata: Metadata = {
  title: "Deep Podder — Backend & AI Engineer",
  description,
  openGraph: {
    title: "Deep Podder — Backend & AI Engineer",
    description,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deep Podder — Backend & AI Engineer",
    description,
  },
  icons: { icon: "/favicon.svg" },
};

const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('dp-theme');
    var dark = t ? t === 'dark' : !window.matchMedia('(prefers-color-scheme: light)').matches;
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.classList.add('js');
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.classList.add('js');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
