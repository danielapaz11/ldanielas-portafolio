 let editingTaskId = null;
 // Initial Dataset covering technical roles and specific challenges
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [
            
{
id: 1,
title: "Instalación TPV",
owner: "Laura",
status: "Bloqueado",
risk: "Alto"
}
];
function saveLocalData() {

localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
);

localStorage.setItem(
    "meetingNotes",
    document.getElementById("meeting-notes").value
);

}

        // Reference target date set for project execution context (May 2026)
        const CURRENT_DATE_CONTEXT = new Date('2026-05-21');
        window.addEventListener("load", () => {

        const savedNotes =
        localStorage.getItem("meetingNotes");

        if(savedNotes) {

        document.getElementById("meeting-notes")
        .value = savedNotes;
}

updateDashboard();

});
        function switchTab(tabId) {
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            event.target.classList.add('active');
            
            if(tabId === 'tab-analytics') {
                renderAnalytics();
            }
        }

        function openModal(isEditing = false) {

        if(!isEditing) {

    document.getElementById("task-form")
        .reset();
        }

document.getElementById("task-modal")
    .classList.add("active");

}

        function closeModal() {
            document.getElementById('task-modal').classList.remove('active');
        }

        function saveTask(e) {

e.preventDefault();

const taskData = {

    title:
        document.getElementById("form-title").value,

    area:
        document.getElementById("form-area").value,

    owner:
        document.getElementById("form-owner").value,

    priority:
        document.getElementById("form-priority").value,

    status:
        document.getElementById("form-status").value,

    deadline:
        document.getElementById("form-deadline").value,

    deps:
        document.getElementById("form-deps").value,

    risk:
        document.getElementById("form-risk").value
};

// EDITAR
if(editingTaskId !== null) {

    const index =
        tasks.findIndex(t => t.id === editingTaskId);

    if(index !== -1) {

        tasks[index] = {
            ...tasks[index],
            ...taskData
        };
    }

    editingTaskId = null;

} else {

    // CREAR
    tasks.push({

        id: Date.now(),

        ...taskData
    });
}

saveLocalData();

updateDashboard();

closeModal();

e.target.reset();

}
         

        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            updateDashboard();
        }
        function editTask(id) {
document.querySelector(".modal-title")
.innerText = "Editar Tarea";
const task =
    tasks.find(t => t.id === id);

if(!task) return;

editingTaskId = id;

document.getElementById("form-title")
    .value = task.title;

document.getElementById("form-area")
    .value = task.area;

document.getElementById("form-owner")
    .value = task.owner;

document.getElementById("form-priority")
    .value = task.priority;

document.getElementById("form-status")
    .value = task.status;

document.getElementById("form-deadline")
    .value = task.deadline;

document.getElementById("form-deps")
    .value = task.deps;

document.getElementById("form-risk")
    .value = task.risk;

openModal(true);
document.querySelector(".modal-title")
.innerText = "Nueva Tarea";
}

        function advanceStatus(id) {
            const statusOrder = ['Pendiente', 'En proceso', 'Bloqueado', 'En validación', 'Finalizado'];
            const task = tasks.find(t => t.id === id);
            if(task) {
                let currIndex = statusOrder.indexOf(task.status);
                if(currIndex < statusOrder.length - 1) {
                    task.status = statusOrder[currIndex + 1];
                } else {
                    task.status = statusOrder[0]; // Loop back
                }
                saveLocalData();
                updateDashboard();
            }
        }
        function moveTaskBack(id) {

                const order = [

                    "Pendiente",
                    "En proceso",
                    "Bloqueado",
                    "En validación",
                    "Finalizado"
                ];

                const task =
                    tasks.find(t => t.id === id);

                if(!task) return;

                let index =
                    order.indexOf(task.status);

                index--;

                if(index < 0) {
                    index = order.length - 1;
                }

                task.status = order[index];

                saveLocalData();

                updateDashboard();

                }

        function updateDashboard() {
            // Reset lists
            const lists = {
                'Pendiente': document.getElementById('list-pendiente'),
                'En proceso': document.getElementById('list-proceso'),
                'Bloqueado': document.getElementById('list-bloqueado'),
                'En validación': document.getElementById('list-validacion'),
                'Finalizado': document.getElementById('list-finalizado')
            };
            
            Object.values(lists).forEach(l => l.innerHTML = '');

            let blockedCount = 0;
            let delayedCount = 0;
            let finishedCount = 0;

            tasks.forEach(task => {
                if(task.status === 'Bloqueado') blockedCount++;
                if(task.status === 'Finalizado') finishedCount++;
                
                // Calculate if deadline is near or passed
                const dDate = new Date(task.deadline);
                const diffTime = dDate - CURRENT_DATE_CONTEXT;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if(diffDays <= 2 && task.status !== 'Finalizado') {
                    delayedCount++;
                }

                // Append card to corresponding column html element
                const card = document.createElement('div');
                card.draggable = true;
                card.dataset.id = task.id;
                card.className = 'task-card';
                
                card.addEventListener("dragstart", dragStart);

                let draggedTaskId = null;

            function dragStart(e) {

                draggedTaskId =
                e.target.dataset.id;

                }

            function allowDrop(e) {
                e.preventDefault();
            }
            
            function dropTask(e, status) {
                e.preventDefault();
                const task =
                tasks.find(t => t.id == draggedTaskId);
            if(task) {
                task.status = status;
                saveLocalData();
                updateDashboard();
            }
        }
                let pColor = 'var(--priority-baja)';
                if(task.priority === 'Alta') pColor = 'var(--priority-alta)';
                if(task.priority === 'Media') pColor = 'var(--priority-media)';

                card.innerHTML = `
                    <div class="task-tags">
                        <span class="task-area">${task.area}</span>
                        <span class="task-priority" style="background: ${pColor}22; color: ${pColor}">${task.priority}</span>
                    </div>
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span style="color:var(--text-muted)">Límite:</span> <div>${task.deadline}</div>
                        <span style="color:var(--text-muted)">Riesgo:</span> <div style="font-weight:600; color:${task.risk === 'Crítico' || task.risk === 'Alto' ? '#ef4444' : '#9ca3af'}">${task.risk}</div>
                        <span style="color:var(--text-muted)">Deps:</span> <div style="font-style:italic;">${task.deps}</div>
                    </div>
                    <div class="task-footer">
                        <div class="task-owner">👤 ${task.owner}</div>
                        <div class="task-actions">
                            <button class="btn-icon" title="Editar" onclick="editTask(${task.id})"> ✏️ </button>
                            <button class="btn-icon" title="Retroceder" onclick="moveTaskBack(${task.id})"> ⬅️ </button>
                            <button class="btn-icon" title="Avanzar" onclick="advanceStatus(${task.id})"> ➡️ </button>                            
                            <button class="btn-icon" title="Eliminar" onclick="deleteTask(${task.id})">🗑️</button>
                        </div>
                    </div>
                `;
                lists[task.status].appendChild(card);
            });

            // Update DOM Counts & Metrics
            document.getElementById('count-pendiente').innerText = tasks.filter(t => t.status === 'Pendiente').length;
            document.getElementById('count-proceso').innerText = tasks.filter(t => t.status === 'En proceso').length;
            document.getElementById('count-bloqueado').innerText = tasks.filter(t => t.status === 'Bloqueado').length;
            document.getElementById('count-validacion').innerText = tasks.filter(t => t.status === 'En validación').length;
            document.getElementById('count-finalizado').innerText = tasks.filter(t => t.status === 'Finalizado').length;

            document.getElementById('kpi-total').innerText = tasks.length;
            document.getElementById('kpi-blocked').innerText = blockedCount;
            document.getElementById('kpi-delayed').innerText = delayedCount;
            
            const progressPct = tasks.length > 0 ? Math.round((finishedCount / tasks.length) * 100) : 0;
            document.getElementById('kpi-progress').innerText = `${progressPct}%`;
        }

        function renderAnalytics() {

            // contador de carga
            const workload = {};

            // contador de riesgos
            const risks = {
                'Bajo': 0,
                'Medio': 0,
                'Alto': 0,
                'Crítico': 0
            };

            // responsables dinámicos
            const dynamicOwners = [
                ...new Set(tasks.map(t => t.owner))
            ];

            // inicializar workload dinámico
            dynamicOwners.forEach(owner => {
                workload[owner] = 0;
            });

            tasks.forEach(t => {

                workload[t.owner] =
                    (workload[t.owner] || 0) + 1;

                if(risks[t.risk] !== undefined) {
                    risks[t.risk]++;
                }
            });

            console.log(workload);
            console.log(risks);

            }
            // Populate Workload Bars Layout
            const wlContainer = document.getElementById('analytics-workload');
            wlContainer.innerHTML = '';
            Object.keys(workload).forEach(owner => {
                const count = workload[owner];
                const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                // Highlight overload danger thresholds
                const barColor = count >= 3 ? 'var(--color-bloqueado)' : 'var(--accent)';
                wlContainer.innerHTML += `
                    <div class="chart-row">
                        <div class="chart-label">
                            <span>${owner} ${count >= 3 ? '⚠️ (Sobrecarga detectada)' : ''}</span>
                            <span>${count} asignadas</span>
                        </div>
                        <div class="chart-bar-bg">
                            <div class="chart-bar-fill" style="width: ${pct}%; background: ${barColor};"></div>
                        </div>
                    </div>
                `;
            });

            // Populate Risk Level Bars Layout
            const riskContainer = document.getElementById('analytics-risk');
            riskContainer.innerHTML = '';
            Object.keys(risks).forEach(r => {
                const count = risks[r];
                const pct = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                let rColor = 'var(--color-finalizado)';
                if(r === 'Crítico') rColor = 'var(--color-bloqueado)';
                if(r === 'Alto') rColor = 'var(--color-validacion)';
                if(r === 'Medio') rColor = 'var(--color-proceso)';

                riskContainer.innerHTML += `
                    <div class="chart-row">
                        <div class="chart-label">
                            <span>Riesgo ${r}</span>
                            <span>${count} tareas</span>
                        </div>
                        <div class="chart-bar-bg">
                            <div class="chart-bar-fill" style="width: ${pct}%; background: ${rColor};"></div>
                        </div>
                    </div>
                `;
            });
        

        function generateExecutiveReport() {

    let total = tasks.length;
    let finished = tasks.filter(t => t.status === 'Finalizado').length;
    let blocked = tasks.filter(t => t.status === 'Bloqueado');
    let pct = total > 0 ? Math.round((finished / total) * 100) : 0;

    // 👇 LEER MINUTA
    const meetingNotes = document.getElementById('meeting-notes').value.trim();

    let report = `==================================================
        REPORTE EJECUTIVO DE AVANCE SEMANAL
        Fecha de Control: ${CURRENT_DATE_CONTEXT.toISOString().split('T')[0]}
==================================================

`;

    report += `1. RESUMEN EJECUTIVO
--------------------------------------------------
`;
    report += `El sprint se encuentra al ${pct}% de completitud general.
`;
    report += `Se detectan ${blocked.length} bloqueos activos comprometiendo metas críticas.

`;

    report += `2. CHECKLIST DE CUMPLIMIENTO DEL SPRINT
--------------------------------------------------
`;

    tasks.forEach(t => {
        let mark = t.status === 'Finalizado' ? '[X]' : '[ ]';

        report += `${mark} [${t.area}] - ${t.title} (${t.owner}) -> ${t.status}
`;
    });

    report += `
3. ALERTAS DE RIESGO Y TAREAS CRÍTICAS
--------------------------------------------------
`;

    if(blocked.length === 0) {
        report += `No hay bloqueos activos en este periodo.
`;
    } else {

        blocked.forEach(b => {

            report += `⚠️ BLOQUEADO: "${b.title}" asignado a ${b.owner}.
`;
            report += `   - Riesgo Operativo: ${b.risk}
`;
            report += `   - Dependencia Inmediata: ${b.deps}

`;
        });
    }

    // 👇 NUEVA SECCIÓN AUTOMÁTICA
    report += `
4. ACUERDOS Y MINUTA DE REUNIÓN
--------------------------------------------------
`;

    if(meetingNotes.length > 0) {
        report += `${meetingNotes}

`;
    } else {
        report += `No se registraron acuerdos en la reunión.

`;
    }

    report += `5. REASIGNACIONES & MEJORAS RECOMENDADAS
--------------------------------------------------
`;

    const counts = {};

    tasks.forEach(t => {
        counts[t.owner] = (counts[t.owner] || 0) + 1;
    });

    let overloaded = Object.keys(counts).filter(o => counts[o] >= 3);

    if(overloaded.length > 0) {

        overloaded.forEach(o => {

            report += `👉 BALANCEO: Aliviar asignaciones de ${o}. Presenta sobrecarga operativa.
`;
        });

    } else {

        report += `✔ Distribución de carga equilibrada entre los integrantes del sprint.
`;
    }

    document.getElementById('executive-text').value = report;
        }
                // Run Initial Render on load
                updateDashboard();
                
        document.getElementById("meeting-notes")
        .addEventListener("input", () => {

        saveLocalData();

        });
        function analyzeMeetingNotes() {

        const notes =
            document.getElementById("meeting-notes")
            .value
            .toLowerCase();

        const lines = notes.split("\n");

        let detectedOwner = "Sin asignar";

        const possibleOwner =
        line.match(/^[A-Za-zÁÉÍÓÚáéíóúñÑ]+/);

        if(possibleOwner) {

        detectedOwner =
            possibleOwner[0];

        }

        const riskWords = [
            "bloqueo",
            "urgente",
            "caído",
            "error",
            "falla",
            "riesgo"
        ];

        lines.forEach(line => {

    if(line.trim() === "") return;

    let detectedOwner = "Sin asignar";

    owners.forEach(owner => {

        if(line.includes(owner)) {

            detectedOwner =
                owner.charAt(0).toUpperCase() +
                owner.slice(1);
        }
    });

    let risk = "Bajo";

    riskWords.forEach(word => {

        if(line.includes(word)) {

            risk = "Alto";
        }
    });

    // evitar duplicados
    const alreadyExists = tasks.some(t =>
        t.title.toLowerCase() === line.trim()
    );

    if(!alreadyExists) {

        tasks.push({

            id: Date.now() + Math.random(),

            title: line,

            owner: detectedOwner,

            status: risk === "Alto"
                ? "Bloqueado"
                : "Pendiente",

            risk: risk
        });
    }
});

        saveLocalData();

        updateDashboard();

        alert("Minuta procesada correctamente 🚀");

        }
        function toggleTheme() {

        document.body.classList.toggle("light-theme");

        const isLight =
            document.body.classList.contains("light-theme");

        localStorage.setItem(
            "theme",
            isLight ? "light" : "dark"
        );

        }