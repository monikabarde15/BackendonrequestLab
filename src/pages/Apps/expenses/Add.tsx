import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../store/themeConfigSlice";
import IconSave from "../../../components/Icon/IconSave";
import axios from "axios";

const Add = () => {
  const dispatch = useDispatch();
  const [preview, setPreview] = useState("/assets/images/cybblackpink.png");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: null as File | null,
  });

  useEffect(() => {
    dispatch(setPageTitle("Add Expense"));
  }, [dispatch]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveData = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("price", formData.price);
      if (formData.image) {
        data.append("image", formData.image);
      }

      // 🔹 अब Expense API कॉल करेंगे
      const res = await axios.post("https://newadmin-u8tx.onrender.com/api/expenses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

    if (res.data.success) {
    alert("Expense Saved! ID: " + res.data.data._id);
    }

    } catch (err) {
      console.error(err);
      alert("Error saving expense.");
    }
  };

  return (
    <div className="panel max-w-2xl mx-auto p-6 shadow-lg rounded-xl bg-white dark:bg-gray-800">
      {/* Image Upload */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={preview}
          alt="Preview"
          className="w-28 h-28 object-cover rounded-xl border shadow-md mb-4"
        />
        <label className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="Enter title"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-textarea w-full min-h-[100px]"
          placeholder="Write description..."
        ></textarea>
      </div>

      {/* Price */}
      <div className="mb-6">
        <label htmlFor="price" className="block font-medium mb-1">
          Price
        </label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          className="form-input w-full"
          placeholder="Enter price"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-center">
        <button
          type="button"
          className="btn btn-success px-8 py-2 text-lg rounded-lg shadow-md"
          onClick={saveData}
        >
          <IconSave className="mr-2 shrink-0" /> Save
        </button>
      </div>
    </div>
  );
};

export default Add;
