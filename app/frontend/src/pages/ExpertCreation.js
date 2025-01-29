import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../redux/slices.js/category-slice"
import Select from 'react-select'
import { createExpertProfile } from "../redux/slices.js/expert-slice"
import { useNavigate } from "react-router-dom"

const formInitialState = {
    age:'',
    gender:'',
    experience: '',
    categories: [],
    location: { address: '' },
    documents: []
}

export default function ExpertCreation() {
    const [expertForm, setExpertForm] = useState(formInitialState)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { data } = useSelector((state) => state.category)
    const [clientErrors, setClientErrors] = useState({})
    const errors = {}
    const newData = data?.map(ele => ({ value: ele._id, label: ele.name }))

    useEffect(() => {
        dispatch(fetchCategories())
    }, [])

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
        if(expertForm.categories.length === 0){
            errors.categories = 'select skills'
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
                
                formData.append('age', expertForm.age)
                formData.append('gender', expertForm.gender)
                formData.append('experience', expertForm.experience);
                formData.append('location', JSON.stringify(expertForm.location)); 
                formData.append('categories', JSON.stringify(expertForm.categories.map(ele => ele.value)));
                
                expertForm.documents.forEach((file, index) => {
                    formData.append('documents', file); 
                });
                
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                
                await dispatch(createExpertProfile({formData, resetForm})).unwrap()
                navigate('/dashboard')

            }catch(err){
                console.log(err)
            }
        }
    }

    const handleSelectCategories = (selectedOptions) => {
        setClientErrors({...clientErrors, categories : null})
        setExpertForm((prevForm) => ({
            ...prevForm,
            categories: selectedOptions.map(ele => ele) || []

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

    return (
        <>
            <h1 className="text-center text-2xl mt-9">Fill Your Professional Details</h1>
            <form onSubmit={handleExpertCreation} className="grid grid-cols-2 gap-8 w-full h-full max-w-5xl mx-auto p-6 shadow-lg rounded-lg">
                {/* Left Column */}
                <div className="space-y-4">
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
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Skills :</label>
                        <Select
                            options={newData}
                            id="category"
                            onChange={handleSelectCategories}
                            className="w-3/4"
                            value={expertForm.categories}
                            isMulti />
                        {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.categories}</p>)}
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
                                value={expertForm.location.address}
                                onChange={(e) => {
                                    setExpertForm({ ...expertForm, location: { ...expertForm.location, address: e.target.value } })
                                    setClientErrors({ ...clientErrors, location: null })
                                }}
                                className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                             {clientErrors && <p className="text-red-500 text-xs">{clientErrors.location}</p>}
                        </div>
                        <div>
                            <button
                                type="button"
                                
                                className="relative right-4 mt-6 p-1 bg-slate-500 text-white font-semibold focus:outline-none">
                                ?
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
