import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const InputPodcast = () => {
  const [frontImage, setFrontImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [Dragging, setDragging] = useState(false);
  const [Inputs, setInputs] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleChangeImage = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setFrontImage(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropImage = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    setFrontImage(file);
  };

  const handleAudioFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setAudioFile(file);
  };

  const onChangeInputs = (e) => {
    const { name, value } = e.target;
    setInputs({ ...Inputs, [name]: value });
  };

  const handleSubmitPodcast = async () => {
    const data = new FormData();
    data.append("title", Inputs.title);
    data.append("description", Inputs.description);
    data.append("category", Inputs.category);
    data.append("frontImage", frontImage);
    data.append("audioFile", audioFile);

    try {
      const res = await axios.post(
        `${window.location.origin}/api/v1/add-podcast`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // Ensure this is true
        }
      );
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setInputs({
        title: "",
        description: "",
        category: "",
      });
      setFrontImage(null);
      setAudioFile(null);
    }
  };

  return (
    <div className="my-4 px-4 lg:px-12">
      <ToastContainer />
      <h1 className="text-2xl font-semibold">Create your podcast</h1>
      <div className="mt-5 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="w-full lg:w-2/6 flex items-center justify-center lg:justify-start">
          <div
            className="h-[20vh] lg:h-[60vh] flex items-center justify-center border border-dashed hover:bg-slate-50 transition-all duration-300"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDropImage}
          >
            <input
              type="file"
              accept="image/*"
              id="file"
              name="frontImage"
              className="hidden"
              onChange={handleChangeImage}
            />
            {frontImage ? (
              <img
                src={URL.createObjectURL(frontImage)}
                alt="thumbnail"
                className="h-full w-full object-cover"
              />
            ) : (
              <>
                <label
                  htmlFor="file"
                  className={`text-xl p-4 h-full w-full flex items-center justify-center ${
                    Dragging ? "bg-blue-200" : "hover:bg-zinc-200"
                  } transition-all duration-300`}
                >
                  Drag and drop the thumbnail or click to browse
                </label>
              </>
            )}
          </div>
        </div>
        <div className="w-full lg:w-4/6">
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title for your podcast"
              className="mt-4 px-4 py-2 border border-zinc-800 rounded"
              value={Inputs.title}
              onChange={onChangeInputs}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Description for your podcast"
              className="mt-4 px-4 py-2 border border-zinc-800 rounded"
              rows={4}
              value={Inputs.description}
              onChange={onChangeInputs}
            />
          </div>
          <div className="flex mt-4">
            <div className="flex flex-col w-2/6">
              <label htmlFor="audioFile">Select Audio</label>
              <input
                type="file"
                accept=".mp3, .wav, .m4a, .ogg"
                id="audioFile"
                className="mt-4"
                onChange={handleAudioFile}
              />
            </div>
            <div className="flex flex-col w-4/6">
              <label htmlFor="category">Select Category</label>
              <select
                name="category"
                id="category"
                className="border border-zinc-900 rounded mt-4 px-4 py-2"
                value={Inputs.category}
                onChange={onChangeInputs}
              >
                <option value="">Select Category</option>
                <option value="Comedy">Comedy</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Hobbies">Hobbies</option>
                <option value="Government">Government</option>
              </select>
            </div>
          </div>
          <div className="mt-8 lg:mt-6 flex">
            <button
              className="bg-zinc-900 w-full text-white rounded px-8 py-2 font-semibold hover:bg-zinc-800 transition-all duration-300"
              onClick={handleSubmitPodcast}
            >
              Create Podcast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPodcast;
