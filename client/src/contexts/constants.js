export const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "https://floating-castle-01348.herokuapp.com/api/"
    : "http://localhost:5000/api/";
