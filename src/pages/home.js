import { fetchAllListings, searchListings } from "../api/listings.js";
import { Navbar } from "../components/navbar.js";
import { Hero } from "../components/hero.js";
import { SearchBar } from "../components/searchBar.js";
import { ListingCard } from "../components/listingCard.js";
import { Footer } from "../components/footer.js";

export async function HomePage(searchText = "") {
  let finalListings = [];

  try {
    if (searchText && searchText.trim() !== "") {
      const apiListings = await searchListings(searchText);
      if (Array.isArray(apiListings) && apiListings.length > 0) {
        finalListings = apiListings;
      }
    } else {
      const apiListings = await fetchAllListings();
      if (Array.isArray(apiListings) && apiListings.length > 0) {
        finalListings = apiListings;
      }
    }
  } catch (error) {}

  let cardsHtml = "";

  if (finalListings.length === 0) {
    const noResultsText =
      searchText && searchText.trim() !== ""
        ? `No listings found for "${searchText}".`
        : "No listings available at the moment.";

    cardsHtml = `
      <p class="text-sm text-gray-500 col-span-full">
        ${noResultsText}
      </p>
    `;
  } else {
    for (let i = 0; i < finalListings.length; i++) {
      const item = finalListings[i];

      const title = item.title;

      let currentBidText = "0 bids";
      if (item._count && typeof item._count.bids === "number") {
        currentBidText = item._count.bids + " bids";
      }

      let timeLeftText = "No end date";
      if (item.endsAt) {
        const endDate = new Date(item.endsAt);
        timeLeftText = "Ends " + endDate.toLocaleDateString("nb-NO");
      }

      let imageUrl = "";
      let imageAlt = "Listing image";

      if (item.media && Array.isArray(item.media) && item.media.length > 0) {
        const firstMedia = item.media[0];

        if (firstMedia && firstMedia.url) {
          imageUrl = firstMedia.url;
        }
        if (firstMedia && firstMedia.alt) {
          imageAlt = firstMedia.alt;
        }
      }

      const cardData = {
        id: item.id,
        title: title,
        currentBid: currentBidText,
        timeLeft: timeLeftText,
        imageUrl: imageUrl,
        imageAlt: imageAlt,
      };

      cardsHtml += ListingCard(cardData);
    }
  }

  return `
    <div class="min-h-screen flex flex-col">
      ${Navbar()}

      <main class="flex-1 w-full">

      <div class="max-w-7xl mx-auto px-8 py-10">
        ${Hero()}
      </div>

      <div class="bg-[#1E293B] py-4">
        <div class="max-w-7xl mx-auto px-8">
          ${SearchBar(searchText)}
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-8 py-10">
        <section class="space-y-4">
          <h2 class="text-lg font-poppins font-semibold text-[#111827]">
            Listings
          </h2>

          <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            ${cardsHtml}
          </div>
        </section>
      </div>
    </main>

      ${Footer()}
    </div>
  `;
}
