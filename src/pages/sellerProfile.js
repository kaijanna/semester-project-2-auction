import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchProfile } from "../api/profile.js";

export async function SellerProfilePage(profileNameFromRoute) {
  const authRaw = localStorage.getItem("auth");

 
  if (!authRaw) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Seller profile
            </h1>
            <p class="text-[#667280]">
              You need to be logged in to view seller profiles.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  let auth = null;

  try {
    auth = JSON.parse(authRaw);
  } catch (error) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Seller profile
            </h1>
            <p class="text-[#F44344]">
              Something went wrong with your login data. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const token = auth ? auth.token : null;

  if (!token) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Seller profile
            </h1>
            <p class="text-[#F44344]">
              Could not find login information. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const profileName = profileNameFromRoute;

  let profile = null;
  let errorMessage = "";

  try {
    profile = await fetchProfile(profileName, token);
  } catch (error) {
    errorMessage = error.message;
  }

  if (!profile) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Seller profile
            </h1>
            <p class="text-[#F44344]">
              Could not load this profile. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const sellerName = profile.name || profileName;

  const bio =
    profile.bio && profile.bio.trim() !== ""
      ? profile.bio
      : "This seller has not added a bio yet.";

  const avatarUrl =
    profile.avatar && profile.avatar.url ? profile.avatar.url : "";
  const avatarAlt =
    profile.avatar && profile.avatar.alt ? profile.avatar.alt : "Seller avatar";

  const firstLetter = sellerName ? sellerName.charAt(0).toUpperCase() : "?";

  const avatarHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="${avatarAlt}" class="h-full w-full object-cover" />`
    : `<span class="text-xl font-poppins">${firstLetter}</span>`;

  let bannerStyle = "";

  if (profile.banner && profile.banner.url) {
    const bannerUrl = profile.banner.url;
    bannerStyle = `background-image: url('${bannerUrl}');`;
  }

  let listings = [];

  if (Array.isArray(profile.listings)) {
    listings = profile.listings;
  }

  let listingsHtml = "";

  if (listings.length === 0) {
    listingsHtml = `
      <p class="text-sm text-[#6B7280]">
        This seller has no listings yet.
      </p>
    `;
  } else {
    let itemsHtml = "";

    for (let index = 0; index < listings.length; index++) {
      const item = listings[index];

      let titleText = "Untitled listing";
      if (item && item.title) {
        titleText = item.title;
      }

      let endsAtText = "No end date";
      if (item && item.endsAt) {
        const endDate = new Date(item.endsAt);
        endsAtText = endDate.toLocaleString("nb-NO");
      }

      let thumbnailUrl = "";
      if (Array.isArray(item.media) && item.media.length > 0) {
        const firstMedia = item.media[0];
        if (firstMedia && firstMedia.url) {
          thumbnailUrl = firstMedia.url;
        }
      }

      let thumbnailHtml = `
        <div class="h-12 w-12 rounded-md bg-[#E5E7EB]"></div>
      `;

      if (thumbnailUrl !== "") {
        thumbnailHtml = `
          <img
            src="${thumbnailUrl}"
            alt="Listing image"
            class="h-12 w-12 rounded-md object-cover"
          />
        `;
      }

      itemsHtml += `
        <article class="border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            ${thumbnailHtml}
            <div>
              <h2 class="text-sm font-poppins font-semibold">${titleText}</h2>
              <p class="text-xs text-[#6B7280]">Ends: ${endsAtText}</p>
            </div>
          </div>

          <div class="flex gap-2">
            <a
              href="#/listing/${item.id}"
              class="btn-secondary text-xs"
            >
              View listing
            </a>
          </div>
        </article>
      `;
    }

    listingsHtml = `
      <div class="space-y-3">
        ${itemsHtml}
      </div>
    `;
  }

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">

        <div
          class="w-full h-40 md:h-48 bg-cover bg-center bg-[#E5E7EB]"
          style="${bannerStyle}"
        ></div>

       <div class="max-w-4xl mx-auto px-4 md:px-8 -mt-12 md:-mt-16 pb-16 flex flex-col items-center gap-10">

          <section class="bg-white rounded-2xl shadow-md w-full max-w-sm px-10 py-10 flex flex-col items-center text-center">
            <div class="h-20 w-20 rounded-md overflow-hidden bg-[#E5E7EB] flex items-center justify-center mb-4">
              ${avatarHtml}
            </div>

            <h1 class="text-lg font-poppins font-semibold mb-1">${sellerName}</h1>

            <div class="text-sm text-[#374151] mt-4 text-left w-full">
              <h2 class="font-poppins font-semibold mb-1">Seller bio</h2>
              <p>${bio}</p>
            </div>
          </section>

         <section class="bg-white rounded-2xl shadow-md w-full max-w-2xl px-8 py-6 mx-auto">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-poppins font-semibold">
                Listings by this seller
              </span>
            </div>

            ${listingsHtml}
          </section>

        </div>
      </main>

      ${Footer()}
    </div>
  `;
}