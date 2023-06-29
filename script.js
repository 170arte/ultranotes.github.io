//cuando se termina de cargar el documento cargamos las notas

$(document).ready(() => {

    cargarNotas();
})

//al boton guardar le damos un evento on click
//que se encarga de tomar los valores dentro de los text input
//y los colora en localStorage en una representación de string del objeto de nota
//y luego vuelve a cargar las notas para mostrar la lista actualizada

$("#BotonGuardar").on("click", () => {
    
    const titulo = $("#InputTitulo").val();
    const contenido = $("#InputContenido").val();
    const storage = window.localStorage;
    storage.setItem(
        storage.length,
        JSON.stringify({titulo, contenido}));
        cargarNotas();
});

//crear archivo crea un blob que su contenido va a ser texto
//y tambien le creamos una url correspondiente para poder descargarlo

function crearArchivo(texto) {

    let data = new Blob([texto], {type: "text/plain"});

    let archivoTexto = window.URL.createObjectURL(data);

    return archivoTexto;
}

//se borran todas las notas y vuelve a cargarlas para actualizar el html

$("#BotonBorrarNotas").on("click" , () => {
    borrarNotas();
    cargarNotas();
})

function cargarNotas() {
    //almacenamiento del navegador
    const storage = window.localStorage;

    //tag HTML para insertar las notas
    
    $("#grillaNotas").empty();

    //tenemos que recorrer todas las notas guardadas 
    
    for(let i = 0; i < storage.length; i++) {

        //con el indide de cada entrada en el storage obtenemos la llave de cada nota

        let key = storage.key(i)

        //con esa llave obtenemos el objeto de la nota que guardamos en forma de string
        //y con JSON.parse() creamos un objeto
        let nota = JSON.parse(storage.getItem(key));

        // por cada nota agregamos el html correspondiente y le interpolamos los contenidos de la nota
        //también le agregamos un boton para eliminar y descargar la nota
        $("#grillaNotas").append(
            `
            <div class="card w-100 my-1" style="width: 18rem;">
                 <div class="card-body">
                    <h5 class="card-title">${nota.titulo}</h5>
                    <p class="card-text">${nota.contenido}</p>
                    <button id="BotonDescargar-${i}" class="btn btn-primary">Descargar</button>
                    <button id="BotonEliminar-${i}" class="btn btn-warning">Eliminar</button>
                </div>
            </div>`
        )

        //como ya se agrego el html de la nota podemos obtenerlo y agregar eventos
        //asi que al boton eliminar le damos un evento on click que va a ir a buscar
        //al storage la key  que queremos borrar
        $(`#BotonEliminar-${i}`).on("click", () => {
            const storage = window.localStorage
            storage.removeItem(key)
            cargarNotas();
        })
        
        //le damos un evento on click al boton descargar
        //que se va a encargar de crear un archivo y crear el link correspondiente
        //para descargarlo

        $(`#BotonDescargar-${i}`).on("click", () => {

            let link = document.createElement("a");

            link.setAttribute("download", nota.titulo + ".txt");

            const archivo = crearArchivo(nota.titulo + "\n" + nota.contenido)

            link.href = archivo;
;
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(archivo);
        })
    }
}

//borrar notas solo toma el localStorage y limpia todas las entradas

function borrarNotas() {
    const storage = window.localStorage;

    storage.clear();
}