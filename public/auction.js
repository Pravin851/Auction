document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const register_number = document.getElementById("register_number").value;
    const name = document.getElementById("name").value;
    const dept = document.getElementById("dept").value;
    const phone = document.getElementById("phone").value;
  
    const response = await fetch("/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ register_number, name, dept, phone }),
    });
  
    const result = await response.text();
  
    const message = document.getElementById("signup-message");
    message.textContent = result.includes("successfully") ? "Signup Successful!" : "Signup Failed!";
  });
  
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const register_number = document.getElementById("register_number").value;
    const name = document.getElementById("name").value;
  
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ register_number, name }),
    });
  
    const result = await response.json();
  
    const message = document.getElementById("login-message");
    if (result.success) {
      window.location.href = "/auction";
    } else {
      message.textContent = "Invalid credentials. Please try again.";
    }
  });
  

  document.getElementById("bid-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const itemId = document.getElementById("item-id").value;
    const username = document.getElementById("username").value;
    const bidAmount = document.getElementById("bid-amount").value;
  
    const response = await fetch("/place-bid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, username, bidAmount }),
    });
  
    const result = await response.json();
    const message = document.getElementById("bid-message");
  
    if (result.success) {
      message.style.color = "green";
      message.textContent = "Bid placed successfully!";
    } else {
      message.style.color = "red";
      message.textContent = result.message;
    }
  });
  