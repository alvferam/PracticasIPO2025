// utils.js

// VARIANTE: Distintos juegos de palabras 
export const PALABRAS_FACILES = [
    "sol", "mar", "casa", "luna", "agua", "mesa", "perro", "gato", "azul", "rojo","pez","coco",
];

export const PALABRAS_NORMALES = [
    "programacion", "javascript", "desarrollo", "frontend", "backend",
    "teclado", "funcion", "variable", "proyecto", "aplicacion",
];

export const PALABRAS_DIFICILES = [
    "algoritmo", "flexbox", "intervalo", "identificador", "asincronia",
    "maquetacion", "responsivo", "transicion", "callback", "parametrizacion",
];

// VARIANTE: Test Bilingüe 
export const DICCIONARIO_BILINGUE = {
    "computer": "computadora",
    "keyboard": "teclado",
    "coding": "programacion",
    "function": "funcion",
    "project": "proyecto",
    "speed": "velocidad",
    "word": "palabra",
    "time": "tiempo",
    "correct": "correcto",
    "language": "lenguaje"
};


// Funciones auxiliares
export function recuperaElementoAleatorio(array) {
  const size = array.length;
  const indiceRealAleatorio = Math.random() * size;
  const indiceAleatorio = Math.floor(indiceRealAleatorio);
  return array[indiceAleatorio];
}