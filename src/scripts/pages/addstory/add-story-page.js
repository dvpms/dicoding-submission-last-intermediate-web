import L from "leaflet";
import { createAddStoryTemplate } from "./templates/add-story-template";
import AddStoryPresenter from "./add-story-presenter";
import StoryModel from "../../data/story-model";

class AddStoryPage {
  constructor() {
    this._presenter = new AddStoryPresenter({
      view: this,
      storyModel: StoryModel,
    });
    this._currentPhotoFile = null;
    this._cameraStream = null;
    this._map = null;
    this._mapMarker = null;
  }

  async render() {
    return createAddStoryTemplate();
  }

  async afterRender() {
    this._descriptionInput = document.querySelector("#storyDescription");
    this._charCountElement = document.querySelector("#descriptionCharCount");
    this._photoInput = document.querySelector("#storyPhoto");
    this._imagePreview = document.querySelector("#imagePreview");
    this._cameraFeed = document.querySelector("#cameraFeed");
    this._photoCanvas = document.querySelector("#photoCanvas");
    this._captureCameraButton = document.querySelector(
      "#captureWithCameraButton"
    );
    this._takePictureButton = document.querySelector("#takePictureButton");
    this._retakePictureButton = document.querySelector("#retakePictureButton");
    this._stopCameraButton = document.querySelector("#stopCameraButton");
    this._latInput = document.querySelector("#storyLatitude");
    this._lonInput = document.querySelector("#storyLongitude");
    this._clearLocationButton = document.querySelector("#clearLocationButton");
    this._form = document.querySelector("#addStoryForm");
    this._submitButton = document.querySelector("#submitStoryButton");
    this._submitSpinner = document.querySelector("#submitSpinner");
    this._errorMessageElement = document.querySelector("#addStoryErrorMessage");
    this._successMessageElement = document.querySelector(
      "#addStorySuccessMessage"
    );

    this._setupDescriptionCounter();
    this._setupPhotoInputListener();
    this._setupCameraButtons();
    this._setupLocationPicker();
    this._setupFormSubmission();

    this._descriptionInput?.focus();
  }

  _setupDescriptionCounter() {
    this._descriptionInput?.addEventListener("input", () => {
      const currentLength = this._descriptionInput.value.length;
      if (this._charCountElement) {
        this._charCountElement.textContent = `${currentLength} / 2200`;
      }
    });
  }

