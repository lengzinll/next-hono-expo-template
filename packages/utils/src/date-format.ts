import moment from "moment";

export function formatDate(date: Date | string | number): string {
  return moment(date).format("DD-MM-YYYY hh:mm A");
}
