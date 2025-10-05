import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const response = await axiosInstance.get("/blog/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response;
      if (response.status === 200) {
        toast.success("Blogs fetched successfully");
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    axiosInstance,
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppProvider;
