const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/auto/upload`;

export const uploadFile = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "chat-app");

  const response = await fetch(url, {
    method: "post",
    body: data,
  });

  const responseData = await response.json();

  return responseData;
};
