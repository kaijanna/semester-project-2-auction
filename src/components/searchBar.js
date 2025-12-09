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
    </section>
  `;
}

export function setupSearchBar() {
  const formElement = document.getElementById("search-form");

  if (!formElement) return;

  const inputElement = document.getElementById("search-input");
  if (!inputElement) return;

  inputElement.addEventListener("input", function () {
    const value = inputElement.value.trim();
    if (value === "") {
      window.location.hash = "#/";
    }
  });

  formElement.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchText = inputElement.value.trim();

    if (searchText === "") {
      window.location.hash = "#/";
    } else {
      window.location.hash = "#/search?q=" + encodeURIComponent(searchText);
    }
  });
}