<template>
    <div class="wrapper-stepper">
        <div class="stepper">
            <div class="stepper-progress">
                <div class="stepper-progress-bar" :style="'width:' + stepperProgress"></div>
            </div>

            <div class="stepper-item" :class="{ 'current': step == item, 'success': step > item }" v-for="item in 3"
                :key="item">
                <div class="stepper-item-counter">
                    <img class="icon-success"
                        src="https://www.seekpng.com/png/full/1-10353_check-mark-green-png-green-check-mark-svg.png" alt="">
                    <span class="number">
                        {{ item }}
                    </span>
                </div>
                <span class="stepper-item-title">
                    Paso {{ item }}
                </span>
            </div>
        </div>

        <div v-if="step == 1">
            <div class="stepper-pane">
                <h2>Selecciona el nivel</h2>
                <h3>El nivel varía la cantidad de productos diferentes en el supermercado.</h3>

                <div class="content-input">
                    <input autocomplete="off" type="text" id="name" v-model="name" placeholder="Nombre" required>
                </div>

                <div class="content-select">
                    <select name="select" id="level" v-model="levelSelected" @change="getIndex()">
                        <option value="" disabled selected>Nivel</option>
                        <option v-for="level in levels" :value="level">
                            {{ level.nombre_nivel }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div v-if="step == 2">
            <div class="stepper-pane">
                <div class="grid-selection">
                    <div id="item-1" class="item item-1" v-for="(product, index) in selectedProducts" :key="product.id_prod_disp">
                        <img class="image" :src="getSrc(product.nombre_prod_disp)" @click="toggle(product.nombre_prod_disp)">
                        <div class="wrapper">
                            <button class="plusminus" @click="handleMinus(index)">-</button>
                            <span class="num">{{ img.cantidad }}</span>

                            <button class="plusminus" @click="handlePlus(index, img.max)">+</button>
                        </div>
                    </div>


                </div>
            </div>
        </div>

        <div v-if="step == 3">
            <div class="stepper-pane">
                <div class="options">
                    <div class="opt">
                        <label class="switch">
                            <input type="checkbox"  v-model="soundOn">
                            <span class="slider round"></span>
                        </label>
                        <span>Habilitar sonido</span>
                    </div>
                </div>
            </div>


        </div>

        <div class="controls">
            <button class="btn boton" @click="step--" :disabled="step == 1">
                Anterior
            </button>
            <button class="btn boton btn--main-color" :disabled="!levelSelected || !name" @click="step++" v-if="step != 3">
                Siguiente
            </button>
            <button class="btn boton btn--main-color" @click="iniciar" v-if="step == 3">
                Iniciar
            </button>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            name:'',
            step: 1,
            levels: [],
            indexLevel: null,
            levelSelected: '',
            images: [{id:"cocaPlastico",dir:"coca-botella.png",cant:0},
            {id:"cocaLata",dir:"coca-lata.png",cant:0},
            {id:"lays",dir:"lays-clasicas.png",cant:0},
            {id:"aceite",dir:"aceite.jpg",cant:0},
            {id:"aceite2",dir:"aceite-botella-chica.png",cant:0},
            {id:"fideos1",dir:"fideos.jpg",cant:0},
            {id:"lasagna",dir:"lasagna.png",cant:0},
            {id:"cereales",dir:"cereales.png",cant:0},
            {id:"cafe",dir:"cafe.png",cant:0},
            {id:"ketchup",dir:"ketchup.png",cant:0},
            {id:"mayonesa",dir:"mayonesa.png",cant:0},
            {id:"corona",dir:"corona.png",cant:0},
            {id:"maruchan",dir:"maruchan.png",cant:0},
            {id:"pringles",dir:"pringles.png",cant:0},
            {id:"heineken",dir:"heineken.png",cant:0},
            {id:"pastaDental",dir:"oralb2.png",cant:0},
            {id:'vino', dir:"vino.png",cant:0},
            ],
            available: [],
            id: null,
            url: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'http://localhost:8081',
            soundOn:false
        }
    },
    mounted() {

        axios
            //.get("http://localhost:8081/level")
            .get(this.url + '/level')
            .then(response => {
                this.levels = response.data;
            });


    },
    computed: {
        stepperProgress() {
            return (100 / 2) * (this.step - 1) + '%'
        }
    },
    methods: {
        toggle(e) {
            console.log(e)
        },
        handleMinus(index) {
            if (this.levels[this.indexLevel].availableProducts[index].cantidad > 0) {
                this.levels[this.indexLevel].availableProducts[index].cantidad--
            }
        },
        handlePlus(index, max) {
            if (this.levels[this.indexLevel].availableProducts[index].cantidad < max)
                this.levels[this.indexLevel].availableProducts[index].cantidad++
        },
        async iniciar() {
            if (this.levels[this.indexLevel].availableProducts && !this.ObjCompare(this.available, this.levels[this.indexLevel].availableProducts)) {
                axios
                    .post(this.url + '/level/' + this.levelSelected.dificultad, { remember: this.levels[this.indexLevel].availableProducts })
                    //  .post("http://localhost:8081/level/"+this.levelSelected.dificultad,this.levels[this.indexLevel].availableProducts)
                    //.get('https://firebase-viviant.herokuapp.com/level')
                    .then(response => {

                    });
            }
            axios.post(this.url + '/result',{
                name: this.name,
                level: this.levelSelected.dificultad.toString()
            }).then(res => {
                this.id = res.data
                axios.post(this.url + '/action',
                    {
                        data: { action: "config", level: this.levelSelected.dificultad.toString()}
                    }
                ).then(response => {
                    this.$router.push({ name: 'simulation', params: { nivel: this.levelSelected.dificultad.toString(), doc: this.id, sound:this.soundOn.toString() } })
                })
            })




        },
        getSrc(img) {
            return this.images.find(x => x.id == img) ? this.images.find(x => x.id == img).dir : null
        },
        getIndex() {
            this.indexLevel = this.levels.indexOf(this.levelSelected)
            if (this.levels[this.indexLevel].availableProducts) {
                this.available = JSON.parse(JSON.stringify(this.levelSelected.availableProducts));
            }
        },

        ObjCompare(obj1, obj2) {
            let Obj1_keys = Object.keys(obj1);
            let Obj2_keys = Object.keys(obj2);

            if (Obj1_keys.length !== Obj2_keys.length) {
                return false;
            }
            for (let k of Obj1_keys) {
                let k_keys = Object.keys(obj1[k]);
                for (let j of k_keys) {
                    if (obj1[k][j] !== obj2[k][j]) {
                        return false;
                    }
                }
            }
            return true;
        }

    }
}
</script>

