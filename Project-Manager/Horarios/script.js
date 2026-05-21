 // Inicialización de datos persistentes o ejemplo inicial
        let team = JSON.parse(localStorage.getItem('it_team_data')) || [
            {
                id: 1716300000000,
                nombre: "Laura Paz",
                area: "Desarrollo",
                rol: "Desarrollo IT",
                h1_inicio: "11:00", h1_fin: "17:00",
                h2_inicio: "23:00", h2_fin: "02:00",
                backup: "Jeison",
                vac_inicio: "2026-05-25", vac_fin: "2026-06-08",
                vac_pendientes: 15,
                festivos_deuda: 8
            }
        ];

        const form = document.getElementById('resourceForm');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newMember = {
                id: Date.now(),
                nombre: document.getElementById('nombre').value,
                area: document.getElementById('area').value,
                rol: document.getElementById('rol').value,
                h1_inicio: document.getElementById('h1_inicio').value,
                h1_fin: document.getElementById('h1_fin').value,
                h2_inicio: document.getElementById('h2_inicio').value || null,
                h2_fin: document.getElementById('h2_fin').value || null,
                backup: document.getElementById('backup').value || "No asignado",
                vac_inicio: document.getElementById('vac_inicio').value || null,
                vac_fin: document.getElementById('vac_fin').value || null,
                vac_pendientes: parseInt(document.getElementById('vac_pendientes').value) || 0,
                festivos_deuda: parseInt(document.getElementById('festivos_deuda').value) || 0
            };

            team.push(newMember);
            saveAndRender();
            form.reset();
            document.getElementById('h1_inicio').value = "09:00";
            document.getElementById('h1_fin').value = "17:00";
        });

        // Actualizar valores específicos directamente desde la fila
        function updateField(id, field, value) {
            const member = team.find(m => m.id === id);
            if (member) {
                // Parsear a número si corresponde a los saldos de días
                if (field === 'vac_pendientes' || field === 'festivos_deuda') {
                    member[field] = parseInt(value) || 0;
                } else {
                    member[field] = value || null;
                }
                localStorage.setItem('it_team_data', JSON.stringify(team));
            }
        }

        function saveAndRender() {
            localStorage.setItem('it_team_data', JSON.stringify(team));
            renderTable();
        }

        function deleteMember(id) {
            if(confirm("¿Retirar a este colaborador de la matriz operativa?")) {
                team = team.filter(member => member.id !== id);
                saveAndRender();
            }
        }

        function renderTable() {
            const tbody = document.querySelector('#teamTable tbody');
            const filterValue = document.getElementById('filterArea').value;
            tbody.innerHTML = '';

            const filteredTeam = team.filter(m => filterValue === 'Todos' || m.area === filterValue);

            if(filteredTeam.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:2rem;">Sin registros en esta sección.</td></tr>`;
                return;
            }

            filteredTeam.forEach(member => {
                let badgeClass = 'badge-dev';
                if(member.area === 'Infraestructura') badgeClass = 'badge-infra';
                if(member.area === 'Soporte') badgeClass = 'badge-soporte';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${member.nombre}</strong></td>
                    <td>
                        <span class="badge ${badgeClass}">${member.area}</span>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.2rem;">${member.rol}</div>
                    </td>
                    <td>
                        <div class="inline-group">
                            <div class="inline-row">B1: 
                                <input type="time" value="${member.h1_inicio}" onchange="updateField(${member.id}, 'h1_inicio', this.value)"> al 
                                <input type="time" value="${member.h1_fin}" onchange="updateField(${member.id}, 'h1_fin', this.value)">
                            </div>
                            <div class="inline-row">B2: 
                                <input type="time" value="${member.h2_inicio || ''}" onchange="updateField(${member.id}, 'h2_inicio', this.value)"> al 
                                <input type="time" value="${member.h2_fin || ''}" onchange="updateField(${member.id}, 'h2_fin', this.value)">
                            </div>
                        </div>
                    </td>
                    <td>
                        <input type="text" value="${member.backup}" style="width:110px;" onchange="updateField(${member.id}, 'backup', this.value)">
                    </td>
                    <td>
                        <div class="inline-group">
                            <div class="inline-row">Inicio: <input type="date" value="${member.vac_inicio || ''}" onchange="updateField(${member.id}, 'vac_inicio', this.value)"></div>
                            <div class="inline-row">Fin: &nbsp;&nbsp;&nbsp;<input type="date" value="${member.vac_fin || ''}" onchange="updateField(${member.id}, 'vac_fin', this.value)"></div>
                        </div>
                    </td>
                    <td>
                        <div class="inline-group">
                            <div class="inline-row" style="justify-content:space-between;">Vac. Libres: 
                                <input type="number" min="0" value="${member.vac_pendientes}" onchange="updateField(${member.id}, 'vac_pendientes', this.value)">
                            </div>
                            <div class="inline-row" style="justify-content:space-between;">Deuda Fest: 
                                <input type="number" min="0" value="${member.festivos_deuda}" onchange="updateField(${member.id}, 'festivos_deuda', this.value)">
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn-delete" onclick="deleteMember(${member.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        window.onload = renderTable;