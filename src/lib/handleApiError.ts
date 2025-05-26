import { AxiosError } from 'axios';

/**
 * Обробка помилок, які приходять з бекенду через axios
 * @param error - необроблена помилка (може бути будь-чим)
 * @returns рядок з повідомленням, яке можна показати користувачу
 */
export function handleApiError(error: unknown): string {
  // Якщо помилка справді з axios
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    // console.log('API Error:', error);
    // console.log('status:', status);

    const message = error.response?.data?.message || error.response?.data?.error;

    // console.log('message:', message);


    // Виводимо різні повідомлення залежно від статусу
    switch (status) {
      case 400:
      case 422:
        return message || 'Invalid input. Please check your data.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'Requested resource not found.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return 'Unexpected error. Please try again.';
    }
  }

  // Якщо помилка не з axios (наприклад, синтаксична)
  return 'Unexpected error occurred.';
}
