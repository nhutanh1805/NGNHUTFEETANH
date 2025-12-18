<!-- src/views/story/StoryEdit.vue -->
<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-3xl shadow-2xl mt-10" v-if="story">
    <h1 class="text-4xl font-extrabold text-center mb-10 text-purple-700">
      Chỉnh Sửa Truyện: {{ story.title }}
    </h1>

    <form @submit.prevent="submit" class="space-y-10">
      <!-- Phần cơ bản -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Tiêu đề truyện <span class="text-red-500">*</span></label>
          <input v-model="story.title" type="text" required class="input w-full" />
        </div>

        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Slug (URL thân thiện)</label>
          <input v-model="story.slug" type="text" class="input w-full" />
          <p class="text-sm text-gray-500 mt-1">Để trống để tự động tạo từ tiêu đề</p>
        </div>

        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Tác giả <span class="text-red-500">*</span></label>
          <input v-model="story.author" type="text" required class="input w-full" />
        </div>

        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Trạng thái</label>
          <select v-model="story.status" class="input w-full">
            <option value="draft">Nháp (Draft)</option>
            <option value="published">Đã xuất bản</option>
          </select>
        </div>
      </div>

      <!-- Ảnh bìa - giống Add -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Ảnh bìa truyện (Cover Image)</label>

          <div v-if="previewCover || story.coverImage" class="mb-6">
            <img :src="previewCover || story.coverImage" class="w-full max-w-md rounded-2xl shadow-2xl object-cover h-96 border-4 border-purple-200" alt="Preview ảnh bìa" />
          </div>

          <div class="p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-300">
            <p class="font-bold text-purple-800 mb-4">Thay ảnh bìa mới (Upload lên Cloudinary)</p>
            <input type="file" accept="image/*" @change="handleCoverUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700" />
            <p v-if="uploadingCover" class="mt-4 text-purple-600 font-medium text-lg">Đang upload ảnh bìa... ⏳</p>
            <p v-if="uploadCoverSuccess" class="mt-4 text-green-600 font-bold text-lg">✓ Upload thành công! Link đã cập nhật</p>
          </div>

          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-600 mb-2">Link ảnh bìa hiện tại</label>
            <input v-model="story.coverImage" type="url" placeholder="https://res.cloudinary.com/..." class="input w-full" />
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <label class="block text-lg font-semibold text-gray-700 mb-2">Thể loại (cách nhau bằng dấu phẩy)</label>
            <input v-model="genresInput" type="text" class="input w-full" />
            <div v-if="story.genres.length" class="mt-3 flex flex-wrap gap-2">
              <span v-for="genre in story.genres" :key="genre" class="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                {{ genre }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <input v-model="story.isFeatured" type="checkbox" id="featured" class="w-6 h-6 text-purple-600 rounded focus:ring-purple-500" />
            <label for="featured" class="text-lg font-semibold text-gray-700 cursor-pointer">Đánh dấu là truyện nổi bật</label>
          </div>
        </div>
      </div>

      <!-- Mô tả -->
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2">Mô tả / Tóm tắt truyện</label>
        <textarea v-model="story.description" rows="8" class="input w-full resize-none"></textarea>
      </div>

      <!-- Ảnh minh họa -->
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-4">Ảnh minh họa trong truyện (Images)</label>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div v-for="(url, index) in story.images" :key="index" class="relative group">
            <img :src="url" class="w-full h-40 object-cover rounded-xl shadow-lg" alt="Ảnh minh họa" />
            <button @click="removeImage(index)" type="button" class="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-700">
              ×
            </button>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl border-2 border-green-300">
          <p class="font-bold text-green-800 mb-4">Thêm ảnh minh họa mới</p>
          <input type="file" accept="image/*" multiple @change="handleImagesUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-green-600 file:text-white hover:file:bg-green-700" />
          <p v-if="uploadingImages" class="mt-4 text-green-600 font-medium text-lg">Đang upload ảnh minh họa... ⏳</p>
        </div>
      </div>

      <!-- Video liên quan -->
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-4">Video liên quan (Trailer, AMV...)</label>

        <div class="space-y-6 mb-6">
          <div v-for="(videoUrl, index) in story.videos" :key="index" class="border-2 border-gray-200 rounded-2xl p-4 bg-gray-50">
            <div class="flex items-center justify-between mb-3">
              <span class="font-medium text-gray-700">Video {{ index + 1 }}</span>
              <button @click="removeVideo(index)" type="button" class="text-red-600 hover:text-red-800 font-bold">Xóa</button>
            </div>

            <video v-if="videoUrl.includes('cloudinary.com') && videoUrl.endsWith('.mp4')" controls class="w-full rounded-xl shadow-md mb-4" style="max-height: 300px;">
              <source :src="videoUrl" type="video/mp4">
            </video>

            <div v-else-if="videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')" class="aspect-video mb-4">
              <iframe :src="getYouTubeEmbedUrl(videoUrl)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-xl"></iframe>
            </div>

            <input v-model="story.videos[index]" type="url" class="input w-full" />
          </div>
        </div>

        <div class="flex gap-4">
          <button @click="addVideoField" type="button" class="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold">
            + Thêm link video
          </button>

          <div class="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300 flex-1">
            <p class="font-bold text-blue-800 mb-4">Upload video mới từ máy</p>
            <input type="file" accept="video/mp4,video/webm" @change="handleVideoUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
            <p v-if="uploadingVideo" class="mt-4 text-blue-600 font-medium text-lg">Đang upload video... ⏳</p>
            <p v-if="uploadVideoSuccess" class="mt-4 text-green-600 font-bold text-lg">✓ Upload thành công!</p>
          </div>
        </div>
      </div>

      <!-- Các trường số -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Đánh giá (Rating)</label>
          <input v-model.number="story.rating" type="number" min="0" max="5" step="0.1" class="input w-full" />
        </div>

        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Số lượt xem</label>
          <input v-model.number="story.views" type="number" min="0" class="input w-full" />
        </div>

        <div>
          <label class="block text-lg font-semibold text-gray-700 mb-2">Số chương hiện tại</label>
          <input v-model.number="story.chaptersCount" type="number" min="0" class="input w-full" />
        </div>
      </div>

      <!-- Nút submit -->
      <div class="text-center pt-8">
        <button type="submit" :disabled="loading" class="w-full md:w-auto px-16 py-6 bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-3xl font-bold rounded-3xl hover:from-purple-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-300 shadow-2xl disabled:opacity-70">
          {{ loading ? 'Đang cập nhật...' : 'CẬP NHẬT TRUYỆN' }}
        </button>
      </div>
    </form>
  </div>

  <div v-else class="text-center py-32">
    <p class="text-2xl text-gray-500">Đang tải thông tin truyện...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import storyService from "@/services/story.service";

