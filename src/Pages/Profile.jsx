import React, { useDebugValue, useEffect, useRef, useState } from "react";
const apiUrl = import.meta.env.VITE_BASE_URL;
import { useDispatch, useSelector } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  logoutUserSuccess,
} from "../Redux/User/userSlice";

function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setformData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  // handleChange function to track the changes in form
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };

  // make the  request to backend to update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(
        `${apiUrl}/api/users/update/${currentUser.user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            token: `${currentUser.token}`,
          },
          body: JSON.stringify({ ...formData, id: currentUser.user._id }),
        }
      );

      // convert to json;
      const data = await res.json();
      if (data.status == 200) {
        setUpdateSuccess(true);
        dispatch(updateUserSuccess(data));
      } else {
        dispatch(updateUserFailure(data));
      }
    } catch (err) {
      dispatch(updateUserFailure(err));
    }
  };

  // handleDelete function to delete the user;
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      
      const res = await fetch(
        `${apiUrl}/api/users/delete/${currentUser.user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: `${currentUser.token}`,
          },
          body: JSON.stringify({ id: currentUser.user._id }),
        }
      );
      
      const data = await res.json();
      console.log(data)
      if (data.status == 201) {
         dispatch(deleteUserSuccess(data))
      } else {
        dispatch(deleteUserFailure(data))
      }
  
    } catch (err) {
      dispatch(deleteUserFailure(err))
}

  };

  // handleLogout to logout user
  const handleLogout = () => {
      dispatch(logoutUserSuccess("user delete successfull"))
  }

  // console.log(file)
  console.log("formdata", formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  console.log(`upload prgress ${filePerc}% done`);
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setformData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.user.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-read-700">Error image upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading  ${filePerc}%`}</span>
          ) : filePerc == 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.user.username}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          defaultValue={currentUser.user.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <input
          placeholder="password"
          id="password"
          type="password"
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span
          onClick={handleLogout}
          className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-green-700">
        {updateSuccess ? "updated successfully" : ""}
      </p>
      <p className="text-red-700">{error ? error.message : ""}</p>
    </div>
  );
}

export default Profile;
