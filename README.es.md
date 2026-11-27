# pretty-mods

Mods bonitas para Claude Code: cambian cómo se ve y qué muestra. Un aspecto navideño con Santa, un aspecto de gatito con un gato en una repisa bajo la luna, algunos extras para la línea de estado y una skill que crea mods a tu estilo. Todo es gratis.

[English](README.md)

## Antes de empezar

- **Necesitas Claude Code.** Estas mods funcionan solo en Claude Code. No funcionaron en una cuenta de Claude Free cuando la dueña del repositorio lo probó.
- **Los temas (aspectos) solo se ven en la app de escritorio de Claude**, en una sesión de Claude Code. La terminal y los editores no dibujan temas. Usa una sesión **en tu propio ordenador**: una sesión que corre en la nube puede mostrar una copia antigua del tema, o ninguna.
- **Las mods de línea de estado** (`kitty-status`, `christmas-countdown`, `now-playing`) se muestran en la terminal de Claude Code. En la app de escritorio de Windows `now-playing` se mostró y las otras dos no fueron fiables: mira "Qué funciona dónde".
- **Un solo tema a la vez.** Si hay dos activos, gana el último.
- Todavía no es para todo el mundo: se ha probado en un solo PC con Windows. Un Mac no se ha probado, y en un iPhone no se vio ningún tema.

## Qué funciona dónde

"Visto" significa que la dueña informó de que lo vio. Todo lo demás se comprobó solo con herramientas, no a ojo.

| Mod | Dónde se muestra | ¿Visto? |
|---|---|---|
| `christmas-theme` | App de escritorio de Claude, en una sesión de Claude Code en tu propio ordenador | Sí, en Windows (versión 0.2.4, "se ve bien", y Santa se ve nítido; después la dueña informó de que los regalos añadidos en la 0.2.6 se ven bien). iPhone: se probó una vez, en una sesión de Remote Control que corría en el ordenador con el tema activado, y no se vio ningún tema |
| `christmas-town-theme` | Igual que arriba | Sí, en Windows: la primera versión tenía chimeneas que no se veían; tras la 0.1.1 (chimeneas de ladrillo con nieve) la dueña informó de que se ve bien |
| `christmas-market-theme` | Igual que arriba | Sí, en Windows: tras pedir la dueña tres puestos (0.2.0), informó de que "está bien", aunque los puestos le siguen pareciendo grandes y decidió dejarlos así. Tras la 0.2.1 (casas del fondo visibles, tazas con asa) informó de que se ve bien. La primera versión mostraba solo dos puestos, uno cortado en el borde |
| `new-year-theme` | Igual que arriba | Sin informe todavía. Solo comprobado en un render en navegador, en claro y en oscuro |
| `snowman-theme` | Igual que arriba | Sin informe todavía. Solo comprobado en un render en navegador, en claro y en oscuro |
| `kitty-theme` | Igual que arriba | Sí, en Windows (la dueña informó de que "se ve bien", y después de que la cola del gato y las estrellas se ven y se mueven en la 0.1.6). iPhone: se probó una vez, en una sesión de Remote Control que corría en el ordenador con el tema activado, y no se vio ningún tema |
| `kitty-status`, `christmas-countdown` | La línea de estado en la terminal de Claude Code | Sí, las dos funcionan en la terminal de Claude Code (informe de la dueña). **En la app de escritorio de Windows los informes fueron mixtos:** `kitty-status` se vio una vez bajo la caja de texto y luego no, y `christmas-countdown` nunca se vio allí. Una línea de prueba que se actualizaba cada 5 segundos tampoco se mostró en una sesión en la nube. No cuentes con las líneas de estado en la app de escritorio; la causa no se conoce |
| `now-playing` | La línea de estado, bajo la caja de texto (Mac: app Música; Windows: cualquier reproductor que informe a los controles multimedia del sistema, como YouTube Music en un navegador) | **Sí, en Windows, en la app de escritorio** (captura de la dueña, versión 0.2.0: se mostraron título y artista con el nombre de la mod delante) **y en la terminal de Claude Code** (informe de la dueña, versión no indicada). Mac: nunca se ha ejecutado. Las letras con acento salían rotas en la 0.2.0; la dueña confirmó que se ven bien (é y ñ) en la 0.2.1 |

