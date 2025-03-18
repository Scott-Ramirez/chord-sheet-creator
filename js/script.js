const acordes = ["C", "Cm", "C#", "C#m", "D", "Dm", "D#", "D#m", "E", "Em", "F", "Fm", 
    "F#", "F#m", "G", "Gm", "G#", "G#m", "A", "Am", "A#", "A#m", "B", "Bm", "Ab", "Eb"];

function agregarSeccion() {
    const sectionContainer = document.getElementById("sections");
    const newSection = document.createElement("div");
    newSection.classList.add("card", "p-3", "mb-3");

    const acordeButtons = acordes.map(acorde => `
        <button type="button" class="btn btn-outline-primary btn-sm m-1 acorde-btn" data-acorde="${acorde}">
            ${acorde}
        </button>
    `).join("");

    newSection.innerHTML = `
        <label class="fw-bold">Sección:</label>
        <input type="text" class="form-control section-title" placeholder="Ejemplo: VOZ 1">

        <label class="fw-bold mt-2">Selecciona los acordes:</label>
        <div class="d-flex flex-wrap">
            ${acordeButtons}
        </div>

        <input type="text" class="form-control section-notes mt-2" placeholder="Acordes seleccionados" readonly>

        <button class="btn btn-danger btn-sm mt-2" onclick="eliminarSeccion(this)">
            <i class="bi bi-trash"></i> Eliminar
        </button>
    `;

    sectionContainer.appendChild(newSection);
    activarBotonesAcordes(newSection);
}

function activarBotonesAcordes(section) {
    const botones = section.querySelectorAll(".acorde-btn");
    const inputAcordes = section.querySelector(".section-notes");

    botones.forEach(boton => {
        boton.addEventListener("click", () => {
            let acorde = boton.getAttribute("data-acorde");
            let acordesSeleccionados = inputAcordes.value.split("-").filter(a => a.trim() !== "");

            if (acordesSeleccionados.includes(acorde)) {
                acordesSeleccionados = acordesSeleccionados.filter(a => a !== acorde);
                boton.classList.remove("btn-primary");
                boton.classList.add("btn-outline-primary");
            } else {
                acordesSeleccionados.push(acorde);
                boton.classList.remove("btn-outline-primary");
                boton.classList.add("btn-primary");
            }

            inputAcordes.value = acordesSeleccionados.join("-");
        });
    });
}

function agregarRepeticion() {
    const repeatContainer = document.getElementById("repeat-sections");
    const newRepeat = document.createElement("div");
    newRepeat.classList.add("card", "p-3", "mb-3", "w-50", "mx-auto");

    newRepeat.innerHTML = `
        <label class="fw-bold">Parte a Repetir:</label>
        <input type="text" class="form-control repeat-title" placeholder="Ejemplo: CORO">
        <button class="btn btn-danger btn-sm mt-2" onclick="eliminarSeccion(this)">
            <i class="bi bi-trash"></i> Eliminar
        </button>
    `;

    repeatContainer.appendChild(newRepeat);
}

function eliminarSeccion(button) {
    button.closest(".card").remove();
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 30;

    const titulo = document.getElementById("titulo").value.trim();
    if (!titulo) {
        alert("Por favor, ingresa el nombre de la canción.");
        return;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(64, 224, 208);
    doc.text(titulo.toUpperCase(), 105, y, { align: "center" });
    y += 10;
    doc.setTextColor(0, 0, 0);

    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);
    y += 10;
    doc.setFontSize(14);

    const sections = document.querySelectorAll("#sections .card");
    sections.forEach(section => {
        const sectionTitle = section.querySelector(".section-title").value.trim();
        const sectionNotes = section.querySelector(".section-notes").value.trim();

        if (sectionTitle) {
            doc.setFont("helvetica", "bold");
            doc.text(sectionTitle.toUpperCase(), 105, y, { align: "center" });
            y += 8;
        }

        if (sectionNotes) {
            doc.setFont("helvetica", "normal");
            doc.text(sectionNotes.replace(/\s/g, "-"), 105, y, { align: "center" }); // Separador por "-"
            y += 12;
        }
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("REPETIR", 105, y, { align: "center" });
    y += 10;

    const repeats = document.querySelectorAll(".repeat-title");
    if (repeats.length === 0) {
        doc.text("No hay repeticiones", 105, y, { align: "center" });
    } else {
        repeats.forEach(repeat => {
            const repeatText = repeat.value.trim();
            if (repeatText) {
                doc.setFont("helvetica", "normal");
                doc.text(repeatText, 105, y, { align: "center" });
                y += 8;
            }
        });
    }

    y += 10;
    doc.save(`${titulo}.pdf`);
}
