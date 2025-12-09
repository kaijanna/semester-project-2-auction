import { Navbar } from "../components/navbar.js";
import { Footer } from "../components/footer.js";
import { fetchProfile, updateProfile } from "../api/profile.js";

export async function EditProfilePage() {
  const authRaw = localStorage.getItem("auth");

  if (!authRaw) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Edit profile
            </h1>
            <p class="text-[#667280]">
              You need to be logged in to edit your profile.
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
              Edit profile
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

  const userName = auth && auth.user ? auth.user.name : "";
  const token = auth ? auth.token : null;

  if (!userName || !token) {
    return `
      <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
        ${Navbar()}
        <main class="flex-1">
          <div class="max-w-2xl mx-auto px-8 py-16 text-center">
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Edit profile
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
            <h1 class="text-2xl font-poppins font-semibold mb-4">
              Edit profile
            </h1>
            <p class="text-[#F44344]">
              Could not load profile. ${errorMessage}
            </p>
          </div>
        </main>
        ${Footer()}
      </div>
    `;
  }

  const bio = profile.bio ? profile.bio : "";
  const avatarUrl =
    profile.avatar && profile.avatar.url ? profile.avatar.url : "";
  const bannerUrl =
    profile.banner && profile.banner.url ? profile.banner.url : "";

  return `
    <div class="min-h-screen flex flex-col bg-[#F3F4F6]">
      ${Navbar()}

      <main class="flex-1">
        <div class="max-w-xl mx-auto px-4 md:px-8 py-10">
          <h1 class="text-2xl font-poppins font-semibold mb-6">
            Edit profile
          </h1>

          <section class="bg-white rounded-2xl shadow-md p-6 md:p-8">
            <form id="edit-profile-form" class="space-y-6">
              
              <div>
                <label
                  for="avatar-url"
                  class="block text-sm font-poppins font-semibold mb-1"
                >
                  Avatar URL
                </label>
                <input
                  id="avatar-url"
                  type="url"
                  placeholder="Link to your avatar image"
                  value="${avatarUrl}"
                  class="w-full border border-[#D1D5DB] rounded-md px-3 py-2 text-sm bg-white"
                />
                <p class="mt-1 text-xs text-[#6B7280]">
                  Must be a direct link to an image file (jpg, png).
                </p>
              </div>

              <div>
                <label
                  for="banner-url"
                  class="block text-sm font-poppins font-semibold mb-1"
                >
                  Banner URL
                </label>
                <input
                  id="banner-url"
                  type="url"
                  placeholder="Link to your banner image"
                  value="${bannerUrl}"
                  class="w-full border border-[#D1D5DB] rounded-md px-3 py-2 text-sm bg-white"
                />
                <p class="mt-1 text-xs text-[#6B7280]">
                  Optional, but recommended.
                </p>
              </div>

              <div>
                <label
                  for="bio"
                  class="block text-sm font-poppins font-semibold mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  class="w-full border border-[#D1D5DB] rounded-md px-3 py-2 text-sm bg-white"
                  placeholder="Write a short description about yourself"
                >${bio}</textarea>
                <p class="mt-1 text-xs text-[#6B7280]">
                  Optional, but recommended.
                </p>
              </div>

              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  class="btn-primary"
                >
                  Save changes
                </button>

                <a
                  href="#/profile"
                  class="text-sm text-[#6B7280] hover:underline"
                >
                  Cancel / Back to profile
                </a>
              </div>

              <p
                id="edit-profile-message"
                class="mt-2 text-sm text-[#F44344]"
              ></p>
            </form>
          </section>
        </div>
      </main>

      ${Footer()}
    </div>
  `;
}

export function setupEditProfileForm() {
  const formElement = document.getElementById("edit-profile-form");

  if (!formElement) {
    return;
  }

  const messageElement = document.getElementById("edit-profile-message");

  formElement.addEventListener("submit", function (event) {
    event.preventDefault();

    const authRaw = localStorage.getItem("auth");

    if (!authRaw) {
      if (messageElement) {
        messageElement.textContent = "You are not logged in.";
      }
      return;
    }

    let auth = null;

    try {
      auth = JSON.parse(authRaw);
    } catch (error) {
      if (messageElement) {
        messageElement.textContent =
          "Something went wrong with your login data.";
      }
      return;
    }

    const userName = auth && auth.user ? auth.user.name : "";
    const token = auth ? auth.token : null;

    if (!userName || !token) {
      if (messageElement) {
        messageElement.textContent =
          "Could not find login information. Please log in again.";
      }
      return;
    }

    const avatarInput = document.getElementById("avatar-url");
    const bannerInput = document.getElementById("banner-url");
    const bioInput = document.getElementById("bio");

    let avatarUrl = "";
    let bannerUrl = "";
    let bio = "";

    if (avatarInput) {
      avatarUrl = avatarInput.value.trim();
    }

    if (bannerInput) {
      bannerUrl = bannerInput.value.trim();
    }

    if (bioInput) {
      bio = bioInput.value.trim();
    }

    const body = {};

    if (bio !== "") {
      body.bio = bio;
    }

    if (avatarUrl !== "") {
      body.avatar = {
        url: avatarUrl,
        alt: "User avatar",
      };
    }

    if (bannerUrl !== "") {
      body.banner = {
        url: bannerUrl,
        alt: "Profile banner",
      };
    }

    async function runUpdate() {
      try {
        if (messageElement) {
          messageElement.textContent = "";
          messageElement.className = "mt-2 text-sm";
        }

        const updatedProfile = await updateProfile(userName, token, body);

        if (messageElement) {
          messageElement.textContent =
            "Profile updated successfully. Redirecting...";
          messageElement.className = "mt-2 text-sm text-[#16A34A]";
        }

        window.location.hash = "#/profile";
      } catch (error) {
        if (messageElement) {
          messageElement.textContent = error.message;
          messageElement.className = "mt-2 text-sm text-[#F44344]";
        }
      }
    }

    runUpdate();
  });
}
