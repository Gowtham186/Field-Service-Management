import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewSkill, changeProfilePic, fetchSkills, getExpertProfile, updateProfile } from "../redux/slices.js/expert-slice";
import { useParams } from "react-router-dom";
import CreatableSelect from 'react-select/creatable';
import { getUserProfile } from "../redux/slices.js/user-slice";
import { ImagePlus } from 'lucide-react'

export default function ExpertProfile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { profile, allSkills, loading } = useSelector((state) => state.expert);
    const [editProfile, setEditProfile] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id) {
            dispatch(getExpertProfile({id}));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (profile?.skills) {
            setSelectedSkills(
                profile.skills.map(skill => ({ value: skill._id, label: skill.name }))
            );
        }
    }, [profile?.skills]);

    if (!profile || loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    const options = allSkills?.map(ele => ({ value: ele._id, label: ele.name }));

    const handleEditProfile = (expertProfile) => {
        dispatch(fetchSkills());
        setEditProfile(expertProfile);

        if (expertProfile?.skills) {
            setSelectedSkills(
                expertProfile.skills.map(skill => ({ value: skill._id, label: skill.name }))
            );
        }
    };

    const handleSaveProfile = async(e) => {
        e.preventDefault();
        console.log(editProfile);
        try{
            await dispatch(updateProfile({id, body : editProfile})).unwrap()

            dispatch(getExpertProfile({id}))
            dispatch(getUserProfile())
        }catch(err){
            console.log(err.response)
        }

        setEditProfile(null); 
    };

    const handleCreate = async (inputValue) => {
        try {
            console.log("Creating skill with input:", inputValue); // Debug log
    
            const response = await dispatch(addNewSkill({ skill: inputValue })).unwrap();
    
            if (!response || !response._id) {
                console.error("Invalid response from API:", response);
                return;
            }
    
            console.log("Skill created successfully:", response); // Debug log
    
            const newSkill = { value: response._id, label: response.name };
    
            setSelectedSkills((prev) => [...prev, newSkill]);
    
            setEditProfile((prev) => ({
                ...prev,
                skills: [...(prev?.skills || []), response._id]
            }));
        } catch (err) {
            console.error("Error creating skill:", err);
        }
    };    
    

    const handleSelectSkills = (selectedOption) => {
        setSelectedSkills(selectedOption);
        setEditProfile((prev) => ({
            ...prev,
            skills: selectedOption.map(ele => ele.value)
        }));
    };

    const handleImageUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Selected file:", file);
            const profilePicData = new FormData()
            profilePicData.append('profilePic', file)

            dispatch(changeProfilePic({ id, profilePicData }))
            .unwrap()
            .then(() => {
                console.log("Profile picture updated successfully!");
                dispatch(getExpertProfile(id)); // Fetch updated profile data
            })
            .catch((error) => {
                console.error("Failed to update profile picture:", error);
            });        }
    };

    return (
        <div className="relative">
            <button
                className="absolute top-2 right-4 bg-blue-500 text-white  px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => handleEditProfile(profile)}
            >
                Edit
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Expert Profile</h2>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            <div className="flex gap-2">
                {/* Left Column */}
                <div className="w-1/2 border p-6 rounded-lg shadow-sm bg-gray-50">
                    <div className="flex flex-col mb-4">
                        <img src={profile.profilePic} alt="Profile" className="w-32 h-32 rounded-full border-2 border-gray-300" />
                    </div>
                        <button 
                            className="absolute top-44 left-36 bg-gray-200 text-gray-500 p-2 rounded-full hover:bg-blue-600 flex items-center"
                            onClick={handleImageUpload}
                        >
                            <ImagePlus size={20} />
                        </button>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Name</p>
                        <p className="text-lg font-semibold">{profile?.userId?.name || "N/A"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Email</p>
                        <p className="text-gray-700">{profile?.userId?.email || "N/A"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Phone</p>
                        <p className="text-gray-700">{profile?.userId?.phone_number || "N/A"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Address</p>
                        <p className="text-gray-700">{profile?.location?.address || "N/A"}</p>
                    </div>
                </div>

                <div className="w-1/2 border p-6 rounded-lg shadow-sm bg-gray-50">
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Age</p>
                        <p className="text-gray-700">{profile?.age || "N/A"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Gender</p>
                        <p className="text-gray-700">{profile?.gender || "N/A"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Experience</p>
                        <p className="text-gray-700">{profile?.experience} years</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Skills</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {profile?.skills?.length > 0 ? (
                                profile.skills.map((skill) => (
                                    <span
                                        key={skill._id}
                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
                                    >
                                        {skill.name}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-700">N/A</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Verified</p>
                        <p className="text-gray-700">{profile?.isVerified ? "Yes" : "No"}</p>
                    </div>
                    <div className="mb-2">
                        <p className="text-gray-500 uppercase text-sm">Premium</p>
                        <p className="text-gray-700">{profile?.isPremium ? "Yes" : "No"}</p>
                    </div>
                </div>
            </div>

            {editProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
                        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
                        
                        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
                            <input 
                                type="text"
                                className="border p-2 rounded"
                                value={editProfile.userId.name}
                                onChange={(e) => setEditProfile((prev) => ({
                                    ...prev, 
                                    userId: { ...prev.userId, name: e.target.value } 
                                }))}
                            />

                            <input 
                                type="email"
                                className="border p-2 rounded"
                                value={editProfile.userId.email}
                                onChange={(e) => setEditProfile((prev) => ({
                                    ...prev, 
                                    userId: { ...prev.userId, email: e.target.value }
                                }))}
                            />

                            <input 
                                type="number"
                                className="border p-2 rounded"
                                value={editProfile.userId.phone_number} 
                                onChange={(e) => setEditProfile((prev) => ({
                                    ...prev, 
                                    userId: { ...prev.userId, phone_number: e.target.value }
                                }))}
                            />

                            <input 
                                type="text"
                                className="border p-2 rounded"
                                value={editProfile.location.address}
                                onChange={(e) => setEditProfile((prev) => ({ 
                                    ...prev, 
                                    location: { ...prev.location, address: e.target.value } 
                                }))}
                            />

                            <CreatableSelect
                                options={options}
                                onCreateOption={handleCreate}
                                id="skills"
                                onChange={handleSelectSkills}
                                className="w-full"
                                value={selectedSkills}
                                isMulti
                            />

                            <div className="flex justify-between mt-4">
                                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setEditProfile(null)}>Cancel</button>
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
