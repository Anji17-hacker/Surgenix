const patientForm = document.getElementById('patientForm');
const patientList = document.getElementById('patientList');

patientForm.addEventListener('submit', function(e) {
  e.preventDefault();
  db.collection("patients").add({
    name: document.getElementById('patientName').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value
  }).then(() => {
    patientForm.reset();
  });
});

db.collection("patients").onSnapshot(snapshot => {
  patientList.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    patientList.innerHTML += `
      <li>
        <span>${d.name}</span> (Age: ${d.age}, Gender: ${d.gender})
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </li>`;
  });

  // Attach delete handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      db.collection("patients").doc(id).delete();
    };
  });
});