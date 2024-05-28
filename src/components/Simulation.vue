<template>
    <div class="wrapper-stepper">
        <h1 class="color-text" :style="'text-align:center'">Resultados</h1>
        <div class="tables-container">
            <div>
                <h2 class="textAlign color-text">Productos a buscar</h2>
                <div class="table-wrapper">
                    <table class="fl-table-products">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody class="color-text">
                            <tr v-for="prod in prodsToFind" :key="prod.nombre">
                                <td v-if="prod.cantidad != 0">{{ productName(prod.nombre) }}</td>
                                <td v-if="prod.cantidad != 0">{{ prod.cantidad }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h2 class="textAlign color-text">Productos seleccionados</h2>
                <div class="table-wrapper">
                    <table class="fl-table-products">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody class="color-text">
                            <tr v-for="(key, value) in products">
                                <td>{{ productName(value) }}</td>
                                <td>{{ key }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="results">
            <h2 class="color-text">Tiempo: {{ timeTest }} segundos</h2>
            <h2 class="color-text">Precisión: {{ porcentaje }}%</h2>
            <h2 class="color-text">Latencia: {{ latency }} segundos</h2>
        </div>

        <div class="buttons-container">
            <button class="btn boton btn--secondary-color" @click="inicio">
                Inicio
            </button>
            <button :disabled="pruebaFinalizada" class="btn boton btn--main-color" @click="iniciar">
                Iniciar
            </button>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { initializeApp } from "firebase/app";
import { documentId, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

export default {
    data() {
        return {
            timeTest: 0,
            products: {},
            db: undefined,
            app: undefined,
            firebaseConfig: undefined,
            remember: [],
            porcentaje: 0,
            prodAux: [],
            prodsToFind: [],
            url: process.env.NODE_ENV === 'development' ? '/api' : 'https://api-proyecto-final.herokuapp.com',
            startTime: null,
            stimulusTime: null,
            latency: 0,
            productsName:[
                {id:'cocaPlastico', name:"Botella Coca Cola"},
                {id:'lays', name:"Lays Clásicas"},
                {id:'aceite', name:"Botella Aceite Grande"},
                {id:'aceite2', name:"Botella Aceite Chica"},
                {id:'fideos1', name:"Fideos Fetuccini"},
                {id:'lasagna', name:"Lasagna"},
                {id:'cereales', name:"Cereales"},
                {id:'ketchup', name:"Ketchup"},
                {id:'pringles', name:"Pringles"},
                {id:'heineken', name:"Cerveza Heineken"},
                {id:'cocaLata', name:"Lata Coca Cola"},
                {id:'mayonesa', name:"Mayonesa"},
                {id:'corona', name:"Cerveza Corona"},
                {id:'vino', name:"Vino"},
                {id:'maruchan', name:"Maruchan"},

            ],
            resultReceived: false,
            pruebaFinalizada:false

        }
    },
    props: {
        nivel: String,
        doc: String,
        sound: String
    },
    watch: {
        products: {
            handler() {
                console.log(this.products)
            },
            deep: true
        }
    },
    mounted() {
        this.initCounter()
        this.firebaseConfig = {
            apiKey: "AIzaSyA9uD1xkYBZ18rqXndDMPqNp-kv_d2Nslo",
            authDomain: "proyectofinalingenieriaviviant.firebaseapp.com",
            databaseURL: "https://proyectofinalingenieriaviviant-default-rtdb.firebaseio.com",
            projectId: "proyectofinalingenieriaviviant",
            storageBucket: "proyectofinalingenieriaviviant.appspot.com",
            messagingSenderId: "397583631129",
            appId: "1:397583631129:web:228b0b87af968792d53b88"
        };

        // Initialize Firebase
        this.app = initializeApp(this.firebaseConfig);
        // Initialize Cloud Firestore and get a reference to the service
        this.db = getFirestore(this.app);
        let unsub = onSnapshot(doc(this.db, "results", this.doc), (doc) => {
                if(!this.resultReceived && doc.data().tiempo){
                    this.resultReceived = true
                    this.timeTest = doc.data().tiempo
                    this.stimulusTime = doc.data().tiempoEstimulo
                    
                    let result = doc.data().productos
                    if (JSON.stringify(result[0]) != '{}') {
                        let prods = Object.values(result)
                        prods.forEach((element) => {   
                            this.agregarProducto(element)
                        });
                    }
                    if(this.timeTest != 0){   
                        this.compararProductos()
                    }
                } 
        });


        axios.get(this.url + '/level/remember/' + this.nivel).then((res) => {
            this.remember = res.data
            this.prodsToFind = JSON.parse(JSON.stringify(this.remember));
            this.prodsToFind = this.prodsToFind.filter(prod => prod.cantidad != 0)
            this.prodAux = JSON.parse(JSON.stringify(this.remember));
        })

    },
    methods: {
        iniciar() {
            axios.post(this.url + '/action',
                {
                    topic: "config",
                    data: { action: "start", level: this.nivel, id: this.doc, sound:this.sound}
                }
            ).then(response => {
                this.stopCounter()
                this.pruebaFinalizada = true
            })
        },
        compararProductos() {
            let porcAcum = 0;

            for (const [key, value] of Object.entries(this.products)) {
                
                let remember = this.contain(key)
                if(remember > value && remember != 0){
                    porcAcum += value/remember
                } else {
                    if(value != 0){
                        porcAcum += remember/value
                    }
                }

            }
            this.porcentaje = (porcAcum / (Object.entries(this.products).length > this.cantidadProductos() ? Object.entries(this.products).length : this.cantidadProductos())) * 100

            this.porcentaje = parseFloat(this.porcentaje.toFixed(2));

            this.latency = (this.timeTest - this.stimulusTime)

            this.latency = parseFloat(this.latency.toFixed(0));

            this.timeTest = parseFloat(this.timeTest.toFixed(0));

            axios.put(this.url + '/result/' + this.doc, { percentage: this.porcentaje })
        },
        cantidadProductos() {
            let result = 0
            this.remember.forEach(element => {
                result += element.cantidad != 0 ? 1 : 0
            });
            return result
        },
        contain(producto) {
            let count = 0
            this.prodAux.forEach(element => {
                if (element.nombre == producto) {
                    count = element.cantidad

                }
            });
            return count
        },
        agregarProducto(producto) {
            if (this.products.hasOwnProperty(producto))
                this.products[producto] += 1
            else
                this.products[producto] = 1

        },
        initCounter() {
            this.startTime = new Date().getTime();
        },

        stopCounter() {
            if (this.startTime) {
                let endTime = new Date().getTime(); // se guarda el tiempo actual en milisegundos
                this.stimulusTime = (endTime - this.startTime) / 1000; // se calcula el tiempo transcurrido en segundos
                this.startTime = null; // se reinicia el valor de startTime
            }
        },
        inicio(){
            this.$router.push({ name: 'home'})
        },
        productName(id){
            let name = this.productsName.find(x => x.id == id)
            if(name){
                return name.name
            }
            return id
        }
    }
}
</script>

<style lang="scss">
$default : #C5C5C5;
$main-color : #75CC65;
$transiton : all 500ms ease;

.color-text {
    color: #000000;
}


.tx-main-color {
    color: $main-color;
    font-weight: 600;
}


.buttons-container {
    display: flex;
    justify-content:space-between;
}

.btn {
    display: flex;
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
    color: #333;
    background-color: #f0f0f0;
    border-color: #f0f0f0;
    font-size: 20px;

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


.grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    /* overflow: hidden; */
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 15px;
}


.image {
    max-height: 150px;
}

.num {
    height: 100%;
    width: 39%;
    border: none;
    font-size: 25px;
}

.wrapper {
    height: 50px;
    padding: 10px;
    display: flex;
}


input {
    text-align: center;
}

.textAlign {
    text-align: center;
}



.options {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 40px;
    width: max-content;
    margin: auto;
}

.opt {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 20px;

}

.tables-container {
    display: flex;
    justify-content: space-evenly;
    max-height: 500px;
}


.results {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}





.table-wrapper {
    margin: 10px 70px 70px;
    box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
    overflow-y: auto;
    overflow-x: hidden;
}

.fl-table-products {
    border-radius: 5px;
    font-size: 14px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    max-width: 100%;
    white-space: nowrap;
    background-color: white;
    border-spacing: 0;
    position: relative; /* requerido para el encabezado sticky */
}

.fl-table-products td,
.fl-table-products th {
    text-align: center;
    padding: 8px;
    min-width: 20vw;
}


.fl-table-products td {
    border-right: 1px solid #f8f8f8;
    font-size: 12px;
}

.fl-table-products thead th {
    color: #ffffff;
    background: #4FC3A1;
    position:sticky;
    top: 0;
    z-index: 999;
}


.fl-table-products thead th:nth-child(odd) {
    color: #ffffff;
    background: #324960;
}

.fl-table-products tr:nth-child(even) {
    background: #F8F8F8;
}

.fl-table-products tr:hover {
   background-color: #ddd;
}

/* Responsive */

@media (max-width: 767px) {
    .fl-table-products {
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

    .fl-table-products thead,
    .fl-table-products tbody,
    .fl-table-products thead th {
        display: block;
    }

    .fl-table-products thead th:last-child {
        border-bottom: none;
    }

    .fl-table-products thead {
        float: left;
    }

    .fl-table-products tbody {
        width: auto;
        position: relative;
        overflow-x: auto;
    }

    .fl-table-products td,
    .fl-table-products th {
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

    .fl-table-products thead th {
        text-align: left;
        border-bottom: 1px solid #f7f7f9;
    }

    .fl-table-products tbody tr {
        display: table-cell;
    }

    .fl-table-products tbody tr:nth-child(odd) {
        background: none;
    }

    .fl-table-products tr:nth-child(even) {
        background: transparent;
    }

    .fl-table-products tr td:nth-child(odd) {
        background: #F8F8F8;
        border-right: 1px solid #E6E4E4;
    }

    .fl-table-products tr td:nth-child(even) {
        border-right: 1px solid #E6E4E4;
    }

    .fl-table-products tbody td {
        display: block;
        text-align: center;
    }

}
</style>