const doctorForm = document.getElementById('doctorForm');
const doctorList = document.getElementById('doctorList');

doctorForm.addEventListener('submit', function(e) {
  e.preventDefault();
  db.collection("doctors").add({
    name: document.getElementById('doctorName').value,
    specialty: document.getElementById('specialty').value
  }).then(() => {
    doctorForm.reset();
  });
});

db.collection("doctors").onSnapshot(snapshot => {
  doctorList.innerHTML = "";
  snapshot.forEach(doc => {
    const d = doc.data();
    doctorList.innerHTML += `
      <li>
        <span>${d.name}</span> (${d.specialty})
        <button class="delete-btn" data-id="${doc.id}">Delete</button>
      </li>`;
  });

  // Attach delete handlers
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = function() {
      const id = this.getAttribute('data-id');
      db.collection("doctors").doc(id).delete();
    };
  });
});