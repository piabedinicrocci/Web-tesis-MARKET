import { createRouter, createWebHistory } from "vue-router";
import Inicio from "../components/Inicio.vue";
import Simulation from "../components/Simulation.vue";
import Config from "../components/Config.vue";
import Registro from "../components/Registro.vue";
import Niveles from "../components/Niveles.vue";
import Results from "../components/Results.vue";
import Login from "../components/Login.vue";

//import Simulation from "../views/SimulationView.vue";

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: "/",
            name: "login",
            component: Login,
        },
        {
            path: "/niveles",
            name: "niveles",
            component: Niveles,
            props: true,
        },
        {
            path: "/config",
            name: "config",
            component: Config,
            props: true,
        },
        {
            path: "/simulation",
            name: "simulation",
            component: Simulation,
            props: true,
        },
        {
            path: "/results",
            name: "results",
            component: Results,
            props: true,
        },
        {
            path: "/inicio",
            name: "inicio",
            component: Inicio,
            props: true,
        },
        {
            path: "/registro",
            name: "registro",
            component: Registro,
            props: true,
        },
    ],
});

export default router;