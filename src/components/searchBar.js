export function SearchBar(currentSearchText = "") {
  return `
    <section>
      <form
        id="search-form"
        class="flex flex-col sm:flex-row gap-3 items-stretch justify-center"
      >
        <input
          id="search-input"
          type="text"
          value="${currentSearchText}"
          placeholder="Search item here..."
          class="flex-1 max-w-xl px-4 py-2 rounded-full border border-[#E5E7EB] text-sm font-inter bg-white"
        />
        <button
          type="submit"
          class="btn-primary"
        >
          Search
        </button>
      </form>

      <!-- Filter-knapper -->
      <div class="mt-3 flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
        <button
          type="button"
          class="filter-button px-3 py-1 rounded-full border border-[#4B5563] text-[#E5E7EB] bg-transparent"
          data-filter="all"
        >
          All
        </button>
        <button
          type="button"
          class="filter-button px-3 py-1 rounded-full border border-[#4B5563] text-[#E5E7EB] bg-transparent"
          data-filter="ending-soon"
        >
          Ending soon
        </button>
        <button
          type="button"
          class="filter-button px-3 py-1 rounded-full border border-[#4B5563] text-[#E5E7EB] bg-transparent"
          data-filter="most-bids"
        >
          Most bids
        </button>
      </div>
    </section>
  `;
}

export function setupSearchBar() {
  const formElement = document.getElementById("search-form");

  if (!formElement) {
    return;
  }

  const inputElement = document.getElementById("search-input");


  if (inputElement) {
    inputElement.addEventListener("input", function () {
      const value = inputElement.value.trim();

      if (value === "") {
        window.location.hash = "#/";
      }
    });
  }

  formElement.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputElement = document.getElementById("search-input");

    if (!inputElement) {
      return;
    }

    const searchText = inputElement.value.trim();

    const hash = window.location.hash || "#/";
    const indexOfQuestionMark = hash.indexOf("?");
    let filter = "all";

    if (indexOfQuestionMark !== -1) {
      const queryString = hash.substring(indexOfQuestionMark + 1);
      const params = new URLSearchParams(queryString);
      const filterFromUrl = params.get("filter");
      if (filterFromUrl) {
        filter = filterFromUrl;
      }
    }

    if (searchText === "" && filter === "all") {
      window.location.hash = "#/";
      return;
    }

    const params = new URLSearchParams();

    if (searchText !== "") {
      params.set("q", searchText);
    }

    if (filter !== "all") {
      params.set("filter", filter);
    }

    window.location.hash = "#/search?" + params.toString();
  });

  const filterButtons = document.querySelectorAll(".filter-button");

  if (filterButtons.length === 0) {
    return;
  }

  const hash = window.location.hash || "#/";
  const indexOfQuestionMark = hash.indexOf("?");
  let activeFilter = "all";

  if (indexOfQuestionMark !== -1) {
    const queryString = hash.substring(indexOfQuestionMark + 1);
    const params = new URLSearchParams(queryString);
    const filterFromUrl = params.get("filter");
    if (filterFromUrl) {
      activeFilter = filterFromUrl;
    }
  }

  function updateFilterButtonStyles(selected) {
    filterButtons.forEach((button) => {
      const value = button.getAttribute("data-filter");

      if (value === selected) {
        button.classList.remove("bg-transparent", "text-[#E5E7EB]");
        button.classList.add("bg-white", "text-[#111827]");
      } else {
        button.classList.add("bg-transparent", "text-[#E5E7EB]");
        button.classList.remove("bg-white", "text-[#111827]");
      }
    });
  }

  updateFilterButtonStyles(activeFilter);

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const value = button.getAttribute("data-filter") || "all";

      const searchInput = document.getElementById("search-input");
      const currentSearchValue = searchInput
        ? searchInput.value.trim()
        : "";

      if (value === "all" && currentSearchValue === "") {
        window.location.hash = "#/";
        return;
      }

      const params = new URLSearchParams();

      if (currentSearchValue !== "") {
        params.set("q", currentSearchValue);
      }

      if (value !== "all") {
        params.set("filter", value);
      }

      window.location.hash = "#/search?" + params.toString();
    });
  });
}