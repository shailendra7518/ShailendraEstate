import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const apiUrl = import.meta.env.VITE_BASE_URL;
import React, { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function UpdateListing() {
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.id;

      const res = await fetch(`${apiUrl}/api/listing/get/${listingId}`);
      const data = await res.json();

      if (data.status == 200) {
        setFormData(data.listing);
      } else {
        console.log(data);
      }

      console.log(listingId);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed");
          setUploading(false);
        });
    } else {
      setImageUploadError("you can only upload 6 image per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(snapshot);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (e.target.type === "text" || e.target.type === "textarea") {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    if (e.target.type === "number") {
      setFormData({ ...formData, [e.target.id]: +e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("upload atleast 1 image");
      }
      if (formData.regularPrice < formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      setLoading(true);
      setError(false);
       console.log('HELLO')
      const res = await fetch(`${apiUrl}/api/listing/update/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          token: currentUser.token,
          id: currentUser.user._id,
        },
        body: JSON.stringify({ ...formData, userRef: currentUser.user._id }),
      });
      const data = await res.json();
    
       setLoading(false);
    
        Navigate(`/listing/${data.updatedlisting._id}`);
       
    } catch (err) {
      setError(error);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            onChange={handleChange}
            value={formData.name}
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg "
            id="name"
            maxLength={"62"}
            minLength={"10"}
            required
          />

          <textarea
            onChange={handleChange}
            value={formData.description}
            type="text"
            className="border p-3 rounded-lg"
            id="description"
            placeholder="Description"
            required
          />

          <input
            onChange={handleChange}
            value={formData.address}
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg "
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type == "sale"}
                type="checkbox"
                id="sale"
                className="w-5 "
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.type == "rent"}
                type="checkbox"
                id="rent"
                className="w-5 "
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.parking}
                type="checkbox"
                id="parking"
                className="w-5 "
              />
              <span>Parking spot</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5 "
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-5 "
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bedrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>

            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.bathrooms}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
              />
              <p>Baths</p>
            </div>

            <div className=" flex items-center gap-2">
              <input
                onChange={handleChange}
                value={formData.regularPrice}
                className="p-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col item-center">
                <p>Regular price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
            {formData.offer && (
              <div className=" flex items-center gap-2">
                <input
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border border-gray-300 rounded-lg"
                  type="number"
                  id="discountPrice"
                  min="1"
                  max="10"
                  required
                />
                <div className="flex flex-col item-center">
                  <p>Discount Price</p>
                  <span className="text-xs">$ / month</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Image:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/.*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div
                key={i}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  className="w-20 h-20 object-contain rounded-lg"
                  src={url}
                  alt="listing image"
                />
                <button
                  onClick={() => handleRemoveImage(i)}
                  type="button"
                  className="text-red-700 rounded-lg 
                    uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}

export default UpdateListing;