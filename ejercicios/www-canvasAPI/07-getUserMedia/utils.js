// utils.js

// Métodos auxilares para el procesamiento de imágenes

// Calcula la semejanza cromática entre dos pixeles px1 y px2
// Un pixel px se interpreta como un punto (r,g,b) en un espacio tridimensional
export function semejanzaCromática(px1, px2, threshold = 160) {

  // Primera versión: Los píxeles deben tener exactamente los mismos valores
  // Problema: Muy restrictivo, no funciona bien con imágenes reales con ruido
  //     return px1.r == px2.r && px1.g == px2.g && px1.b == px2.b;

  // Segunda versión: La semejanza se calibra fijando un umbral de la distancia 
  // euclídea que hay entre ambos pixeles en el espacio tridimensional RGB.
  // Problema: Muy costosa computacionalmente por el uso de la raíz cuadrada.

  // Tercera versión (la actual): distancia euclídea al cuadrado (más eficiente)
  const sqDistance = (px1.r - px2.r) ** 2 + (px1.g - px2.g) ** 2 + (px1.b - px2.b) ** 2;
  return sqDistance < threshold * threshold;
}

// Calcula el punto central de una nube de puntos
export function puntoCentral(puntos) {
  const res = { x: 0, y: 0 };

  puntos.forEach((loc) => {
    res.x += loc.x;
    res.y += loc.y;
  });
  res.x /= puntos.length;
  res.y /= puntos.length;

  return res;
}
