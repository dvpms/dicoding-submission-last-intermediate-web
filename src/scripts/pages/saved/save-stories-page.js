// src/scripts/pages/saved/saved-stories-page.js
import StoryDbHelper from "../../data/db-helper";
import { createStoryItemTemplate } from "../home/templates/story-item-template";

class SavedStoriesPage {
  async render() {
    return `
      <section class="saved-stories-page">
        <h2 class="page__title">Cerita Tersimpan (Offline)</h2>
        <div id="savedStoryListContainer" class="story-list">
          </div>
      </section>
    `;
  }

  async afterRender() {
    const stories = await StoryDbHelper.getAllStories();
    const storyContainer = document.querySelector("#savedStoryListContainer");

    if (stories.length === 0) {
      storyContainer.innerHTML =
        '<p class="empty-message">Anda belum menyimpan cerita apapun untuk mode offline.</p>';
      return;
    }

    storyContainer.innerHTML = "";
    stories.forEach((story) => {
      // Karena semua cerita di sini pasti tersimpan, 'isSaved' selalu true
      storyContainer.innerHTML += createStoryItemTemplate(story, true);
    });

    // Event listener untuk tombol hapus di halaman ini
    storyContainer.addEventListener("click", async (event) => {
      const deleteButton = event.target.closest(".delete-offline-button");
      if (deleteButton) {
        const storyId = deleteButton.dataset.id;
        if (confirm("Hapus cerita ini dari daftar offline?")) {
          await StoryDbHelper.deleteStory(storyId);
          // Hapus dari tampilan dan render ulang halaman ini
          this.afterRender();
        }
      }
    });
  }
}

export default SavedStoriesPage;