## Las mods

### Navidad

![Vista previa de christmas-theme: una noche verde pino con nieve, el trineo de Santa y un reno](docs/previews/christmas-theme.png)

*Vista previa solo de la escena, dibujada en un navegador. La app añade encima su propio desenfoque y sus paneles, así que allí se ve distinto. No es una captura de la pantalla de nadie.*

![Vista previa de christmas-town-theme: un pueblo en una noche azul medianoche con ventanas encendidas, una iglesia y pinos con luces](docs/previews/christmas-town-theme.png)

*Vista previa de `christmas-town-theme`, dibujada de la misma forma.*

![Vista previa de christmas-market-theme: un mercadillo de Navidad de noche con puestos, luces, un abeto y gente comiendo y bebiendo](docs/previews/christmas-market-theme.png)

*Vista previa de `christmas-market-theme`, dibujada de la misma forma, en un momento con los brazos levantados.*

| Mod | Qué hace |
|---|---|
| `christmas-theme` | Verde pino profundo con texto crema cálido, acentos granate y dorado, una nevada lenta, y Santa con su trineo lleno de regalos envueltos, tirado por un tiro de tres renos con Rudolph delante, subiendo por el cielo una vez cada 70 segundos. Oscuro. |
| `christmas-town-theme` | Otro aspecto navideño, con un pueblo: una noche azul medianoche con casas con tejados nevados, chimeneas de ladrillo y sus ventanas encendidas, una iglesia con campanario, pinos con luces de colores, una luna, humo de chimeneas que se eleva despacio y una nevada lenta. Oscuro. Instálalo en lugar de `christmas-theme`, no a la vez. |
| `christmas-market-theme` | Un mercadillo de Navidad de noche: tres puestos de madera (rojo, mostaza y verde) con tejados nevados y toldos a rayas, guirnaldas de luces de colores entre ellos, un abeto alto iluminado detrás del central, dos mesas altas con una vela y una taza humeante, y seis personas con abrigos de invierno comiendo y bebiendo (un salchichón en pan, un pretzel, un crepe, tazas de algo caliente). Los brazos suben despacio hacia la boca y sale vapor de las tazas. Oscuro. Instálalo en lugar de los otros temas navideños, no a la vez. |
| `christmas-countdown` | Muestra "🎄 N days to Christmas" en la línea de estado, y "🎄 Merry Christmas!" el mismo día. Sigue siendo correcto si dejas una sesión abierta pasada la medianoche. |

### Gatitos

![Vista previa de kitty-theme: una noche ciruela con luna y un gato en una repisa](docs/previews/kitty-theme.png)

*Vista previa solo de la escena, dibujada en un navegador, sin el desenfoque ni los paneles de la app.*

| Mod | Qué hace |
|---|---|
| `kitty-theme` | Noche ciruela suave, texto crema y acentos rosas, con una luna y un gato dormilón en una repisa. Solo se mueven la cola y las estrellas, despacio. Oscuro. |
| `kitty-status` | Un gatito en la línea de estado cuyo humor sigue la hora del día ("😴 kitty is asleep", "😺 kitty wants breakfast", "😸 kitty is purring"...). El texto de la línea está en inglés. |

### Muñeco de nieve

![Vista previa de snowman-theme: un muñeco de nieve y otro pequeño en una colina nevada con abetos, de día a la izquierda y de noche a la derecha](docs/previews/snowman-theme.png)

*Vista previa solo de la escena, de día (izquierda) y de noche (derecha), dibujada en un navegador, sin el desenfoque ni los paneles de la app.*

