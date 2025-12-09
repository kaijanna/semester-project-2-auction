import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { API_BASE, API_KEY } from "../api/config.js";

export function CreateListingPage() {
  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">
        <div class="max-w-md mx-auto px-4 py-10">

          <section class="bg-white shadow-md rounded-2xl p-8">

            <div class="flex justify-center mb-4">
              <img src="./assets/images/logo-crow.png" alt="Crow logo" class="h-10" />
            </div>

            <h1 class="text-xl font-poppins font-semibold text-center mb-6">
              Create listing
            </h1>

           
            <form id="create-listing-form" class="space-y-6">

              <div>
                <label class="text-sm font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  placeholder="Name of your item"
                  required
                />
                <p class="text-xs text-[#9CA3AF] mt-1">
                  Required. Be short and descriptive.
                </p>
              </div>

              
              <div>
                <label class="text-sm font-semibold block mb-1">Description</label>
                <textarea
                  id="description"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2 h-24"
                  placeholder="Describe your item..."
                ></textarea>
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
                />
              </div>

             
              <div>
                <label class="text-sm font-semibold block mb-1">End time:</label>
                <input
                  id="end-time"
                  type="time"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
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
                />
              </div>

              <div>
                <label class="text-sm font-semibold block mb-1">Image alt text:</label>
                <input
                  type="text"
                  id="image-alt-1"
                  class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
                  placeholder="Short description of the image"
                />
                <p class="text-xs text-[#9CA3AF] mt-1">
                  Optional, but recommended.
                </p>
              </div>

              <div id="extra-images"></div>

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
                Create listing
              </button>

              <p id="form-message" class="text-sm text-center mt-2"></p>

              <a href="#/profile" class="text-sm text-center block mt-4 text-[#6B7280]">
                Cancel / Back to profile
              </a>

            </form>
          </section>
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}

export function setupCreateListingForm() {
  const form = document.getElementById("create-listing-form");
  const addImageButton = document.getElementById("add-image-button");
  const extraImages = document.getElementById("extra-images");
  const message = document.getElementById("form-message");

  // Sjekk at alt finnes før vi går videre
  if (!form || !addImageButton || !extraImages || !message) {
    return;
  }

  let imageCount = 1;

  addImageButton.addEventListener("click", function () {
    imageCount = imageCount + 1;

    extraImages.insertAdjacentHTML(
      "beforeend",
      `
      <div class="mt-4 border-t pt-4">
        <label class="text-sm font-semibold block mb-1">Image URL ${imageCount}:</label>
        <input
          type="text"
          id="image-${imageCount}"
          class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
        />

        <label class="text-sm font-semibold block mb-1 mt-3">Image alt text ${imageCount}:</label>
        <input
          type="text"
          id="image-alt-${imageCount}"
          class="border border-[#D1D5DB] rounded-md w-full px-3 py-2"
        />
      </div>
    `
    );
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    message.textContent = "";
    message.className = "text-sm text-center";

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const endDateInput = document.getElementById("end-date");
    const endTimeInput = document.getElementById("end-time");

    let title = "";
    if (titleInput && typeof titleInput.value === "string") {
      title = titleInput.value.trim();
    }

    let description = "";
    if (descriptionInput && typeof descriptionInput.value === "string") {
      description = descriptionInput.value.trim();
    }

    let endDate = "";
    if (endDateInput && typeof endDateInput.value === "string") {
      endDate = endDateInput.value;
    }

    let endTime = "";
    if (endTimeInput && typeof endTimeInput.value === "string") {
      endTime = endTimeInput.value;
    }

    let endsAt = null;
    if (endDate !== "" && endTime !== "") {
      endsAt = new Date(endDate + "T" + endTime);
    }

    let endsAtString = null;
    if (endsAt) {
      endsAtString = endsAt.toISOString();
    }

    const media = [];

    for (let i = 1; i <= imageCount; i = i + 1) {
      const imageInput = document.getElementById("image-" + i);
      const altInput = document.getElementById("image-alt-" + i);

      let url = "";
      let alt = "";

      if (imageInput && typeof imageInput.value === "string") {
        url = imageInput.value.trim();
      }

      if (altInput && typeof altInput.value === "string") {
        alt = altInput.value.trim();
      }

      if (url !== "") {
        media.push({ url: url, alt: alt });
      }
    }

    const payload = {
      title: title,
      description: description,
      endsAt: endsAtString,
      media: media,
    };

    try {
      const authRaw = localStorage.getItem("auth");
      let token = "";

      if (authRaw) {
        try {
          const auth = JSON.parse(authRaw);
          if (auth && auth.token) {
            token = auth.token;
          }
        } catch (error) {}
      }

      if (token === "") {
        message.textContent = "You must be logged in to create a listing.";
        message.classList.add("text-[#F44344]");
        return;
      }

      const response = await fetch(API_BASE + "/auction/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        message.textContent =
          "Could not create listing. Please check your inputs.";
        message.classList.add("text-[#F44344]");
        return;
      }

      message.textContent = "Listing created successfully. Redirecting...";
      message.classList.add("text-green-600");

      setTimeout(function () {
        window.location.hash = "#/profile";
      }, 1200);
    } catch (error) {
      message.textContent = "Something went wrong.";
      message.classList.add("text-[#F44344]");
    }
  });
}
