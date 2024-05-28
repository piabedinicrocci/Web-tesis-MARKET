<template>
    <Config v-if="config" @init="config = false; nivel = $event.nivel; id = $event.id" />
    <Simulation v-if="nivel" :doc="id" :nivel="nivel" />
</template>
<script setup>
import Config from "../components/Config.vue";
import Simulation from "../components/Simulation.vue";
import { ref } from 'vue'

var config = ref(true)
var nivel = ref(null)
var id = ref("1")

</script>


