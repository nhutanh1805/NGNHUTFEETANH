<!-- src/views/story/StoryAdd.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 py-12 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-4">
          Thêm Truyện Mới Vào Thư Viện
        </h1>
        <p class="text-xl text-gray-600 font-medium">Bắt đầu hành trình sáng tạo của bạn ngay hôm nay ✨</p>
      </div>

      <div class="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-purple-200">
        <form @submit.prevent="submit" class="p-8 lg:p-12 space-y-12">
          <!-- Phần cơ bản - Gradient header -->
          <div class="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 text-white -m-8 mb-8">
            <h2 class="text-3xl font-bold mb-2">Thông tin cơ bản</h2>
            <p class="opacity-90">Những trường bắt buộc để tạo truyện</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label class="block text-lg font-bold text-gray-800 mb-3">Tiêu đề truyện <span class="text-red-500">*</span></label>
              <input v-model="form.title" type="text" placeholder="Ví dụ: Kỷ Nguyên Thần Thoại" required class="input w-full" />
            </div>

            <div>
              <label class="block text-lg font-bold text-gray-800 mb-3">Slug (URL thân thiện)</label>
              <input v-model="form.slug" type="text" placeholder="ky-nguyen-than-thoai" class="input w-full" />
              <p class="text-sm text-gray-500 mt-2">Để trống để tự động tạo từ tiêu đề</p>
            </div>

            <div>
              <label class="block text-lg font-bold text-gray-800 mb-3">Tác giả <span class="text-red-500">*</span></label>
              <input v-model="form.author" type="text" placeholder="Ví dụ: Minh Khôi" required class="input w-full" />
            </div>

            <div class="flex items-center gap-6">
              <div class="flex-1">
                <label class="block text-lg font-bold text-gray-800 mb-3">Trạng thái</label>
                <select v-model="form.status" class="input w-full">
                  <option value="draft">Nháp (Draft)</option>
                  <option value="published">Đã xuất bản</option>
                </select>
              </div>
              <div class="flex items-end">
                <div class="flex items-center gap-4 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 rounded-2xl shadow-md">
                  <input v-model="form.isFeatured" type="checkbox" id="featured" class="w-8 h-8 text-orange-600 rounded-lg focus:ring-orange-500" />
                  <label for="featured" class="text-lg font-bold text-orange-700 cursor-pointer">Truyện nổi bật 🔥</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Ảnh bìa - Nổi bật -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <label class="block text-2xl font-bold text-gray-800 mb-6">Ảnh bìa truyện</label>

              <div v-if="previewCover" class="mb-8 relative">
                <img :src="previewCover" class="w-full rounded-3xl shadow-2xl object-cover border-8 border-purple-200" alt="Preview ảnh bìa" />
                <div class="absolute inset-0 rounded-3xl ring-4 ring-purple-400 ring-inset opacity-50"></div>
              </div>

              <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border-4 border-dashed border-purple-300">
                <p class="text-xl font-bold text-purple-800 mb-6 text-center">🎨 Upload ảnh bìa lên Cloudinary</p>
                <input type="file" accept="image/*" @change="handleCoverUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-purple-600 file:to-indigo-700 file:text-white hover:file:from-purple-700 hover:file:to-indigo-800 cursor-pointer" />
                <p v-if="uploadingCover" class="mt-6 text-purple-600 font-bold text-xl text-center">Đang upload... ⏳</p>
                <p v-if="uploadCoverSuccess" class="mt-6 text-green-600 font-bold text-2xl text-center">✓ Thành công!</p>
              </div>

              <div class="mt-6">
                <label class="block text-sm font-medium text-gray-600 mb-2">Hoặc dán link ảnh bìa</label>
                <input v-model="form.coverImage" type="url" placeholder="https://res.cloudinary.com/..." class="input w-full" />
              </div>
            </div>

            <!-- Thể loại -->
            <div>
              <label class="block text-2xl font-bold text-gray-800 mb-6">Thể loại truyện</label>
              <input v-model="genresInput" type="text" placeholder="Fantasy, Action, Thần thoại, Huyền huyễn..." class="input w-full text-lg" />
              <div v-if="form.genres.length" class="mt-6 flex flex-wrap gap-3">
                <span v-for="genre in form.genres" :key="genre" class="inline-block bg-gradient-to-r from-indigo-200 to-purple-200 text-purple-900 px-6 py-3 rounded-full text-base font-bold shadow-md hover:shadow-lg transition">
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>

          <!-- Mô tả -->
          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-10 shadow-xl">
            <label class="block text-2xl font-bold text-gray-800 mb-6">Mô tả / Tóm tắt truyện</label>
            <textarea v-model="form.description" rows="8" placeholder="Viết giới thiệu thật hấp dẫn để thu hút độc giả..." class="input w-full resize-none text-lg"></textarea>
          </div>

          <!-- Nội dung chính -->
          <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-10 shadow-xl">
            <label class="block text-2xl font-bold text-gray-800 mb-6">Nội dung chính truyện (Content)</label>
            <textarea
              v-model="form.content"
              rows="14"
              placeholder="Viết toàn bộ nội dung truyện tại đây (hỗ trợ HTML cơ bản như <p>, <h2>, <strong>, <em>...)"
              class="input w-full resize-vertical font-mono text-base bg-white/70"
            ></textarea>
            <p class="text-sm text-gray-600 mt-3">Nếu bạn dùng hệ thống chương riêng thì có thể để trống phần này.</p>
          </div>

          <!-- Ảnh minh họa -->
          <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-10 shadow-xl">
            <label class="block text-2xl font-bold text-gray-800 mb-6">Ảnh minh họa trong truyện</label>
            <p class="text-gray-700 mb-6">Thêm banner, nhân vật, cảnh quan để truyện sinh động hơn</p>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div v-for="(url, index) in form.images" :key="index" class="relative group rounded-2xl overflow-hidden shadow-xl">
                <img :src="url" class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" alt="Ảnh minh họa" />
                <button @click="removeImage(index)" type="button" class="absolute top-3 right-3 bg-red-600 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center hover:bg-red-700 text-xl font-bold">
                  ×
                </button>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-8 border-4 border-dashed border-emerald-400">
              <p class="text-xl font-bold text-emerald-800 mb-6 text-center">🖼️ Upload ảnh minh họa</p>
              <input type="file" accept="image/*" multiple @change="handleImagesUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-emerald-600 file:to-teal-700 file:text-white hover:file:from-emerald-700 hover:file:to-teal-800 cursor-pointer" />
              <p v-if="uploadingImages" class="mt-6 text-emerald-600 font-bold text-xl text-center">Đang upload... ⏳</p>
            </div>
          </div>

          <!-- Video -->
          <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-10 shadow-xl">
            <label class="block text-2xl font-bold text-gray-800 mb-6">Video liên quan (Trailer, AMV...)</label>

            <div class="space-y-8 mb-8">
              <div v-for="(video, index) in form.videos" :key="index" class="bg-white rounded-2xl p-6 shadow-lg border border-cyan-200">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-lg font-bold text-cyan-800">Video {{ index + 1 }}</span>
                  <button @click="removeVideo(index)" type="button" class="text-red-600 hover:text-red-800 font-bold text-lg">Xóa</button>
                </div>

                <video v-if="video.url && video.url.includes('cloudinary.com') && video.url.endsWith('.mp4')" controls class="w-full rounded-xl shadow-md mb-4">
                  <source :src="video.url" type="video/mp4">
                </video>

                <div v-else-if="video.url && video.url.includes('youtube.com')" class="aspect-video mb-4">
                  <iframe :src="getYouTubeEmbedUrl(video.url)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full h-full rounded-xl"></iframe>
                </div>

                <input v-model="video.url" type="url" placeholder="Dán link YouTube hoặc Cloudinary video" class="input w-full" />
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <button @click="addVideoField" type="button" class="px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition">
                + Thêm link video thủ công
              </button>

              <div class="bg-white rounded-2xl p-8 border-4 border-dashed border-blue-400">
                <p class="text-xl font-bold text-blue-800 mb-6 text-center">🎬 Upload video từ máy</p>
                <input type="file" accept="video/mp4,video/webm" @change="handleVideoUpload" class="block w-full text-sm text-gray-700 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-600 file:to-cyan-700 file:text-white hover:file:from-blue-700 hover:file:to-cyan-800 cursor-pointer" />
                <p v-if="uploadingVideo" class="mt-6 text-blue-600 font-bold text-xl text-center">Đang upload video... ⏳</p>
                <p v-if="uploadVideoSuccess" class="mt-6 text-green-600 font-bold text-2xl text-center">✓ Thành công!</p>
              </div>
            </div>
          </div>

          <!-- Các trường số -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-3xl p-10 shadow-xl">
            <div>
              <label class="block text-xl font-bold text-gray-800 mb-4">Đánh giá ban đầu</label>
              <input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" placeholder="4.8" class="input w-full text-lg" />
            </div>
            <div>
              <label class="block text-xl font-bold text-gray-800 mb-4">Số lượt xem ban đầu</label>
              <input v-model.number="form.views" type="number" min="0" placeholder="2500" class="input w-full text-lg" />
            </div>
            <div>
              <label class="block text-xl font-bold text-gray-800 mb-4">Số chương hiện tại</label>
              <input v-model.number="form.chaptersCount" type="number" min="0" placeholder="5" class="input w-full text-lg" />
            </div>
          </div>

          <!-- Nút submit siêu đẹp -->
          <div class="text-center pt-12">
            <button type="submit" :disabled="loading" class="px-24 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-700 text-white text-4xl font-black rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition-all duration-500 disabled:opacity-70 disabled:scale-100">
              <span v-if="loading">Đang thêm truyện... ✨</span>
              <span v-else>THÊM TRUYỆN MỚI 🚀</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useRouter } from "vue-router";
