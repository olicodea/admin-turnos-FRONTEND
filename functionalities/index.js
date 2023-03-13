import { clientesAPI, turnosAPI } from "../remoteApi/api.js";

const turnos = document.getElementById("turnos");
const clientes = document.getElementById("clientes");
const tabCliente = document.querySelector("#tabCliente");
const tabTurno = document.querySelector("#tabTurno");
const main = document.querySelector("main");
const registrarTurno = document.querySelector("#registrarTurno");
const registrarCliente = document.querySelector("#registrarCliente");

const url = "http://localhost:7000/api/peluqueria";

window.addEventListener("load", listarTurnos);

const verTabCliente = (e) => {
    e.preventDefault();
    tabTurno.classList.remove("active");
    tabCliente.classList.add("active");

    turnos.classList.add("d-none");
    clientes.classList.remove("d-none");

    listarClientes();
};

const verTabTurno = (e) => {
    e.preventDefault();
    tabCliente.classList.remove("active");
    tabTurno.classList.add("active");

    clientes.classList.add("d-none");
    turnos.classList.remove("d-none");

    listarTurnos();
};

tabCliente.addEventListener("click", verTabCliente);

tabTurno.addEventListener("click", verTabTurno);

async function listarClientes() {
    const btnOld = document.getElementById("crearTurnoBtn");
    if (btnOld) {
        btnOld.remove();
    }

    const urlClientes = `${url}/clientes`;
    clientes.innerHTML = "";
    turnos.innerHTML = "";
    crearBoton("crearClienteBtn", "CREAR CLIENTE");
    const data = await clientesAPI.getAll(urlClientes);
    data.forEach(async (cliente) => {
        const { id, nombre, apellido, telefono } = cliente;
        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("card-cliente");
        card.innerHTML = `
        <div class="card-top card-top-cliente">
            <h3>${nombre} ${apellido}</h3>
            <p>Teléfono: ${telefono}</p>
        </div>
        <button class="btn btn-cliente">Ver turnos</button>
        `;

        clientes.appendChild(card);
    });
}

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
                <h3>${cliente.nombre} ${cliente.apellido}</h3>
                <span class="estado">${chequearEstado(idEstado)}</span>
            </div>
            <p>${fecha} - ${hora}</p>
        `;
        turnos.appendChild(card);
    });
}

async function buscarCliente(id) {
    return await fetch(`${url}/clientes/${id}`).then((res) => res.json());
}

function guardarTurno(e) {
    e.preventDefault();
    const turno = {
        fecha: "",
        hora: "",
        idCliente: null,
    };
    const inputsTurno = document.querySelectorAll(".inputForm");
    inputsTurno.forEach((input) => {
        if (input.id === "fecha") turno.fecha = input.value;

        if (input.id === "hora") turno.hora = input.value;

        if (input.id === "selectClientes") turno.idCliente = input.value;
    });
    turnosAPI.create(`${url}/turno`, turno);
    verTabTurno(e);
}

function cancelarTurno(e) {
    verTabTurno(e);
}

async function llenarSelect() {
    const selectClientes = document.querySelector("#selectClientes");
    const clientes = await clientesAPI.getAll(url + "/clientes");

    clientes.forEach((cliente) => {
        const { id, nombre, apellido, telefono } = cliente;
        const option = document.createElement("option");
        option.value = id;
        option.innerText = `${nombre} ${apellido}`;
        selectClientes.append(option);
    });
}

const mostrarForm = (id, btn) => {
    if (id === "crearTurnoBtn") {
        registrarTurno.classList.remove("d-none");
        turnos.innerHTML = "";
        btn.remove();
        turnos.append(registrarTurno);
        llenarSelect();
        const guardarBtn = document.querySelector("#guardarTurnoBtn");
        const cancelarBtn = document.querySelector("#cancelarTurnoBtn");
        guardarBtn.addEventListener("click", guardarTurno);
        cancelarBtn.addEventListener("click", cancelarTurno);
    } else {
        registrarCliente.classList.toggle("d-none");
    }
};

function crearBoton(id, texto) {
    const btnOld = document.getElementById(id);
    if (btnOld) {
        btnOld.remove();
    }
    const btn = document.createElement("button");
    btn.id = id;
    btn.classList.add("btn");
    btn.innerText = texto;

    //TODO: pasar handler a una función
    btn.addEventListener("click", () => {
        mostrarForm(id, btn);
    });
    main.prepend(btn);
}

function chequearEstado(idEstado) {
    if (idEstado === 1) return "REGISTRADO";

    if (idEstado === 2) return "REALIZADO";

    if (idEstado === 3) return "CANCELADO";
}
