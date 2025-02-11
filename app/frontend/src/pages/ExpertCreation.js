import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CreatableSelect from 'react-select/creatable'
import { createExpertProfile, fetchSkills } from "../redux/slices.js/expert-slice"
import { useNavigate } from "react-router-dom"
import { getAddress } from "../redux/slices.js/search-slice"
import { expertRegister } from "../redux/slices.js/user-slice"

const formInitialState = {
    profilePic : '',
    age:'',
    gender:'',
    experience: '',
    skills: [],
    location: { address: '' },
    documents: []
}

export default function ExpertCreation() {
    const [expertForm, setExpertForm] = useState(formInitialState)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [clientErrors, setClientErrors] = useState({})
    const { currentAddress } = useSelector((state) => state.search)
    const [options, setOptions] = useState([])
    const errors = {}

    useEffect(() => {
        dispatch(fetchSkills()).unwrap().then((data) => {
            const newData = data?.map(ele => ({value : ele._id, label : ele.name}))
            setOptions(newData)
        })
    }, [dispatch])

    useEffect(() => {
        if (currentAddress && !expertForm.location.address) {
            setExpertForm((prevForm) => ({
                ...prevForm,
                location: { address: currentAddress }
            }));
        }
    }, [currentAddress, expertForm.location.address]);    

    const handleCreate = (inputValue)=>{
        const formatInput = inputValue.slice(0,1).toUpperCase() + inputValue.slice(1)

        const newOption = { value : formatInput, label : formatInput}
        console.log(newOption)
        setOptions((prevOptions) => [...prevOptions, newOption]);
        setExpertForm((prev)=> ({
            ...prev,
            skills : [...prev.skills, newOption]
        }))
    }

    const runClientValidaions = ()=>{
        if(!expertForm.age){
            errors.age = 'age is required'
        }else if(expertForm.age < 20){
            errors.age = 'age should be greater than 18'
        }
        if(!expertForm.gender){
            errors.gender = 'gender should be selected'
        }
        if(!expertForm.experience){
            errors.experience = 'experience should be atleast 1 year'
        }
        if(expertForm.skills.length === 0){
            errors.skills = 'select skills'
        }
        if(!expertForm.location.address){
            errors.location = 'location is required'
        }
        if(expertForm.documents.length === 0){
            errors.documents = 'atleast one document is needed for verify'
        }
    }

    const handleExpertCreation = async (e) => {
        e.preventDefault()
        runClientValidaions()
        console.log(errors)
        const resetForm = ()=> setExpertForm(formInitialState)
        if(Object.keys(errors).length !== 0){
            setClientErrors(errors)
        }else{
            try{
                setClientErrors({})
                const formData = new FormData();
                
                formData.append('profilePic', expertForm.profilePic)
                formData.append('age', expertForm.age)
                formData.append('gender', expertForm.gender)
                formData.append('experience', expertForm.experience);
                formData.append('location', JSON.stringify(expertForm.location)); 
                formData.append('skills', JSON.stringify(expertForm.skills.map(ele => ele.value)));
                
                expertForm.documents.forEach((file, index) => {
                    formData.append('documents', file); 
                });
                
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                
                await dispatch(createExpertProfile({formData, resetForm}))
                    .unwrap()
                    .then(()=>{
                        navigate('/expert-dashboard')
                    })
                    .catch((err) => {
                        console.log(err)
                    })

            }catch(err){
                console.log(err)
            }
        }
    }

    const handleSelectSkills = (selectedOptions) => {
        setClientErrors({...clientErrors, skills : null})
        setExpertForm((prevForm) => ({
            ...prevForm,
            skills: selectedOptions || []

        }))
    }

    const handleDocumentChange = (e) => {
        setClientErrors({...clientErrors, documents : null})
        const files = Array.from(e.target.files);
        setExpertForm((prevForm) => ({
            ...prevForm,
            documents: files
        }));
    };

    const handleProfilePic = (e)=>{
        const pic = e.target.files[0]
        setExpertForm((prevForm)=>({
            ...prevForm,
            profilePic : pic
        }))
    }

    const handleGetAddress = ()=>{
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

    const handleLocationChange = (e) => {
        console.log(e.target.value);
        console.log(currentAddress);
        setClientErrors({...clientErrors, location: null});
        setExpertForm((prevForm) => ({
            ...prevForm,
            location: { ...prevForm.location, address: e.target.value || currentAddress }
        }));
    }    

    return (
        <>
            <h1 className="text-center text-2xl mt-9">Fill Your Professional Details</h1>
            <form onSubmit={handleExpertCreation} className="grid grid-cols-2 gap-8 w-full h-full max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
                {/* Left Column */}
                <div className="space-y-4">
                <div>
                        <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-1">profilePic :</label>
                        <input
                            type="file"
                            id="profilePic"
                            name="profilePic"
                            onChange={handleProfilePic}
                            className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.profilePic}</p>)}
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age :</label>
                        <input
                            type="number"
                            id="age"
                            onChange={(e) => {
                                setExpertForm({ ...expertForm, age: e.target.value })
                                setClientErrors({...clientErrors, age : null})
                            }}
                            value={expertForm.age}
                            className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4"
                        />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.age}</p>)}
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender :</label>
                        <input 
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            checked={expertForm.gender === 'male'}
                            onChange={(e)=> {
                                setExpertForm({...expertForm, gender : e.target.value})
                                setClientErrors({...clientErrors, gender : null})
                            }}
                        />
                        <label htmlFor="male" className="mr-2">Male</label>

                        <input 
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            checked={expertForm.gender === 'female'}
                            onChange={(e)=> {
                                setExpertForm({...expertForm, gender : e.target.value})
                                setClientErrors({...clientErrors, gender : null})

                            }}
                        />
                        <label htmlFor="female">Female</label>
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.gender}</p>)}
                    </div>

                    <div>
                        <label htmlFor="skills" className=" text-sm font-medium text-gray-700 mb-1">Skills :</label>
                        <CreatableSelect
                            options={options}
                            onCreateOption={handleCreate}
                            id="skills"
                            onChange={handleSelectSkills}
                            className="w-full"
                            value={expertForm.skills}
                            isMulti />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.skills}</p>)}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience :</label>
                        <input
                            type="number"
                            id="experience"
                            value={expertForm.experience}
                            onChange={(e) => {
                                setExpertForm({ ...expertForm, experience: e.target.value })
                                setClientErrors({...clientErrors, experience : null})
                            }}
                            className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.experience}</p>)}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location :</label>
                            <input
                                type="text"
                                id="location"
                                value={expertForm.location.address || currentAddress}
                                onChange={handleLocationChange}
                                className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                             {clientErrors && <p className="text-red-500 text-xs">{clientErrors.location}</p>}
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleGetAddress}
                                className="relative right-4 mt-6 p-1 bg-slate-500 text-white font-semibold focus:outline-none">
                                Get Current Address
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">Documents :</label>
                        <input
                            type="file"
                            id="documents"
                            multiple
                            onChange={handleDocumentChange}
                            className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.documents}</p>)}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-2 flex justify-center mt-4">
                    <button
                        type="submit"
                        className="py-2 px-4 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xs">
                        Register
                    </button>
                </div>
            </form>
        </>
    )
}
