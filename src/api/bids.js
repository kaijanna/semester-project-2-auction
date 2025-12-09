import { API_BASE, API_KEY } from "./config.js";

export async function placeBid(listingId, amount, token) {
  const url = API_BASE + "/auction/listings/" + listingId + "/bids";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({
      amount: amount,
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Could not place bid.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  return json;
}

export async function fetchProfileBids(profileName, token) {
  const url =
    API_BASE +
    "/auction/profiles/" +
    encodeURIComponent(profileName) +
    "/bids?_listings=true";

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Could not load bids.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  let bids = [];

  if (json && Array.isArray(json.data)) {
    bids = json.data;
  }

  return bids;
}
