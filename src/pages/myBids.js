import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchProfileBids, fetchProfileWins } from "../api/bids.js";

export async function MyBidsPage() {
  const authRaw = localStorage.getItem("auth");

  if (!authRaw) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">My bids</h1>
            <p class="text-[#667280]">You need to be logged in to view this page.</p>
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">My bids</h1>
            <p class="text-[#F44344]">
              Something went wrong with your login data. Please log in again.
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const userName = auth.user.name;
  const token = auth.token;

  let bids = [];
  let bidsErrorMessage = "";

  try {
    bids = await fetchProfileBids(userName, token);
  } catch (error) {
    bidsErrorMessage = error.message;
  }

  let bidsSectionHtml = "";

  if (bidsErrorMessage !== "") {
    bidsSectionHtml = `
      <p class="text-sm text-[#F44344]">
        Could not load your bid history right now. ${bidsErrorMessage}
      </p>
    `;
  } else if (!Array.isArray(bids) || bids.length === 0) {
    bidsSectionHtml = `
      <p class="text-sm text-[#6B7280]">
        You have not placed any bids yet.
      </p>
    `;
  } else {
    let cardsHtml = "";

    for (let index = 0; index < bids.length; index++) {
      const bid = bids[index];

      const listing = bid.listing ? bid.listing : {};

      let titleText = "Untitled listing";
      if (listing.title) {
        titleText = listing.title;
      }

      let endsAtText = "No end date";
      if (listing.endsAt) {
        const endsDate = new Date(listing.endsAt);
        endsAtText = endsDate.toLocaleString("nb-NO");
      }

      let createdText = "";
      if (bid.created) {
        const createdDate = new Date(bid.created);
        createdText = createdDate.toLocaleString("nb-NO");
      }

      let thumbnailUrl = "";
      if (Array.isArray(listing.media) && listing.media.length > 0) {
        const firstMedia = listing.media[0];
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

      cardsHtml += `
        <article class="border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            ${thumbnailHtml}
            <div>
              <h2 class="text-sm font-poppins font-semibold">
                ${bid.amount} NOK · ${titleText}
              </h2>
              <p class="text-xs text-[#6B7280]">Ends: ${endsAtText}</p>
              <p class="text-xs text-[#9CA3AF]">Bid placed: ${createdText}</p>
            </div>
          </div>

          <div class="flex gap-2">
            <a
              href="#/listing/${listing.id}"
              class="btn-secondary text-xs"
            >
              View listing
            </a>
          </div>
        </article>
      `;
    }

    bidsSectionHtml = `
      <div class="space-y-3">
        ${cardsHtml}
      </div>
    `;
  }

  let wins = [];
  let winsErrorMessage = "";

  try {
    wins = await fetchProfileWins(userName, token);
  } catch (error) {
    winsErrorMessage = error.message;
  }

  let winsSectionHtml = "";

  if (winsErrorMessage !== "") {
    winsSectionHtml = `
      <p class="text-sm text-[#F44344]">
        Could not load your winning bids right now. ${winsErrorMessage}
      </p>
    `;
  } else if (!Array.isArray(wins) || wins.length === 0) {
    winsSectionHtml = `
      <p class="text-sm text-[#6B7280]">
        You have no winning bids yet.
      </p>
    `;
  } else {
    let winsCardsHtml = "";

    for (let index = 0; index < wins.length; index++) {
      const listing = wins[index];

      let titleText = "Untitled listing";
      if (listing.title) {
        titleText = listing.title;
      }

      let endsAtText = "No end date";
      if (listing.endsAt) {
        const endsDate = new Date(listing.endsAt);
        endsAtText = endsDate.toLocaleString("nb-NO");
      }

      let thumbnailUrl = "";
      if (Array.isArray(listing.media) && listing.media.length > 0) {
        const firstMedia = listing.media[0];
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

      winsCardsHtml += `
        <article class="border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 flex-1">
            ${thumbnailHtml}
            <div>
              <h2 class="text-sm font-poppins font-semibold">
                ${titleText}
              </h2>
              <p class="text-xs text-[#6B7280]">Ended: ${endsAtText}</p>
              <p class="text-xs text-[#16A34A] font-medium">You won this listing</p>
            </div>
          </div>

          <div class="flex gap-2">
            <a
              href="#/listing/${listing.id}"
              class="btn-secondary text-xs"
            >
              View listing
            </a>
          </div>
        </article>
      `;
    }

    winsSectionHtml = `
      <div class="space-y-3">
        ${winsCardsHtml}
      </div>
    `;
  }

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">
        <div class="max-w-3xl mx-auto px-4 md:px-8 py-10">
          <h1 class="text-2xl font-poppins font-semibold mb-6">My bids</h1>

          <section class="space-y-8">
            <div>
              <h2 class="text-sm font-poppins font-semibold mb-3">All bids</h2>
              ${bidsSectionHtml}
            </div>

            <div>
              <h2 class="text-sm font-poppins font-semibold mb-3">Winning bids</h2>
              ${winsSectionHtml}
            </div>
          </section>
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}
