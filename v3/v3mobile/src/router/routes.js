const routes = [
  {
    path: "/",
    component: () => import("layouts/MyLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "/index",
        component: () => import("pages/index.vue"),
      },
      {
        name: "start",
        path: "/start",
        component: () => import("pages/start.vue"),
      },
      {
        name: "dobrojutro",
        path: "/dobrojutro",
        component: () => import("pages/dobrojutro.vue"),
      },
      {
        name: "dogadjaj",
        path: "/dogadjaj/:id",
        component: () => import("pages/dogadjaj.vue"),
      },
      {
        name: "lakunoc",
        path: "/lakunoc",
        component: () => import("pages/lakunoc.vue"),
      },
      {
        name: "podesavanja",
        path: "/podesavanja",
        component: () => import("pages/podesavanja.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
