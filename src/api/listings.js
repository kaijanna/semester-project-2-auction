import { API_BASE } from "./config.js";

export async function fetchAllListings() {
  const url =
    API_BASE + "/auction/listings?_bids=true&sort=created&sortOrder=desc";

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Something went wrong while loading listings.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  let result = [];

  if (json && Array.isArray(json.data)) {
    result = json.data;
  }

  return result;
}

export async function searchListings(searchText) {
  const cleanSearchText = searchText.trim();

  if (cleanSearchText === "") {
    return await fetchAllListings();
  }

  const url =
    API_BASE +
    "/auction/listings/search?q=" +
    encodeURIComponent(cleanSearchText) +
    "&_bids=true";

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Something went wrong while searching listings.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  let result = [];

  if (json && Array.isArray(json.data)) {
    result = json.data;
  }

  return result;
}

export async function fetchListingById(listingId) {
  const url =
    API_BASE + "/auction/listings/" + listingId + "?_bids=true&_seller=true";

  const response = await fetch(url);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Something went wrong while loading listing.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  return json.data;
}
