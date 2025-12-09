export function ListingCard(data) {
  const id = data.id;
  const title = data.title;
  const currentBid = data.currentBid;
  const timeLeft = data.timeLeft;
  const imageUrl = data.imageUrl;
  const imageAlt = data.imageAlt;

  const imageHtml = imageUrl
    ? `<img src="${imageUrl}" alt="${imageAlt}" class="h-40 w-full object-cover rounded-t-2xl" />`
    : `<div class="h-40 w-full bg-[#E5E7EB] rounded-t-2xl"></div>`;

  return `
    <article class="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      ${imageHtml}

      <div class="p-4 flex flex-col gap-2 flex-1">
        <h3 class="text-sm font-poppins font-semibold text-[#111827]">
          ${title}
        </h3>

        <p class="text-xs text-[#6B7280]">
          ${currentBid} · ${timeLeft}
        </p>

        <div class="mt-auto">
          <a
            href="#/listing/${id}"
            class="btn-primary w-full inline-flex justify-center"
          >
            Place bid
          </a>
        </div>
      </div>
    </article>
  `;
}