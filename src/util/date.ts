import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const parseUtcDate = (dateString: string, type: "start" | "end") => {
  const parsedDate = dayjs.utc(dateString, "YYYY-MM-DD");

  return type === "end"
    ? parsedDate.endOf("day").toDate()
    : parsedDate.startOf("day").toDate();
};
