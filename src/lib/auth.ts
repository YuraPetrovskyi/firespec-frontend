import axios from "@/lib/axios";

/**
 * Оновлює токен через бекенд
 * @returns новий токен або null
 */
export const refreshToken = async (): Promise<string | null> => {
  console.log("Refreshing token...");
  const oldToken = localStorage.getItem("token");
  if (!oldToken) return null;

  try {
    const res = await axios.post("/refresh", null, {
      headers: {
        Authorization: `Bearer ${oldToken}`,
      },
    });

    const newToken = res.data.token;
    const newUser = res.data.user;
    // console.log("New token:", newToken);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // 🔄 Сповіщаємо AuthContext, що дані змінилися
    window.dispatchEvent(new Event("auth-updated"));

    return newToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return null;
  }
};
