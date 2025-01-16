import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import StudentProfile from "./Student/StudentProfile";
import OrganizerProfile from "./Organizer/OrganizerProfile";
import AdminProfile from "./Admin/AdminProfile";

export default function CommonProfile({mainUser}) {
  const { paramId } = useParams();
  console.log("ParamId:", paramId);

  const [user, setUser] = useState({});
  const [interests, setInterests] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (paramId) {
      axios.defaults.withCredentials = true;
      axios
        .get(`http://localhost:3000/profiles/${paramId}`)
        .then((res) => {
          console.log(res.data);
          setUser(res.data.user);
          setInterests(res.data.user.interests || []);
          setLoaded(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [paramId]);

  if (!loaded) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {paramId[0] === "S" ? (
        <StudentProfile user={user} interests={interests} mainUser={mainUser}/>
      ) : paramId[0] === "O" ? (
        <OrganizerProfile user={user} mainUser={mainUser}/>
      ) : (
        <AdminProfile user={user} mainUser={mainUser}/>
      )}
    </>
  );
}
