import moment from "moment";

export const formatDate = (date: string | Date) => {
  const DATE_FORMAT = "MMMM Do YYYY, h:mm:ss a";
  return moment(date).format(DATE_FORMAT);
};
