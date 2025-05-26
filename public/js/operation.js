// Handle operation form submission
const operationForm = document.getElementById('operationForm');
if (operationForm) {
  operationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = {
      patientId: document.getElementById('patientId').value,
      doctor: document.getElementById('doctor').value,
      roomId: document.getElementById('roomId').value,
      surgeryType: document.getElementById('surgeryType').value,
      datetime: document.getElementById('datetime').value,
      materials: document.getElementById('materials').value,
      assistants: document.getElementById('assistants').value,
      notes: document.getElementById('notes').value,
      timestamp: new Date().toISOString()
    };

    db.collection("operations").add(data)
      .then(() => {
        alert("Operation scheduled successfully!");
        operationForm.reset();
      })
      .catch((error) => {
        console.error("Error scheduling operation:", error);
        alert("Error occurred!");
      });
  });
}
// Display operations in table if present
const operationsTable = document.querySelector("#operationsTable tbody");
if (operationsTable) {
  db.collection("operations").orderBy("datetime").onSnapshot(snapshot => {
    operationsTable.innerHTML = "";
    snapshot.forEach(doc => {
      const d = doc.data();
      operationsTable.innerHTML += `
        <tr>
          <td>${d.patient || d.patientId || ""}</td>
          <td>${d.doctor}</td>
          <td>${d.roomId}</td>
          <td>${d.surgeryType}</td>
          <td>${d.datetime}</td>
          <td>${d.assistants}</td>
        </tr>`;
    });
  });
}

