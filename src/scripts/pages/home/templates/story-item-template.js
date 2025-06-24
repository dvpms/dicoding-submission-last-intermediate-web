// src/scripts/pages/home/templates/story-item-template.js

// Fungsi bantuan untuk memformat tanggal (tidak perlu diubah)
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  try {
    return new Intl.DateTimeFormat("id-ID", options).format(
      new Date(dateString)
    );
  } catch (e) {
    return new Date(dateString).toLocaleString(undefined, options);
  }
};

// --- GANTI SELURUH FUNGSI createStoryItemTemplate DENGAN YANG DI BAWAH INI ---
const createStoryItemTemplate = (story, isSaved) => {
  // Memastikan semua data yang dibutuhkan ada, dengan fallback jika tidak
  const storyId = story.id || "unknown-id";
  const storyName = story.name || "Nama Tidak Diketahui";
  const storyDescription = story.description || "Deskripsi tidak tersedia.";
  const storyPhotoUrl =
    story.photoUrl || "https://via.placeholder.com/400x300?text=No+Image";
  const storyDate = story.createdAt
    ? formatDate(story.createdAt)
    : "Tanggal tidak diketahui";
  const storyLat = story.lat;
  const storyLon = story.lon;

  // Logika untuk menentukan tombol mana yang akan ditampilkan
  const actionButton = isSaved
    ? // Jika SUDAH tersimpan, tampilkan tombol HAPUS
      `<button class="button button-danger delete-offline-button" data-id="${storyId}" aria-label="Hapus cerita ${storyName} dari daftar offline">
         <i class="fas fa-trash-alt"></i> Hapus dari Offline
       </button>`
    : // Jika BELUM tersimpan, tampilkan tombol SIMPAN
      `<button class="button button-primary save-offline-button" data-id="${storyId}" aria-label="Simpan cerita ${storyName} untuk offline">
         <i class="fas fa-save"></i> Simpan untuk Offline
       </button>`;

  return `
    <article class="story-item card" id="story-${storyId}">
      <figure class="story-item__figure">
        <img class="story-item__image lazyload" src="${storyPhotoUrl}" alt="Cerita dari ${storyName}: ${storyDescription.substring(
    0,
    50
  )}..." crossorigin="anonymous">
      </figure>
      <div class="story-item__content">
        <h3 class="story-item__title">${storyName}</h3>
        <p class="story-item__date"><time datetime="${
          story.createdAt
        }">${storyDate}</time></p>
        <p class="story-item__description">${storyDescription}</p>
        
        ${
          storyLat != null && storyLon != null
            ? `
          <div class="story-item__map-container">
            <h4><i class="fas fa-map-marker-alt"></i> Lokasi Cerita:</h4>
            <div class="story-item__map" id="map-${storyId}">
              Memuat peta...
            </div>
            <p class="story-item__coordinates">Koordinat: ${storyLat.toFixed(
              5
            )}, ${storyLon.toFixed(5)}</p>
          </div>
        `
            : `
          <p class="story-item__no-location"><em>Lokasi tidak tersedia untuk cerita ini.</em></p>
        `
        }
        
        <div class="story-item__actions">
          ${actionButton}
        </div>

      </div>
    </article>
  `;
};

export { createStoryItemTemplate };
