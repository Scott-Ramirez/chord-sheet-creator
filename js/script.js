function agregarSeccion() {
    const sectionContainer = document.getElementById("sections");
    const newSection = document.createElement("div");
    newSection.classList.add("card", "p-3", "mb-3", "w-50", "mx-auto");

    newSection.innerHTML = `
        <label class="fw-bold">Sección:</label>
        <input type="text" class="form-control section-title" placeholder="Ejemplo: VOZ 1">
        <textarea class="form-control section-notes mt-2" rows="2" placeholder="Ejemplo: Cm - Bb - F"></textarea>
        <button class="btn btn-danger btn-sm mt-2" onclick="eliminarSeccion(this)">
            <i class="bi bi-trash"></i> Eliminar
        </button>
    `;

    sectionContainer.appendChild(newSection);
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
    button.parentElement.remove();
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
            doc.text(sectionNotes, 105, y, { align: "center" });
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
