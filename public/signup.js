document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const register_number = document.getElementById("register_number").value;
  const name = document.getElementById("name").value;
  const dept = document.getElementById("dept").value;
  const phone = document.getElementById("phone").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ register_number, name, dept, phone, password }),
  });

  const result = await response.json();

  const message = document.getElementById("signup-message");
  if (result.success) {
    message.style.color = "green";
    message.textContent = result.message;

    setTimeout(() => {
      window.location.href = "/auction";
    }, 1000); 
  } else {
    message.style.color = "red";
    message.textContent = result.message;
  }
});
