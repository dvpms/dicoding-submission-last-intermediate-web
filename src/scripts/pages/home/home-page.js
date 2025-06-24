import L from "leaflet";
import HomePresenter from "./home-presenter";
import { createStoryItemTemplate } from "./templates/story-item-template";
import StoryDbHelper from "../../data/db-helper";

class HomePage {
  constructor() {
    this._presenter = new HomePresenter({ view: this });
    this._mainContentContainer = null;
    this._loadingIndicator = null;
    this._storiesErrorMessage = null;
    this.currentStories = [];
  }

  async render() {
    return `
      <section class="home-page">
        <h2 class="home-page__title">Daftar Cerita Terbaru</h2>
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
          <p>Memuat cerita...</p>
        </div>
        <div id="storiesErrorMessage" class="error-message" style="display: none;"></div>
        <div id="storyListContainer" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.currentStories = []; // Reset setiap kali render ulang
    this._mainContentContainer = document.querySelector("#storyListContainer");
    this._loadingIndicator = document.querySelector("#loadingIndicator");
    this._storiesErrorMessage = document.querySelector("#storiesErrorMessage");

    await this._presenter.initializePage();
    this._setupActionListeners();
  }

  redirectToLogin() {
    window.location.hash = "#/login";
  }

  showLoading() {
    if (this._loadingIndicator) {
      this._loadingIndicator.style.display = "block";
    }
    if (this._storiesErrorMessage) {
      this._storiesErrorMessage.style.display = "none";
    }
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = "";
    }
  }

  hideLoading() {
    if (this._loadingIndicator) {
      this._loadingIndicator.style.display = "none";
    }
  }

  async displayStories(stories) {
    if (!this._mainContentContainer) return;

    // Simpan daftar cerita saat ini untuk digunakan oleh event listener nanti
    this.currentStories = stories;

    // Ambil daftar ID cerita yang sudah tersimpan di IndexedDB
    const savedStories = await StoryDbHelper.getAllStories();
    const savedStoryIds = new Set(savedStories.map((story) => story.id));

    this._mainContentContainer.innerHTML = "";
    if (stories && stories.length > 0) {
      stories.forEach((story) => {
        const isSaved = savedStoryIds.has(story.id);

        const storyItemElement = document.createElement("div");
        storyItemElement.innerHTML = createStoryItemTemplate(story, isSaved);

        this._mainContentContainer.appendChild(
          storyItemElement.firstElementChild
        );

        if (story.lat != null && story.lon != null) {
          this._initializeMap(
            `map-${story.id}`,
            story.lat,
            story.lon,
            story.name,
            story.description
          );
        }
      });
    } else {
      this.showEmptyStories();
    }
  }

  _setupActionListeners() {
    this._mainContentContainer.addEventListener("click", async (event) => {
      // Cari elemen tombol terdekat yang diklik
      const button = event.target.closest("button");
      if (!button) return;

      const storyId = button.dataset.id;

      // Logika untuk tombol "Simpan"
      if (button.classList.contains("save-offline-button")) {
        // Cari objek cerita lengkap dari daftar yang kita simpan
        const storyToSave = this.currentStories.find(
          (story) => story.id === storyId
        );
        if (storyToSave) {
          await StoryDbHelper.putStory(storyToSave);
          alert("Cerita berhasil disimpan untuk mode offline!");
          this._updateButtonState(storyId, true);
        }
      }

      // Logika untuk tombol "Hapus"
      if (button.classList.contains("delete-offline-button")) {
        if (
          confirm(
            "Apakah Anda yakin ingin menghapus cerita ini dari daftar offline?"
          )
        ) {
          await StoryDbHelper.deleteStory(storyId);
          alert("Cerita berhasil dihapus dari daftar offline.");
          this._updateButtonState(storyId, false);
        }
      }
    });
  }

  _updateButtonState(storyId, isSaved) {
    const storyElement = document.querySelector(`#story-${storyId}`);
    if (!storyElement) return;

    const story = this.currentStories.find((s) => s.id === storyId);
    if (!story) return;

    const actionContainer = storyElement.querySelector(".story-item__actions");
    if (!actionContainer) return;

    const newButtonHtml = isSaved
      ? `<button class="button button-danger delete-offline-button" data-id="${storyId}" aria-label="Hapus cerita ${story.name} dari daftar offline">
           <i class="fas fa-trash-alt"></i> Hapus dari Offline
         </button>`
      : `<button class="button button-primary save-offline-button" data-id="${storyId}" aria-label="Simpan cerita ${story.name} untuk offline">
           <i class="fas fa-save"></i> Simpan untuk Offline
         </button>`;

    actionContainer.innerHTML = newButtonHtml;
  }

  _initializeMap(mapId, lat, lon, storyName, storyDescription) {
    try {
      const mapContainer = document.getElementById(mapId);
      if (
        !mapContainer ||
        mapContainer.classList.contains("leaflet-container")
      ) {
        if (!mapContainer)
          console.warn(`Elemen peta dengan ID ${mapId} tidak ditemukan.`);
        return;
      }

      mapContainer.innerHTML = "";

      const openStreetMap = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }
      );

      const esriWorldImagery = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 19,
        }
      );

      const baseMaps = {
        Street: openStreetMap,
        Satelit: esriWorldImagery,
      };

      const map = L.map(mapId, {
        layers: [openStreetMap],
      }).setView([lat, lon], 13);

      L.control.layers(baseMaps).addTo(map);

      const marker = L.marker([lat, lon]).addTo(map);
      marker
        .bindPopup(
          `<b>${storyName}</b><br>${storyDescription.substring(0, 100)}...`
        )
        .openPopup();

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    } catch (error) {
      console.error(`Gagal menginisialisasi peta untuk ID ${mapId}:`, error);
      const mapElement = document.getElementById(mapId);
      if (mapElement) {
        mapElement.innerHTML =
          '<p style="color: red; text-align: center;">Peta tidak dapat dimuat.</p>';
      }
    }
  }
  showEmptyStories() {
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = `
        <p class="empty-stories-message" style="text-align: center; padding: 20px;">
          Belum ada cerita yang tersedia untuk ditampilkan.
        </p>
      `;
    }
  }

  showError(message) {
    if (this._storiesErrorMessage) {
      this._storiesErrorMessage.innerHTML = `<p>${message}</p>`;
      this._storiesErrorMessage.style.display = "block";
    }
    if (this._mainContentContainer) {
      this._mainContentContainer.innerHTML = "";
    }
  }
}

export default HomePage;
