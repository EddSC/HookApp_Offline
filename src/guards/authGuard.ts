import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { Preferences } from '@capacitor/preferences';

const authGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    if (to.meta.requiresAuth) {
        let isAuthenticated = false
        const data = await Preferences.get({ key: 'auth' });
        if (data.value) isAuthenticated = true
        if (isAuthenticated) {
            next(); 
        } else {
            next('/login');
        }
    } else {
        next();
    }
};

export default authGuard;