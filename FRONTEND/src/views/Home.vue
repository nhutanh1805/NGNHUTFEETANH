<template>
  <div class="min-h-screen bg-light">

    <!-- NÚT DỪNG / CHẠY TẤT CẢ VIDEO -->
    <div class="video-control-global">
      <button class="btn btn-dark rounded-pill px-4 py-2 fw-bold"
              @click="toggleAllVideos">
        {{ allPlaying ? "⏸ Dừng tất cả video" : "▶ Phát tất cả video" }}
      </button>
    </div>

    <!-- Hero Section -->
    <section class="bg-gradient-mystic text-white position-relative overflow-hidden py-5">
      <div class="bg-dark opacity-60 position-absolute top-0 start-0 w-100 h-100"></div>
      <div class="container position-relative py-5">
        <div class="row justify-content-center text-center py-5">
          <div class="col-lg-10">
            <h1 class="display-3 fw-bold mb-4">
              Thư Viện Truyện 2025
            </h1>
            <p class="lead fs-3 mb-5 opacity-90">
              Fantasy • Thần thoại • Hành động • Những câu chuyện huyền thoại bất tận
            </p>
            <div class="d-flex flex-column flex-sm-row gap-4 justify-content-center">
              <router-link to="/stories"
                class="btn btn-light btn-lg px-5 py-4 rounded-pill fw-bold">
                ĐỌC NGAY
              </router-link>
              <router-link to="/stories"
                class="btn btn-outline-light btn-lg px-5 py-4 rounded-pill fw-bold">
                Khám phá tất cả truyện
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Genres -->
    <section class="py-5 bg-white">
      <div class="container py-5">
        <h2 class="text-center fw-bold mb-5">Thể loại nổi bật</h2>
        <div class="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-4 text-center">
          <div class="col"><div class="genre-icon bg-fantasy mx-auto mb-2"></div>Fantasy</div>
          <div class="col"><div class="genre-icon bg-action mx-auto mb-2"></div>Action</div>
          <div class="col"><div class="genre-icon bg-myth mx-auto mb-2"></div>Thần thoại</div>
          <div class="col"><div class="genre-icon bg-adventure mx-auto mb-2"></div>Phiêu lưu</div>
          <div class="col"><div class="genre-icon bg-romance mx-auto mb-2"></div>Lãng mạn</div>
          <div class="col"><div class="genre-icon bg-scifi mx-auto mb-2"></div>Sci-Fi</div>
        </div>
      </div>
    </section>

    <!-- VIDEO BANNER LỚN -->
    <section class="py-5 bg-dark text-white">
      <div class="container text-center">
        <h2 class="fw-bold mb-4">
          Siêu phẩm truyện mới 2025 đã cập bến!
        </h2>

        <video
          ref="mainVideoRef"
          class="img-fluid rounded-4 shadow-lg"
          autoplay
          muted
          loop
          style="max-height:600px;width:100%;object-fit:cover"
        >
          <source :src="mainVideo" type="video/mp4" />
        </video>

        <p class="mt-3 text-muted">
          Trailer giới thiệu những bộ truyện hot nhất năm 2025
        </p>
      </div>
    </section>

    <!-- 8 VIDEO BANNER NHỎ -->
    <section class="py-5 bg-gray-900">
      <div class="container">
        <h3 class="text-center text-white fw-bold mb-4">
          Trailer truyện nổi bật
        </h3>

        <div class="row g-4">
          <div
            v-for="(video, index) in miniVideos"
            :key="index"
            class="col-6 col-md-3"
          >
            <div class="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg hover-scale">
              <video
                :ref="el => miniVideoRefs[index] = el"
                :src="video"
                autoplay
                muted
                loop
                playsinline
                class="w-100 h-100 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Stories -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-bold mb-4">
          Truyện nổi bật & Đọc nhiều nhất
        </h2>

        <div class="d-flex gap-3 overflow-auto pb-3">
          <div
            v-for="story in featuredStories"
            :key="story._id"
            style="width:112px"
          >
            <router-link :to="`/stories/${story._id}`">
              <img :src="smallCover(story.coverImage)" class="rounded w-100" />
              <p class="small fw-bold mt-1 line-clamp-2">
                {{ story.title }}
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import storyService from "@/services/story.service";

/* video assets */
import mainVideo from "@/assets/videos/Bannerchinh.mp4";
import v1 from "@/assets/videos/Banner1.mp4";
import v2 from "@/assets/videos/Banner2.mp4";
import v3 from "@/assets/videos/Banner3.mp4";
import v4 from "@/assets/videos/Banner4.mp4";
import v5 from "@/assets/videos/Banner5.mp4";
import v6 from "@/assets/videos/Banner6.mp4";
import v7 from "@/assets/videos/Banner7.mp4";
import v8 from "@/assets/videos/Banner8.mp4";

const miniVideos = [v1, v2, v3, v4, v5, v6, v7, v8];

const mainVideoRef = ref(null);
const miniVideoRefs = ref([]);
const allPlaying = ref(true);

const toggleAllVideos = () => {
  const videos = [
    mainVideoRef.value,
    ...miniVideoRefs.value
  ].filter(Boolean);

  if (allPlaying.value) {
    videos.forEach(v => v.pause());
  } else {
    videos.forEach(v => v.play());
  }

  allPlaying.value = !allPlaying.value;
};

const featuredStories = ref([]);

const smallCover = (url) => {
  if (!url) return "https://via.placeholder.com/112x160";
  if (url.includes("cloudinary"))
    return url.replace(
      "/upload/",
      "/upload/c_fill,w_112,h_160,q_auto,f_auto/"
    );
  return url;
};

onMounted(async () => {
  const res = await storyService.getFeatured({ limit: 20 });
  featuredStories.value = res.stories || [];
});
</script>

<style scoped>
.video-control-global {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}

.bg-gradient-mystic {
  background: linear-gradient(135deg,#6b46c1,#4c1d95,#2d1145);
}
.genre-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.bg-fantasy { background: linear-gradient(135deg,#ff9a9e,#fad0c4); }
.bg-action { background: linear-gradient(135deg,#a8edea,#fed6e3); }
.bg-myth { background: linear-gradient(135deg,#ffecd2,#fcb69f); }
.bg-adventure { background: linear-gradient(135deg,#d299c2,#fef9d7); }
.bg-romance { background: linear-gradient(135deg,#84fab0,#8fd3f4); }
.bg-scifi { background: linear-gradient(135deg,#a1c4fd,#c2e9fb); }

.hover-scale {
  transition: transform .3s, box-shadow .3s;
}
.hover-scale:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 40px rgba(0,0,0,.5);
}
.object-cover { object-fit: cover; }
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
