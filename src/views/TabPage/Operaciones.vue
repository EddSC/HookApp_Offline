<template>
  <ion-page>
    <Header titulo="Operaciones" color="bluedark" />
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item-group>
          <ion-item-divider class="Header_Item">
            <ion-icon :icon="personSharp" slot="start"></ion-icon>
            <div class="header_divider">
              <ion-label class="cuenta_header" > Cuenta </ion-label>
              <ion-item class="id_item_header">
                <ion-icon :icon="idCardOutline" size="small" slot="start"></ion-icon>
                <ion-label class="id_header"> 123456789 </ion-label>
              </ion-item>
            </div>
          </ion-item-divider>

          <ion-item>
            <ion-label>NOMBRE: EDGAR GUTIERREZS </ion-label>
          </ion-item>
          <ion-item >
            <ion-label>E-MAIL: EDGAR@KONECRANES.COM </ion-label>
          </ion-item>
          <ion-item  lines="none">
            <ion-label>ESTADO: <span class="estado"> ACTIVO</span> </ion-label>
          </ion-item>
        </ion-item-group>
        </ion-list>

        <ion-list>
        <ion-accordion-group :multiple="true" :value="['first', 'third']">
          <ion-accordion value="first">
            <ion-item class="Header_Item" slot="header" color="light">
              <ion-label>First Accordion</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">First Content</div>
          </ion-accordion>
        </ion-accordion-group>
        </ion-list>

        <ion-list>
        <ion-accordion-group :multiple="true" :value="['first', 'third']">
          <ion-accordion value="first">
            <ion-item class="Header_Item" slot="header" color="light">
              <ion-icon :icon="settingsSharp" slot="start"></ion-icon>
              <div class="header_divider">
              <ion-label class="cuenta_header" > Ajustes </ion-label>
              <ion-item class="id_item_header" lines="none">
                <ion-label class="id_header"> Versión 123456789 </ion-label>
              </ion-item>
            </div>
            </ion-item>
            <div class="ion-padding" slot="content">First Content</div>
          </ion-accordion>
        </ion-accordion-group>
        </ion-list>
        <ion-list>
        <ion-item class="Header_Item" button slot="header" color="light" @click="cerrarSesion" >
          <ion-icon :icon="logOut" slot="start"></ion-icon>
          <ion-label>Cerrar Sesión</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonList,
  IonAccordion,
  IonItem,
  IonLabel,
  IonContent,
  IonAccordionGroup,
  IonItemGroup,
  IonItemDivider,
  IonIcon,
} from '@ionic/vue';
import { idCardOutline, personSharp, logOut, settingsSharp } from 'ionicons/icons';
import Header from '@/common/Header.vue';
import { showToast } from '@/helpers/showToast';

const cerrarSesion = () => {
  showToast('Cerrando sesión...', 'danger');
};

</script>

<style scoped>
ion-list{
  background: #28282A;
  border-radius: 10px;
  margin-top: 1.2rem;
}

.Header_Item{
  background: #222428;
  height: 5rem;
  /* centrar horizontalmente */
  display: flex;
  justify-content: center;
  align-items: center;
  /* centrar verticalmente */
  /* flex-direction: column; */
}

ion-icon {
  font-size: 48px;
  color: #D4463C
}
.header_divider{
  color: white;
}
.cuenta_header{
  font-size: 1.2rem;
  margin-left: 18px;
  margin-bottom: -5px;
}
.id_header{
  font-size: 1.2rem;
  color: #D4463C;
}
.id_item_header{
  --background: #22242800;
}
.estado{
  color: #3cd455;
  font-weight: bold;
  font-size: 1.2rem;
  }
</style>