| Mod | Qué hace |
|---|---|
| `snowman-theme` | Un muñeco de nieve con chistera, bufanda roja y nariz de zanahoria, en una colina nevada con abetos decorados (bolas, luces y una estrella dorada) con abetos, bajo una nevada lenta. Sigue tu modo claro u oscuro: un día de nieve luminoso con sol, o una noche de nieve con estrellas y luna. Las bufandas ondean un poco y las estrellas parpadean. Los paneles detrás del texto son de cristal esmerilado, así que la escena se ve suavizada detrás de ellos; el muñeco y los abetos están en los bordes, fuera del centro donde suele estar el panel del chat. |

### Año Nuevo

![Vista previa de new-year-theme: fuegos artificiales sobre una ciudad, de día a la izquierda y de noche a la derecha](docs/previews/new-year-theme.png)

*Vista previa solo de la escena, de día (izquierda) y de noche (derecha), dibujada en un navegador, sin el desenfoque ni los paneles de la app.*

| Mod | Qué hace |
|---|---|
| `new-year-theme` | Un horizonte de ciudad con ventanas encendidas y confeti que cae despacio. En los últimos diez minutos del año, una cuenta atrás en dorado (de 10 a 1, cambiando cada minuto). Desde la medianoche, el año 2027 en dorado y fuegos artificiales que estallan en los bordes izquierdo y derecho, hasta la 01:00 del 1 de enero. Es siempre oscuro, aunque tu sistema esté en claro, y los paneles detrás del texto son de cristal esmerilado. No hay aviso a medianoche: en las pruebas, la app de escritorio no lo mostró, así que solo cambia la escena. El móvil no es compatible por ahora: hasta ahora no se ha visto ningún tema en un iPhone |

### Música

| Mod | Qué hace |
|---|---|
| `now-playing-controls` | Comandos `/next-song`, `/previous-song` y `/play-pause`, una fila con botones Anterior, Reproducir/pausa y Siguiente encima de la caja de texto, y un panel `/playback` con los mismos botones (ambos solo mientras suena una canción). La fila tiene una ✕ que la oculta hasta que empiece la siguiente canción o escribas `/playback`, en la terminal de Claude Code. Mac: solo la app Música. Windows: lo que muestren los controles multimedia del sistema. No muestra nada en la línea de estado. |
| `now-playing` | Muestra "🎵 título - artista" en la línea de estado para la canción que suena. Se actualiza cada 15 segundos. No muestra nada si no suena nada. No necesita conectar ninguna cuenta, ni claves, ni iniciar sesión, porque pregunta a tu propio ordenador. |

## Instalación

En una terminal, inicia Claude Code (`claude`) y escribe, para cada mod que quieras:

```
/plugin install christmas-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-countdown --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-town-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install christmas-market-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install kitty-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install snowman-theme --marketplace malenaaza/pretty-mods
```

```
/plugin install new-year-theme --marketplace malenaaza/pretty-mods
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

Si `enable`, `disable` o `update` dicen que funcionó desde una terminal pero no cambia nada en tus sesiones, añade el alcance con el que la instalaste, por ejemplo `claude plugin enable christmas-theme --scope user`. Esos comandos eligen un alcance por su cuenta cuando no se indica, y puede no ser el que leen tus sesiones. Dentro de una sesión de Claude Code, `/plugin` actúa sobre el alcance en el que estás. (Una usuaria vio que `enable` decía haberlo hecho desde PowerShell sin efecto, y que `/plugin` sí funcionó; la causa no se confirmó.)

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

- La skill `pretty-mods` crea mods a tu estilo, y trae una plantilla para un tema con el logo de tu propia empresa, que puede seguir el modo claro u oscuro de tu sistema. Un PNG sencillo de un solo color se puede trazar a vectores.
- Todo lo de este repositorio es gratis y con licencia MIT.
- Cómo funcionan por dentro, cómo hacer o cambiar una, y el estado detallado de lo probado: en el [README en inglés](README.md).

Licencia MIT.
