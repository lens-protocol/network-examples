import { pingAbi } from "@/utils/pingAbi";
import { Button } from "./ui/button";
import { useAccount, useWriteContract, useSwitchChain } from "wagmi";
import { chains } from "@lens-chain/sdk/viem";
import { useEffect } from "react";

export function PingButton({
  onTransactionConfirmed,
}: {
  onTransactionConfirmed: (txHash: string) => void;
}) {
  const { address, chainId: activeChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const {
    writeContract,
    data: txHash,
    isPending,
    isSuccess,
  } = useWriteContract();

  const lensTestnetId = chains.testnet.id;
  const isCorrectNetwork = activeChainId === lensTestnetId;

  useEffect(() => {
    if (isSuccess && txHash) {
      onTransactionConfirmed(txHash);
    }
  }, [isSuccess, onTransactionConfirmed, txHash]);

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
          onClick={() =>
            writeContract({
              address: "0xb7462EaCd5487514b6b789CF1Fca3081020F4e21",
              abi: pingAbi,
              functionName: "ping",
            })
          }
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
