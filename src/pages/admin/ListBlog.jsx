import React, { useEffect, useState } from "react";
import { blog_data } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import { useAppContext } from "../../hooks/useAppContext";
import { toast } from "react-toastify";

const ListBlog = () => {
  const { blogs, setBlogs, token } = useAppContext();

  const fetchBlogs = async () => {
    // setBlogs(blog_data);
    try {
      const response = await axiosInstance.get("/admin/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response;
      if (response.status === 200) {
        setBlogs(data.blogs);
      } else {
        console.log(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="mt-4 flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <h1>All blogs</h1>

      <div className="relative h-4/5 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hid bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-600 text-left uppercase">
            <tr>
              <th scope="col" className="px-2 py-4 xl:px-6">
                #
              </th>
              <th scope="col" className="px-2 py-4">
                Blog Title
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-2 py-4 max-sm:hidden">
                Status
              </th>
              <th scope="col" className="px-2 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => {
              return (
                <BlogTableItem
                  key={blog._id}
                  blog={blog}
                  fetchBlogs={fetchBlogs}
                  index={index + 1}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