<style lang="scss">
$default : #C5C5C5;
$main-color : #75CC65;
$transiton : all 500ms ease;

.tx-main-color {
    color: $main-color;
    font-weight: 600;
}


.stepper-pane {
    color: #333;
    text-align: center;
    padding: 120px 60px;
    /* box-shadow: 0 8px 12px rgba($color: #000000, $alpha: 0.09);*/

}

.controls {
    display: flex;
    justify-content: space-between;
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
    font-size: 0.75rem;
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

.content-input input,
.content-select select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    width: 25%;
    height: 50px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0 10px;
    font-size: 20px;
    color: #333;
    background-color: #fff;
    outline: none;
    margin-top: 20px;
    text-align: center;
}




.grid-selection {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    /* overflow: hidden; */
    grid-gap: 15px;
}


.item {
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 8px 12px rgba($color: #000000, $alpha: 0.09);
    color: white;
}

.image {
    max-height: 150px;
}



.plusminus {
    height: 100%;
    width: 30%;
    background: white;
    border: none;
    font-size: 30px;
    color: #5f5fce;
    cursor: pointer
}

.num {
    height: 100%;
    width: 39%;
    border: none;
    font-size: 25px;
    color: #000000;
}

.wrapper {
    height: 50px;
    padding: 10px;
    display: flex;
}

input[type="number"] {
    -webkit-appearance: textfield !important;
    -moz-appearance: textfield !important;
    appearance: textfield !important;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
}

input {
    text-align: center;
}

.boton {
    font-size: 20px;
}







/* The switch - the box around the slider */
.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

/* The slider */
.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
}

.slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
}

input:checked+.slider {
    background-color: $main-color;
}

input:focus+.slider {
    box-shadow: 0 0 1px $main-color;
}

input:checked+.slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
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
</style>