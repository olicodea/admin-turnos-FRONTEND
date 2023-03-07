const turnos = document.getElementById("turnos");
const clientes = document.getElementById("clientes")

const url = "http://localhost:7000/api/peluqueria";

window.addEventListener("load", listarClientes);

async function listarClientes() {
    const data = await fetch(`${url}/clientes`).then((res) => res.json());
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

async function listarTurnos(e) {
    e.preventDefault();
    const { data } = await fetch(url).then((res) => res.json());
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

function chequearEstado(idEstado) {
    if (idEstado === 1) return "REGISTRADO";

    if (idEstado === 2) return "REALIZADO";

    if (idEstado === 3) return "CANCELADO";
}
