import { API_BASE, API_KEY } from "./config.js";

export async function fetchProfile(profileName, token) {
  const url =
    API_BASE +
    "/auction/profiles/" +
    encodeURIComponent(profileName) +
    "?_listings=true";

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Could not load profile.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  let profile = json;

  if (json && json.data) {
    profile = json.data;
  }

  try {
    const existingAuthRaw = localStorage.getItem("auth");

    if (existingAuthRaw) {
      const existingAuth = JSON.parse(existingAuthRaw);

      if (existingAuth.user && existingAuth.user.name === profile.name) {
        existingAuth.user.credits = profile.credits;
        existingAuth.user.avatar = profile.avatar;
        existingAuth.user.banner = profile.banner;
        existingAuth.user.bio = profile.bio;
        existingAuth.user.listings = profile.listings;

        localStorage.setItem("auth", JSON.stringify(existingAuth));
      }
    }
  } catch (syncError) {}

  return profile;
}

export async function updateProfile(profileName, token, body) {
  const url = API_BASE + "/auction/profiles/" + encodeURIComponent(profileName);

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    let errorMessage = "Could not update profile.";

    if (json && json.errors && json.errors.length > 0) {
      errorMessage = json.errors[0].message;
    } else if (json && json.message) {
      errorMessage = json.message;
    }

    throw new Error(errorMessage);
  }

  let profile = json;

  if (json && json.data) {
    profile = json.data;
  }

  try {
    const existingAuthRaw = localStorage.getItem("auth");

    if (existingAuthRaw) {
      const existingAuth = JSON.parse(existingAuthRaw);

      if (existingAuth.user && existingAuth.user.name === profile.name) {
        existingAuth.user.credits = profile.credits;
        existingAuth.user.avatar = profile.avatar;
        existingAuth.user.banner = profile.banner;
        existingAuth.user.bio = profile.bio;

        localStorage.setItem("auth", JSON.stringify(existingAuth));
      }
    }
  } catch (syncError) {}

  return profile;
}

