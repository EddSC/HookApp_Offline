<template>
    <ion-segment-button button :disabled="estado" :value="value" >
        <slot></slot>
        <ion-label>  {{ name }}  </ion-label>
    </ion-segment-button>
</template>

<script setup lang="ts">
import { IonSegmentButton, IonLabel} from '@ionic/vue';
// props
defineProps({
    name: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: false
    },
    value: {
        type: String,
        required: false
    }
})

</script>

<style scoped>
ion-segment-button {
    background-color: #01415fdc;
}

/* Material Design styles */
ion-segment-button.md {
    --color: #ffffff;
    --color-checked: #08a391;
    --indicator-height: 7px;
}

/* iOS styles */
ion-segment-button.ios {
    --color: #08a391;
    --color-checked: #fff;
}


</style>