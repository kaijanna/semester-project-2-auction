import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchListingById } from "../api/listings.js";
import { placeBid } from "../api/bids.js";

export async function SingleListingPage(listingId) {
  let listing = null;
  let errorMessage = "";

  try {
    listing = await fetchListingById(listingId);
  } catch (error) {
    errorMessage = error.message;
  }

  if (!listing) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Listing
            </h1>
            <p class="text-[#F44344]">
              Could not load this listing. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  let isOwner = false;
  let isLoggedIn = false;

  const authRaw = localStorage.getItem("auth");

  if (authRaw) {
    try {
      const auth = JSON.parse(authRaw);

      if (auth && auth.user && auth.user.name) {
        isLoggedIn = true;

        const hasSellerName =
          listing.seller &&
          listing.seller.name &&
          typeof listing.seller.name === "string";

        if (hasSellerName) {
          const userNameLower = auth.user.name.toLowerCase();
          const sellerNameLower = listing.seller.name.toLowerCase();

          if (userNameLower === sellerNameLower) {
            isOwner = true;
          }
        }
      }
    } catch (error) {}
  }

  let title = "Untitled listing";
  if (listing.title) {
    title = listing.title;
  }

  let description = "This listing has no description yet.";
  if (listing.description) {
    description = listing.description;
  }

  let sellerName = "Unknown seller";
  if (listing.seller && listing.seller.name) {
    sellerName = listing.seller.name;
  }

  let bidsArray = [];
  if (Array.isArray(listing.bids)) {
    bidsArray = listing.bids;
  }

  const numberOfBids = bidsArray.length;

  let highestBid = 0;
  if (numberOfBids > 0) {
    const sortedByAmount = bidsArray
      .slice()
      .sort(function (firstBid, secondBid) {
        return secondBid.amount - firstBid.amount;
      });

    highestBid = sortedByAmount[0].amount;
  }

  let bidHistoryHtml = "";

  if (numberOfBids === 0) {
    bidHistoryHtml = `
      <p class="text-sm text-[#6B7280]">
        There are no bids yet.
      </p>
    `;
  } else {
    const sortedByDate = bidsArray.slice().sort(function (firstBid, secondBid) {
      const firstTime = new Date(firstBid.created).getTime();
      const secondTime = new Date(secondBid.created).getTime();
      return secondTime - firstTime;
    });

    let listItemsHtml = "";

    for (let index = 0; index < sortedByDate.length; index++) {
      const bid = sortedByDate[index];

      const amount = bid.amount;

      let bidderName = "Unknown bidder";

      if (bid.bidder && bid.bidder.name) {
        bidderName = bid.bidder.name;
      }

      let createdText = "";
      if (bid.created) {
        const createdDate = new Date(bid.created);
        createdText = createdDate.toLocaleString("nb-NO");
      }

      listItemsHtml += `
        <li class="flex flex-col text-sm text-[#374151]">
          <span class="font-medium">${amount} NOK · ${bidderName}</span>
          <span class="text-xs text-[#9CA3AF]">${createdText}</span>
        </li>
      `;
    }

    bidHistoryHtml = `
      <ul class="space-y-2">
        ${listItemsHtml}
      </ul>
    `;
  }

  let endsAtText = "No end date";
  if (listing.endsAt) {
    const endDate = new Date(listing.endsAt);
    endsAtText = endDate.toLocaleString("nb-NO");
  }

  let mediaArray = [];
  if (Array.isArray(listing.media)) {
    mediaArray = listing.media;
  }

  let mainImageUrl = "";
  let mainImageAlt = "Listing image";

  if (mediaArray.length > 0) {
    const firstMedia = mediaArray[0];

    if (firstMedia && firstMedia.url) {
      mainImageUrl = firstMedia.url;
    }

    if (firstMedia && firstMedia.alt) {
      mainImageAlt = firstMedia.alt;
    }
  }

  let thumbnailsHtml = "";
  const maxThumbnails = 3;
  const totalImages = mediaArray.length;

  for (let index = 0; index < totalImages && index < maxThumbnails; index++) {
    const mediaItem = mediaArray[index];

    if (mediaItem && mediaItem.url) {
      let thumbAlt = "Listing image " + (index + 1).toString();

      if (mediaItem.alt) {
        thumbAlt = mediaItem.alt;
      }

      thumbnailsHtml += `
        <button
          type="button"
          class="h-16 w-16 rounded-md overflow-hidden bg-[#E5E7EB] flex items-center justify-center border border-transparent hover:border-[#F4A938]"
          data-image-url="${mediaItem.url}"
          data-image-alt="${thumbAlt}"
        >
          <img
            src="${mediaItem.url}"
            alt="${thumbAlt}"
            class="h-full w-full object-cover"
          />
        </button>
      `;
    }
  }

  let actionHtml = "";

  if (!isLoggedIn) {
    actionHtml = `
      <div class="mt-2 flex flex-col gap-2">
        <p class="text-sm text-[#6B7280]">
          You need to be logged in to place a bid.
        </p>
        <div class="flex gap-2">
          <a href="#/login" class="btn-primary text-xs">
            Log in
          </a>
          <a href="#/register" class="btn-secondary text-xs">
            Create account
          </a>
        </div>
      </div>
    `;
  } else if (isOwner) {
    actionHtml = `
      <div class="mt-2">
        <a
          href="#/edit-listing/${listingId}"
          class="btn-primary inline-flex items-center justify-center"
        >
          Edit listing
        </a>
      </div>
    `;
  } else {
    actionHtml = `
      <div class="mt-2 flex flex-col gap-2">
        <label
          for="bid-amount"
          class="text-sm font-poppins font-semibold"
        >
          Your bid
        </label>

        <div class="flex gap-2 items-center">
          <input
            id="bid-amount"
            type="number"
            min="1"
            placeholder="Enter amount in NOK"
            class="border border-[#D1D5DB] rounded-md px-3 py-2 text-sm w-32 bg-white"
          />

          <button
            id="place-bid-button"
            type="button"
            class="btn-primary"
          >
            Place bid
          </button>
        </div>

        <p id="bid-message" class="text-sm text-[#6B7280]"></p>
      </div>
    `;
  }

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">
        <div class="max-w-5xl mx-auto px-4 md:px-8 py-10">

          <a
            href="#/"
            class="inline-flex items-center gap-2 text-sm text-[#6B7280] mb-4"
          >
            ← Back to listings
          </a>

          <section class="bg-white rounded-2xl shadow-md p-6 md:p-8">

            <div class="grid gap-8 md:grid-cols-2 mb-8">
      
              <div class="flex flex-col gap-4">
                <div class="h-[260px] md:h-[320px] rounded-2xl overflow-hidden bg-[#E5E7EB] flex items-center justify-center">
                  ${
                    mainImageUrl !== ""
                      ? `<img
                           id="listing-main-image"
                           src="${mainImageUrl}"
                           alt="${mainImageAlt}"
                           class="h-full w-full object-cover"
                         />`
                      : `<span class="text-[#9CA3AF] text-sm">No image</span>`
                  }
                </div>

                ${
                  thumbnailsHtml !== ""
                    ? `<div class="flex gap-3">
                         ${thumbnailsHtml}
                       </div>`
                    : ""
                }
              </div>

              <div class="flex flex-col gap-4">
                
                <div>
                  <h1 class="text-xl font-poppins font-semibold mb-1">
                    ${title}
                  </h1>
                  <p class="text-sm text-[#6B7280]">
                    Seller: ${sellerName}
                  </p>
                </div>

                <div class="flex flex-col gap-1 text-sm text-[#374151]">
                  <p>
                    <span class="font-semibold">Ends:</span>
                    ${endsAtText}
                  </p>
                  <p>
                    <span class="font-semibold">Current bid:</span>
                    ${highestBid > 0 ? highestBid + " NOK" : "No bids yet"}
                  </p>
                  <p>
                    <span class="font-semibold">Bids:</span>
                    ${numberOfBids}
                  </p>
                </div>

                ${actionHtml}

              </div>
            </div>

            <div class="mt-10">
              <div class="grid gap-12 md:grid-cols-2 max-w-[700px] mx-auto">
                
                <div>
                  <h2 class="text-sm font-poppins font-semibold mb-2">
                    Description
                  </h2>
                  <p class="text-sm text-[#374151]">
                    ${description}
                  </p>
                </div>

                <div>
                  <h2 class="text-sm font-poppins font-semibold mb-2">
                    Bid history
                  </h2>
                  ${bidHistoryHtml}
                </div>

              </div>
            </div>

          </section>
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}

