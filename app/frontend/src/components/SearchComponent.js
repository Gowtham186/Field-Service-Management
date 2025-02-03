import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { querying, getAddress, setSearchSkillState } from "../redux/slices.js/search-slice"
import { useNavigate } from "react-router-dom"
import { fetchSkills, setSelectedExpertProfile } from "../redux/slices.js/expert-slice"
import Select from 'react-select'

export default function SearchComponent(){
    const { resultsExperts, serverError, currentAddress } = useSelector((state)=> state.search)
    const [searchLocation, setSearchLocation] = useState(currentAddress || "")
    const [searchSkill, setSearchSkill] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allSkills } = useSelector((state) => state.expert)

    useEffect(()=>{
        dispatch(fetchSkills())
    },[])

    const skillOptions = allSkills?.map(skill => ({ value : skill._id, label : skill.name}))

    const handleSkillSelect = (selectedOption)=>{
        const selectedSkillValue = selectedOption ? selectedOption.value : "";
        setSearchSkill(selectedSkillValue)
        dispatch(setSearchSkillState(selectedSkillValue))
    }
    const handleSearch = async(e)=>{
        e.preventDefault()
        // console.log(searchLocation)
        // console.log(searchSkill)
        const queryParams = new URLSearchParams()

        if(searchLocation !== ""){
            queryParams.append("location", searchLocation)
        }
        if(searchSkill !== ""){
            queryParams.append("skill", searchSkill)
        }

        const queryString = queryParams.toString()
        console.log(queryString)
        try{
            dispatch(querying(queryString))
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        if(currentAddress){
            setSearchLocation(currentAddress)
        }
    }, [currentAddress])

    const getCurrentLocation = ()=>{
        if("geolocation" in navigator){
            navigator.geolocation.getCurrentPosition(async(position) => {
                const lat = position.coords.latitude
                const lng = position.coords.longitude
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)

                await dispatch(getAddress({lat, lng})).unwrap()
            })   
        }
    }


    const handleViewDetails = (expert)=>{
        //console.log('view details', expert)
        dispatch(setSelectedExpertProfile(expert))
        navigate(`/experts/${expert.userId._id}`)
    }

    return(
        <div className="p-4 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSearch} className="flex flex-col items-center space-y-4">
                    <input 
                        type="search"
                        value={searchLocation}
                        onChange={(e)=> setSearchLocation(e.target.value)}
                        placeholder="Enter location"
                        className="w-3/4 sm:w-1/2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="bg-gray-500 text-white p-2 rounded-md cursor-pointer hover:bg-gray-600"
                        >
                            Get Current Location
                        </button>
                    <Select
                        options={skillOptions}
                        className="w-64"
                        onChange={handleSkillSelect}
                        isClearable
                        />
                    {/* {!searchSkill && (
                        <p className="text-red-500 text-center mt-4">You should select a skill to search.</p>
                    )} */}

                    <div className="flex justify-center space-x-4">
                        <input 
                            type="submit"
                            value="Search"
                            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600"
                        />
                    </div>
                </form>
                
            </div>

            {serverError && <p className="text-red-500 text-center mt-4">{serverError}</p>}
            {resultsExperts && resultsExperts?.length === 0 && <p className="text-red-500 text-center mt-4">No experts found in this location & skill</p>}
            <div className="mt-8">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resultsExperts?.length > 0 && 
                        resultsExperts.map((expert) => (
                            <div key={expert.userId._id} className="bg-white p-4 rounded-lg shadow-lg">
                                <h1 className="text-xl font-semibold mb-2">{expert.userId.name}</h1>
                                <p className="text-gray-700">Experience: {expert.experience} years</p>
                                <p className="text-gray-700">Age: {expert.age}</p>
                                <p className="text-gray-700">Gender: {expert.gender}</p>
                                <div className="mt-2">
                                    {/* <h2 className="text-lg font-semibold">Skills:</h2>
                                    {expert?.skills?.map((skill, index) => (
                                        <p key={index} className="text-gray-600">{skill.name}</p>
                                    ))} */}
                                </div>
                                    
                                {/* {expert.documents?.length > 0 && (
                                    <div className="mt-4">
                                        <h2 className="text-lg font-semibold">Documents:</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {expert.documents.map((doc, index) => (
                                                <div key={index} className="border p-2 rounded-md">
                                                    
                                                        <img 
                                                            src={doc.pathName} 
                                                            alt={`Document ${index + 1}`} 
                                                            className="w-16 h-16 object-cover rounded-md"
                                                        />
                                                    
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )} */}

                                <button
                                   className="bg-blue-500 text-white p-2 rounded-md cursor-pointer hover:bg-blue-600"
                                    onClick={() => handleViewDetails(expert)}
                                >view details</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
