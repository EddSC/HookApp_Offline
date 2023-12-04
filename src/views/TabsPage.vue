<template>
  <ion-page>
    <ion-tabs mode="md">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar id="tabs" slot="bottom"  color="blueblack">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Inicio</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="build" />
          <ion-label>Correctivo</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3" disabled>
          <ion-icon aria-hidden="true" :icon="construct" />
          <ion-label>Solución</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="tab4" href="/tabs/tab4">
          <ion-icon aria-hidden="true" :icon="cog" />
          <ion-label>Operaciones</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { home, build, construct, cog } from 'ionicons/icons';
</script>
