<template>
  <div class="bg-gray-50 min-h-screen">
    <div v-if="story" class="relative h-[480px] overflow-hidden hidden lg:block">
      <div class="absolute inset-0 z-0">
        <template v-if="story.videos?.length && isYouTube(story.videos[0])">
          <iframe 
            :src="`https://www.youtube.com/embed/${getYouTubeID(story.videos[0])}?autoplay=1&mute=1&controls=0&loop=1&playlist=${getYouTubeID(story.videos[0])}&rel=0&showinfo=0&iv_load_policy=3`"
            class="w-full h-[180%] -translate-y-1/4 pointer-events-none opacity-40 grayscale-[30%]"
            frameborder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </template>
        <video 
          v-else-if="story.videos?.length"
          :src="story.videos[0]" 
          autoplay muted loop playsinline
          class="w-full h-full object-cover opacity-40 shadow-inner"
        ></video>
        <div 
          v-else
          class="absolute inset-0 bg-cover bg-center blur-3xl opacity-20 scale-110"
          :style="{ backgroundImage: `url(${story.coverImage})` }"
        ></div>
      </div>
      
      <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-50 z-1"></div>
    </div>

    <div v-if="story" class="max-w-7xl mx-auto px-4 sm:px-6 lg:-mt-80 relative z-20 pb-20">
      
      <nav class="py-4 text-sm text-white/90 hidden lg:flex items-center gap-2 mb-6 drop-shadow-md font-medium">
        <router-link to="/" class="hover:underline">Trang chủ</router-link>
        <span class="opacity-50">/</span>
        <router-link to="/stories" class="hover:underline">Thư viện</router-link>
        <span class="opacity-50">/</span>
        <span class="text-white font-bold">{{ story.title }}</span>
      </nav>

      <div class="grid lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-9 space-y-6">
          
          <div class="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div class="p-8 md:p-12">
              <div class="flex flex-col md:flex-row gap-12">
                
                <div class="flex-none mx-auto md:mx-0">
                  <div class="relative group w-64 h-[380px] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white transition-all duration-500 hover:rotate-2">
                    <img :src="story.coverImage" class="w-full h-full object-cover" :alt="story.title" />
                    <div v-if="story.isFeatured" class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg transform -rotate-12">HOT</div>
                    
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                       <button @click="openVideo(story.videos[0])" class="bg-white text-purple-600 p-5 rounded-full shadow-2xl transform scale-75 group-hover:scale-100 transition duration-300">
                          <i class="fas fa-play text-2xl ml-1"></i>
                       </button>
                    </div>
                  </div>
                  
                  <div class="mt-6 flex items-center justify-center gap-3 py-2 px-4 bg-gray-50 rounded-full">
                    <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping"></span>
                    <span class="text-xs font-black text-gray-600 uppercase tracking-tighter">Đang tiến hành</span>
                  </div>
                </div>

                <div class="flex-grow space-y-6">
                  <h1 class="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] uppercase tracking-tighter">
                    {{ story.title }}
                  </h1>
                  
                  <div class="flex flex-wrap items-center gap-8">
                    <div class="flex flex-col border-l-4 border-purple-500 pl-4">
                      <span class="text-gray-400 text-[10px] uppercase font-black">Tác giả</span>
                      <span class="font-bold text-xl text-purple-700">{{ story.author }}</span>
                    </div>
                    <div class="flex flex-col border-l-4 border-yellow-500 pl-4">
                      <span class="text-gray-400 text-[10px] uppercase font-black">Đánh giá</span>
                      <span class="font-bold text-xl text-yellow-500">★ {{ story.rating || '5.0' }}</span>
                    </div>
                    <div class="flex flex-col border-l-4 border-indigo-500 pl-4">
                      <span class="text-gray-400 text-[10px] uppercase font-black">Lượt xem</span>
                      <span class="font-bold text-xl">{{ story.views?.toLocaleString() || 0 }}</span>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 pt-2">
                    <span v-for="genre in story.genres" :key="genre" 
                      class="px-5 py-2 bg-purple-50 hover:bg-purple-600 hover:text-white rounded-xl text-xs font-bold text-purple-700 transition-all cursor-pointer border border-purple-100 shadow-sm">
                      {{ genre }}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-4 pt-6">
                    <button class="px-12 py-5 bg-gradient-to-r from-purple-600 to-indigo-800 text-white rounded-2xl font-black shadow-[0_15px_30px_rgba(79,70,229,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm">
                      Đọc từ đầu
                    </button>
                    <button class="px-8 py-5 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all text-sm uppercase">
                      <i class="far fa-heart mr-2"></i> Yêu thích
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-16 pt-10 border-t border-gray-100 relative">
                <h3 class="text-2xl font-black text-gray-800 mb-8 uppercase tracking-tighter">
                  Sơ lược cốt truyện
                </h3>
                <div class="text-gray-600 leading-[1.8] text-lg whitespace-pre-line relative z-10">
                  {{ story.description || 'Nội dung bộ truyện này đang được đội ngũ biên tập cập nhật.' }}
                </div>
                <div class="absolute -bottom-4 right-0 text-9xl font-black text-gray-50/50 select-none z-0 uppercase leading-none">STORY</div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-8 border-b bg-gray-50/30 flex justify-between items-center">
              <h3 class="font-black text-gray-800 uppercase tracking-widest flex items-center gap-3 text-lg">
                <i class="fas fa-list-ol text-purple-600"></i> Mục lục chương
              </h3>
              <span class="text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase">Mới cập nhật</span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 p-8 max-h-[600px] overflow-y-auto custom-scrollbar">
              <div v-for="i in 40" :key="i" class="flex justify-between items-center py-4 border-b border-gray-50 hover:bg-purple-50/50 px-4 rounded-xl transition-all group cursor-pointer">
                <div class="flex items-center gap-4 overflow-hidden">
                  <span class="text-xs font-black text-gray-300 group-hover:text-purple-400">#{{ i }}</span>
                  <span class="text-sm font-bold text-gray-700 group-hover:text-purple-700 truncate transition-colors">Chương {{ i }}: Tên chương truyện mới nhất</span>
                </div>
                <span class="text-[10px] font-bold text-gray-400 uppercase flex-none">12/2025</span>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-8">
          
          <div class="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 group">
            <h4 class="text-[10px] font-black mb-6 text-gray-400 uppercase tracking-[0.2em] border-b pb-2">Hệ thống</h4>
            <div class="space-y-3">
              <router-link :to="`/stories/edit/${story._id}`" class="flex items-center justify-center gap-3 w-full py-4 bg-amber-50 text-amber-700 rounded-2xl font-black hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                <i class="fas fa-pen-nib"></i> Chỉnh sửa
              </router-link>
              <button @click="deleteStory" class="flex items-center justify-center gap-3 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <i class="fas fa-trash-alt"></i> Xóa truyện
              </button>
            </div>
          </div>

          <div v-if="story.images?.length" class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            <h4 class="font-black text-gray-800 mb-6 uppercase text-xs tracking-widest border-l-4 border-purple-600 pl-3">Gallary</h4>
            <div class="grid grid-cols-2 gap-3">
               <img v-for="img in story.images.slice(0, 4)" :key="img" :src="img" class="w-full h-24 object-cover rounded-2xl border border-gray-100 hover:scale-105 transition-all cursor-zoom-in shadow-md">
            </div>
          </div>

          <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
            <h4 class="font-black text-gray-800 mb-8 uppercase text-xs tracking-widest border-l-4 border-purple-600 pl-3">Đề xuất</h4>
            <div class="space-y-8">
              <div v-for="i in 5" :key="i" class="flex gap-4 group cursor-pointer">
                <div class="w-16 h-20 bg-gray-100 rounded-xl overflow-hidden flex-none shadow-lg">
                   <img :src="`https://via.placeholder.com/150x200?text=Top+${i}`" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                </div>
                <div class="flex flex-col justify-center overflow-hidden">
                  <h5 class="text-sm font-black text-gray-800 line-clamp-2 leading-snug group-hover:text-purple-600 transition-colors uppercase tracking-tighter">Legendary Return {{ i }}</h5>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-[9px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded">Action</span>
                    <span class="text-[9px] font-black text-purple-400 uppercase">1.2M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    
    <div v-else class="flex flex-col items-center justify-center min-h-screen py-20 px-4 text-center bg-white">
       <h2 class="text-8xl font-black text-gray-100 mb-4 select-none">404</h2>
       <h3 class="text-2xl font-black text-gray-800 uppercase tracking-widest">Không tìm thấy truyện</h3>
       <router-link to="/stories" class="mt-8 px-10 py-4 bg-purple-600 text-white rounded-2xl font-black shadow-2xl uppercase text-xs">Về thư viện</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import storyService from "@/services/story.service";

const route = useRoute();
const router = useRouter();
const story = ref(null);

const deleteStory = async () => {
  if (confirm("Gỡ bỏ truyện này vĩnh viễn?")) {
    try {
      await storyService.delete(story.value._id);
      router.push("/stories");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  }
};

const isYouTube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));

const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const openVideo = (url) => {
  if (isYouTube(url)) {
    const id = getYouTubeID(url);
    window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
  } else {
    window.open(url, '_blank');
  }
};

onMounted(async () => {
  try {
    const data = await storyService.get(route.params.id);
    story.value = data;
    document.title = story.value.title + " | Thư Viện 2025";
  } catch (err) {
    console.error(err);
    story.value = null;
  }
});
</script>

<style scoped>
/* Scrollbar mảnh đẹp */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a855f7; }

/* Giới hạn dòng tiêu đề */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Xử lý iframe video background chuyên nghiệp */
iframe {
  pointer-events: none;
  filter: brightness(0.6) contrast(1.1);
  transform: scale(1.3); /* Phóng to để ẩn viền đen YouTube */
}

/* Hiệu ứng bóng chữ cho text trắng trên video */
.drop-shadow-md {
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);
}
</style>