import storyService from "@/services/story.service";

const router = useRouter();
const loading = ref(false);

const uploadingCover = ref(false);
const uploadCoverSuccess = ref(false);
const uploadingImages = ref(false);
const uploadingVideo = ref(false);
const uploadVideoSuccess = ref(false);
const previewCover = ref('');

const CLOUDINARY_CLOUD_NAME = 'dxqxcg9wr';
const CLOUDINARY_UPLOAD_PRESET = 'storynhutanh';

const form = reactive({
  title: "",
  slug: "",
  author: "",
  description: "",
  content: "",
  coverImage: "",
  images: [],
  videos: [],
  genres: [],
  rating: null,
  views: 0,
  chaptersCount: 0,
  status: "draft",
  isFeatured: false,
});

const genresInput = computed({
  get() {
    return form.genres.join(", ");
  },
  set(value) {
    form.genres = value.split(",").map(g => g.trim()).filter(g => g.length > 0);
  },
});

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
    if (data.secure_url) {
      form.coverImage = data.secure_url;
      previewCover.value = data.secure_url;
      uploadCoverSuccess.value = true;
    }
  } catch (err) {
    alert('Lỗi upload ảnh bìa: ' + err.message);
    previewCover.value = '';
  } finally {
    uploadingCover.value = false;
  }
};

