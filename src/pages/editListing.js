import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { API_BASE, API_KEY } from "../api/config.js";
import { fetchListingById } from "../api/listings.js";

export async function EditListingPage(listingId) {
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">Edit listing</h1>
            <p class="text-[#F44344]">
              Could not load this listing. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const title = listing.title || "";
  const description = listing.description || "";

  let endDateValue = "";
  let endTimeValue = "";

  if (listing.endsAt) {
    const endDate = new Date(listing.endsAt);

    const year = endDate.getFullYear();
    const monthNumber = endDate.getMonth() + 1;
    const dayNumber = endDate.getDate();

    const hoursNumber = endDate.getHours();
    const minutesNumber = endDate.getMinutes();

    const month = monthNumber < 10 ? "0" + monthNumber : monthNumber.toString();
    const day = dayNumber < 10 ? "0" + dayNumber : dayNumber.toString();
    const hours = hoursNumber < 10 ? "0" + hoursNumber : hoursNumber.toString();
    const minutes =
      minutesNumber < 10 ? "0" + minutesNumber : minutesNumber.toString();

    endDateValue = year + "-" + month + "-" + day;
    endTimeValue = hours + ":" + minutes;
  }

  let firstImageUrl = "";
  let firstImageAlt = "";
  let extraImagesHtml = "";
  let maxImageIndex = 1;

  if (Array.isArray(listing.media)) {
    if (listing.media.length > 0 && listing.media[0]) {
      if (listing.media[0].url) {
        firstImageUrl = listing.media[0].url;
      }
      if (listing.media[0].alt) {
        firstImageAlt = listing.media[0].alt;
      }
    }

    for (let index = 1; index < listing.media.length; index++) {
      const mediaItem = listing.media[index];

      if (mediaItem && mediaItem.url) {
        const imageIndex = index + 1;
        maxImageIndex = imageIndex;

        const urlValue = mediaItem.url;
        const altValue = mediaItem.alt || "";

        extraImagesHtml += `
          <div class="mt-4 border-t pt-4">
            <label class="text-sm font-semibold block mb-1">
              Image URL ${imageIndex}:
            </label>
            <input
              type="text"
              id="image-${imageIndex}"
              class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
              value="${urlValue}"
            />

            <label class="text-sm font-semibold block mb-1 mt-3">
              Image alt text ${imageIndex}:
            </label>
            <input
              type="text"
              id="image-alt-${imageIndex}"
              class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
              value="${altValue}"
            />
          </div>
        `;
      }
    }
  }

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">
        <div class="max-w-md mx-auto px-4 py-10">

          <section class="bg-white shadow-md rounded-2xl p-8">

            <div class="flex justify-center mb-4">
              <img src="assets/images/logo-crow.png" alt="Crow logo" class="h-10" />
            </div>

            <h1 class="text-xl font-poppins font-semibold text-center mb-1">
              Edit listing
            </h1>
            <p class="text-xs text-[#6B7280] text-center mb-6">
              Update the details of your listing.
            </p>

            <form id="edit-listing-form" class="space-y-6" data-max-image-index="${maxImageIndex}">

              <div>
                <label class="text-sm font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  value="${title}"
                  required
                />
              </div>

             
              <div>
                <label class="text-sm font-semibold block mb-1">Description</label>
                <textarea
                  id="description"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2 h-24"
                >${description}</textarea>
                <p class="text-xs text-[#9CA3AF] mt-1">
                  Optional, but recommended.
                </p>
              </div>

             
              <div>
                <label class="text-sm font-semibold block mb-1">End date:</label>
                <input
                  id="end-date"
                  type="date"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  value="${endDateValue}"
                />
              </div>

            
              <div>
                <label class="text-sm font-semibold block mb-1">End time:</label>
                <input
                  id="end-time"
                  type="time"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  value="${endTimeValue}"
                />
                <p class="text-xs text-[#9CA3AF] mt-1">
                  Auction must end in the future.
                </p>
              </div>

             
              <div>
                <label class="text-sm font-semibold block mb-1">Image URL:</label>
                <input
                  type="text"
                  id="image-1"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  placeholder="Must be a direct link to image file (.jpg, .png)"
                  value="${firstImageUrl}"
                />
              </div>

              <div>
                <label class="text-sm font-semibold block mb-1">Image alt text:</label>
                <input
                  type="text"
                  id="image-alt-1"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  placeholder="Short description of the image"
                  value="${firstImageAlt}"
                />
                <p class="text-xs text-[#9CA3AF] mt-1">
                  Optional, but recommended.
                </p>
              </div>

            
              <div id="extra-images">
                ${extraImagesHtml}
              </div>

              <button
                type="button"
                id="add-image-button"
                class="flex items-center gap-2 text-sm text-[#374151]"
              >
                ➕ Add another image
              </button>

              <button
                type="submit"
                class="btn-primary w-full"
              >
                Save changes
              </button>

              <p id="form-message" class="text-sm text-center mt-2"></p>

              <a href="#/listing/${listingId}" class="text-sm text-center block mt-2 text-[#6B7280]">
                Cancel / Back to listing
              </a>

              <button
                type="button"
                id="delete-listing-button"
                class="mt-4 text-sm text-[#F44344]"
              >
                Delete listing
              </button>

            </form>
          </section>
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}

