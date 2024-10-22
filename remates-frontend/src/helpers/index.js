export const formatQuantity = (quantity) =>
  Number(quantity).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });
