import { clientesAPI, turnosAPI } from "../api/api.js";

const turnos = document.getElementById("turnos");
const clientes = document.getElementById("clientes");
const tabCliente = document.querySelector("#tabCliente");
const tabTurno = document.querySelector("#tabTurno");
const main = document.querySelector("main");
const registrarTurnoForm = document.querySelector("#registrarTurno");

const url = "http://localhost:7000/api/peluqueria";

window.addEventListener("load", listarTurnos);

// Clientes funcionalidades

function mostraNombre(nombre, apellido) {
    const nombreCompleto = `${nombre} ${apellido}`;
    if (nombreCompleto.length > 20) {
        return nombreCompleto.slice(0, 20) + "...";
    } else {
        return nombreCompleto;
    }
}

async function listarClientes() {
    const btnOld = document.getElementById("crearTurnoBtn");
    if (btnOld) {
        btnOld.remove();
    }

    const urlClientes = `${url}/clientes`;
    clientes.innerHTML = "";
    turnos.innerHTML = "";
    const btnCrear = crearBoton("crearClienteBtn", "CREAR CLIENTE");
    const data = await clientesAPI.getAll(urlClientes);
    data.forEach((cliente) => {
        const { id: idCliente, nombre, apellido, telefono } = cliente;
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("card-cliente");
        card.innerHTML = `
            <div class="card-top card-top-cliente">
                <div class="cliente-info">
                    <h4 data-name='${nombre} ${apellido}'>${mostraNombre(nombre, apellido)}</h4>
                    <p class="p-card">Tel.: ${telefono}</p>
                </div>
                <button class="btn" id="${idCliente}">Editar<i class="fa-sharp fa-solid fa-pencil edit-icon"></i></button>
            </div>
        `;

        const btnEditar = card.children[0].children[1];
        btnEditar.addEventListener("click", () => {
            mostrarFormCliente(btnCrear, idCliente);
        });

        clientes.appendChild(card);
    });
}

const verTabCliente = (e = null) => {
    if(e) e.preventDefault();
    tabTurno.classList.remove("active");
    tabCliente.classList.add("active");

    turnos.classList.add("d-none");
    clientes.classList.remove("d-none");

    listarClientes();
};

tabCliente.addEventListener("click", verTabCliente);

async function guardarCliente(idCliente) {
    try {
        const cliente = {
            id: idCliente,
            nombre: document.querySelector("#nombre").value,
            apellido: document.querySelector("#apellido").value,
            telefono: document.querySelector("#telefono").value,
        };

        if (idCliente) {
            await clientesAPI.update(`${url}/clientes/${idCliente}`, cliente);
        } else {
            await clientesAPI.create(`${url}/clientes`, cliente);
        }

        verTabCliente();
    } catch (error) {
        console.log(error);
    }
}

function cancelarCliente(e) {
    verTabCliente(e);
}

// Turno - Funcionalidades

