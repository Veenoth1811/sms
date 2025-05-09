function flipCard() {
  document.getElementById("flipCard").classList.toggle("flipped");
}
document.getElementById("register")?.addEventListener("click", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("epwrd").value.trim();
  const confirmPassword = document.getElementById("cpwrd").value.trim();
  const nw = document.getElementById("nw");
  const ew = document.getElementById("ew");
  const epwrdw = document.getElementById("epwrdw");
  const cpwrdw = document.getElementById("cpwrdw");

  // Regex for password validation
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Regex for email validation
  const mail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

  let errors = 0; // Track number of validation errors

  // Name validation
  if (!name) {
    nw.innerText = "Name is required!";
    errors++;
  } else if (name.length < 3) {
    nw.innerText = "At least 3 characters required!";
    errors++;
  } else {
    nw.innerText = ""; // No errors
  }

  // Email validation
  if (!email) {
    ew.innerText = "Email is required!";
    errors++;
  } else if (!mail(email)) {
    ew.innerText = "Enter a valid Email!";
    errors++;
  } else {
    ew.innerText = ""; // No errors
  }
console.log("working 43");

  // Password validation
  if (!password) {
    epwrdw.innerText = "Password is required!";
    errors++;
  } else if (!passwordRegex.test(password)) {
    epwrdw.innerText = "Password must be at least 8 characters, contain uppercase, lowercase, number, and special character!";
    errors++;
  } else {
    epwrdw.innerText = ""; // No errors
  }

  // Confirm Password validation
  if (!confirmPassword) {
    cpwrdw.innerText = "Confirm Password is required!";
    errors++;
  } else if (password !== confirmPassword) {
    cpwrdw.innerText = "Passwords do not match!";
    errors++;
  } else {
    cpwrdw.innerText = ""; // No errors
  }

  if (errors > 0) {
    return;
  }
console.log("working 69");

  try {
    console.log("working 73");
    const response = await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name, email, password }),
    });
console.log("hii78");

    const data = await response.json();
    
    
    alert(data.message);

    if (data) {
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("epwrd").value = "";
      document.getElementById("cpwrd").value = "";
      flipCard();
    }
  } catch (error) {
    alert("Error: Unable to connect to server!");
  }
});
console.log("93")
// Sign In Logic
document.querySelector(".SI")?.addEventListener("click", async (event) => {
  event.preventDefault();

  const email = document.getElementById("signin-email").value.trim();
  const password = document.getElementById("psword").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, password }),
    });

    const data = await response.json();
    console.log(data);
    
    if (response.ok) {
      localStorage.setItem("token", data.token);
      console.log(localStorage.getItem("token"));
      alert("Login successful! Redirecting...");
      document.getElementById("signin-email").value = "";
      document.getElementById("psword").value = "";
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Error: Unable to connect to server!");
    console.log(error);
  }
});
