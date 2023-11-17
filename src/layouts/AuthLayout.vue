<template>
    <main class="container">
        <slot></slot>
    </main>
</template>

<style scoped>
.container {
    display: grid;
    place-items: center;
    height: 100vh;
    text-align: center;
}
</style>