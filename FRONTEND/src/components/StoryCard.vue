<!-- src/components/StoryCard.vue -->
<template>
  <div class="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group relative">
    <router-link :to="`/stories/${story._id}`" class="block">
      <div class="relative overflow-hidden">
        <img
          :src="story.coverImage || 'https://via.placeholder.com/300x450/2e1065/ffffff?text=No+Cover'"
          :alt="story.title"
          class="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <!-- Overlay gradient khi hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <!-- Badge nổi bật -->
        <div v-if="story.isFeatured"
             class="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-xl flex items-center gap-2">
          <span class="text-lg">✨</span> NỔI BẬT
        </div>

        <!-- Badge trạng thái -->
        <div class="absolute top-4 right-4 px-4 py-2 rounded-full text-white text-sm font-bold shadow-lg"
             :class="story.status === 'published' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'">
          {{ story.status === 'published' ? 'ĐÃ XUẤT BẢN' : 'NHÁP' }}
        </div>
      </div>

      <div class="p-7 space-y-5">
        <!-- Tiêu đề -->
        <h3 class="text-2xl font-extrabold text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">
          {{ story.title }}
        </h3>

        <!-- Tác giả -->
        <p class="text-lg text-gray-600">
          Tác giả: <span class="font-bold text-purple-700">{{ story.author }}</span>
        </p>

        <!-- Thể loại -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="genre in story.genres"
            :key="genre"
            class="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm"
          >
            {{ genre }}
          </span>
        </div>

        <!-- Thống kê -->
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="text-yellow-500 text-2xl">★</span>
              <span class="font-bold text-gray-800 text-lg">{{ story.rating || 'Chưa có' }}</span>
            </div>
            <span class="text-gray-500">•</span>
            <span class="font-medium text-gray-700">{{ story.chaptersCount || 0 }} chương</span>
          </div>
          <div class="text-right">
            <p class="font-bold text-purple-700 text-lg">{{ story.views?.toLocaleString() || 0 }}</p>
            <p class="text-sm text-gray-500">lượt xem</p>
          </div>
        </div>

        <!-- Nút xem chi tiết -->
        <div class="pt-4">
          <div class="bg-gradient-to-r from-purple-600 to-indigo-700 text-white text-center py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            XEM CHI TIẾT
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style> chỉnh sửa cái này cho xịn và đẹp hơn 