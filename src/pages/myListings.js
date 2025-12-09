import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchProfile } from "../api/profile.js";

export async function MyListingsPage() {
  const authRaw = localStorage.getItem("auth");

  if (!authRaw) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">My listings</h1>
            <p class="text-[#667280]">
              You need to be logged in to view your listings.
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">My listings</h1>
            <p class="text-[#F44344]">
              Something went wrong with your login data. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  let userName = "";
  let token = null;

  if (auth && auth.user && auth.user.name) {
    userName = auth.user.name;
  }

  if (auth && auth.token) {
    token = auth.token;
  }

  if (userName === "") {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">My listings</h1>
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">My listings</h1>
            <p class="text-[#F44344]">
              Could not load profile. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  let listings = [];

  if (Array.isArray(profile.listings)) {
    listings = profile.listings;
  }

  let listingsHtml = "";

  if (listings.length === 0) {
    listingsHtml = `
      <p class="text-sm text-[#6B7280]">
        You have no listings yet.
      </p>
      <a href="#/create" class="btn-primary mt-3 inline-block text-xs">
         Create your first listing
      </a>
    `;
  } else {
    let itemsHtml = "";

    for (let index = 0; index < listings.length; index++) {
      const item = listings[index];

      let titleText = "Untitled listing";
      if (item.title) {
        titleText = item.title;
      }

      let endsAtText = "No end date";
      if (item.endsAt) {
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

        <a
          href="#/edit-listing/${item.id}"
          class="btn-primary text-xs"
        >
          Edit listing
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
        <div class="max-w-3xl mx-auto px-4 md:px-8 py-10">

          <h1 class="text-xl font-poppins font-semibold mb-4">
            My listings
          </h1>

          ${listingsHtml}

        </div>
      </main>

      ${Footer()}
    </div>
  `;
}
