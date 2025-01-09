export const pingAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "Pong",
    type: "event",
  },
  {
    inputs: [],
    name: "ping",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
