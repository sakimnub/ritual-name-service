import { encodeAbiParameters, decodeAbiParameters, parseAbiParameters } from "viem";
import type { Hex } from "viem";

// ─── LLM Precompile Encoding (0x0802 — 30 fields) ───────────────────────────

export function encodeLLMRequest(params: {
  executor: `0x${string}`;
  messages: Array<{ role: string; content: string }>;
  model?: string;
  maxCompletionTokens?: bigint;
  temperature?: bigint;
  ttl?: bigint;
}): Hex {
  const messagesJson = JSON.stringify(params.messages);
  const model = params.model ?? "zai-org/GLM-4.7-FP8";

  return encodeAbiParameters(
    parseAbiParameters(
      [
        "address, bytes[], uint256, bytes[], bytes,",
        "string, string, int256, string, bool, int256, string, string,",
        "uint256, bool, int256, string, bytes, int256, string, string, bool,",
        "int256, bytes, bytes, int256, int256, string, bool,",
        "(string,string,string)",
      ].join("")
    ),
    [
      params.executor,
      [],                                         // encryptedSecrets
      params.ttl ?? 300n,                         // ttl
      [],                                         // secretSignatures
      "0x",                                       // userPublicKey
      messagesJson,                               // messagesJson
      model,                                      // model
      0n,                                         // frequencyPenalty
      "",                                         // logitBiasJson
      false,                                      // logprobs
      params.maxCompletionTokens ?? 4096n,        // maxCompletionTokens (>=4096 for GLM reasoning)
      "",                                         // metadataJson
      "",                                         // modalitiesJson
      1n,                                         // n
      true,                                       // parallelToolCalls (placeholder)
      0n,                                         // presencePenalty
      "medium",                                   // reasoningEffort
      "0x",                                       // responseFormatData
      -1n,                                        // seed
      "auto",                                     // serviceTier
      "",                                         // stopJson
      false,                                      // stream
      params.temperature ?? 700n,                 // temperature (×1000, 0.7)
      "0x",                                       // toolChoiceData (placeholder)
      "0x",                                       // toolsData (placeholder)
      -1n,                                        // topLogprobs
      1000n,                                      // topP (1.0)
      "",                                         // user
      false,                                      // piiEnabled
      ["", "", ""] as [string, string, string],   // convoHistory (empty = no history)
    ]
  );
}

// ─── LLM Response Decoding ───────────────────────────────────────────────────

export function decodeLLMResponse(data: Hex) {
  const [hasError, completionData, , errorMessage] = decodeAbiParameters(
    [
      { type: "bool" },
      { type: "bytes" },
      { type: "bytes" },
      { type: "string" },
      { type: "tuple", components: [{ type: "string" }, { type: "string" }, { type: "string" }] },
    ],
    data
  );

  if (hasError) {
    return {
      hasError: true as const,
      content: null,
      error: errorMessage as string,
    };
  }

  // Decode completion data — it's an OpenAI-compatible JSON response
  const completionText = new TextDecoder().decode(
    completionData as unknown as Uint8Array
  );

  let content = completionText;
  try {
    const parsed = JSON.parse(completionText);
    if (parsed.choices?.[0]?.message?.content) {
      content = parsed.choices[0].message.content;
    }
  } catch {
    // completionData is raw text, use as-is
  }

  // Strip <think>...</think> reasoning blocks from GLM-4.7-FP8
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  return {
    hasError: false as const,
    content,
    error: null,
  };
}

// ─── HTTP Precompile Encoding (0x0801 — 13 fields) ──────────────────────────

export function encodeHTTPCallRequest(params: {
  executor: `0x${string}`;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headerKeys?: string[];
  headerValues?: string[];
  body?: string;
  ttl?: bigint;
}): Hex {
  const methodCode = { GET: 1, POST: 2, PUT: 3, DELETE: 4, PATCH: 5 }[
    params.method
  ];

  return encodeAbiParameters(
    [
      { type: "address" },
      { type: "bytes[]" },
      { type: "uint256" },
      { type: "bytes[]" },
      { type: "bytes" },
      { type: "string" },
      { type: "uint8" },
      { type: "string[]" },
      { type: "string[]" },
      { type: "bytes" },
      { type: "uint256" },
      { type: "uint8" },
      { type: "bool" },
    ],
    [
      params.executor,
      [],
      params.ttl ?? 100n,
      [],
      "0x",
      params.url,
      methodCode,
      params.headerKeys ?? [],
      params.headerValues ?? [],
      params.body
        ? (`0x${Buffer.from(params.body).toString("hex")}` as Hex)
        : "0x",
      0n,
      0,
      false,
    ]
  );
}

// ─── HTTP Response Decoding ──────────────────────────────────────────────────

export function decodeHTTPCallResponse(data: Hex) {
  const [statusCode, headerKeys, headerValues, body, errorMessage] =
    decodeAbiParameters(
      [
        { type: "uint16" },
        { type: "string[]" },
        { type: "string[]" },
        { type: "bytes" },
        { type: "string" },
      ],
      data
    );
  const headers: Record<string, string> = {};
  (headerKeys as string[]).forEach((k: string, i: number) => {
    headers[k] = (headerValues as string[])[i];
  });
  return {
    statusCode,
    headers,
    body: new TextDecoder().decode(body as unknown as Uint8Array),
    error: (errorMessage as string) || null,
  };
}
