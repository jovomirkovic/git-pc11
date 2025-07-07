
const routes = [
  { name: 'login', path: '/', component: () => import('pages/login.vue') },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'dashboard', path: '/dashboard', component: () => import('pages/dashboard.vue') },
      { name: 'dashboard1', path: '/dashboard1', component: () => import('pages/dashboard1.vue') },
      { name: 'administracija',  path: '/administracija', component: () => import('pages/administracija.vue') },
      { name: 'treninzi', path: '/treninzi', component: () => import('pages/treninzi.vue') },
      { name: 'trenezneVezbe', path: '/trenezneVezbe', component: () => import('pages/trenezneVezbe.vue') },
      { name: 'utakmice', path: '/utakmice', component: () => import('pages/utakmice.vue') },
      { name: 'podaciOigri', path: '/podaciOigri', component: () => import('pages/podaciOigri.vue') },
      { name: 'catapult', path: '/catapult', component: () => import('pages/catapult.vue') },
      { name: 'taktickiElementi', path: '/taktickiElementi', component: () => import('pages/taktickiElementi.vue') },    
      { name: 'tehnickiElementi', path: '/tehnickiElementi', component: () => import('pages/tehnickiElementi.vue') },      
      { name: 'principiIgre', path: '/principiIgre', component: () => import('pages/principiIgre.vue') },
      { name: 'medicinskiKarton', path: '/medicinskiKarton', component: () => import('pages/medicinskiKarton.vue') },
      { name: 'povredeIgraca', path: '/povredeIgraca', component: () => import('pages/povredeIgraca.vue') },
      { name: 'strucniTim', path: '/strucniTim', component: () => import('pages/strucniTim.vue') },
      { name: 'igraci', path: '/igraci', component: () => import('pages/igraci.vue') },
      { name: 'test', path: '/test', component: () => import('pages/test.vue') },

    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
