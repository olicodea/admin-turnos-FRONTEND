const turnos = document.getElementById("turnos");

const url = "http://localhost:7000/api/peluqueria";

window.addEventListener("load", listarTurnos);

async function listarTurnos(e) {
    e.preventDefault();
    const { data } = await fetch(url).then((res) => res.json());
    data.forEach((turno) => {
        const { idCliente, fecha, hora, idEstado } = turno;
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-top">
                <h2>${idCliente}</h2>
                <span>${chequearEstado(idEstado)}</span>
            </div>
            <p>${fecha} - ${hora}</p>
        `;
        turnos.appendChild(card);
    });
}

function chequearEstado(idEstado) {
    if (idEstado === 1) return "Registrado";

    if (idEstado === 2) return "Realizado";

    if (idEstado === 3) return "Cancelado";
}