async function listarTurnos() {
    const btnOld = document.getElementById("crearClienteBtn");
    if (btnOld) {
        btnOld.remove();
    }

    const urlTurnos = `${url}/turnos`;
    clientes.innerHTML = "";
    turnos.innerHTML = "";

    crearBoton("crearTurnoBtn", "CREAR TURNO");
    const { data } = await turnosAPI.getAll(urlTurnos);

    data.forEach(async (turno) => {
        const { idCliente, fecha, hora, idEstado } = turno;
        const cliente = await buscarCliente(idCliente);
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-top">
                <h5>${cliente.nombre} ${cliente.apellido}</h5>
                <span class="estado">${chequearEstadoTurno(idEstado)}</span>
            </div>
            <p>${fecha} - ${hora}</p>
        `;
        turnos.appendChild(card);
    });
}

const verTabTurno = (e) => {
    e.preventDefault();
    tabCliente.classList.remove("active");
    tabTurno.classList.add("active");

    clientes.classList.add("d-none");
    turnos.classList.remove("d-none");

    listarTurnos();
};

tabTurno.addEventListener("click", verTabTurno);

async function guardarTurno(e) {
    try {
        e.preventDefault();
        const turno = {
            fecha: "",
            hora: "",
            idCliente: null,
        };
        const inputsTurno = document.querySelectorAll(".inputForm");
        inputsTurno.forEach((input) => {
            if (input.id === "fecha") turno.fecha = formatearFechaTurno(input.value);
            if (input.id === "hora") turno.hora = input.value;
            if (input.id === "selectClientes") turno.idCliente = input.value;
        });
        await turnosAPI.create(`${url}/turno`, turno);
        verTabTurno(e);
    } catch (error) {
        console.log(error);
    }
}

function cancelarTurno(e) {
    verTabTurno(e);
}

function chequearEstadoTurno(idEstado) {
    if (idEstado === 1) return "REGISTRADO";

    if (idEstado === 2) return "REALIZADO";

    if (idEstado === 3) return "CANCELADO";
}

function formatearFechaTurno(fecha) {
    const date = new Date(fecha);
    return new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

//TODO: llevar a la carpeta api
async function buscarCliente(id) {
    return await fetch(`${url}/clientes/${id}`).then((res) => res.json());
}

async function llenarSelect() {
    const selectClientes = document.querySelector("#selectClientes");
    const clientes = await clientesAPI.getAll(url + "/clientes");

    selectClientes.innerHTML = `<option value="">Seleccione cliente</option>`;
    clientes.forEach((cliente) => {
        const { id, nombre, apellido, telefono } = cliente;
        const option = document.createElement("option");
        option.value = id;
        option.innerText = `${nombre} ${apellido}`;
        selectClientes.append(option);
    });
}

const mostrarFormCliente = async (btn, idCliente = null) => {
    clientes.innerHTML = `
        <form id="clientesForm" action="" class="form">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" class="inputForm" />
            <label for="apellido">Apellido:</label>
            <input type="text" id="apellido" class="inputForm" />
            <label for="telefono">Teléfono:</label>
            <input type="text" id="telefono" class="inputForm" />
            <div class="btn-container">
                <input type="submit" id="guardarClienteBtn" class="btn" value="GUARDAR"/>
                <button id="cancelarClienteBtn" class="btn">CANCELAR</button>
            </div>
        </form>
        `;
        btn.remove();
        if (idCliente) {
            const clientePrecarga = await buscarCliente(idCliente);
            document.querySelector("#nombre").value = clientePrecarga.nombre;
            document.querySelector("#apellido").value = clientePrecarga.apellido;
            document.querySelector("#telefono").value = clientePrecarga.telefono;
        }

        const cancelarBtn = document.querySelector("#cancelarClienteBtn");
        const clientesForm = document.querySelector("#clientesForm");

        cancelarBtn.addEventListener("click", cancelarCliente);
        clientesForm.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarCliente(idCliente);
        });
}

const mostrarFormTurno = async (btn) => {
        registrarTurnoForm.classList.remove("d-none");
        turnos.innerHTML = "";
        btn.remove();

        turnos.append(registrarTurnoForm);
        llenarSelect();

        const guardarBtn = document.querySelector("#guardarTurnoBtn");
        const cancelarBtn = document.querySelector("#cancelarTurnoBtn");
        guardarBtn.addEventListener("click", guardarTurno);
        cancelarBtn.addEventListener("click", cancelarTurno);
};

function crearBoton(id, texto) {
    const btnOld = document.getElementById(id);
    if (btnOld) {
        btnOld.remove();
    }
    const btn = document.createElement("button");
    btn.id = id; // Será crearTurnoBtn || crearClienteBtn
    btn.classList.add("btn");
    btn.innerText = texto;

    //TODO: pasar handler a una función
    btn.addEventListener("click", () => {
        if(id === "crearClienteBtn"){
            mostrarFormCliente(btn);
        } else {
            mostrarFormTurno(btn);
        }
    });
    main.prepend(btn);
    return btn;
}