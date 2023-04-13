import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'

import Mark2 from './components/Mark2.vue'
import Task1 from './components/Task1.vue'
import Task2 from './components/Task2.vue'

import Backend from "./components/Backend";
import Backstage from "./components/Backstage";
import Endtask from "./components/Endtask";




Vue.use(Router)


const router = new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },

        {
            path: '/login',
            component: Login
        },


        {
            path: '/register',
            component: Register
        },
        {
            path: '/backstage',
            component: Backstage
        },
        {
            path: '/backend',
            component: Backend
        },
        {
            path: '/endtask',
            component: Endtask
        },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                {
                    path: '/welcome',
                    component: Welcome
                },

                {
                    path: '/mark2',
                    name:'id',
                    component: Mark2
                },
                {
                    path: '/task1',
                    component: Task1
                },
                {
                    path: '/task2',
                    component: Task2
                },



            ]
        },
    ]
})

router.beforeEach((to, from, next) => {
    if (to.path === '/mark') {
        const identity = window.sessionStorage.getItem('identity');
        if (identity == '0') {
            const mark=window.sessionStorage.getItem('mark');
            if(mark==2){
                next({ path: '/mark2' })
            }else{
                next({ path: '/mark1' })
            }
        } else next();
    } else next();

})

export default router
