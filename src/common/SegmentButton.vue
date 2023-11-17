<template>
    <ion-segment-button button :disabled="estado">
        <ion-label> <b> {{ name }} </b> </ion-label>
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
    }
})

</script>

<style scoped>
ion-segment-button {
    --indicator-color: #08a391;
    background-color: #01415fdc;
    color: #ffffff;
}

/* Material Design styles */
ion-segment-button.md {
    --color: #000;
    --color-checked: #08a391;
    --indicator-height: 4px;
}

/* iOS styles */
ion-segment-button.ios {
    --color: #08a391;
    --color-checked: #fff;
    --border-radius: 20px;
}


</style>