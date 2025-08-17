// Importar SDK Firebase (usa ES Modules desde CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// 🔹 Configuración de tu proyecto Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("item-form");
const itemsTable = document.getElementById("items-table");
let editId = null;

// Crear o actualizar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    telefono: document.getElementById("telefono").value,
    domicilio: document.getElementById("domicilio").value,
    correo: document.getElementById("correo").value,
    edad: parseInt(document.getElementById("edad").value)
  };

  if (editId) {
    const ref = doc(db, "items", editId);
    await updateDoc(ref, data);
    editId = null;
  } else {
    await addDoc(collection(db, "items"), data);
  }

  form.reset();
});

// Leer en tiempo real
onSnapshot(collection(db, "items"), (snapshot) => {
  itemsTable.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    itemsTable.innerHTML += `
      <tr>
        <td>${item.nombre}</td>
        <td>${item.telefono}</td>
        <td>${item.domicilio}</td>
        <td>${item.correo}</td>
        <td>${item.edad}</td>
        <td>
          <button class="btn btn-sm btn-warning" onclick="editItem('${docSnap.id}', '${item.nombre}', '${item.telefono}', '${item.domicilio}', '${item.correo}', ${item.edad})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${docSnap.id}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
});

// Editar
window.editItem = (id, nombre, telefono, domicilio, correo, edad) => {
  document.getElementById("nombre").value = nombre;
  document.getElementById("telefono").value = telefono;
  document.getElementById("domicilio").value = domicilio;
  document.getElementById("correo").value = correo;
  document.getElementById("edad").value = edad;
  editId = id;
};

// Eliminar
window.deleteItem = async (id) => {
  await deleteDoc(doc(db, "items", id));
};
