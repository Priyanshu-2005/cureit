import { Avatar, Badge, Code, Flex } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import useGetDoctorProfileDetails from "../../hooks/useGetDoctorProfileDetails";
import Loader from "../Loader";
import EditDoctorProfile from "./EditDoctorProfile";
import { supabase } from "../../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import { data } from "autoprefixer";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@radix-ui/themes";

function DoctorProfileTab() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: "",
    age: "",
    gender: "",
    specialization: "",
    uid: 234,
  });
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const profileImagePlaceholder =
    "https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg";
  const [userId, setUserId] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tokenString = localStorage.getItem(
    "sb-vakmfwtcbdeaigysjgch-auth-token",
  );

  const token = JSON?.parse(tokenString);
  useEffect(() => {
    // // console.log("ggggg", token);
    if (!token) {
      toast.error("Session Expired Please Login Again.");
      navigate("/login", { state: { sessionExpiration: true } }); // Redirect to login page
    }
  }, [token]);

  const accessToken = token?.access_token;

  // const MyComponent = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    isLoading: isLoadingDetails,
    data: dataDetails,
    error: errorDetails,
    refetch: refetchDetails,
    isFetching: isFetchingDetails,
  } = useGetDoctorProfileDetails(userId, accessToken);

  useEffect(() => {
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      // console.log("Session Data:", data);
      if (error) {
        console.error("Session Error:", error);
        // navigate("/login");
        navigate("/login", { state: { sessionExpiration: true } }); // Redirect to login page
      }
    };
    //can enter a toast here user not authenticated to view this page
    checkUserSession();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
      if (error) console.error("Error fetching user:", error);
    };
    fetchUser();
  }, []);

  const fetchUserProfile = async () => {
    try {
      if (dataDetails) {
        // console.log(dataDetails);
        setProfile({
          name: dataDetails.profiles.name || "",
          email: dataDetails.profiles.email || "",
          phone: dataDetails.profiles.phone_number || "",
          address: dataDetails.profiles.address || "",
          profileImage: dataDetails.profiles.avatar_url,
          age: dataDetails.profile.age || null,
          gender: dataDetails.profiles.gender || "",
          specialization: dataDetails.profile.specialization || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    // console.log("hello", " ", userId);
    if (userId) fetchUserProfile();
  }, [userId, dataDetails]);

  useEffect(() => {
    // console.log("profile ", profile);
  }, [profile]);
  // console.log("profile ", profile);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${API_URL}/api/doctorProfileRoutes/download/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Add your token here
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        // console.log(response);
        throw new Error(response.status);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onError: (error) => {
      // console.log(error);
      if (error.message === "404") {
        // // console.log(error);
        alert("No appointments scheduled for today");
      } else {
        // console.log("Error downloading file:", error.message);
        alert("Failed to download the appointments file.");
      }
    },
  });
  return (
    <div className="flex flex-col gap-y-6">
      {isFetchingDetails && <Loader />}
      <div className="flex flex-col justify-start gap-x-4 rounded-md border px-8 py-4 text-xs sm:gap-x-12 md:flex-row md:text-sm">
        <div className="flex flex-col items-center justify-center p-4">
          <Flex gap="2">
            <Avatar
              size={{
                initial: "4",
                sm: "5",
                md: "6",
              }}
              radius="full"
              src={profile.profileImage || profileImagePlaceholder}
              fallback={profile.name[0]?.toUpperCase()}
            />
          </Flex>
          <div className="mt-1 w-32 text-center">{profile.name}</div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div>
            <span className="font-semibold">Email:</span> {profile?.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {profile?.phone}
          </div>
          <div>
            <span className="font-semibold">Address:</span> {profile?.address}
          </div>
          <div>
            <span className="font-semibold">Specialization:</span>{" "}
            <Code>{profile?.specialization} </Code>
          </div>
          <div>
            <span className="font-semibold">Age & Gender:</span> {profile?.age}{" "}
            {profile.gender}
          </div>
          <div className="mt-12 flex w-full justify-center gap-x-4">
            <Button
              color="iris"
              size="3"
              variant="soft"
              className="download-btn my-4"
              onClick={() => mutation.mutate()}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? "Downloading..."
                : "Download Today's Appointments"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfileTab;
