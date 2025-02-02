/**
 * Convert a raw string secret into a CryptoKey for HMAC signing/verifying.
 */
export async function createHmacKeyFromString(
    secret: string,
    algorithm: "HS256" | "HS384" | "HS512",
): Promise<CryptoKey> {
    // 1) Map from HSxxx → SHA-xxx
    let hash: AlgorithmIdentifier;
    switch (algorithm) {
        case "HS256":
            hash = "SHA-256";
            break;
        case "HS384":
            hash = "SHA-384";
            break;
        case "HS512":
            hash = "SHA-512";
            break;
        default:
            throw new Error("Unsupported algorithm: " + algorithm);
    }

    // 2) Use Web Crypto's importKey with "raw" format
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);

    return await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash },
        false,      // "extractable" = false (we can't export the key)
        ["sign", "verify"],
    );
}
