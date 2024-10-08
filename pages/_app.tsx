import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "@/lib/store";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import GenAiDataContextProvier from "@/context/GenAiDataContext";

export function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <ChakraProvider>
        <GenAiDataContextProvier>
          <Component {...props.pageProps} />
        </GenAiDataContextProvier>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
