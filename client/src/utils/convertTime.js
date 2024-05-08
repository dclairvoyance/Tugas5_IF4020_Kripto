// convert 2024-05-07T10:34:28.322Z to 17:34
export const convertTime = (time) => {
  const date = new Date(time);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export default convertTime;
