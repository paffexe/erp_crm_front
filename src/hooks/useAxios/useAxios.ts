import type { AxiosType } from "@/types";
import axios from "axios";
import Cookies from "js-cookie";

export const useAxios = () => {
  const request = ({ url, method = "GET", header, param, body }: AxiosType) => {
    return axios({
      url: `${import.meta.env.VITE_API_URL}/${url}`,
      method,
      data: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
        ...header,
      },
      params: {
        ...param,
      },
    })
      .then((res) => res.data)
      .catch((error) => console.log(error));
  };
  return request;
};
