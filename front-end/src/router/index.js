import {createRouter, createWebHistory} from 'vue-router';
import Test1 from '@/components/Test1.vue';
import Test2 from '@/components/Test2.vue';
import Home from '@/components/Home.vue';

const base = import.meta.env.VITE_BASE_URL || '/';

const routes = [
    // home route
    {
        path: base,
        name: 'Home',
        component: Home
    },


    {
        path: base + "test1",
        name: 'Test1',
        component: Test1
    },
    {
        path: base + "test2",
        name: 'Test2',
        component: Test2
    },
]

const router = createRouter({
    base: base,
    history: createWebHistory(),
    mode: 'history',
    routes,
})

export default router