const THEME_KEY = "salao_tema";

export function getTemaSalvo(): "dark" | "light" {
  return localStorage.getItem(THEME_KEY) === "dark" ? "dark" : "light";
}

export function aplicarTema(tema: "dark" | "light") {
  document.documentElement.classList.toggle("dark", tema === "dark");
  localStorage.setItem(THEME_KEY, tema);
}
