import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import '../styles/globals.css'


// This will create a configuration object for the Celo Alfajores chain, as required by RainbowKit/wagmi
const celoChain = {
  id: 44787,
  name: "Celo Alfajores Testnet",
  network: "alfajores",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    default: "https://alfajores-forno.celo-testnet.org",
  },
  blockExplorers: {
    default: {
      name: "CeloScan",
      url: "https://alfajores.celoscan.io",
    },
  },
  testnet: true,
};


// This will configure the providers and connectors, which will let RainbowKit know how to interact with the chain
const { chains, provider } = configureChains(
  [celoChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== celoChain.id) return null;
        return { http: chain.rpcUrls.default };
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Celo NFT Marketplace",
  chains,
});


// This is to initialize a wagmi client that combines all the above information, that RainbowKit will use under the hood.
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});



// Wrap the code with the Wagmi and RainbowKit providers
function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp
