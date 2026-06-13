document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const label = toggleBtn.querySelector(".label");

  const setDark = () => {
    document.body.classList.add("dark");
   // icon.textContent = "";
    label.textContent = "Light ☀️";
    localStorage.setItem("theme", "dark");
  };

  const setLight = () => {
    document.body.classList.remove("dark");
    //icon.textContent = "";
    label.textContent = "Dark 🌙";
    localStorage.setItem("theme", "light");
  };

  // Initialize theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") setDark();
  else if (saved === "light") setLight();
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setDark();
  else setLight();

  // Toggle theme on click
  toggleBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) setLight();
    else setDark();
  });
});