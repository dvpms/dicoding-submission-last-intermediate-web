const createAddStoryTemplate = () => `
  <section class="add-story-page">
    <h2 class="add-story-page__title">Buat Cerita Baru</h2>
    <form id="addStoryForm" class="add-story-form">
      <div class="form-group">
        <label for="storyDescription">Deskripsi Cerita:</label>
        <textarea id="storyDescription" name="description" rows="5" required maxlength="2200"></textarea>
        <p id="descriptionCharCount" class="char-count">0 / 2200</p>
      </div>

      <div class="form-group">
        <label for="storyPhoto">Foto Cerita:</label>
        <input type="file" id="storyPhoto" name="photo" accept="image/png, image/jpeg, image/gif">
        <button type="button" id="captureWithCameraButton" class="button button-secondary">
          Ambil dengan Kamera
        </button>
        <img id="imagePreview" src="#" alt="Pratinjau Gambar" style="display: none; max-width: 100%; margin-top: 10px; border-radius: 4px;"/>
<video id="cameraFeed" autoplay playsinline muted style="display: none; max-width: 100%; margin-top: 10px; border-radius: 4px;"></video>        <canvas id="photoCanvas" style="display:none;"></canvas> <button type="button" id="takePictureButton" class="button button-capture" style="display:none;">Ambil Gambar</button>
        <button type="button" id="retakePictureButton" class="button button-secondary" style="display:none;">Ulangi</button>
        <button type="button" id="stopCameraButton" class="button button-danger" style="display:none;">Tutup Kamera</button>
      </div>

      <div class="form-group">
        <label>Lokasi Cerita (Opsional):</label>
        <div id="locationPickerMap" class="location-picker-map">
          Memuat peta untuk pemilihan lokasi...
        </div>
        <input type="text" id="storyLatitude" name="latitude" placeholder="Latitude (klik peta)" readonly>
        <input type="text" id="storyLongitude" name="longitude" placeholder="Longitude (klik peta)" readonly>
        <button type="button" id="clearLocationButton" class="button button-link">Hapus Lokasi</button>
      </div>
      
      <div id="addStoryErrorMessage" class="error-message" style="display: none;"></div>
      <div id="addStorySuccessMessage" class="success-message" style="display: none;"></div>

      <button type="submit" id="submitStoryButton" class="button button-primary">
        <span id="submitSpinner" class="spinner" style="display: none;"></span>
        <i class="fas fa-paper-plane"></i>
        Kirim Cerita
      </button>
    </form>
  </section>
`;

export { createAddStoryTemplate };
