<template>
    <!--<h1>Prueba de memoria</h1>
    <input type="text" v-model="name" class="input">-->

    <div ref="main" class="container">

        <nav id="main-menu">
            <ul class="nav-bar">
                <li class="nav-button-home" @click="autoscroll('main')">Inicio</li>
                <li class="nav-button-services" @click="autoscroll('products')">Resultados</li>
            </ul>
        </nav>



        <div class="section-container">
            <div class="section left">
                <div class="title-wrapper">
                    <h1>Realidad Virtual Inmersiva para el Estudio de Atención y Memoria</h1>
                    <div class="text">
                        <p>Desarrollado en el marco del trabajo final para Ingenieria de Sistemas de la Universidad Nacional
                            Nacional del Centro de la Provincia de Buenos Aires.</p>

                    </div>
                </div>

                <div class="btn-container">
                    <button class="ov-btn-slide-left btn-menu" @click="iniciarConfiguracion">
                        Iniciar configuración
                        <img class="chevron" src="../assets/icNavigation@3x.png" alt="">
                    </button>

                    <button class="ov-btn-slide-left btn-menu" @click="nuevoNivel">
                        Nuevo nivel
                        <img class="chevron" src="../assets/icNavigation@3x.png" alt="">
                    </button>
                    <button class="ov-btn-slide-left btn-menu" @click="editarNiveles">
                        Editar niveles
                        <img class="chevron" src="../assets/icNavigation@3x.png" alt="">
                    </button>
                </div>
            </div>

            <div class="section right">
                <div class="element">
                </div>
                <img class="cardboard" src="../assets/cardboard.png" alt="">

            </div>
        </div>
        <section ref="products">
            <div class="subtitle-wrapper">
                <h2>Últimos 10 resultados</h2>
            </div>
            <div class="table-wrapper">
                <table class="fl-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Nivel</th>
                            <th>Cantidad de productos</th>
                            <th>Tiempo</th>
                            <th>Precisión</th>
                            <th>Latencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in items" :key="item.id">
                            <td>{{ item.nombre_persona }}</td>
                            <td>{{ item.id_nivel }}</td>
                            <td>{{ item.productos ? Object.keys(item.productos).length : 0}}</td>
                            <td>{{ item.tiempo ? item.tiempo.toFixed(0) : 0 }} segundos</td>
                            <td>{{ item.porcentaje || 0 }} %</td>
                            <td>{{ item.tiempo_estimulo ? item.tiempo_estimulo.toFixed(0) : 0 }} segundos</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
        <div>
            <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="4" fill="rgba(255,255,255,0.7" />
                    <use xlink:href="#gentle-wave" x="48" y="7" fill="rgba(255,255,255,0.5)" />
                    <use xlink:href="#gentle-wave" x="48" y="9" fill="rgba(255,255,255,0.3)" />
                    <use xlink:href="#gentle-wave" x="48" y="11" fill="#fff" />
                </g>
            </svg>
        </div>
    </div>

</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            name: "",
            // '/api' en el primer localhost
            url: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'http://localhost:8081',
            items: [],
            scrollPosition: 0,
            scrollStep: 1,
            scrollDelay: 2000

        }
    },
    mounted() {
        axios.get(this.url + '/result').then((res) => {
            this.items = res.data
        })
    },
    methods: {
        iniciarConfiguracion() {
            this.$router.push({ name: 'config' })
        },
        editarNiveles() {
            this.$router.push({ name: 'niveles', params: { newLevel: false } })
        },
        nuevoNivel() {
            this.$router.push({ name: 'niveles', params: { newLevel: true } })
        },
        autoscroll(sectionName) {
            const section = this.$refs[sectionName];
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    },
}

</script>

<style lang="scss">
$default : #C5C5C5;
$main-color : #75CC65;
$transiton : all 500ms ease;

button {
    justify-content: center;
    align-items: center;
    padding: 6px 16px;
    border: 1px solid;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    line-height: 1.5;
    transition: all 150ms;
    border-radius: 4px;
    width: fit-content;
    font-size: 20px;
    color: #333;
    background-color: #f0f0f0;
    border-color: #f0f0f0;

    &:disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    &--main-color {
        background-color: $main-color;
        border-color: $main-color;
        color: #fff;
    }
}

.container {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: linear-gradient(150deg, #22b968, #1fc2bd);
    width: 100%;

}

.input {
    font-size: 20px;
    border-radius: 4px;
    padding: 6px 16px;
    border: 1px solid;
    line-height: 1.5;
}

.btn-menu {
    border-radius: 60px;
    background-color: #fff;
    padding: 16px;
    width: 300px;
    border: #fff 2px solid;
    color: #17b3b2;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin: 20px 0;
    justify-content: center;
}

.title-wrapper {
    display: flex;
    width: 80%;
    justify-content: center;
    flex-direction: column;
    margin-left: 10%;
}

.subtitle-wrapper {
    width: 80%;
    text-align: center;
    margin: 0 auto;
}



.title-wrapper h1 {
    font-size: 48px;
    font-weight: 600;
    color: #fff,
}

.subtitle-wrapper h2 {
    font-size: 36px;
    font-weight: 600;
    color: #fff,
}

@media (max-width: 1366px) {
    .title-wrapper h1 {
        font-size: 36px;
        font-weight: 600;
        color: #fff,
    }

    .subtitle-wrapper h2 {
        font-size: 24px;
        font-weight: 600;
        color: #fff,
    }
}


.text {
    color: #fff;
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 36px;
}

.btn-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

.section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.left {
    flex: 50%;
    justify-content: center;
}

.right {
    flex: 50%;
}

.section-container {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    margin-bottom: 95px;
}

.chevron {
    height: 30px;
    width: 30px;
    margin: 0 0px 0 5px;
    filter: hue-rotate(150deg);
}

.cardboard {
    width: 800px;
    -moz-transform: scaleX(-1);
    -o-transform: scaleX(-1);
    -webkit-transform: scaleX(-1) !important;
    transform: scaleX(-1);
    -ms-filter: "FlipV";
    filter: FlipV;
}

.element {
    background-color: #fff;
    width: 450px;
    height: 700px;
    position: absolute;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-top-left-radius: 30% 40%;
    border-top-right-radius: 70% 60%;
    border-bottom-right-radius: 70% 40%;
    border-bottom-left-radius: 30% 60%;
    transform: rotate(-30deg);
}

#main-menu {
    background-image: linear-gradient(1.4deg, #22b968, #1fc2bd);
    background-color: #22b968;
    padding: 20px 0;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    position: sticky;
    top: 0;
    z-index: 999;
}

#main-menu .nav-bar {
    list-style: none;
    margin-right: 15%;
}

