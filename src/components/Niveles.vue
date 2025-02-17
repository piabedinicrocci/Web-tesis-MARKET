<template>
<div class="wrapper-stepper">
        <div class="stepper">
            <div class="stepper-progress">
                <div class="stepper-progress-bar" :style="'width:' + stepperProgress "></div>
            </div>

            <div class="stepper-item" :class="{ 'current': step == item, 'success': step > item }" v-for="item in 3" :key="item">
                <div class="stepper-item-counter">
                    <img class="icon-success" src="https://www.seekpng.com/png/full/1-10353_check-mark-green-png-green-check-mark-svg.png" alt="">
                    <span class="number">
                        {{ item }}
                    </span>
                </div>
                <span class="stepper-item-title">
                    Paso {{ item }}
                </span>
            </div>
        </div>
        
        <div class="stepper-content" v-if="step == 1">
            <div v-if="newLevelComp" class="stepper-panel nuevo-nivel" >
                <h2>Nuevo nivel</h2>
                <input type="number" v-model="newLevelName" class="input level">
                <div class="text-error">
                    <span v-if="!newLevelValid">El nivel ya fue creado</span>
                </div>
            </div>
            <div v-else class="stepper-panel" >
                <h2>Selecciona el nivel</h2>
                <h3>El nivel varía la cantidad de productos diferentes en el supermercado.</h3>

                <div class="content-select">
                    <select name="select" v-model="levelSelected" @change="getIndex()">
                        <option v-for="level in levels" :value="level">
                        {{level.nombre}}
                        </option> 
                    </select>
                </div>
            </div>
        </div>
        <div v-if="step == 2">
            <div class="stepper-panel" >
                <div class="level-title">
                    <h2 v-if="!newLevelComp">{{levelSelected.name}}</h2>
                    <h2 v-else>Nivel {{newLevelName}}</h2>
                </div>
                <div class="grid">
                    <button class="estanteria row-2" @click="step++; estanteria=1;">1</button>              
                    <button class="estanteria" @click="step++; estanteria=2;">2</button> 
                    <button class="estanteria" @click="step++; estanteria=3;">3</button> 
                    <button class="estanteria" @click="step++; estanteria=4;">4</button> 
                    <button class="estanteria" @click="step++; estanteria=5;">5</button> 
                    <button class="estanteria" @click="step++; estanteria=6;">6</button> 
                    <button id="heladeraH" class="estanteria row-2" @click="step++; estanteria=7;">7</button>
                    <div class="grid-estanteria estanteria">
                        <button class="estanteria" @click="step++; estanteria=8;">8</button> 
                        <button class="estanteria" @click="step++; estanteria=9;">9</button> 
                        <button class="estanteria" @click="step++; estanteria=10;">10</button> 
                        <button class="estanteria" @click="step++; estanteria=11;">11</button>
                    </div>
                    <div class="grid-estanteria-8 estanteria col-3">
                        <button class="estanteria" @click="step++; estanteria=12;">12</button> 
                        <button class="estanteria" @click="step++; estanteria=13;">13</button> 
                        <button class="estanteria" @click="step++; estanteria=14;">14</button> 
                        <button class="estanteria" @click="step++; estanteria=15;">15</button>
                        <button class="estanteria" @click="step++; estanteria=16;">16</button> 
                        <button class="estanteria" @click="step++; estanteria=17;">17</button> 
                        <button class="estanteria" @click="step++; estanteria=18;">18</button> 
                        <button class="estanteria" @click="step++; estanteria=19;">19</button>
                    </div>
                    <button class="estanteria col-4" @click="step++; estanteria=20;">20</button>              
                    <button class="estanteria col-4" @click="step++; estanteria=21;">21</button> 
                    <button class="estanteria col-4" @click="step++; estanteria=22;">22</button> 
                    <button class="estanteria col-4" @click="step++; estanteria=23;">23</button> 
                    <button class="estanteria col-4" @click="step++; estanteria=24;">24</button> 
                </div>
            </div>
        </div>

        <div class="stepper-content" v-if="step == 3">
            <div class="stepper-panel">
                <div class="level-title">
                    <h2>{{levelSelected.name}}</h2>
                    <div class="arrow-shelf">
                        <img class="chevron rotate-chevron cursor-pointer" @click="downShelf()" src="../assets/icNavigation@3x.png" alt="">
                        
                        <h3>Estantantería {{estanteria}}</h3>
                       
                        <img class="chevron cursor-pointer" @click="upShelf()" src="../assets/icNavigation@3x.png" alt="">
                    
                    </div>    
                </div>
                <div class="grid-prod">
                    
                    <div id="item-1" class="item item-1" v-for="(key,value) in estanterias[estanteria]">
                        <img class="image" :src="getSrc(value)"  @click="toggle(img)">
                        <div class="wrapper">
                            <button class="plusminus" @click="handleMinus(value)">-</button>
                            <input  class="num" readlony v-model="estanterias[estanteria][value]" />
                            <button class="plusminus" @click="handlePlus(value)">+</button>
                        </div>
                    </div>
                   
                </div>
            </div>            
        </div>

        <div class="controls">
            <button class="btn boton"  @click="inicio" v-if="step == 1">
                Inicio
            </button>
            <button class="btn boton"  @click="step--" v-else :disabled="step == 1">
                Anterior
            </button>
            <button class="btn boton btn--main-color" :disabled="!nextEnabled" @click="step++; getNivel()" v-if="step != 3 && step != 2">
                Siguiente
            </button>
            <button class="btn boton btn--main-color" @click="guardar" v-if="step == 2 || step ==3">
                Guardar
            </button>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    newLevel: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      step: 1,
      levels: [],
      indexLevel: null,
      levelSelected: {},
      estanteria: null,
      newLevelName: null,
      images: [
        {id: "cocaPlastico", dir: "coca-botella.png", cant: 0},
        {id: "cocaLata", dir: "coca-lata.png", cant: 0},
        {id: "heineken", dir: "heineken.png", cant: 0},
        {id: "corona", dir: "corona.png", cant: 0},
        {id: "lays", dir: "lays-clasicas.png", cant: 0},
        {id: "aceite", dir: "aceite.jpg", cant: 0},
        {id: "aceite2", dir: "aceite-botella-chica.png", cant: 0},
        {id: "fideos1", dir: "fideos.jpg", cant: 0},
        {id: "lasagna", dir: "lasagna.png", cant: 0},
        {id: "maruchan", dir: "maruchan.png", cant: 0},
        {id: "cereales", dir: "cereales.png", cant: 0},
        {id: "ketchup", dir: "ketchup.png", cant: 0},
        {id: "mayonesa", dir: "mayonesa.png", cant: 0},
        {id: "pringles", dir: "pringles.png", cant: 0},
        {id: "cafe", dir: "cafe.png", cant: 0},
        {id: "pastaDental", dir: "oralb2.png", cant: 0},
        {id: 'vino', dir: "vino.png", cant: 0},
      ],
      available: [],
      id: null,
      estanterias: {},
      original: {},
      url: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : 'http://localhost:8081',
      newLevelValid: true  // Variable to store the validation result
    }
  },
  mounted() {
    axios
      .get(this.url + '/level')
      .then(response => {
        this.levels = response.data;
      });
  },
  watch: {
    newLevelName(newVal) {
      if (this.newLevelComp) {
        this.checkNewLevelValidity(newVal);
      }
    }
  },
  computed: {
    newLevelComp() {
      return this.newLevel === "true";
    },
    stepperProgress() {
      return (100 / 2) * (this.step - 1) + '%';
    },
    nextEnabled() {
      if (this.newLevelComp) {
        return this.newLevelValid !== null && this.newLevelValid && this.newLevelName != null && this.newLevelName != '';
      } else {
        return Object.keys(this.levelSelected).length !== 0;
      }
    }
  },
  methods: {
    toggle(e) {
      console.log(e);
    },
    handleMinus(index) {
      if (this.estanterias[this.estanteria][index] > 0) {
        this.estanterias[this.estanteria][index]--;
      }
    },
    handlePlus(index) {
      if (this.isAble())
        this.estanterias[this.estanteria][index]++;
    },
    isAble() {
      let suma = 0;
      for (let clave in this.estanterias[this.estanteria]) {
        if (typeof this.estanterias[this.estanteria][clave] === 'number') {
          suma += this.estanterias[this.estanteria][clave];
        }
      }
      if (this.estanteria != 7 && this.estanteria != 20 && this.estanteria != 21) {
        return suma == 25 ? false : true;
      } else {
        return suma == 20 ? false : true;
      }
    },
    async guardar() {
      let dif;
      if (!this.newLevelComp)
        dif = this.levelSelected.dificultad;
      else
        dif = this.newLevelName;
      if (!this.ObjCompare(this.estanterias, this.original)) {
        axios
          .put(this.url + '/level?id=' + dif, this.estanterias)
          .then(response => {

          });
      }
      this.$router.push({ name: 'home' });
    },
    getSrc(img) {
      return this.images.find(x => x.id == img) ? this.images.find(x => x.id == img).dir : this.images[0];
    },
    getIndex() {
      this.indexLevel = this.levels.indexOf(this.levelSelected);
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
    },
    getNivel() {
      if (this.newLevelComp) {
        for (let i = 1; i <= 24; i++) {
          this.estanterias[i] = this.convertArrayToObject(this.images);
        }
      } else {
        axios.get(this.url + '/level/' + this.levelSelected.dificultad)
          .then(response => {
            this.generateEstanterias(response.data);
          });
      }
    },
    generateEstanterias(estanterias) {
      for (let i = 1; i <= 24; i++) {
        this.estanterias[i] = this.convertArrayToObject(this.images);
      }
      estanterias.forEach(x => {
        if (x.productos) {
          x.productos.forEach(prod => {
            let nombre = prod.nombre.split("-")[0];
            this.estanterias[x.gondola][nombre]++;
          });
        }
      });
      this.original = JSON.parse(JSON.stringify(this.estanterias));
      console.log(this.original);
    },
    convertArrayToObject(array) {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item.id]: 0,
        };
      }, initialValue);
    },
    inicio() {
      this.$router.push({ name: 'home' });
    },
    downShelf() {
      if (this.estanteria > 1)
        this.estanteria--;
    },
    upShelf() {
      if (this.estanteria < 24)
        this.estanteria++;
    },
    async checkNewLevelValidity(levelName) {
      try {
        const response = await axios.get(this.url + `/level/${levelName}`);
        this.newLevelValid = response.data.length === 0;
      } catch (error) {
        console.error('Error checking level validity:', error);
        this.newLevelValid = false;
      }
    }
  }
}
</script>


