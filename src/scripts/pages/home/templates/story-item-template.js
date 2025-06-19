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

const createStoryItemTemplate = (story) => {
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

  return `
        <article class="story-item card" id="story-${storyId}">
      <figure class="story-item__figure">
        <img class="story-item__image lazyload" src="${storyPhotoUrl}" alt="..." crossorigin="anonymous">
      </figure>
      <div class="story-item__content">
        <h3 class="story-item__title">${storyName}</h3>
        <p class="story-item__date"><time datetime="${
          story.createdAt
        }">${storyDate}</time></p>
        <p class="story-item__description">${storyDescription}</p>
        
        ${
          storyLat !== null &&
          storyLat !== undefined &&
          storyLon !== null &&
          storyLon !== undefined
            ? `
          <div class="story-item__map-container">
            <h4><i class="fas fa-map-marker-alt"></i>Lokasi Cerita:</h4>
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
          <button class="button button-danger delete-offline-button" data-id="${storyId}" aria-label="Hapus cerita ${storyName} dari cache">
            <i class="fas fa-trash-alt"></i> Hapus dari Offline
          </button>
        </div>

      </div>
    </article>
  `;
};

export { createStoryItemTemplate };
