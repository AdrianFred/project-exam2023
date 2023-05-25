import { useState, useEffect } from "react";

const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const handleAvatarChange = (e) => {
    const imageUrl = e.target.value;
    setAvatar(imageUrl);
  };

  const handleVenueManagerChange = (e) => {
    setIsVenueManager(e.target.checked);
    console.log(isVenueManager);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    async function updateProfile() {
      const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem("name")}/media`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          avatar: avatar,
        }),
      });
    }
    updateProfile();
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      async function fetchData() {
        const res = await fetch(`https://api.noroff.dev/api/v1/holidaze/profiles/${localStorage.getItem("name")}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: undefined,
        });
        const data = await res.json();
        setUserInfo(data);
        setIsVenueManager(data.venueManager);
        console.log(data);
      }
      fetchData();
    }
  }, []);

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-2">Avatar URL</label>
          <input type="text" value={avatar} onChange={handleAvatarChange} className="border border-gray-300 px-4 py-2 w-full rounded" />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Current Avatar</label>
          {userInfo.avatar ? (
            <img src={userInfo.avatar} alt="Current Avatar" className="w-36 h-36 object-cover rounded" />
          ) : (
            <span className="text-gray-500">No avatar selected</span>
          )}
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-2">Venue Manager</label>
          <input type="checkbox" checked={userInfo.venueManager} onChange={handleVenueManagerChange} className="mr-2" />
          <span className="text-sm">Are you a venue manager?</span>
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
