import { pingAbi } from "@/utils/pingAbi";
import { Button } from "./ui/button";
import { useAccount, useSwitchChain } from "wagmi";
import { chains } from "@lens-chain/sdk/viem";
import { useState } from "react";
import { useEthersSigner } from "@/lib/utils";
import { ethers } from "ethers";

export function PingButton({
  onTransactionConfirmed,
}: {
  onTransactionConfirmed: (txHash: string) => void;
}) {
  const { address, chainId: activeChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const signer = useEthersSigner({ chainId: 37111 });

  const sendPingTransaction = async () => {
    if (!signer) return;
    try {
      setIsPending(true);
      const contract = new ethers.Contract(
        "0xb7462EaCd5487514b6b789CF1Fca3081020F4e21",
        pingAbi,
        signer
      );
      const txResponse = await contract.ping();
      const receipt = await txResponse.wait();
      setIsPending(false);
      setTxHash(receipt.hash);
      onTransactionConfirmed(receipt.hash);
    } catch (error) {
      setIsPending(false);
      console.error("Transaction failed:", error);
    }
  };

  const lensTestnetId = chains.testnet.id;
  const isCorrectNetwork = activeChainId === lensTestnetId;

  if (!address) return null;

  return (
    <>
      {!isCorrectNetwork ? (
        <Button
          variant="default"
          size="default"
          className="mt-4"
          onClick={() => {
            if (switchChain) {
              switchChain({ chainId: lensTestnetId });
            } else {
              alert("Network switching is not supported in your wallet.");
            }
          }}
        >
          Switch Network
        </Button>
      ) : (
        <Button
          variant="default"
          size="default"
          className="mt-4"
          onClick={() => sendPingTransaction()}
        >
          Send Ping
        </Button>
      )}
      {isPending && <div className="mt-4">Pending...</div>}
      {txHash && (
        <div className="mt-4">
          <a
            href={chains.testnet.blockExplorers!.default.url + "/tx/" + txHash}
          >
            View Transaction
          </a>
        </div>
      )}
    </>
  );
}
