import { useState } from "react";

function ProfileInfo({ API_URL, user, setUser, message, setMessage }) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileAge, setProfileAge] = useState(user?.age || "");
  const [profileWeight, setProfileWeight] = useState(user?.weight || "");

  async function updateProfile(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          age: Number(profileAge),
          weight: Number(profileWeight)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Could not update profile");
        return;
      }

      const updatedUser = {
        ...user,
        age: data.age ?? Number(profileAge),
        weight: data.weight ?? Number(profileWeight)
      };

      setUser(updatedUser);
      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      setEditingProfile(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to server.");
    }
  }

  return (
    <>
      <div className="info-grid">
        <div className="info-box">
          <div className="info-label">Name</div>
          <div className="info-value">{user.name}</div>
        </div>

        <div className="info-box">
          <div className="info-label">Email</div>
          <div className="info-value">{user.email}</div>
        </div>

        <div className="info-box">
          <div className="info-label">Age</div>

          {editingProfile ? (
            <input
              type="number"
              value={profileAge}
              onChange={(e) => setProfileAge(e.target.value)}
            />
          ) : (
            <div className="info-value">{user.age}</div>
          )}
        </div>

        <div className="info-box">
          <div className="info-label">Weight</div>

          {editingProfile ? (
            <input
              type="number"
              value={profileWeight}
              onChange={(e) => setProfileWeight(e.target.value)}
            />
          ) : (
            <div className="info-value">{user.weight} kg</div>
          )}
        </div>
      </div>

      {editingProfile ? (
        <form onSubmit={updateProfile} className="profile-actions">
          <button type="submit">Save Profile</button>
          <button type="button" onClick={() => setEditingProfile(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setEditingProfile(true)}>
          Edit Age / Weight
        </button>
      )}

      <p>{message}</p>
    </>
  );
}

export default ProfileInfo;