#main-menu .nav-bar li {
    display: inline;
    padding: 0 10px;
    text-decoration: none;
    padding-left: 25px;
    color: #fff;
    font-weight: 600;
    font-size: 16;
    cursor: default;
}



.waves {
    position: relative;
    width: 100%;
    height: 15vh;
    margin-bottom: -7px;
    /*Fix for safari gap*/
    min-height: 100px;
    max-height: 150px;
}

.content {
    position: relative;
    height: 20vh;
    text-align: center;
    background-color: white;
}

/* Animation */

.parallax>use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

.parallax>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
}

.parallax>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
}

.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
}

.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}

/*Shrinking for mobile*/
@media (max-width: 768px) {
    .waves {
        height: 40px;
        min-height: 40px;
    }

    .content {
        height: 30vh;
    }

    h1 {
        font-size: 24px;
    }
}


.table-wrapper {
    margin: 10px 70px 70px;
    box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.fl-table {
    border-radius: 5px;
    font-size: 14px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
}

.fl-table td,
.fl-table th {
    text-align: center;
    padding: 8px;
}

.fl-table td {
    border-right: 1px solid #f8f8f8;
    font-size: 12px;
    color: #000000;
}

.fl-table thead th {
    color: #ffffff;
    background: #4FC3A1;
}


.fl-table thead th:nth-child(odd) {
    color: #ffffff;
    background: #324960;
}

.fl-table tr:nth-child(even) {
    background: #F8F8F8;
}

.fl-table tr:hover {
    background-color: #ddd;
}

/* Responsive */

@media (max-width: 767px) {
    .fl-table {
        display: block;
        width: 100%;
    }

    .table-wrapper:before {
        content: "Scroll horizontally >";
        display: block;
        text-align: right;
        font-size: 11px;
        color: white;
        padding: 0 0 10px;
    }

    .fl-table thead,
    .fl-table tbody,
    .fl-table thead th {
        display: block;
    }

    .fl-table thead th:last-child {
        border-bottom: none;
    }

    .fl-table thead {
        float: left;
    }

    .fl-table tbody {
        width: auto;
        position: relative;
        overflow-x: auto;
    }

    .fl-table td,
    .fl-table th {
        padding: 20px .625em .625em .625em;
        height: 60px;
        vertical-align: middle;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;
        width: 120px;
        font-size: 13px;
        text-overflow: ellipsis;
    }

    .fl-table thead th {
        text-align: left;
        border-bottom: 1px solid #f7f7f9;
    }

    .fl-table tbody tr {
        display: table-cell;
    }

    .fl-table tbody tr:nth-child(odd) {
        background: none;
    }

    .fl-table tr:nth-child(even) {
        background: transparent;
    }

    .fl-table tr td:nth-child(odd) {
        background: #F8F8F8;
        border-right: 1px solid #E6E4E4;
    }

    .fl-table tr td:nth-child(even) {
        border-right: 1px solid #E6E4E4;
    }

    .fl-table tbody td {
        display: block;
        text-align: center;
    }

}

.autoscroll-container {
    overflow: hidden;
}

.autoscroll-container ul {
    margin: 0;
    padding: 0;
    list-style: none;
}

.autoscroll-container li {
    margin: 10px 0;
    padding: 10px;
    background-color: #f1f1f1;
}

//   .custom-table {
//   border-collapse: collapse;
//   width: 100%;
//   max-width: 1250px;
//   margin: 0 auto;
//   font-family: Arial, sans-serif;
//   font-size: 14px;
// }

// .custom-table th, .custom-table td {
//   border: 1px solid #ddd;
//   padding: 8px;
//   text-align: left;
// }

// .custom-table th {
//   background-color: #22B968;
//   color: #fff;
// }

// .custom-table tbody tr:nth-child(even) {
//   background-color: #f2f2f2;
// }

// .custom-table tbody tr:hover {
//   background-color: #ddd;
// }

/* Estilos generales de la barra de desplazamiento */
::-webkit-scrollbar {
  width: 10px; /* Ancho de la barra de desplazamiento */
  background-color: #f2f2f2; /* Color de fondo */
  border-radius: 5px; /* Radio de borde */
}

/* Estilos específicos del pulgar de la barra de desplazamiento */
::-webkit-scrollbar-thumb {
  background-color: #918888; /* Color del pulgar */
  border-radius: 5px; /* Radio de borde */
}
</style>