const route = useRoute();
const router = useRouter();
const story = ref(null);
const loading = ref(false);

// Upload states
const uploadingCover = ref(false);
const uploadCoverSuccess = ref(false);
const uploadingImages = ref(false);
const uploadingVideo = ref(false);
const uploadVideoSuccess = ref(false);
const previewCover = ref('');

// Cloudinary config
const CLOUDINARY_CLOUD_NAME = 'dxqxcg9wr';
const CLOUDINARY_UPLOAD_PRESET = 'storynhutanh';

onMounted(async () => {
  try {
    const data = await storyService.get(route.params.id);
    story.value = data;
  } catch (err) {
    console.error("Lỗi tải truyện:", err);
    alert("Không thể tải thông tin truyện!");
    router.push("/stories");
  }
});

const genresInput = computed({
  get() {
    return story.value?.genres?.join(", ") || "";
  },
  set(value) {
    if (story.value) {
      story.value.genres = value.split(",").map(g => g.trim()).filter(g => g.length > 0);
    }
  },
});

// Upload ảnh bìa mới
const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  previewCover.value = URL.createObjectURL(file);
  uploadingCover.value = true;
  uploadCoverSuccess.value = false;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('resource_type', 'image');

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url && story.value) {
      story.value.coverImage = data.secure_url;
      previewCover.value = data.secure_url;
      uploadCoverSuccess.value = true;
    }
  } catch (err) {
    alert('Lỗi upload ảnh bìa: ' + err.message);
    previewCover.value = story.value?.coverImage || '';
  } finally {
    uploadingCover.value = false;
  }
};

// Thêm ảnh minh họa mới
const handleImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0 || !story.value) return;

  uploadingImages.value = true;

  for (const file of files) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', 'image');

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        story.value.images.push(data.secure_url);
      }
    } catch (err) {
      console.error('Lỗi upload ảnh minh họa:', err);
    }
  }

  uploadingImages.value = false;
};

// Upload video mới
const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file || !story.value) return;

  uploadingVideo.value = true;
  uploadVideoSuccess.value = false;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('resource_type', 'video');

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.secure_url) {
      story.value.videos.push(data.secure_url);
      uploadVideoSuccess.value = true;
    }
  } catch (err) {
    alert('Lỗi upload video: ' + err.message);
  } finally {
    uploadingVideo.value = false;
  }
};

const addVideoField = () => {
  if (story.value) story.value.videos.push("");
};

const removeVideo = (index) => {
  if (story.value) story.value.videos.splice(index, 1);
};

const removeImage = (index) => {
  if (story.value) story.value.images.splice(index, 1);
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : '';
};

const submit = async () => {
  if (!story.value?.title || !story.value?.author) {
    alert("Tiêu đề và Tác giả là bắt buộc!");
    return;
  }

  loading.value = true;
  try {
    await storyService.update(route.params.id, story.value);
    alert("Cập nhật truyện thành công! 🎉");
    router.push(`/stories/${route.params.id}`);
  } catch (err) {
    alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  @apply border-2 border-gray-300 rounded-xl px-5 py-4 focus:outline-none focus:border-purple-500 transition-colors text-lg;
}
.input:focus {
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.2);
}
</style>