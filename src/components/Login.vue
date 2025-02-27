<template>
    <div class="container-login">
      <div class="login-form">
        <div class="title-wrapper">
          <h1>Iniciar Sesión</h1>
        </div>
        <div class="input-container">
          <input
            type="text"
            v-model="dni"
            class="login-input"
            placeholder="DNI"
          />
        </div>
        <div class="input-container">
          <input
            type="password"
            v-model="password"
            class="login-input"
            placeholder="Contraseña"
          />
        </div>
        <div class="btn-container">
          <button class="ov-btn-slide-left btn-login" @click="inicio">
            Iniciar Sesion
          </button>
          <button class="ov-btn-slide-left btn-register" @click="registro">
            Registrarse
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
      dni: "",
      password: "",
      error: null,
    };
  },
  methods: {
  
    async inicio() {
    try {
        const response = await axios.post(this.url + "/login", {
            dni: this.dni,
            password: this.password,
        });

        if (response.data.success) {
            sessionStorage.setItem("token", response.data.token); // Guarda el DNI como token
            console.log("Token guardado:", response.data.token);
            this.$router.push({ name: "inicio" });
        } else {
            this.error = response.data.message || "DNI o Contraseña incorrectos";
        }
    } catch (error) {
        this.error = "Error al iniciar sesión. Inténtalo de nuevo.";
        console.error("Login error:", error);
    }
}

      
    },
    registro() {
      this.$router.push({ name: "registro" });
    },
  };
  
</script>

<style lang="scss" scoped>
$main-color: #75cc65;

.container-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: linear-gradient(150deg, #22b968, #1fc2bd);
}

.login-form {
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

.login-input {
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

.btn-login {
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

.btn-login:hover {
  background-color: darken($main-color, 10%);
}
</style>
