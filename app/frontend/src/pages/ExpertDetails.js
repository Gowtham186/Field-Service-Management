import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { getExpertProfile } from "../redux/slices.js/expert-slice"

export default function ExpertDetails(){
    const dispatch = useDispatch()
    const { id } = useParams()
    const { profile } = useSelector((state) => state.expert)
    const navigate = useNavigate()


    useEffect(() => {
        dispatch(getExpertProfile({id}))
    }, []);

    const handleBookExpert = (id)=>{
        navigate(`/experts/${id}/categories`)
    }

    return(
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Expert Details</h1>
        <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {profile?.userId?.name}</p>
            <p><span className="font-semibold">Age:</span> {profile?.age}</p>
            <p><span className="font-semibold">Gender:</span> {profile?.gender}</p>
            <p><span className="font-semibold">Experience:</span> {profile?.experience} years</p>
            <p><span className="font-semibold">Premium:</span> {profile?.isPremium ? "Yes" : "No"}</p>
            <p><span className="font-semibold">Verified:</span> {profile?.isVerified ? "Yes" : "No"}</p>
            <p><span className="font-semibold">Location:</span> {profile?.location?.address}</p>
            <p><span className="font-semibold">Skills:</span> {profile?.skills?.map(skill => skill.name).join(", ")}</p>
            <button
              className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600"
              onClick={()=> handleBookExpert(id)}            
            >Book Expert</button>
        </div>
    </div>
    )
}