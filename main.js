// Referencia a la base de datos de Firebase
const db = firebase.database();
const contactsRef = db.ref('contacts');

// Referencias a los elementos del DOM
const contactForm = document.getElementById('contactForm');
const contactsList = document.getElementById('contactsList');
const contactIdInput = document.getElementById('contactId');

// Escucha el evento de envío del formulario
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const domicilio = document.getElementById('domicilio').value;
    const correo = document.getElementById('correo').value;
    const edad = parseInt(document.getElementById('edad').value);

    // Si el campo contactId está vacío, es una nueva entrada (CREATE)
    if (contactIdInput.value === '') {
        contactsRef.push({
            nombre: nombre,
            telefono: telefono,
            domicilio: domicilio,
            correo: correo,
            edad: edad
        });
    } else {
        // Si tiene un ID, es una actualización (UPDATE)
        const contactId = contactIdInput.value;
        contactsRef.child(contactId).update({
            nombre: nombre,
            telefono: telefono,
            domicilio: domicilio,
            correo: correo,
            edad: edad
        });
        contactIdInput.value = ''; // Limpiar el ID
    }

    contactForm.reset(); // Limpiar el formulario
});

// Escucha los cambios en la base de datos (READ)
contactsRef.on('value', (snapshot) => {
    contactsList.innerHTML = ''; // Limpia la lista antes de volver a renderizar
    snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const contact = childSnapshot.val();

        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact-item');
        contactDiv.innerHTML = `
            <h3>${contact.nombre}</h3>
            <p><strong>Teléfono:</strong> ${contact.telefono}</p>
            <p><strong>Domicilio:</strong> ${contact.domicilio}</p>
            <p><strong>Correo:</strong> ${contact.correo}</p>
            <p><strong>Edad:</strong> ${contact.edad}</p>
            <button class="edit" data-id="${key}">Editar</button>
            <button class="delete" data-id="${key}">Eliminar</button>
        `;
        contactsList.appendChild(contactDiv);

        // Agrega event listeners a los botones de editar y eliminar
        const editButton = contactDiv.querySelector('.edit');
        const deleteButton = contactDiv.querySelector('.delete');

        editButton.addEventListener('click', () => {
            editContact(key, contact);
        });

        deleteButton.addEventListener('click', () => {
            deleteContact(key);
        });
    });
});

// Función para editar un contacto
function editContact(id, contact) {
    contactIdInput.value = id;
    document.getElementById('nombre').value = contact.nombre;
    document.getElementById('telefono').value = contact.telefono;
    document.getElementById('domicilio').value = contact.domicilio;
    document.getElementById('correo').value = contact.correo;
    document.getElementById('edad').value = contact.edad;
}

// Función para eliminar un contacto (DELETE)
function deleteContact(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
        contactsRef.child(id).remove();
    }
}