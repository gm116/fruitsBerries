export async function refreshTokenIfNeeded() {
  const token = localStorage.getItem("token");
  const refresh = localStorage.getItem("refresh");

  if (!token || !refresh) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp - now < 120) {
      const response = await fetch("http://localhost:8080/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access);
        console.log("Новый access token получен");
      } else {
        console.warn("refresh token недействителен, выходим");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        window.location.href = "/auth";
      }
    }
  } catch (err) {
    console.error("Ошибка при обработке токена:", err);
  }
}