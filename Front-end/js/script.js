let editUserId = null; 
let cachedUsers = []; 
// Open the form for adding/editing a user
async function openForm(user = null) {
    document.getElementById('popup').classList.remove('hidden1');
    document.getElementById('overlay').classList.remove('hidden0');

    if (user) {
        // Populate form fields with user data
        document.getElementById('name').value = user.name;
        document.getElementById('phone').value = user.phone;
        document.getElementById('email').value = user.email;
        document.getElementById('register-no').value = user.register;
        editUserId = user._id; // Set the user ID for editing
    } else {
        // Clear form fields for adding a new user
        document.getElementById('name').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('email').value = '';
        document.getElementById('register-no').value = '';
        editUserId = null; // Reset editUserId
    }

    clearErrors(); // Clear any previous validation errors
}

// Close the form and reset state
function closeForm() {
    document.getElementById('popup').classList.add('hidden1');
    document.getElementById('overlay').classList.add('hidden0');
    editUserId = null; // Reset editUserId
    clearErrors(); // Clear validation errors
}

// Clear all validation error messages
function clearErrors() {
    document.getElementById("nameError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("registerError").textContent = "";
}

// Validate input fields using regex
function validateInputs(name, phone, email, register) {
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const registerRegex = /^\d{5,}$/;

    let isValid = true;

    if (!nameRegex.test(name)) {
        document.getElementById("nameError").textContent = "Invalid name (must be at least 3 letters).";
        isValid = false;
    }
    if (!phoneRegex.test(phone)) {
        document.getElementById("phoneError").textContent = "Invalid phone number (must be 10 digits).";
        isValid = false;
    }
    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Invalid email format.";
        isValid = false;
    }
    if (!registerRegex.test(register)) {
        document.getElementById("registerError").textContent = "Register number must be at least 5 digits.";
        isValid = false;
    }

    return isValid;
}


function checkDuplicate(name, phone, email, register) {
    let error = 0;

    cachedUsers.forEach(user => {
        
        if (user.name === name) {
            document.getElementById("nameError").textContent = "Name already exists.";
            error++;
        }
        if (user.phone === phone) {
            document.getElementById("phoneError").textContent = "Phone number already exists.";
            error++;
        }
        if (user.email === email) {
            document.getElementById("emailError").textContent = "Email already exists.";
            error++;
        }
        if (user.register === register) {
            document.getElementById("registerError").textContent = "Register number already exists.";
            error++;
        }
    });

    return error === 0; 
}


async function submitUser() {
    console.log("Started form submission...");

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const register = document.getElementById('register-no').value.trim();

    clearErrors(); 

    
    if (!validateInputs(name, phone, email, register)) {
        return; 
    }

    
    if (!editUserId && !checkDuplicate(name, phone, email, register)) {
        return; 
    }

   
    let url = 'http://localhost:3000/users/addUser';
    let method = 'POST';
    let bodyData = JSON.stringify({ name, phone, email, register });

    if (editUserId) {
        url = `http://localhost:3000/users/updateUser/${editUserId}`;
        method = 'PUT';
    }

    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: bodyData
        });

        if (response.ok) {
            closeForm(); 
            await loadUsers();
        } else {
            alert("Failed to save user. Please try again.");
        }
    } catch (error) {
        console.error("Error during form submission:", error);
        alert("An error occurred. Please try again.");
    }
}


async function loadUsers() {
    try {
        const res = await fetch('http://localhost:3000/users/getUsers', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const users = await res.json();
        cachedUsers = users; // Update cached users
        renderTable(users); // Render the table
    } catch (error) {
        console.error("Failed to load users:", error);
        alert("Failed to load users. Please try again.");
    }
}

// Render the user table
function renderTable(users) {
    const table = document.getElementById('userTable');
    table.innerHTML = users.map(user =>
        `<tr>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${user.email}</td>
            <td>${user.register}</td>
            <td>
                <button class="edit-btn" data-id="${user._id}">Edit</button>
                <button class="delete-btn" data-id="${user._id}">Delete</button>
            </td>
        </tr>`
    ).join('');
}

// Handle edit and delete button clicks
document.getElementById('userTable')?.addEventListener('click', async function (event) {
    const target = event.target;
    const userId = target.dataset.id;

    if (target.classList.contains('edit-btn')) {
        const user = cachedUsers.find(user => user._id === userId);
        openForm(user); // Open the form with user data
    }

    if (target.classList.contains('delete-btn')) {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`http://localhost:3000/users/deleteUser/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                if (response.ok) {
                    await loadUsers(); // Refresh the user list
                } else {
                    alert("Failed to delete user.");
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("An error occurred. Please try again.");
            }
        }
    }
});

// Initialize the app
window.onload = async function () {
    closeForm(); // Ensure the form is closed on page load
    await loadUsers(); // Load users into the table
};