  _setupPhotoInputListener() {
    this._photoInput?.addEventListener("change", (event) => {
      if (event.target.files && event.target.files[0]) {
        this._stopCamera();
        const file = event.target.files[0];
        this._currentPhotoFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          if (this._imagePreview) {
            this._imagePreview.src = e.target.result;
            this._imagePreview.style.display = "block";
          }
        };
        reader.readAsDataURL(file);
        if (this._cameraFeed) this._cameraFeed.style.display = "none";
      }
    });
  }

  _setupCameraButtons() {
    this._captureCameraButton?.addEventListener("click", () =>
      this._startCamera()
    );
    this._takePictureButton?.addEventListener("click", () =>
      this._takePicture()
    );
    this._retakePictureButton?.addEventListener("click", () =>
      this._retakePicture()
    );
    this._stopCameraButton?.addEventListener("click", () => this._stopCamera());
  }

  async _startCamera() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this._cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        if (this._cameraFeed) {
          this._cameraFeed.srcObject = this._cameraStream;
          this._cameraFeed.style.display = "block";
          this._captureCameraButton.style.display = "none";
          this._takePictureButton.style.display = "inline-block";
          this._stopCameraButton.style.display = "inline-block";
          this._photoInput.style.display = "none";
          if (this._imagePreview) this._imagePreview.style.display = "none";
        }
      } else {
        this.showError("Kamera tidak didukung oleh browser Anda.");
      }
    } catch (error) {
      console.error("Error mengakses kamera:", error);
      this.showError(
        `Gagal mengakses kamera: ${error.message}. Pastikan Anda memberikan izin.`
      );
      this._stopCamera();
    }
  }

  _takePicture() {
    if (this._cameraStream && this._cameraFeed && this._photoCanvas) {
      const context = this._photoCanvas.getContext("2d");
      this._photoCanvas.width = this._cameraFeed.videoWidth;
      this._photoCanvas.height = this._cameraFeed.videoHeight;
      context.drawImage(
        this._cameraFeed,
        0,
        0,
        this._photoCanvas.width,
        this._photoCanvas.height
      );

      this._photoCanvas.toBlob(
        (blob) => {
          this._currentPhotoFile = new File(
            [blob],
            `story-capture-${Date.now()}.jpg`,
            { type: "image/jpeg" }
          );
          if (this._imagePreview) {
            this._imagePreview.src = this._photoCanvas.toDataURL("image/jpeg");
            this._imagePreview.style.display = "block";
          }
        },
        "image/jpeg",
        0.9
      );

      this._cameraFeed.style.display = "none";
      this._takePictureButton.style.display = "none";
      this._retakePictureButton.style.display = "inline-block";
    }
  }

  _retakePicture() {
    this._currentPhotoFile = null;
    if (this._imagePreview) this._imagePreview.style.display = "none";
    if (this._cameraFeed) this._cameraFeed.style.display = "block";
    this._takePictureButton.style.display = "inline-block";
    this._retakePictureButton.style.display = "none";
  }

  _stopCamera() {
    if (this._cameraStream) {
      this._cameraStream.getTracks().forEach((track) => track.stop());
      this._cameraStream = null;
    }
    if (this._cameraFeed) this._cameraFeed.style.display = "none";
    this._captureCameraButton.style.display = "inline-block";
    this._takePictureButton.style.display = "none";
    this._retakePictureButton.style.display = "none";
    this._stopCameraButton.style.display = "none";
    this._photoInput.style.display = "block";
  }

  _setupLocationPicker() {
    const mapElement = document.getElementById("locationPickerMap");
    if (!mapElement) return;

    mapElement.innerHTML = "";

    const openStreetMap = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const esriWorldImagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      }
    );

    const baseMaps = {
      Street: openStreetMap,
      Satelit: esriWorldImagery,
    };

    this._map = L.map(mapElement, {
      layers: [openStreetMap],
    }).setView([-6.2, 106.816666], 11);

    L.control.layers(baseMaps).addTo(this._map);

    this._map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      if (this._latInput) this._latInput.value = lat.toFixed(6);
      if (this._lonInput) this._lonInput.value = lng.toFixed(6);

      if (this._mapMarker) {
        this._mapMarker.setLatLng(e.latlng);
      } else {
        this._mapMarker = L.marker(e.latlng).addTo(this._map);
      }
      this._mapMarker
        .bindPopup(`Lokasi dipilih: ${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();
    });

    this._clearLocationButton?.addEventListener("click", () => {
      if (this._latInput) this._latInput.value = "";
      if (this._lonInput) this._lonInput.value = "";
      if (this._mapMarker) {
        this._map.removeLayer(this._mapMarker);
        this._mapMarker = null;
      }
    });

    setTimeout(() => {
      this._map.invalidateSize();
    }, 100);
  }
  _setupFormSubmission() {
    this._form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!this._descriptionInput || !this._currentPhotoFile) {
        this.showError("Deskripsi dan foto wajib diisi.");
        return;
      }

      const data = {
        description: this._descriptionInput.value,
        photo: this._currentPhotoFile,
        lat: this._latInput?.value ? parseFloat(this._latInput.value) : null,
        lon: this._lonInput?.value ? parseFloat(this._lonInput.value) : null,
      };

      if (data.lat === null || isNaN(data.lat)) delete data.lat;
      if (data.lon === null || isNaN(data.lon)) delete data.lon;

      await this._presenter.submitStory(data);
    });
  }

  showLoading() {
    if (this._submitButton) this._submitButton.disabled = true;
    if (this._submitSpinner) this._submitSpinner.style.display = "inline-block";
    if (this._errorMessageElement)
      this._errorMessageElement.style.display = "none";
    if (this._successMessageElement)
      this._successMessageElement.style.display = "none";
  }

  hideLoading() {
    if (this._submitButton) this._submitButton.disabled = false;
    if (this._submitSpinner) this._submitSpinner.style.display = "none";
  }

  showSuccess(message) {
    if (this._successMessageElement) {
      this._successMessageElement.textContent = message;
      this._successMessageElement.style.display = "block";
    }
    if (this._errorMessageElement)
      this._errorMessageElement.style.display = "none";
    this._form?.reset();
    if (this._imagePreview) this._imagePreview.style.display = "none";
    this._currentPhotoFile = null;
    if (this._charCountElement) this._charCountElement.textContent = "0 / 2200";
    if (this._mapMarker) this._map.removeLayer(this._mapMarker);
    this._mapMarker = null;
    if (this._latInput) this._latInput.value = "";
    if (this._lonInput) this._lonInput.value = "";
    this._stopCamera();
  }

  showError(message) {
    if (this._errorMessageElement) {
      this._errorMessageElement.textContent = `Error: ${message}`;
      this._errorMessageElement.style.display = "block";
    }
    if (this._successMessageElement)
      this._successMessageElement.style.display = "none";
  }

  onPageLeave() {
    this._stopCamera();
  }
}

export default AddStoryPage;
