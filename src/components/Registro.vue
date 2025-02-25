<template>
    <div class="container-register">
      <div class="register-form">
        <div class="title-wrapper">
          <h1>Registro</h1>
        </div>
        <div class="input-container">
          <input
            type="text"
            v-model="nombre"
            class="register-input"
            placeholder="Nombre"
          />
        </div>
        <div class="input-container">
          <input
            type="text"
            v-model="dni"
            class="register-input"
            placeholder="DNI"
          />
        </div>
        <div class="input-container">
          <input
            type="password"
            v-model="password"
            class="register-input"
            placeholder="Contraseña"
          />
        </div>
        <div class="input-container">
          <input
            type="tel"
            v-model="celular"
            class="register-input"
            placeholder="Celular"
          />
        </div>
        <div class="btn-container">
          <button class="ov-btn-slide-left btn-register-submit" @click="registrar">
            Registrar
          </button>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        url: process.env.NODE_ENV === "development" ? "http://localhost:8081" : "http://localhost:8081",
        nombre: "",
        dni: "",
        password: "",
        celular: "",
        error: null,
      };
    },
    methods: {
      async registrar() {
        try {
          const response = await axios.post(`${this.url}/registro`, {
            nombre: this.nombre,
            dni: this.dni,
            password: this.password,
            celular: this.celular,
          });
  
          if (response.data.success) {
            this.$router.push({ name: "login" }); // Redirige a la página de inicio de sesión después del registro exitoso
          } else {
            this.error = response.data.message || "Error al registrar. Inténtalo de nuevo.";
          }
        } catch (error) {
          this.error = "Error al registrar. Inténtalo de nuevo.";
          console.error("Registro error:", error);
        }
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  $main-color: #75cc65;
  
  .container-register {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: linear-gradient(150deg, #22b968, #1fc2bd);
  }
  
  .register-form {
    width: 400px;
    padding: 40px;
    background-color: white;
    border-radius: 60px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .title-wrapper {
    text-align: center;
    margin-bottom: 30px;
  }
  
  .title-wrapper h1 {
    font-size: 32px;
    color: #333;
  }
  
  .input-container {
    margin-bottom: 20px;
  }
  
  .register-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 60px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .btn-container {
    text-align: center;
  }
  
  .btn-register-submit {
    border-radius: 60px;
    background-color: $main-color;
    padding: 16px 32px;
    border: none;
    color: white;
    font-weight: 600;
    font-size: 18px;
    cursor: pointer;
    width: 100%;
  }
  
  .btn-register-submit:hover {
    background-color: darken($main-color, 10%);
  }
  
  .error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
  }
  </style>