<style lang="scss">
$default    :   #C5C5C5;
$main-color    :   #17b3b2;
$transiton  :   all 500ms ease;

.tx-main-color{
    color:  $main-color;
    font-weight: 600;
}

.wrapper-stepper{
    background-color: #fff;
    padding: 35px;
    box-shadow: rgba($color: #000000, $alpha: 0.01);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
}

.stepper{
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 0;
    margin-bottom: 24px;

    &-progress{
        position: absolute;
        background-color: $default;
        height: 2px;
        z-index: -1;
        left: 0;
        right: 0;
        margin: 0 auto;

        &-bar{
            position: absolute;
            left: 0;
            height: 100%;
            width: 0%;
            background-color: $main-color;
            transition: $transiton;
        }
    }
}

.stepper-item{
    display: flex;
    flex-direction: column;
    align-items: center;
    color: $default;
    transition: $transiton;

    &-counter{
        height: 68px;
        width: 68px;
        display: grid;
        place-items: center;
        background-color: #fff;
        border-radius: 100%;
        border: 2px solid $default;
        position: relative;

        .icon-success{
            position: absolute;
            opacity: 0;
            transform: scale(0);
            width: 24px;
            transition: $transiton;
        }

        .number{
            font-size: 22px;
            transition: $transiton;
        }
    }

    &-title{
        position: absolute;
        font-size: 14px;
        bottom: -24px;
    }
}

.stepper-item.success{
    .stepper-item-counter{
        border-color: $main-color;
        background-color: #60cccc;
        color: #fff;
        font-weight: 600;

        .icon-success{
            opacity: 1;
            transform: scale(1);
        }

        .number{
            opacity: 0;
            transform: scale(0);
        }
    }

    .stepper-item-title{
        color: $main-color;
    }
}

.stepper-item.current{
    .stepper-item-counter{
        border-color: $main-color;
        background-color: $main-color;
        color: #fff;
        font-weight: 600;
    }

    .stepper-item-title{
        color: #818181;
    }
}

.stepper-panel{
    color: #333;
    text-align: center;
   /* box-shadow: 0 8px 12px rgba($color: #000000, $alpha: 0.09);*/

}

.controls{
    display: flex;
    justify-content: space-between;
}

.btn{
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

    &:disabled{
        opacity: 0.5;
        pointer-events: none;
    }

    &--main-color{
        background-color: $main-color;
        border-color: $main-color;
        color: #fff;
    }
}


.grid {
  display: grid;
  grid-template-columns: 6% 12% 12% 6%;
  /* overflow: hidden; */
  grid-template-rows: repeat(13, 1fr);
  grid-gap: 15px;
  column-gap: 20px;
  grid-auto-flow: column;
  justify-content: center;
}


.item {
    border-radius: 10px;
    text-align: center;
  
    box-shadow: 0 8px 12px rgba($color: #000000, $alpha: 0.09);
  /*color: white;*/
  /* height: 140px; */
}

.image{
    max-height: 150px;
}

/*

.plusminus {
  height: 100%;
  width: 30%;
  background: white;
  border: none;
  font-size: 30px;
  color: #5f5fce;
  cursor:pointer
}

.num {
  height: 100%;
  width: 39%;
  border: none;
  font-size: 25px;
}*/

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

.boton{
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

input:checked + .slider {
  background-color: $main-color;
}

input:focus + .slider {
  box-shadow: 0 0 1px $main-color;
}

input:checked + .slider:before {
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


.options{
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 40px;
    width: max-content;
    margin: auto;
}

.opt{
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 20px;
   
}

#heladeraH{
    grid-row: 2 / span 4 !important;
}

.col-3{
    grid-column: 3;
}

.col-4{
    grid-column: 4;
}

.row-2{
    grid-row: 2 / span 2 !important;
}

.grid-estanteria{
    
  display: grid;
  grid-template-columns: repeat(2, 5em);
  /* overflow: hidden; */
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 15px;
  column-gap:1px;
  grid-auto-flow: column;
  grid-row:span 4 !important;

}

.estanteria{
    justify-self: center;
    grid-row:span 2;
}

.grid-prod{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    overflow-y: auto; 
    grid-gap: 15px;
    min-height:28rem;
    max-height: 28rem;
}


@media (min-width:1920px){
    .grid button{
        min-height: 4.063rem;
        min-width: 4rem;
    }

    .grid-prod{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    overflow-y: auto; 
    grid-gap: 15px;
    min-height:35rem;
    max-height: 35rem;
}
}



.grid-estanteria-8{
    display: grid;
    grid-template-columns: repeat(1, 5em);
    /* overflow: hidden; */
    grid-template-rows: repeat(8, 1fr);
    row-gap:15px;
    column-gap:6px;
    grid-auto-flow: column;
    grid-row: 2 / span 8 !important;
}

.nuevo-nivel{
    display: flex;
    justify-content: center;
    flex-direction: column;

}

/*.stepper-content{
    margin:auto
}*/

.text-error{
    min-height: 30px;
    color:red;
}

.level{
    width: 15%;
    align-self: center;
}

.level-title{
    margin: 30px 0px 30px 0px;
}

.arrow-shelf{
    display: flex;
    justify-content: center;
}

.rotate-chevron{
    rotate:180deg;
}

.cursor-pointer{
    cursor:pointer;
}

</style>