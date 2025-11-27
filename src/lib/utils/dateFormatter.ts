export const formatDate = (iso: string): string => {
  const date = new Date(iso);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sept","Oct","Nov","Dec"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${month} ${day}, ${year} - ${hour}:${minute}`;
};