export function setupEditListingForm(listingId) {
  const form = document.getElementById("edit-listing-form");
  const addImageButton = document.getElementById("add-image-button");
  const extraImages = document.getElementById("extra-images");
  const message = document.getElementById("form-message");
  const deleteButton = document.getElementById("delete-listing-button");

  if (!form || !addImageButton || !extraImages || !message || !deleteButton) {
    return;
  }
  let imageCount = 0;

  while (true) {
    const nextIndex = imageCount + 1;
    const input = document.getElementById("image-" + nextIndex);

    if (input) {
      imageCount = nextIndex;
    } else {
      break;
    }
  }

  addImageButton.addEventListener("click", function () {
    imageCount++;

    extraImages.insertAdjacentHTML(
      "beforeend",
      `
      <div class="mt-4 border-t pt-4">
        <label class="text-sm font-semibold block mb-1">
          Image URL ${imageCount}:
        </label>
        <input
          type="text"
          id="image-${imageCount}"
          class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
        />

        <label class="text-sm font-semibold block mb-1 mt-3">
          Image alt text ${imageCount}:
        </label>
        <input
          type="text"
          id="image-alt-${imageCount}"
          class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
        />
      </div>
    `
    );
  });

  function getTokenFromLocalStorage() {
    const authRaw = localStorage.getItem("auth");
    if (!authRaw) {
      return "";
    }

    try {
      const auth = JSON.parse(authRaw);
      if (auth && auth.token) {
        return auth.token;
      }
    } catch (error) {}

    return "";
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    message.textContent = "";
    message.className = "text-sm text-center mt-2";

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const endDate = document.getElementById("end-date").value;
    const endTime = document.getElementById("end-time").value;

    let endsAt = null;

    if (endDate && endTime) {
      endsAt = new Date(endDate + "T" + endTime);
    }

    const media = [];

    for (let index = 1; index <= imageCount; index++) {
      const urlInput = document.getElementById("image-" + index);
      const altInput = document.getElementById("image-alt-" + index);

      if (!urlInput) {
        continue;
      }

      const urlValue = urlInput.value.trim();
      const altValue = altInput ? altInput.value.trim() : "";

      if (urlValue !== "") {
        media.push({
          url: urlValue,
          alt: altValue,
        });
      }
    }

    const payload = {
      title: title,
      description: description,
      endsAt: endsAt ? endsAt.toISOString() : null,
      media: media,
    };

    const token = getTokenFromLocalStorage();

    if (token === "") {
      message.textContent = "You must be logged in to edit this listing.";
      message.classList.add("text-[#F44344]");
      return;
    }

    try {
      const response = await fetch(
        API_BASE + "/auction/listings/" + listingId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            "X-Noroff-API-Key": API_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        message.textContent =
          "Could not edit listing. Please check your inputs.";
        message.classList.add("text-[#F44344]");
        return;
      }

      message.textContent = "Listing updated successfully. Redirecting...";
      message.classList.add("text-green-600");

      setTimeout(function () {
        window.location.hash = "#/listing/" + listingId;
      }, 1200);
    } catch (error) {
      message.textContent = "Something went wrong.";
      message.classList.add("text-[#F44344]");
    }
  });

  deleteButton.addEventListener("click", async function () {
    const wantsToDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!wantsToDelete) {
      return;
    }

    const token = getTokenFromLocalStorage();

    try {
      const response = await fetch(
        API_BASE + "/auction/listings/" + listingId,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + token,
            "X-Noroff-API-Key": API_KEY,
          },
        }
      );

      if (!response.ok) {
        message.textContent = "Could not delete listing.";
        message.classList.add("text-[#F44344]");
        return;
      }

      message.textContent = "Listing deleted. Redirecting...";
      message.classList.add("text-green-600");

      setTimeout(function () {
        window.location.hash = "#/profile";
      }, 1200);
    } catch (error) {
      message.textContent = "Something went wrong while deleting.";
      message.classList.add("text-[#F44344]");
    }
  });
}
