import { parseISO, format } from "date-fns";
import es from "date-fns/locale/es";

export const formatQuantity = (quantity) =>
  Number(quantity).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
  });

export const displayDate = (date) => {
  try {
    const newDate = parseISO(date);
    return format(newDate, "PPPPpppp", { locale: es });
  } catch (error) {
    console.log(error);
    return "";
  }
};
