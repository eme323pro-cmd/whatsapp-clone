<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';

// Conectamos con el servidor
const socket = io('http://localhost:3000');

const usuariosConectados = ref([]); // Array con usuarios conectados
const miUsuario = ref({}); // Datos de mi usuario
const nuevoMensaje = ref(''); // Input para el mensaje
const listaMensajes = ref([]);
const usuarioQueEscribe = ref(''); // Para el "escribiendo"

const enviar = () => {
  if (nuevoMensaje.value.trim() !== '') {
    socket.emit('enviar-mensaje', nuevoMensaje.value);
    nuevoMensaje.value = ''; // Limpiamos el input
  }
};

// Función que se activa al teclear
const avisarEscribiendo = () => {
  socket.emit('escribiendo', true);
  
  // Limpiamos el aviso después de 2 segundos de inactividad
  clearTimeout(window.typingTimeout);
  window.typingTimeout = setTimeout(() => {
    socket.emit('escribiendo', false);
  }, 2000);
};

onMounted(() => {
  // Recuperamos los datos del localStorage que guardamos en el Login
    const datosGuardados = localStorage.getItem('usuario_whatsapp');
  
    if (datosGuardados) {
        miUsuario.value = JSON.parse(datosGuardados);
        // Le decimos al servidor quiénes somos
        socket.emit('entrar-chat', miUsuario.value);
    }

    // Actualizar la lista de usuarios cuando el servidor lo diga
    socket.on('lista-usuarios', (lista) => {
        usuariosConectados.value = lista;
    });

    // Notificaciones de entrada/salida
    socket.on('notificacion', (mensaje) => {
        console.log(mensaje); 
    });

    socket.on('nuevo-mensaje', (msj) => {
        listaMensajes.value.push(msj);
    });
    
    socket.on('usuario-escribiendo', (datos) => {
        if (datos.escribiendo) {
            usuarioQueEscribe.value = datos.nombre;
        } else {
            usuarioQueEscribe.value = '';
        }
    });
});
</script>

<template>
  <div class="contenedor-chat">
    <!-- Lateral Izquierdo: Lista de Usuarios -->
    <div class="lateral">
      <div class="mi-perfil">
        <img :src="miUsuario.avatar" class="avatar" />
        <span>{{ miUsuario.nombre }} (Tú)</span>
      </div>
      
      <div class="lista-usuarios">
        <h3>Usuarios conectados ({{ usuariosConectados.length }})</h3>
        <div v-for="user in usuariosConectados" :key="user.id" class="usuario-item">
          <img :src="user.avatar" class="avatar-peque" />
          <div>
            <p class="user-nom">{{ user.nombre }}</p>
            <p class="user-est">{{ user.estado }}</p>
          </div>
        </div>
      </div>
    </div>

    <!--Sala de Chat -->
    <div class="ventana-chat">
        <!-- Cabecera del chat -->
        <div class="chat-header">Sala Común</div>

        <!-- Zona de mensajes -->
        <div class="mensajes-container">
            <div 
                v-for="(m, index) in listaMensajes" 
                :key="index" 
                :class="[
                m.nombre === 'Aviso' ? 'mensaje-sistema' : 'burbuja', 
                m.nombre === miUsuario.nombre ? 'mia' : 'otra'
                ]"
            >
            <!-- Solo mostramos el nombre si NO es un aviso y NO es mi mensaje -->
            <span 
            class="msj-nombre" 
            v-if="m.nombre !== 'Aviso' && m.nombre !== miUsuario.nombre"
            >
            {{ m.nombre }}
            </span>

            <p>{{ m.texto }}</p>

            <!-- Solo mostramos la hora si NO es un aviso -->
            <span class="msj-hora" v-if="m.nombre !== 'Aviso'">
            {{ m.hora }}
            </span>
        </div>
        </div>

        <div v-if="usuarioQueEscribe" class="aviso-escribiendo">
            {{ usuarioQueEscribe }} está escribiendo...
        </div>
        <!-- Input de abajo -->
        <div class="input-area">
            <input 
            v-model="nuevoMensaje" 
            @keyup.enter="enviar"
            @input="avisarEscribiendo" 
            placeholder="Escribe un mensaje" />
            <button @click="enviar">➤</button>
        </div>
    </div>
  </div>
</template>

<style scoped>

.contenedor-chat {
    display: flex;
    height: 100vh;
}

.lateral {
    width: 30%;
    background: #f0f2f5;
    border-right: 1px solid #ddd;
}

.ventana-chat {
    width: 70%;
    background: #e5ddd5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.mi-perfil {
    padding: 20px;
    background: #ededed;
    display: flex;
    align-items: center;
    gap: 10px;
}

.avatar {
    width: 40px;
    border-radius: 50%;
}

.avatar-peque {
    width: 30px;
    border-radius: 50%;
}

.usuario-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 20px;
    border-bottom: 1px solid #e9edef;
    background: white;
}

.user-nom {
    margin: 0;
    font-weight: bold;
}

.user-est {
    margin: 0;
    font-size: 12px;
    color: #667781;
}

.chat-header {
    width: 100%;
    padding: 15px;
    background: #ededed;
    font-weight: bold;
}

.mensajes-container {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.burbuja {
    max-width: 60%;
    padding: 8px 12px;
    border-radius: 8px;
    position: relative;
    font-size: 14px;
}

.mia {
    align-self: flex-end;
    background: #d9fdd3;
}

.otra {
    align-self: flex-start;
    background: white;
}

.msj-nombre {
    font-size: 11px;
    font-weight: bold;
    color: #00a884;
    display: block;
}

.msj-hora {
    font-size: 10px;
    color: #667781;
    float: right;
    margin-top: 5px;
    margin-left: 10px;
}

.input-area {
    width: 100%;
    padding: 10px;
    background: #f0f2f5;
    display: flex;
    gap: 10px;
}

.input-area input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    outline: none;
}

.input-area button {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #54656f;
}

.aviso-escribiendo {
  font-size: 12px;
  color: #00a884;
  font-style: italic;
  padding: 5px 20px;
  background: rgba(255, 255, 255, 0.8);
  width: 100%;
}

.mensaje-sistema {
    align-self: center;
    background-color: #f0f2f5;
    color: #54656f;
    font-size: 12px;
    padding: 6px 12px;
    border-radius: 6px;
    margin: 10px 0;
    text-align: center;
    max-width: 80%;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.mensaje-sistema p {
    margin: 0;
    line-height: 1.4;
}
</style>