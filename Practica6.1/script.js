//Diana Isabel Perez Hernandez
var cajadatos;
var db;

/**
 * Inicializa la base de datos y los eventos
 */
function iniciar() {
    cajadatos = document.getElementById("datosAlbum");

    // Configuración de IndexedDB
    var request = indexedDB.open("AlbumsDB", 1);
    request.onupgradeneeded = function(event) {
        db = event.target.result;
        // Crea el ObjectStore si no existe
        if (!db.objectStoreNames.contains("albums")) {
            var store = db.createObjectStore("albums", { keyPath: "id", autoIncrement: true });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("Base de datos abierta correctamente.");
        mostrarAlbums(); // Muestra los álbumes almacenados
    };

    request.onerror = function(event) {
        console.error("Error al abrir la base de datos:", event.target.errorCode);
    };

    // Configuración de eventos para cargar archivos
    var cargarArchivo = document.getElementById("cargarArchivo");
    cargarArchivo.addEventListener("click", function() {
        var archivos = document.getElementById("archivos").files[0];
        if (archivos) {
            procesarArchivo(archivos);
        } else {
            alert("Selecciona un archivo XML.");
        }
    });

    // Configuración de eventos para buscar por año
    var buscar = document.getElementById("buscar");
    buscar.addEventListener("click", function() {
        var ano = document.getElementById("fechaB").value;
        if (ano) {
            buscarPorAno(ano);
        } else {
            alert("Ingresa un año para buscar.");
        }
    });
}

/**
 * Procesa el archivo XML seleccionado
 */
function procesarArchivo(archivo) {
    var tipo = archivo.type;
    console.log("Procesando archivo:", archivo.name, "Tipo:", tipo);

    if (tipo === "text/xml" || tipo === "application/xml") {
        cargarXML(archivo);
    } else {
        cajadatos.innerHTML = "Tipo de archivo no soportado";
    }
}

/**
 * Carga el archivo XML
 */
function cargarXML(archivo) {
    var lector = new FileReader();
    lector.addEventListener("load", mostrarYGuardarXML);
    lector.readAsText(archivo);
}

/**
 * Muestra y guarda el contenido del archivo XML en IndexedDB
 */
function mostrarYGuardarXML(evento) {
    var resultado = evento.target.result;
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(resultado, "text/xml");

    var albums = xmlDoc.getElementsByTagName("album");
    if (albums.length === 0) {
        cajadatos.innerHTML = "No se encontraron álbumes en el archivo XML.";
        console.error("No se encontraron etiquetas <album> en el archivo XML.");
        return;
    }

    var contenido = "<ul>"; // Listado HTML para los álbumes

    // Iniciar transacción para guardar en IndexedDB
    var transaction = db.transaction(["albums"], "readwrite");
    var store = transaction.objectStore("albums");

    // Recorre cada <album> y guarda los datos en IndexedDB
    for (var i = 0; i < albums.length; i++) {
        var artist = albums[i].getElementsByTagName("artist")[0]?.textContent || "N/A";
        var title = albums[i].getElementsByTagName("title")[0]?.textContent || "N/A";
        var songs = albums[i].getElementsByTagName("songs")[0]?.textContent || "N/A";
        var year = albums[i].getElementsByTagName("year")[0]?.textContent || "N/A";
        var genre = albums[i].getElementsByTagName("genre")[0]?.textContent || "N/A";

        console.log("Guardando álbum:", artist, title, year);

        // Guardar el álbum en IndexedDB
        var albumData = { artist: artist, title: title, songs: songs, year: year, genre: genre };
        store.add(albumData);

        // Agregar cada álbum al contenido HTML para mostrarlo
        contenido += "<li><strong>Artista:</strong> " + artist +
                     " <strong>Título:</strong> " + title +
                     " <strong>Canciones:</strong> " + songs +
                     " <strong>Año:</strong> " + year +
                     " <strong>Género:</strong> " + genre + 
                     " <button onclick='eliminarAlbum(" + i + ")'>Eliminar</button></li><br>";
    }

    contenido += "</ul>";
    cajadatos.innerHTML = contenido;

    transaction.oncomplete = function() {
        console.log("Álbumes guardados correctamente en IndexedDB.");
        mostrarAlbums(); // Muestra los álbumes almacenados
    };

    transaction.onerror = function(event) {
        console.error("Error al guardar álbumes en IndexedDB:", event.target.errorCode);
    };
}

/**
 * Muestra los álbumes almacenados en IndexedDB y agrega botones de eliminar
 */
function mostrarAlbums() {
    var transaction = db.transaction(["albums"], "readonly");
    var store = transaction.objectStore("albums");

    var request = store.getAll();
    request.onsuccess = function(event) {
        var albums = event.target.result;
        var contenido = "<ul>";
        if (albums.length > 0) {
            albums.forEach(function(album, index) {
                contenido += "<li><strong>Artista:</strong> " + album.artist +
                             " <strong>Título:</strong> " + album.title +
                             " <strong>Canciones:</strong> " + album.songs +
                             " <strong>Año:</strong> " + album.year +
                             " <strong>Género:</strong> " + album.genre + 
                             " <button onclick='eliminarAlbum(" + album.id + ")'>Eliminar</button></li><br>";
            });
        } else {
            contenido += "<li>No hay álbumes almacenados.</li>";
        }
        contenido += "</ul>";
        cajadatos.innerHTML = contenido;
    };

    request.onerror = function(event) {
        console.error("Error al obtener álbumes de IndexedDB:", event.target.errorCode);
    };
}

/**
 * Elimina un álbum de IndexedDB usando su id
 */
function eliminarAlbum(id) {
    var transaction = db.transaction(["albums"], "readwrite");
    var store = transaction.objectStore("albums");

    var request = store.delete(id);
    request.onsuccess = function(event) {
        console.log("Álbum eliminado correctamente.");
        mostrarAlbums(); // Refresca la lista de álbumes
    };

    request.onerror = function(event) {
        console.error("Error al eliminar el álbum:", event.target.errorCode);
    };
}

/**
 * Busca álbumes por año en IndexedDB
 */
function buscarPorAno(ano) {
    var transaction = db.transaction(["albums"], "readonly");
    var store = transaction.objectStore("albums");

    var request = store.getAll();
    request.onsuccess = function(event) {
        var albums = event.target.result;
        var contenido = "<ul>";
        var encontrado = false;

        albums.forEach(function(album) {
            if (album.year === ano) {
                contenido += "<li><strong>Artista:</strong> " + album.artist +
                             " <strong>Título:</strong> " + album.title +
                             " <strong>Canciones:</strong> " + album.songs +
                             " <strong>Año:</strong> " + album.year +
                             " <strong>Género:</strong> " + album.genre + "</li><br>";
                encontrado = true;
            }
        });

        if (!encontrado) {
            contenido += "<li>No se encontraron álbumes del año " + ano + ".</li>";
        }

        contenido += "</ul>";
        cajadatos.innerHTML = contenido;
    };

    request.onerror = function(event) {
        console.error("Error al buscar álbumes por año en IndexedDB:", event.target.errorCode);
    };
}

// Inicializa el sistema cuando se carga la página
window.addEventListener("load", iniciar);

