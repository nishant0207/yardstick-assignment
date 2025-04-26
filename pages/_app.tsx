// pages/_app.tsx
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Head from "next/head"
import { ThemeProvider } from "@/contexts/ThemeContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f3f4f6" />
        <meta name="description" content="Finance Visualizer - Track your expenses, manage budgets, and visualize your financial data" />
        <title>Finance Visualizer</title>
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}