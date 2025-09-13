export const COLLECTION_ADDR =
  "stars1d5frtu2txpy2c5v9jg60wqju2qk8cm8xg3k7s4k863m4hg9mt70sxlxtq2";

export function normalizeUrl(u) {
  if (!u) return "";
  if (u.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${u.replace("ipfs://", "")}`;
  return u;
}

export async function fetchPixelBirds(owner) {
  const res = await fetch("https://graphql.mainnet.stargaze-apis.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      query: `
      query Tokens($owner: String!, $collectionAddr: String!, $limit: Int = 50) {
        tokens(owner: $owner, collectionAddr: $collectionAddr, limit: $limit) {
          tokens { tokenId name media { url } imageUrl }
        }
      }`,
      variables: { owner, collectionAddr: COLLECTION_ADDR, limit: 50 },
    }),
  });

  if (!res.ok) throw new Error("Stargaze GQL HTTP " + res.status);
  const payload = await res.json();
  const list = (payload && payload.data && payload.data.tokens && payload.data.tokens.tokens) || [];
  return list.map((t) => ({
    tokenId: (t && t.tokenId) || "",
    name: (t && t.name) || `PixelBird #${(t && t.tokenId) || ""}`,
    image: normalizeUrl((t && t.media && t.media.url) || (t && t.imageUrl) || ""),
  }));
}
