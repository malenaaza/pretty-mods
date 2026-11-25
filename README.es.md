# pretty-mods

Mods bonitas para Claude Code: cambian cómo se ve y qué muestra. Un aspecto navideño con Santa, un aspecto de gatito con un gato en una repisa bajo la luna, algunos extras para la línea de estado y una skill que crea mods a tu estilo. Todo es gratis.

[English](README.md)

## Antes de empezar

- **Necesitas Claude Code.** Estas mods funcionan solo en Claude Code. No funcionaron en una cuenta de Claude Free cuando la dueña del repositorio lo probó.
- **Los temas (aspectos) solo se ven en la app de escritorio de Claude**, en una sesión de Claude Code. La terminal y los editores no dibujan temas. Usa una sesión **en tu propio ordenador**: una sesión que corre en la nube puede mostrar una copia antigua del tema, o ninguna.
- **Las mods de línea de estado** (`christmas-countdown`, `kitty-status`, `now-playing`) se muestran en la terminal de Claude Code. La app de escritorio de Windows no las mostró.
- **Un solo tema a la vez.** Si hay dos activos, gana el último.
- Todavía no es para todo el mundo: se ha probado en un solo PC con Windows. Mac y móvil no se han probado.

## Qué funciona dónde

"Visto" significa que la dueña informó de que lo vio. Todo lo demás se comprobó solo con herramientas, no a ojo.

| Mod | Dónde se muestra | ¿Visto? |
|---|---|---|
| `christmas-theme` | App de escritorio de Claude, en una sesión de Claude Code en tu propio ordenador | Sí, en Windows (versión 0.2.4, "se ve bien", y Santa se ve nítido). Móvil: sin probar |
| `kitty-theme` | Igual que arriba | Sí, en Windows (la dueña informó de que "se ve bien"; la 0.1.5 era la versión actual, no dijo cuál exactamente). Móvil: sin probar |
| `christmas-countdown`, `kitty-status` | La línea de estado en la terminal de Claude Code. La app de escritorio de Windows no las mostró | Sí, las dos funcionan en la terminal de Claude Code (informe de la dueña). **No en la app de escritorio de Windows**: ninguna de las dos líneas se mostró allí, ni siquiera con `christmas-countdown` instalado desde el marketplace (informe de la dueña) |
| `now-playing` | La línea de estado en la terminal de Claude Code (Mac: app Música; Windows: cualquier reproductor que informe a los controles multimedia del sistema, como YouTube Music en un navegador) | No. Nunca se ha ejecutado en un Mac ni en un PC con Windows reales |

## Las mods

### Navidad

![Vista previa de christmas-theme: una noche verde pino con nieve, el trineo de Santa y un reno](docs/previews/christmas-theme.png)

*Vista previa solo de la escena, dibujada en un navegador. La app añade encima su propio desenfoque y sus paneles, así que allí se ve distinto. No es una captura de la pantalla de nadie.*

| Mod | Qué hace |
|---|---|
| `christmas-theme` | Verde pino profundo con texto crema cálido, acentos granate y dorado, una nevada lenta, y Santa con su trineo y un reno cruzando el cielo una vez cada 70 segundos. Oscuro. |
| `christmas-countdown` | Muestra "🎄 N days to Christmas" en la línea de estado, y "🎄 Merry Christmas!" el mismo día. Sigue siendo correcto si dejas una sesión abierta pasada la medianoche. |

### Gatitos

![Vista previa de kitty-theme: una noche ciruela con luna y un gato en una repisa](docs/previews/kitty-theme.png)

*Vista previa solo de la escena, dibujada en un navegador, sin el desenfoque ni los paneles de la app.*

| Mod | Qué hace |
|---|---|
| `kitty-theme` | Noche ciruela suave, texto crema y acentos rosas, con una luna y un gato dormilón en una repisa. Solo se mueven la cola y las estrellas, despacio. Oscuro. |
| `kitty-status` | Un gatito en la línea de estado cuyo humor sigue la hora del día ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). El texto de la línea está en inglés. |

### Música

| Mod | Qué hace |
|---|---|
| `now-playing` | Muestra "🎵 título - artista" en la línea de estado para la canción que suena. Se actualiza cada 15 segundos. No muestra nada si no suena nada. Solo en la terminal. No necesita conectar ninguna cuenta, ni claves, ni iniciar sesión, porque pregunta a tu propio ordenador. |

## Instalación

En una terminal, inicia Claude Code (`claude`) y escribe, para cada mod que quieras:

```
/plugin install christmas-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-countdown --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-status --marketplace malenaaza/pretty-mods
```

```
/plugin install now-playing --marketplace malenaaza/pretty-mods
```

Te pregunta una vez si añadir el marketplace (`y`), y luego el alcance. Elige **user** para tener la mod en todas las sesiones de ese ordenador, o **project** para una sola carpeta. Después abre una sesión **nueva**: el tema se aplica al empezar la sesión.

El menú **+** y luego **Plugins** de la app de escritorio también puede funcionar, pero en la versión de la dueña no tenía el botón "Add marketplace", así que la terminal es la vía que se ha probado.

Para actualizar tras una versión nueva: `claude plugin marketplace update pretty-mods`, y luego `claude plugin update <mod>`. Para apagar una: `claude plugin disable <mod>`.

## Si no ves nada

1. **Ejecuta `claude plugin list`** en una terminal. ¿Está la mod, en la versión que esperas y activa?
2. **Abre una sesión nueva.** Los temas se aplican al empezar.
3. **Usa una sesión en tu propio ordenador** en la app de escritorio, no una de la nube.
4. **Apaga los otros temas** para que solo haya uno.
5. **Una sesión de terminal solo imprime una nota** como "no attached desktop or mobile client draws themes yet". Es lo esperado: la terminal no dibuja temas.
6. **En una cuenta Free** las mods no funcionaron, y la causa no se investigó.
7. **¿Sigue sin verse?** Abre un issue con tu sistema, la versión de la app, la salida de `claude plugin list` y lo que ves.

## Qué hacen las mods en tu ordenador

- **Los temas** solo fijan colores y una imagen detrás de la conversación. No ejecutan comandos ni usan la red.
- **`christmas-countdown` y `kitty-status`** leen el reloj y muestran una línea de texto. No usan la red.
- **`now-playing`** ejecuta un pequeño comando en tu ordenador para preguntar qué suena: `osascript` en Mac, o Windows PowerShell en Windows. Lee solo el título y el artista y no los envía a ningún sitio. En Mac, la primera vez macOS puede pedir permiso para que la terminal controle Música; permítelo si quieres que funcione.
- Ninguna mod recoge ni envía tus datos. El código está en `plugins/` y puedes leerlo.

## Movimiento

Las escenas navideña y de gatitos se mueven despacio, sin parpadeos. Se paran cuando el ajuste "reducir movimiento" de tu sistema está activado. La dueña confirmó en Windows que funciona en la app (no dijo con cuál de los dos temas lo comprobó).

## Más

- La skill `pretty-mods` crea mods a tu estilo, y trae una plantilla para un tema con el logo de tu propia empresa.
- Todo lo de este repositorio es gratis y con licencia MIT, y seguirá siéndolo. Más adelante podría aparecer un conjunto de pago aparte, en otro repositorio privado; hoy no hay nada a la venta.
- Cómo funcionan por dentro, cómo hacer o cambiar una, y el estado detallado de lo probado: en el [README en inglés](README.md).

Licencia MIT.
