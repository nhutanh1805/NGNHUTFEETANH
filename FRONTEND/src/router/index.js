// src/router/index.js
import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"), // Có thể dùng để hiển thị truyện nổi bật
  },

  // ==================== STORY ROUTES ====================
  {
    path: "/stories",
    name: "story.list",
    component: () => import("@/views/story/StoryList.vue"),
  },
  {
    path: "/stories/add",
    name: "story.add",
    component: () => import("@/views/story/StoryAdd.vue"),
  },
  {
    path: "/stories/:id",
    name: "story.detail",
    component: () => import("@/views/story/StoryDetail.vue"),
    props: true,
  },
  {
    path: "/stories/edit/:id",
    name: "story.edit",
    component: () => import("@/views/story/StoryEdit.vue"),
    props: true,
  },

  // Bonus: Route đọc truyện theo slug (đẹp cho SEO và chia sẻ)
  // Ví dụ: /truyen/ky-nguyen-than-thoai
  // {
  //   path: "/truyen/:slug",
  //   name: "story.read-by-slug",
  //   component: () => import("@/views/story/StoryDetail.vue"),
  //   props: route => ({ slug: route.params.slug }),
  // },

  // Bonus: Trang danh sách truyện đã xuất bản (public view)
  // {
  //   path: "/truyen",
  //   name: "story.public-list",
  //   component: () => import("@/views/story/PublicStoryList.vue"), // Tùy chọn tạo riêng nếu muốn giao diện khác
  //   // Hoặc dùng chung StoryList.vue cũng được
  // },

  // ==================== 404 NOT FOUND ====================
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Tùy chọn: cuộn lên đầu trang khi chuyển route
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;