document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const register_number = document.getElementById("register_number").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ register_number, password }),
  });

  const result = await response.json();
  
  // Log result
  console.log(result);

  const message = document.getElementById("login-message");

  if (result.success) {
    message.style.color = "green";
    message.textContent = "Login successful! Welcome, " + result.user.name;
    
    setTimeout(() => {
      window.location.href = "/home";  
    }, 1000); 
  } else {
    message.style.color = "red";
    message.textContent = "Invalid credentials. Please try again.";
  }
});
