// js/app.js — v8 version (no imports)
// Firebase services are provided by firebase.js (do not redeclare auth/db here)

document.addEventListener('DOMContentLoaded', function () {

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await auth.signOut();
      window.location.href = "login.html";
    });
  }

  // Register
  const registerForm = document.getElementById('registerForm');
  const registerMessage = document.getElementById('registerMessage');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (registerMessage) {
        registerMessage.textContent = "";
        registerMessage.classList.remove("success");
      }
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        await db.collection('users').doc(cred.user.uid).set({
          email,
          role: 'user' // or 'admin' manually in Firebase
        });
        if (registerMessage) {
          registerMessage.textContent = "Registration successful! Redirecting to login...";
          registerMessage.classList.add("success");
        }
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } catch (err) {
        if (registerMessage) {
          registerMessage.textContent = err.message;
          registerMessage.classList.remove("success");
        }
      }
    });
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (loginMessage) {
        loginMessage.textContent = "";
        loginMessage.classList.remove("success");
      }
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        const cred = await auth.signInWithEmailAndPassword(email, password);
        const userDoc = await db.collection("users").doc(cred.user.uid).get();
        if (!userDoc.exists) {
          if (loginMessage) loginMessage.textContent = "No user profile found in database. Please register again or contact admin.";
          return;
        }
        const role = userDoc.data().role;
        if (role === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "schedule.html";
        }
      } catch (err) {
        if (loginMessage) {
          loginMessage.textContent = "Login failed: " + err.message;
          loginMessage.classList.remove("success");
        }
      }
    });
  }

  // Add schedule
  const addScheduleForm = document.getElementById('addScheduleForm');
  const scheduleMessage = document.getElementById('scheduleMessage');
  if (addScheduleForm) {
    addScheduleForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (scheduleMessage) {
        scheduleMessage.textContent = "";
        scheduleMessage.classList.remove("success");
        scheduleMessage.style.color = "";
      }

      // Collect data for operations
      const data = {
        doctor: document.getElementById('doctor').value,
        patient: document.getElementById('patient').value,
        datetime: document.getElementById('datetime').value,
        roomId: document.getElementById('roomId').value,
        surgeryType: document.getElementById('surgeryType').value,
        anesthesia: document.getElementById('anesthesia').value,
        anesthesiologist: document.getElementById('anesthesiologist').value,
        assistants: document.getElementById('assistants').value,
        nurses: document.getElementById('nurses').value,
        materials: document.getElementById('materials').value,
        notes: document.getElementById('notes').value,
        timestamp: new Date().toISOString()
      };

      try {
        await db.collection("operations").add(data);
        alert("Operation scheduled successfully!");
        addScheduleForm.reset();
      } catch (error) {
        console.error("Error adding schedule:", error);
        alert("Error occurred while adding schedule.");
      }
    });
  }

  // Show schedules
  const scheduleList = document.getElementById('scheduleList');
  if (scheduleList) {
    db.collection("schedules").orderBy("datetime")
      .onSnapshot((snapshot) => {
        scheduleList.innerHTML = "";
        snapshot.forEach(doc => {
          const item = doc.data();
          const div = document.createElement('div');
          div.className = 'card';
          div.innerHTML = `
            <h3>Doctor: ${item.doctor}</h3>
            <p>Patient: ${item.patient}</p>
            <p>Date/Time: ${new Date(item.datetime).toLocaleString()}</p>
            <p>Details: ${item.details}</p>
          `;
          scheduleList.appendChild(div);
        });
      });
  }

});