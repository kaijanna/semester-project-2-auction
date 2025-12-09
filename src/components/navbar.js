export function Navbar() {
  let authRaw = localStorage.getItem("auth");
  let isLoggedIn = false;
  let creditsText = "";
  let userName = "";

  if (authRaw) {
    try {
      const auth = JSON.parse(authRaw);

      if (auth && auth.user) {
        isLoggedIn = true;

        if (typeof auth.user.credits === "number") {
          creditsText = auth.user.credits + " NOK";
        }

        if (auth.user.name) {
          userName = auth.user.name;
        }
      }
    } catch (error) {
      console.error("Could not parse auth from localStorage:", error);
    }
  }

  if (isLoggedIn) {
    return `
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a href="#/" class="flex items-center gap-2">
              <img src="./assets/images/logoiconcrow.png" alt="Crow logo" class="h-6 w-auto" />
            </a>
          </div>

          <nav class="hidden md:flex items-center gap-6 text-sm font-poppins">
            <a href="#/" class="hover:text-[#667280]">Home</a>
            <a href="#/my-listings" class="hover:text-[#667280]">My listings</a>
            <a href="#/my-bids" class="hover:text-[#667280]">Bid history</a>
            <button 
              id="logoutButton" 
              type="button"
              class="hover:text-[#667280]"
            >
              Logout
            </button>
          </nav>

          <div class="hidden md:flex items-center gap-4 text-sm font-poppins">
            <div class="flex items-center gap-2">
              <span>🔥</span>
              <span>${creditsText}</span>
            </div>

            <a 
              href="#/create" 
              class="btn-primary"
            >
              Create listing
            </a>

            <a 
              href="#/profile"
              class="h-8 w-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-xs hover:bg-[#F3F4F6] transition"
            >
              ${userName ? userName.charAt(0).toUpperCase() : "?"}
            </a>
          </div>

          <button
            id="mobileMenuButton"
            type="button"
            class="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#E5E7EB] text-[#374151]"
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        <div
          id="mobileMenu"
          class="md:hidden border-t border-[#E5E7EB] bg-white hidden"
        >
          <nav class="px-4 py-3 space-y-3 text-sm font-poppins">
            <a href="#/" class="block hover:text-[#667280]">Home</a>
            <a href="#/my-listings" class="block hover:text-[#667280]">My listings</a>
            <a href="#/my-bids" class="block hover:text-[#667280]">Bid history</a>

            <div class="pt-2 border-t border-[#E5E7EB] mt-2 space-y-2">
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <span>🔥</span>
                  <span>${creditsText}</span>
                </span>
                <a
                  href="#/profile"
                  class="h-8 w-8 rounded-full border border-[#E5E7EB] flex items-center justify-center text-xs hover:bg-[#F3F4F6] transition"
                >
                  ${userName ? userName.charAt(0).toUpperCase() : "?"}
                </a>
              </div>

              <a href="#/create" class="btn-primary w-full text-center block">
                Create listing
              </a>

              <button
                id="logoutButtonMobile"
                type="button"
                class="w-full text-left text-[#B91C1C] text-sm mt-1"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
    `;
  }

  return `
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <a href="#/" class="flex items-center gap-2">
          <img src="./assets/images/logoiconcrow.png" alt="Crow logo" class="h-6 w-auto" />
        </a>

        <nav class="hidden md:flex items-center gap-6 text-sm font-poppins">
          <a href="#/" class="hover:text-[#667280]">Home</a>
          <a href="#/register" class="hover:text-[#667280]">Register</a>
          <a href="#/login" class="hover:text-[#667280]">Login</a>
        </nav>

        <button
          id="mobileMenuButton"
          type="button"
          class="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md border border-[#E5E7EB] text-[#374151]"
          aria-label="Open menu"
        >
          ☰
        </button>
      </div>

      <div
        id="mobileMenu"
        class="md:hidden border-t border-[#E5E7EB] bg-white hidden"
      >
        <nav class="px-4 py-3 space-y-3 text-sm font-poppins">
          <a href="#/" class="block hover:text-[#667280]">Home</a>
          <a href="#/register" class="block hover:text-[#667280]">Register</a>
          <a href="#/login" class="block hover:text-[#667280]">Login</a>
        </nav>
      </div>
    </header>
  `;
}
