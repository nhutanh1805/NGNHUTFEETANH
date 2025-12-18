<!-- src/views/story/StoryList.vue -->
<template>
  <div class="stories-page py-8 min-h-screen bg-gradient-to-b from-purple-50 to-white">
    <div class="container mx-auto px-4 max-w-7xl">

      <!-- Hero Box -->
      <div class="hero-box text-center text-white py-10 mb-8 rounded-3xl shadow-2xl bg-gradient-to-r from-purple-600 to-indigo-700">
        <h2 class="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Quản lý thư viện truyện
        </h2>
        <p class="text-2xl font-light opacity-90">
          Fantasy – Thần thoại – Hành động – Những câu chuyện huyền thoại bất tận
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-8">

        <!-- Cột trái: Danh sách + tìm kiếm + nút chức năng -->
        <div class="lg:col-span-5">
          <div class="bg-white rounded-3xl shadow-xl p-6 sticky top-6">

            <!-- Ô tìm kiếm -->
            <InputSearch v-model="searchText" @submit="refreshList" class="mb-6" />

            <h4 class="text-2xl font-bold text-purple-600 mb-6">
              Danh sách truyện ({{ filteredStoriesCount }})
            </h4>

            <!-- Danh sách truyện dạng grid nhỏ gọn -->
            <div v-if="filteredStoriesCount > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
              <div
                v-for="(story, index) in filteredStories"
                :key="story._id"
                @click="activeIndex = index"
                class="flex flex-col gap-3 p-3 rounded-2xl cursor-pointer transition-all border-2 hover:shadow-lg"
                :class="[
                  activeIndex === index
                    ? 'bg-purple-100 border-purple-500 shadow-xl'
                    : 'bg-gray-50 border-transparent hover:bg-gray-100'
                ]"
              >
                <!-- Ảnh thumbnail nhỏ từ Cloudinary -->
                <img
                  :src="tinyCover(story.coverImage)"
                  class="w-full h-32 object-cover rounded-xl shadow-md"
                  alt="Cover"
                />
                <div class="flex-1 min-w-0 text-center">
                  <h5 class="font-bold text-sm text-gray-800 line-clamp-2">
                    {{ story.title }}
                  </h5>
                  <p class="text-xs text-gray-600 mt-1">
                    {{ story.author }}
                  </p>
                  <div class="flex flex-col items-center mt-2 text-xs">
                    <span class="text-purple-600 font-semibold">
                      {{ story.views?.toLocaleString() || 0 }} lượt xem
                    </span>
                    <span
                      class="mt-1 px-3 py-1 text-xs font-medium rounded-full"
                      :class="story.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'"
                    >
                      {{ story.status === 'published' ? 'Đã xuất bản' : 'Nháp' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p v-else class="text-center text-gray-500 py-10 italic">
              Không có truyện nào khớp với tìm kiếm
            </p>

            <!-- Các nút chức năng -->
            <div class="flex flex-wrap gap-3 mt-8 justify-center">
              <button @click="refreshList" class="btn btn-primary">
                Làm mới
              </button>
              <router-link to="/stories/add" class="btn btn-success">
                Thêm truyện mới
              </router-link>
              <button @click="removeAllStories" class="btn btn-danger">
                Xóa tất cả
              </button>
            </div>
          </div>
        </div>

        <!-- Cột phải: Chi tiết truyện -->
        <div class="lg:col-span-7" v-if="activeStory">
          <div class="bg-white rounded-3xl shadow-2xl p-8">
            <h4 class="text-3xl font-bold text-purple-600 mb-6">
              Chi tiết truyện
            </h4>

            <div class="grid md:grid-cols-2 gap-8">
              <!-- Ảnh lớn (giữ chất lượng cao) -->
              <div>
                <img
                  :src="activeStory.coverImage || 'https://via.placeholder.com/600x900?text=No+Cover'"
                  class="w-full max-w-md mx-auto rounded-2xl shadow-2xl object-cover"
                  alt="Cover"
                />
              </div>

              <!-- Thông tin -->
              <div class="space-y-5">
                <h2 class="text-3xl font-extrabold text-gray-800">
                  {{ activeStory.title }}
                </h2>

                <p class="text-xl text-gray-600">
                  Tác giả: <span class="font-bold">{{ activeStory.author }}</span>
                </p>

                <div class="flex items-center gap-6 text-lg">
                  <div class="flex items-center gap-2">
                    <span class="text-yellow-500 text-2xl">★</span>
                    <span class="font-bold text-xl">{{ activeStory.rating || 'Chưa có' }}</span>
                  </div>
                  <span class="text-purple-600 font-bold text-xl">
                    {{ activeStory.views?.toLocaleString() || 0 }} lượt xem
                  </span>
                </div>

                <div class="space-y-3 text-lg">
                  <p><strong>Thể loại:</strong> {{ activeStory.genres?.join(', ') || 'Chưa có' }}</p>
                  <p><strong>Số chương:</strong> {{ activeStory.chaptersCount || 0 }} chương</p>
                  <p><strong>Trạng thái:</strong> 
                    <span class="font-bold" :class="activeStory.status === 'published' ? 'text-green-600' : 'text-orange-600'">
                      {{ activeStory.status === 'published' ? 'Đã xuất bản' : 'Nháp' }}
                    </span>
                  </p>
                  <p><strong>Nổi bật:</strong> <span class="font-bold">{{ activeStory.isFeatured ? 'Có' : 'Không' }}</span></p>
                </div>

                <div class="flex gap-4 mt-8">
                  <router-link
                    :to="`/stories/edit/${activeStory._id}`"
                    class="btn btn-warning flex-1 text-center"
                  >
                    Chỉnh sửa
                  </router-link>
                  <router-link
                    :to="`/stories/${activeStory._id}`"
                    class="btn btn-primary flex-1 text-center"
                  >
                    Đọc truyện
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Mô tả truyện -->
            <div class="mt-10 bg-gray-50 rounded-2xl p-6">
              <h3 class="text-2xl font-bold mb-4 text-gray-800">Tóm tắt nội dung</h3>
              <p class="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {{ activeStory.description || 'Chưa có mô tả.' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Nếu chưa chọn truyện nào -->
        <div v-else class="lg:col-span-7 flex items-center justify-center">
          <p class="text-2xl text-gray-400 italic">
            Chọn một truyện bên trái để xem chi tiết
          </p>
        </div>
      </div>

      <!-- Nút về trang chủ -->
      <div class="text-center mt-12">
        <router-link to="/" class="btn btn-outline-primary text-xl px-10 py-4">
          Quay về Trang chủ
        </router-link>
        <p class="text-gray-600 mt-4 text-lg italic">
          “Trong thế giới của những trang sách, mọi giấc mơ đều có thể trở thành hiện thực.”
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import storyService from "@/services/story.service";
import InputSearch from "@/components/InputSearch.vue";

const router = useRouter();
const stories = ref([]);
const searchText = ref("");
const activeIndex = ref(-1);

// Hàm resize ảnh Cloudinary cho danh sách (thumbnail nhỏ gọn)
const tinyCover = (url) => {
  if (!url) {
    return 'https://via.placeholder.com/120x180?text=No+Cover';
  }
  if (url.includes('res.cloudinary.com')) {
    // Resize thành 120x180px - nhỏ gọn, load nhanh, vẫn rõ nét
    return url.replace('/upload/', '/upload/c_fill,w_120,h_180,g_auto,q_auto:best,f_auto/');
  }
  return url;
};

onMounted(() => {
  refreshList();
});

const refreshList = async () => {
  try {
    const res = await storyService.getAll();
    stories.value = res.stories || res;
    activeIndex.value = -1;
  } catch (err) {
    console.error(err);
    alert("Lỗi tải danh sách truyện!");
  }
};

const removeAllStories = async () => {
  if (confirm("Bạn có chắc muốn xóa TẤT CẢ truyện? (soft delete)")) {
    await storyService.deleteAll();
    refreshList();
  }
};

const storyStrings = computed(() => {
  return stories.value.map(s => 
    `${s.title}${s.author}${s.description}${s.genres?.join('') || ''}`.toLowerCase()
  );
});

const filteredStories = computed(() => {
  if (!searchText.value.trim()) return stories.value;
  return stories.value.filter((_, i) =>
    storyStrings.value[i].includes(searchText.value.toLowerCase())
  );
});

const filteredStoriesCount = computed(() => filteredStories.value.length);

const activeStory = computed(() => 
  activeIndex.value >= 0 ? filteredStories.value[activeIndex.value] : null
);
</script>

<style scoped>
.stories-page { font-family: 'Poppins', sans-serif; }
.hero-box { background: linear-gradient(135deg, #7c3aed, #4f46e5); }
.btn {
  @apply px-5 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:-translate-y-1;
}
.btn-primary { @apply bg-purple-600 text-white hover:bg-purple-700; }
.btn-success { @apply bg-green-600 text-white hover:bg-green-700; }
.btn-danger { @apply bg-red-600 text-white hover:bg-red-700; }
.btn-warning { @apply bg-yellow-500 text-white hover:bg-yellow-600; }
.btn-outline-primary { @apply border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white; }
.line-clamp-2 { 
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.drop-shadow-lg {
  text-shadow: 0 4px 8px rgba(0,0,0,0.6);
}
</style>