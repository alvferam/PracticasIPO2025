// utils.js

// VARIANTE: Distintos juegos de palabras 
export const PALABRAS_FACILES = [
    "sol", "mar", "casa", "luna", "agua", "mesa", "perro", "gato", "azul", "rojo", "pan", "pez", "luz", "ver", "ir", "rey", "ley", "pie", "sal", "voz",
    "dia", "noche", "cielo", "flor", "tren", "mano", "dedo", "ojo", "pelo", "cara", "paz", "don", "fin", "hoy", "ayer", "cien", "mil", "tres", "seis", "siete",
    "lapiz", "papel", "libro", "hoja", "silla", "cama", "piso", "auto", "moto", "barco"
];

export const PALABRAS_NORMALES = [
    "programacion", "javascript", "desarrollo", "frontend", "backend", "teclado", "funcion", "variable", "proyecto", "aplicacion",
    "internet", "navegador", "servidor", "cliente", "codigo", "fuente", "estilo", "enlace", "boton", "menu", "ventana", "archivo", "carpeta", "raton", "imagen",
    "video", "audio", "texto", "lista", "tabla", "formulario", "red", "nube", "clase", "objeto", "metodo", "array", "consola", "error", "evento", "bucle", "control",
    "version", "sistema", "usuario", "computadora", "pantalla", "memoria", "puerto"
];

export const PALABRAS_DIFICILES = [
    "algoritmo", "flexbox", "intervalo", "identificador", "asincronia", "maquetacion", "responsivo", "transicion", "callback", "parametrizacion",
    "abstraccion", "polimorfismo", "herencia", "encapsulamiento", "interfaz", "despliegue", "compilador", "interprete", "depuracion", "refactorizar",
    "componente", "framework", "libreria", "repositorio", "versionado", "protocolo", "autenticacion", "autorizacion", "encriptacion", "desencriptacion", "recursividad",
    "dependencia", "inyeccion", "promesa", "observador", "manejador", "excepcion", "semantico", "accesibilidad", "escalabilidad", "optimizar", "microservicio"
];

// VARIANTE: Test Bilingüe 
export const DICCIONARIO_BILINGUE = {
    "computer": "computadora", "keyboard": "teclado", "coding": "programacion", "function": "funcion", "project": "proyecto", "speed": "velocidad", "word": "palabra", 
    "time": "tiempo", "correct": "correcto", "language": "lenguaje", "mouse": "raton", "file": "archivo", "folder": "carpeta", "window": "ventana", "save": "guardar",
    "open": "abrir","close": "cerrar","delete": "borrar", "copy": "copiar", "paste": "pegar", "cut": "cortar", "new": "nuevo", "user": "usuario", "password": "contraseña",
    "email": "correo", "web": "red", "link": "enlace", "button": "boton", "menu": "menu", "error": "error", "debug": "depurar", "server": "servidor", "client": "cliente",
    "cloud": "nube", "database": "basedatos", "query": "consulta", "table": "tabla", "row": "fila", "column": "columna"
};

// Funciones auxiliares
export function recuperaElementoAleatorio(array) {
  const size = array.length;
  const indiceRealAleatorio = Math.random() * size;
  const indiceAleatorio = Math.floor(indiceRealAleatorio);
  return array[indiceAleatorio];
}