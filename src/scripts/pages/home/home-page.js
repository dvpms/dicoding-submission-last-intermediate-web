import L from "leaflet";
import HomePresenter from "./home-presenter";
import { createStoryItemTemplate } from "./templates/story-item-template";
import StoryDbHelper from "../../data/db-helper";

class HomePage {
  constructor() {
    this._presenter = new HomePresenter({ view: this });
    this._mainContentContainer = null;
  }

  async render() {
    return `
      <section class="home-page">
        <h2 class="home-page__title">Daftar Cerita Terbaru</h2>
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
          <p>Memuat cerita...</p>
          </div>
        <div id="storiesErrorMessage" class="error-message" style="display: none;">
          </div>
        <div id="storyListContainer" class="story-list">
          </div>
      </section>
    `;
  }

  async afterRender() {
    this._mainContentContainer = document.querySelector("#storyListContainer");
    this._loadingIndicator = document.querySelector("#loadingIndicator");
    this._storiesErrorMessage = document.querySelector("#storiesErrorMessage");

    await this._presenter.initializePage();
    this._mainContentContainer.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-offline-button")) {
        const storyId = event.target.dataset.id;
        console.log(`Tombol hapus untuk ID ${storyId} diklik.`);

        if (
          confirm(
            "Apakah Anda yakin ingin menghapus cerita ini dari cache offline?"
          )
        ) {
          await StoryDbHelper.deleteStory(storyId);
          console.log(`Cerita ${storyId} dihapus dari IndexedDB.`);
          document.querySelector(`#story-${storyId}`)?.remove();
        }
      }
    });
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

  displayStories(stories) {
    if (!this._mainContentContainer) return;

    this._mainContentContainer.innerHTML = "";
    if (stories && stories.length > 0) {
      stories.forEach((story) => {
        const storyItemElement = document.createElement("div");
        storyItemElement.innerHTML = createStoryItemTemplate(story);

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
