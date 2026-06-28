export const getErrorMessage = (error) => {
  if (!navigator.onLine) {
    return "No internet connection";
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong"
  );
};