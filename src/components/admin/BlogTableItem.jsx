import React from "react";
import { assets } from "../../assets/assets";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../hooks/useAppContext";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { title, createdAt, _id } = blog; // Destructure _id directly
  const BlogDate = new Date(createdAt);
  const { token } = useAppContext();

  const deleteBlog = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirm) return;
    try {
      const response = await axiosInstance.delete(`/blog/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response;
      if (response.status === 200) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    }
  };

  const togglePublish = async () => {
    console.log("Token:", token);
    console.log("Blog ID:", _id);
    console.log("Current published status:", blog.isPublished);
    try {
      const response = await axiosInstance.patch(
        `/blog/${_id}`,
        { isPublished: !blog.isPublished }, // Send the toggle value in body
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { data } = response;
      if (response.status === 200) {
        toast.success(data.message);
        await fetchBlogs();
      } else if (response.status === 400) {
        toast.error(data.message);
      } else if (response.status === 404) {
        toast.error(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>
      <td className="px-2 py-4">{title}</td>
      <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>
      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>
      <td className="px-2 py-4 flex text-xs gap-3">
        <button
          onClick={togglePublish}
          className="border px-2 py-0.5 mt-1 rounded cursor-pointer"
        >
          {blog.isPublished ? "Unpublish" : "Publish"}
        </button>
        <img
          onClick={deleteBlog}
          src={assets.cross_icon}
          alt=""
          className="w-8 hover:scale-110 transition-all cursor-pointer"
        />
      </td>
    </tr>
  );
};

export default BlogTableItem;
