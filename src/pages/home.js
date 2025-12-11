import { fetchAllListings, searchListings } from "../api/listings.js";
import { Navbar } from "../components/navbar.js";
import { Hero } from "../components/hero.js";
import { SearchBar } from "../components/searchBar.js";
import { ListingCard } from "../components/listingCard.js";
import { Footer } from "../components/footer.js";

function getBidCount(listing) {
  if (listing && listing._count && typeof listing._count.bids === "number") {
    return listing._count.bids;
  }
  return 0;
}

export async function HomePage(searchText = "", filter = "all") {
  let finalListings = [];
  let allListings = [];

  try {
    if (searchText && searchText.trim() !== "") {
      const apiListings = await searchListings(searchText);
      if (Array.isArray(apiListings) && apiListings.length > 0) {
        finalListings = apiListings;
        allListings = apiListings;
      }
    } else {
      const apiListings = await fetchAllListings();
      if (Array.isArray(apiListings) && apiListings.length > 0) {
        finalListings = apiListings;
        allListings = apiListings;
      }
    }
  } catch (error) {
    
  }

  
  let popularHtml = "";

  if (Array.isArray(allListings) && allListings.length > 0) {
    const sortedByBids = allListings
      .slice()
      .sort(function (first, second) {
        return getBidCount(second) - getBidCount(first);
      });

    const topThree = sortedByBids.slice(0, 3);

    if (topThree.length === 0 || getBidCount(topThree[0]) === 0) {
      popularHtml = `
        <p class="text-sm text-[#6B7280]">
          No popular listings yet.
        </p>
      `;
    } else {
      let cards = "";

      for (let i = 0; i < topThree.length; i++) {
        const item = topThree[i];

        const title = item.title || "Untitled listing";

        const bidsText = getBidCount(item) + " bids";

        let timeLeftText = "No end date";
        if (item.endsAt) {
          const endDate = new Date(item.endsAt);
          timeLeftText = "Ends " + endDate.toLocaleDateString("nb-NO");
        }

        let imageUrl = "";
        let imageAlt = "Listing image";

        if (Array.isArray(item.media) && item.media.length > 0) {
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
          currentBid: bidsText,
          timeLeft: timeLeftText,
          imageUrl: imageUrl,
          imageAlt: imageAlt,
        };

        cards += ListingCard(cardData);
      }

      popularHtml = `
        <section class="space-y-2">
          <div class="flex flex-col gap-1">
            <h2 class="text-sm font-poppins font-semibold text-[#111827]">
              Popular right now
            </h2>
            <p class="text-xs text-[#6B7280]">
              Listings with the highest number of bids.
            </p>
          </div>

          <div class="grid gap-6 md:grid-cols-3">
            ${cards}
          </div>
        </section>
      `;
    }
  }

  
  if (Array.isArray(finalListings) && finalListings.length > 0) {
    if (filter === "ending-soon") {
      finalListings.sort(function (first, second) {
        const firstTime = first.endsAt
          ? new Date(first.endsAt).getTime()
          : Number.POSITIVE_INFINITY;
        const secondTime = second.endsAt
          ? new Date(second.endsAt).getTime()
          : Number.POSITIVE_INFINITY;
        return firstTime - secondTime;
      });
    } else if (filter === "most-bids") {
      finalListings.sort(function (first, second) {
        return getBidCount(second) - getBidCount(first);
      });
    }
  }

  
  let cardsHtml = "";

  if (!Array.isArray(finalListings) || finalListings.length === 0) {
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

      const title = item.title || "Untitled listing";

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
        <div class="max-w-7xl mx-auto px-8 py-10 space-y-10">

          ${Hero()}

          <!-- Popular section -->
          ${popularHtml}

          <!-- Search bar + filters -->
          <div class="bg-[#1E293B] rounded-2xl py-4 px-4 mt-4">
            ${SearchBar(searchText)}
          </div>

          <!-- All listings -->
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

