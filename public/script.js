
function fetchStudents() {
    fetch("/view-students")
      .then((response) => response.json())
      .then((data) => {
        const tbody = document.querySelector("#studentTable tbody");
        tbody.innerHTML = "";
  
        data.forEach((student) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${student.register_number}</td>
            <td>${student.name}</td>
            <td>${student.dept}</td>
            <td>${student.phone || ""}</td>
            <td>
              <button onclick="editStudent('${student._id}')">Edit</button>
              <button onclick="deleteStudent('${student._id}')">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      });
  }
  
  document.querySelector("#studentForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const id = document.querySelector("#studentId").value;
    const register_number = document.querySelector("#register_number").value;
    const name = document.querySelector("#name").value;
    const dept = document.querySelector("#dept").value;
    const phone = document.querySelector("#phone").value;
  
    fetch("/add-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, register_number, name, dept, phone }),
    }).then(() => {
      fetchStudents();
      this.reset();
    });
  });
  
  function editStudent(id) {
    fetch(`/view-students`)
      .then((response) => response.json())
      .then((data) => {
        const student = data.find((s) => s._id === id);
        document.querySelector("#studentId").value = student._id;
        document.querySelector("#register_number").value = student.register_number;
        document.querySelector("#name").value = student.name;
        document.querySelector("#dept").value = student.dept;
        document.querySelector("#phone").value = student.phone;
      });
  }
  
  function deleteStudent(id) {
    fetch(`/delete-student/${id}`).then(() => fetchStudents());
  }
  
  window.onload = fetchStudents;
  