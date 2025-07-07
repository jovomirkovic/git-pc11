const routes = [
  { name: "login", path: "/", component: () => import("pages/login.vue") },
  {
    name: "basePath",
    path: "/",
    component: () => import("layouts/MainLayoutDynamics.vue"),
    children: [
      {
        name: "dashboard",
        path: "/dashboard",
        component: () => import("pages/dashboard.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "dashboard1",
        path: "/dashboard1",
        component: () => import("pages/dashboard1.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "administracija",
        path: "/administracija",
        component: () => import("pages/administracija.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "treninzi",
        path: "/treninzi",
        component: () => import("pages/treninzi.vue"),
        meta: { icon: "Trainings.svg" }
      },
      {
        name: "trenezneVezbe",
        path: "/trenezneVezbe",
        component: () => import("pages/trenezneVezbe.vue"),
        meta: { icon: "Training excersizes.svg" }
      },
      {
        name: "utakmice",
        path: "/utakmice",
        component: () => import("pages/utakmice.vue"),
        meta: { icon: "Matches.svg" }
      },
      {
        name: "podaciOIgri",
        path: "/podaciOIgri",
        component: () => import("pages/podaciOigri.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "catapult",
        path: "/catapult",
        component: () => import("pages/catapult.vue"),
        meta: { icon: "Catapult.svg" }
      },
      {
        name: "taktickiElementi",
        path: "/taktickiElementi",
        component: () => import("pages/taktickiElementi.vue"),
        meta: { icon: "Tactical elements.svg" }
      },
      {
        name: "tehnickiElementi",
        path: "/tehnickiElementi",
        component: () => import("pages/tehnickiElementi.vue"),
        meta: { icon: "Technical elements.svg" }
      },
      {
        name: "principiIgre",
        path: "/principiIgre",
        component: () => import("pages/principiIgre.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "strucniTim",
        path: "/strucniTim",
        component: () => import("pages/strucniTim.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "igraci",
        path: "/igraci",
        component: () => import("pages/igraci.vue"),
        meta: { icon: "Administration.svg" },
        children: [
          {
            name: "medicinskiKarton",
            path: "medicinskiKarton",
            component: () => import("pages/medicinskiKarton.vue"),
            meta: { icon: "Medical record.svg" }
          },
          {
            name: "povredeIgraca",
            path: "povredeIgraca",
            component: () => import("pages/povredeIgraca.vue"),
            meta: { icon: "Player injuries.svg" }
          }
        ]
      },
      {
        name: "test",
        path: "/test",
        component: () => import("pages/test.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "access",
        path: "/access",
        component: () => import("pages/access.vue"),
        meta: { icon: "Administration.svg" }
      },
      {
        name: "tenanti",
        path: "/tenanti",
        component: () => import("pages/tenanti.vue"),
        meta: { icon: "Administration.svg" }
      },

      {
        name: "emptyPage",
        path: "/*",
        component: () => import("pages/emptyPage.vue"),
        meta: { icon: "Administration.svg" }
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
