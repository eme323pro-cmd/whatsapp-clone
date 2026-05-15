<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, googleProvider, githubProvider } from '../firebase' 
import { signInWithPopup } from 'firebase/auth'

const router = useRouter();

// Variables 
const nombre = ref('');
const estado = ref('');
const avatarSeleccionado = ref('');

// lista de avatares predefinidos
const avatares = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna'
];

// Función para entrar al chat 
const entrarAlChat = () => {
  if (nombre.value && estado.value && avatarSeleccionado.value) {
    const usuario = {
      nombre: nombre.value,
      estado: estado.value,
      avatar: avatarSeleccionado.value
    };
    localStorage.setItem('usuario_whatsapp', JSON.stringify(usuario));
    router.push('/chat');
  } else {
    alert("Por favor, completa todos los campos y selecciona un avatar");
  }
};

async function entrarConGoogle() {
  if (estado.value && avatarSeleccionado.value) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const usuario = {
        nombre: result.user.displayName,
        estado: estado.value,
        avatar: avatarSeleccionado.value
      };
      localStorage.setItem('usuario_whatsapp', JSON.stringify(usuario));
      router.push('/chat');
    } catch (error) {
      console.log("Error Google: " + error.message);
    }
  } else {
    alert("Selecciona estado y avatar primero");
  }
}

async function entrarConGitHub() {
  if (estado.value && avatarSeleccionado.value) {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const usuario = {
        nombre: result.user.displayName || "Usuario GitHub",
        estado: estado.value,
        avatar: avatarSeleccionado.value
      };
      localStorage.setItem('usuario_whatsapp', JSON.stringify(usuario));
      router.push('/chat');
    } catch (error) {
      console.log("Error GitHub: " + error.message);
    }
  } else {
    alert("Selecciona estado y avatar primero");
  }
}
</script>

<template>
  <div class="contenedor-login">
    <div class="tarjeta-login">
      
      <div class="header-login">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
          alt="WhatsApp Logo"
        />
        <h2>Identifícate</h2>
      </div>

      <div class="formulario">
        <div class="campo">
          <label>Tu nombre (para chat manual)</label>
          <input 
            v-model="nombre" 
            type="text" 
            placeholder="Escribe tu nombre"
          />
        </div>

        <div class="campo">
          <label>Tu estado</label>
          <input 
            v-model="estado" 
            type="text" 
          />
        </div>

        <div class="campo">
          <label>Elige un avatar</label>
          <div class="lista-avatares">
            <img 
              v-for="url in avatares" 
              :key="url" 
              :src="url" 
              :class="{ 'avatar-activo': avatarSeleccionado === url }"
              @click="avatarSeleccionado = url"
            />
          </div>
        </div>

        <button 
          class="boton-entrar" 
          @click="entrarAlChat"
        >
          Entrar al chat manual
        </button>

        <div class="separador">o entra con</div>

        <button class="boton-google" @click="entrarConGoogle">
          Google
        </button>

        <button class="boton-github" @click="entrarConGitHub">
          GitHub
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.contenedor-login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
}

.tarjeta-login {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.header-login {
  text-align: center;
  margin-bottom: 30px;
}

.header-login img {
  width: 70px;
  margin-bottom: 10px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.campo label {
  font-size: 14px;
  color: #667781;
  font-weight: bold;
}

.campo input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.campo input:focus {
  border-color: #00a884;
}

.lista-avatares {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.lista-avatares img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  cursor: pointer;
  border: 3px solid transparent;
  transition: 0.3s;
}

.lista-avatares img:hover {
  transform: scale(1.1);
}

.avatar-activo {
  border-color: #00a884 !important;
}

.boton-entrar {
  background-color: #00a884;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.boton-entrar:hover {
  background-color: #008f6f;
}

.grupo-botones-sociales {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 25px;
}

.boton-google, .boton-github {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ddd;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
}

.boton-google {
    background-color: white;
    color: #444;
}

.boton-google:hover {
    background-color: #f8f8f8;
}

.boton-github {
    background-color: #24292e;
    color: white;
}

.boton-github:hover {
    background-color: #111;
}

.boton-google img, .boton-github img {
    width: 20px;
}
</style>