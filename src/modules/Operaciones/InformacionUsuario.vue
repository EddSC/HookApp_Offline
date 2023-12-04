<script setup lang="ts">
import {
    IonItem,
    IonLabel,
    IonItemGroup,
    IonItemDivider,
    IonIcon,
} from '@ionic/vue';
import { idCardOutline, personSharp } from 'ionicons/icons';
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';

const authStore = useAuthStore();

const estadoUser = computed(() => {
    return authStore.authStatus === '1' ? 'ACTIVO' : 'INACTIVO';
});

const numeroFormateado = computed(() => {
      const numeroString = authStore.authId.padStart(3, '0');
      return `00${numeroString.slice(0, -3)}-${numeroString.slice(-3)}`;
    });

</script>

<template>
    <div class="ion-padding">
        <ion-item-group class="ion-item-group">
            <ion-item-divider class="Header_Item">
                <ion-icon :icon="personSharp" slot="start"></ion-icon>
                <div class="header_divider">
                    <ion-label class="cuenta_header"> Cuenta </ion-label>
                    <ion-item class="id_item_header" lines="none">
                        <ion-icon :icon="idCardOutline" size="small" slot="start"></ion-icon>
                        <ion-label class="id_header"> {{ numeroFormateado }} </ion-label>
                    </ion-item>
                </div>
            </ion-item-divider>

            <ion-item class="item_user">
                <ion-label>NOMBRE: {{ authStore.authNombres.toUpperCase() }} </ion-label>
            </ion-item>
            <ion-item class="item_user">
                <ion-label>E-MAIL: {{ authStore.authCorreo.toUpperCase() }} </ion-label>
            </ion-item>
            <ion-item class="item_user">
                <ion-label>IDENTIFICADOR: {{ authStore.authId }} </ion-label>
            </ion-item>
            <ion-item class="item_user" lines="none">
                <ion-label>ESTADO: <span :class="estadoUser === 'ACTIVO' ? 'activo' : 'inactivo'"> {{ estadoUser }}</span>
                </ion-label>
            </ion-item>
        </ion-item-group>
    </div>
</template>


<style scoped>
.ion-item-group {
    border-radius: 10px;
    background: #222428;
}

.Header_Item {
    background: #22242800;
    height: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

ion-icon {
    font-size: 48px;
    color: #D4463C
}

.header_divider {
    color: white;
}

.cuenta_header {
    font-size: 1.2rem;
    margin-left: 18px;
    margin-bottom: -5px;
}

.id_header {
    font-size: 1.2rem;
    color: #D4463C;
}

.id_item_header {
    --background: #22242800;
}

.activo {
    color: #3cd455;
    font-weight: bold;
    font-size: 1.2rem;
}

.inactivo {
    color: #D4463C;
    font-weight: bold;
    font-size: 1.2rem;
}

.item_user {
    --background: #22242800;
    --color: white;
}
</style>