import { secureAxios, guestAxios } from "./AxiosInstance";

export const fetchItems = async () => {
  const api = "stat/items";
  const res = await secureAxios.get(api);
  return res.data.data;
};
export const fetchStates = async () => {
  const api = "stat/states";
  const res = await guestAxios.get(api);
  return res.data.data;
};
export const fetchMenus = async () => {
  const api = "stat/menus";
  const res = await secureAxios.get(api);
  return res.data.data;
};
export const downloader = async (filePath) => {
  try {
    const api = "schedule/download-excel";

    const res = await secureAxios.post(
      api,
      { filePath },
      { responseType: "blob" }
    );

    if (!res) {
      return;
    }
    console.log(res);

    var fileURL = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/vnd.ms-excel" })
    );
    var fileLink = document.createElement("a");

    fileLink.href = fileURL;
    console.log(filePath);
    fileLink.setAttribute("download", filePath.split("/").pop());
    document.body.appendChild(fileLink);

    fileLink.click();
  } catch (err) {
    console.log(err);
  }
};
