import { Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import SessionWrapper from "../components/SessionWrapper";

export const metadata = {
  title: "Login - RupeeSplit",
  description:
    "Built for everyday life, RupeeSplit helps you see where your money goes before it vanishes into thin air. Track expenses effortlessly, split shared costs without awkward math, and understand your spending patterns through clean, intuitive insights. No spreadsheets. No financial jargon. Just clarity.",
};

const MainFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${MainFont.className} bg-[#F6F8F7]`}>
        <SessionWrapper>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