const handleImagesUpload = async (event) => {
  const files = Array.from(event.target.files);
  if (files.length === 0) return;

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
        form.images.push(data.secure_url);
      }
    } catch (err) {
      console.error('Lỗi upload ảnh minh họa:', err);
    }
  }

  uploadingImages.value = false;
};

const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

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
      form.videos.push(data.secure_url);
      uploadVideoSuccess.value = true;
    }
  } catch (err) {
    alert('Lỗi upload video: ' + err.message);
  } finally {
    uploadingVideo.value = false;
  }
};

const addVideoField = () => {
  form.videos.push("");
};

const removeVideo = (index) => {
  form.videos.splice(index, 1);
};

const removeImage = (index) => {
  form.images.splice(index, 1);
};

const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : '';
};

const submit = async () => {
  if (!form.title || !form.author) {
    alert("Tiêu đề và Tác giả là bắt buộc!");
    return;
  }

  loading.value = true;
  try {
    await storyService.create(form);
    alert("Thêm truyện thành công! 🎉");
    router.push("/stories");
  } catch (err) {
    alert("Lỗi khi thêm truyện: " + (err.response?.data?.message || err.message));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.input {
  @apply border-2 border-gray-300 rounded-2xl px-6 py-5 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all text-lg font-medium;
}
</style>