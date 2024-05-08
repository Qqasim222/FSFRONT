import type { Metadata } from "next";
import "@/app/globals.css";
import { Roboto } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { ThemeToggleProvider } from "@/providers/themeToggle";
import { ToastContainer } from "@/providers/toastContainer";
import { notFound } from "next/navigation";
import "react-toastify/dist/ReactToastify.css";
import NextAuthProvider from "@/providers/nextAuth";
import "react-international-phone/style.css";
import ReduxProvider from "@/providers/reduxStore";
import NextTopLoader from "nextjs-toploader";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

export const metadata: Metadata = {
  title: "FoodSwitch",
  description: "Food Switch App",
};

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh-cn" }, { locale: "pt-br" }];
}
export default async function LocaleLayout({ children, params: { locale } }) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning className={`${roboto.variable}`}>
      <body>
        <NextAuthProvider>
          <ToastContainer className="z-100" />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ReduxProvider>
              <NextTopLoader color="#2478be" />
              <ThemeToggleProvider>{children}</ThemeToggleProvider>
            </ReduxProvider>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
