import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchProfile } from "../api/profile.js";
import { fetchProfileBids } from "../api/bids.js";

export async function ProfilePage() {
  const authRaw = localStorage.getItem("auth");

  if (!authRaw) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">Profile</h1>
            <p class="text-[#667280]">
              You need to be logged in to view your profile.
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">Profile</h1>
            <p class="text-[#F44344]">
              Something went wrong with your login data. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const userName = auth && auth.user ? auth.user.name : "";
  const token = auth ? auth.token : null;

  if (!userName) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">Profile</h1>
            <p class="text-[#F44344]">
              Could not find profile name. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  let profile = null;
  let errorMessage = "";

  try {
    profile = await fetchProfile(userName, token);
  } catch (error) {
    errorMessage = error.message;
  }

  if (!profile) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">Profile</h1>
            <p class="text-[#F44344]">
              Could not load profile. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const credits = typeof profile.credits === "number" ? profile.credits : 0;
  const email = profile.email;
  const bio =
    profile.bio ||
    "This is the place where the bio will be, when the user has added that.";
  const avatarUrl =
    profile.avatar && profile.avatar.url ? profile.avatar.url : "";
  const avatarAlt =
    profile.avatar && profile.avatar.alt ? profile.avatar.alt : "User avatar";

  const firstLetter = userName ? userName.charAt(0).toUpperCase() : "?";

  const avatarHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="${avatarAlt}" class="h-full w-full object-cover" />`
    : `<span class="text-xl font-poppins">${firstLetter}</span>`;

  let bannerStyle = "";

  if (profile.banner && profile.banner.url) {
    const bannerUrl = profile.banner.url;
    bannerStyle = `background-image: url('${bannerUrl}');`;
  }

  let bidsPreviewHtml = "";

  try {
    const bids = await fetchProfileBids(userName, token);

    let sortedBids = [];

    if (Array.isArray(bids)) {
      sortedBids = bids.slice().sort(function (firstBid, secondBid) {
        const firstTime = new Date(firstBid.created).getTime();
        const secondTime = new Date(secondBid.created).getTime();
        return secondTime - firstTime;
      });
    }

    const maxItems = 3;
    let listItemsHtml = "";

    for (
      let index = 0;
      index < sortedBids.length && index < maxItems;
      index++
    ) {
      const bid = sortedBids[index];

      let amount = 0;
      if (typeof bid.amount === "number") {
        amount = bid.amount;
      }

      let listingTitle = "Listing";
      let listingId = "";

      if (bid.listing) {
        if (bid.listing.title) {
          listingTitle = bid.listing.title;
        }
        if (bid.listing.id) {
          listingId = bid.listing.id;
        }
      }

      let createdText = "";
      if (bid.created) {
        const createdDate = new Date(bid.created);
        createdText = createdDate.toLocaleString("nb-NO");
      }

      let viewLinkHtml = "";
      if (listingId !== "") {
        viewLinkHtml =
          `<a href="#/listing/` +
          listingId +
          `" class="text-xs text-[#6B7280] hover:underline">View</a>`;
      }

      listItemsHtml += `
        <li class="flex items-center justify-between text-sm text-[#374151]">
          <div class="flex flex-col">
            <span class="font-medium">${amount} NOK · ${listingTitle}</span>
            <span class="text-xs text-[#9CA3AF]">${createdText}</span>
          </div>
          ${viewLinkHtml}
        </li>
      `;
    }

    if (listItemsHtml === "") {
      bidsPreviewHtml = `
        <p class="text-sm text-[#6B7280]">
          Your latest bids will appear here once you start bidding.
        </p>
      `;
    } else {
      bidsPreviewHtml = `<ul class="space-y-2">${listItemsHtml}</ul>`;
    }
  } catch (error) {
    bidsPreviewHtml = `
      <p class="text-sm text-[#F44344]">
        Could not load your bid history right now.
      </p>
    `;
  }

  let listings = [];

  if (Array.isArray(profile.listings)) {
    listings = profile.listings;
  }

  let myListingsHtml = "";

  if (listings.length === 0) {
    myListingsHtml = `
      <p class="text-sm text-[#6B7280]">
        You have no listings yet.
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

      let idText = "";
      if (item && item.id) {
        idText = item.id;
      }

      itemsHtml += `
        <li class="flex items-center justify-between text-sm text-[#374151]">
          <span>${titleText}</span>
          ${
            idText !== ""
              ? `<a href="#/listing/${idText}" class="text-xs text-[#6B7280] hover:underline">
                   View
                 </a>`
              : ""
          }
        </li>
      `;
    }

    myListingsHtml = `
      <ul class="space-y-2">
        ${itemsHtml}
      </ul>
    `;
  }

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">

        <!-- Banner bak profilen, med URL fra API -->
        <div
          class="w-full h-40 md:h-48 bg-cover bg-center bg-[#E5E7EB]"
          style="${bannerStyle}"
        ></div>

        <div class="max-w-4xl mx-auto px-4 md:px-8 -mt-12 md:-mt-16 pb-16 flex flex-col items-center gap-10">

          <section class="bg-white rounded-2xl shadow-md w-full max-w-sm px-10 py-10 flex flex-col items-center text-center">
            <div class="h-20 w-20 rounded-md overflow-hidden bg-[#E5E7EB] flex items-center justify-center mb-4">
              ${avatarHtml}
            </div>

            <h1 class="text-lg font-poppins font-semibold mb-1">${userName}</h1>

            <p class="text-sm text-[#374151] mb-1 flex items-center justify-center gap-2">
              <span class="inline-block h-3 w-3 rounded-full bg-[#F4A938]"></span>
              <span>${credits} NOK</span>
            </p>

            <p class="text-xs text-[#9CA3AF] mb-4">${email}</p>

            <div class="text-sm text-[#374151] mb-6 text-left w-full">
              <h2 class="font-poppins font-semibold mb-1">User bio</h2>
              <p>${bio}</p>
            </div>

            <a
               href="#/edit-profile"
               class="btn-primary inline-flex items-center justify-center"
            >
                Edit profile
                </a>
          </section>

          <section class="bg-white rounded-2xl shadow-md w-full px-8 py-6">
            <div class="grid gap-6 md:grid-cols-2">

              <div class="border-b md:border-b-0 md:border-r border-[#E5E7EB] pb-4 md:pb-0 md:pr-6">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-poppins font-semibold">My listings</span>
                  <a href="#/my-listings" class="btn-primary text-xs px-4 py-1">
                    View all
                  </a>
                </div>

                ${myListingsHtml}
              </div>

              <div class="md:pl-6">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-poppins font-semibold">Bid history</span>
                  <a href="#/my-bids" class="btn-primary text-xs px-4 py-1">
                    View all
                  </a>
                </div>

                ${bidsPreviewHtml}
              </div>
            </div>
          </section>

        </div>
      </main>

      ${Footer()}
    </div>
  `;
}
