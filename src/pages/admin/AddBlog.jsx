import { useState, useRef, useEffect } from "react";
import { assets, blogCategories } from "../../assets/assets";
import Quill from "quill";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { useAppContext } from "../../hooks/useAppContext";

const AddBlog = () => {
  const [isAdding, setIsAdding] = useState(false);
  const { token } = useAppContext();

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {};

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsAdding(true);

    const formData = new FormData();
    // Append fields directly (not nested in "blog")
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("description", quillRef.current.root.innerHTML);
    formData.append("category", category);
    formData.append("isPublished", isPublished);
    formData.append("image", image); // Ensure `image` is a File object

    try {
      const response = await axiosInstance.post("/blog/add", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response;
      if (response.status === 201) {
        toast.success(data.message);
        setImage(false);
        setTitle("");
        quillRef.current.root.innerHTML = "";
        setSubTitle("");
        setCategory("Startup");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    // Initialize Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            accept="image/*"
            hidden
            required
          />
        </label>
        <p className="mt-4">Blog title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Sub title</p>
        <input
          type="text"
          placeholder="Type here"
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          required
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:undeline cursor-pointer"
          >
            Generate with AI
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          <option value="">Select category</option>
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scaale-125"
          />
        </div>

        <button
          type="submit"
          disabled={isAdding}
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
