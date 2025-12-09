export function Footer() {
  return `
    <footer class="mt-12 border-t border-[#E5E7EB] bg-white w-full">
      <div class="max-w-7xl mx-auto px-8 py-8 text-center space-y-3 text-xs text-[#6B7280]">
        <button
          class="mx-auto flex flex-col items-center gap-1 text-[#6B7280] hover:text-[#111827]"
          onclick="window.scrollTo({ top: 0, behavior: 'smooth' })"
        >
          <span class="text-sm">↑</span>
          <span>Back to top</span>
        </button>

        <div class="flex flex-col items-center gap-1">
          <img
            src="./assets/images/logoiconcrow.png"
            alt="Crow footer logo"
            class="h-6 w-auto"
          />
          <p class="text-[#111827]">Crow Auction House</p>
          <p>© 2025 · Designed by Anna Kaijankoski</p>
        </div>
      </div>
    </footer>
  `;
}