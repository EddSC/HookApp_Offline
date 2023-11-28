<template>
    <ion-button expand="block" fill="clear" :type="type">
        <b>{{ name }}</b>
    </ion-button>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';
const validButtonTypes = ["submit", "button", "reset"] as const;
defineProps({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String as () => typeof validButtonTypes[number],
        default: 'submit'
    }
})

</script>

<style scoped>
ion-button {
    --background: #ff4d00;
    --color: white;
    --border-radius: 10px;
}
</style>