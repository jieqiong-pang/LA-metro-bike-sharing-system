import Vue from "vue";
import VueRouter from "vue-router";
// import Intro from '../views/intro/Intro.vue'
import Region from "../views/region/Region.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/region",
    name: "Home",
  },
  // {
  //   path: '/intro',
  //   name: 'Intro',
  //   component: Intro
  // },
  {
    path: "/region",
    name: "Region",
    component: Region,
  },
  // {
  //   path: "/heatmap",
  //   name: "Heatmap",
  //   component: () => import("../views/heatmap/Heatmap.vue"),
  // },
  {
    path: "/station",
    name: "Station",
    component: () => import("../views/station/Station.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/about/About.vue"),
  },
  // {
  //   path: '/test',
  //   name: 'Test',
  //   component: () => import('../views/test/Test.vue')
  // }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.afterEach((to, from) => {
  window.scrollTo(0, 0);
});

export default router;
