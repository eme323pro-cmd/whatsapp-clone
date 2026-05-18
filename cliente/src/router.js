import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Chat from './components/Chat.vue';


const routes = [
  { 
    path: '/', 
    component: Login, 
    meta: { requiresAuth: false } 
  },
  { 
    path: '/chat', 
    component: Chat, 
    meta: { requiresAuth: true } 
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const usuario = localStorage.getItem('usuario_whatsapp');

  if (to.meta.requiresAuth && !usuario) {
    next('/'); // Si no hay usuario en localStorage, al login
  }
  
  else if (to.path == '/' && usuario){
    next('/chat')
  }
  
  else {
    next(); // Si hay usuario o no requiere auth, adelante
  }
});