import GenAiDataContextProvier from "@/context/GenAiDataContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GenAiDataContextProvier>
      <Component {...pageProps} />
    </GenAiDataContextProvier>
  );
}