export function setupSingleListingGallery() {
  const mainImageElement = document.getElementById("listing-main-image");

  if (!mainImageElement) {
    return;
  }

  const allThumbnailButtons = document.querySelectorAll("[data-image-url]");

  for (let index = 0; index < allThumbnailButtons.length; index++) {
    const button = allThumbnailButtons[index];

    button.addEventListener("click", function () {
      const newUrl = button.getAttribute("data-image-url");
      const newAlt = button.getAttribute("data-image-alt");

      if (newUrl) {
        mainImageElement.src = newUrl;
      }

      if (newAlt) {
        mainImageElement.alt = newAlt;
      }
    });
  }
}

export function setupSingleListingBidding(listingId) {
  const button = document.getElementById("place-bid-button");
  const input = document.getElementById("bid-amount");
  const message = document.getElementById("bid-message");

  if (!button || !input || !message) {
    return;
  }

  button.addEventListener("click", async function () {
    const rawValue = input.value;
    const amount = parseInt(rawValue, 10);

    if (isNaN(amount) || amount <= 0) {
      message.textContent = "Please enter a valid amount.";
      message.className = "text-sm text-[#F44344]";
      return;
    }

    const authRaw = localStorage.getItem("auth");

    if (!authRaw) {
      window.location.hash = "#/login";
      return;
    }

    let auth = null;

    try {
      auth = JSON.parse(authRaw);
    } catch (error) {
      message.textContent = "Login data is invalid. Please log in again.";
      message.className = "text-sm text-[#F44344]";
      return;
    }

    const token = auth.token;

    if (!token) {
      message.textContent = "You must be logged in to place a bid.";
      message.className = "text-sm text-[#F44344]";
      return;
    }

    try {
      await placeBid(listingId, amount, token);

      message.textContent = "Bid placed!";
      message.className = "text-sm text-[#10B981]";

      window.location.reload();
    } catch (error) {
      message.textContent = error.message;
      message.className = "text-sm text-[#F44344]";
    }
  });
}
