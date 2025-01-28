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
    }, [dispatch])

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
        // } else if (expertForm.experience > expertForm.age) {
        //     errors.experience = 'Experience cannot exceed age';
        // }
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
                formData.append('categories', JSON.stringify(expertForm.categories)); 
                
                expertForm.documents.forEach((file, index) => {
                    formData.append('documents', file); 
                });
                
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }
                
                await dispatch(createExpertProfile({formData, resetForm}))
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
            categories: selectedOptions.map(ele => ele.value) || []
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
            <h1>Fill Your Professional Details</h1>
            <form onSubmit={handleExpertCreation}>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age :</label>
                <input
                    type="number"
                    id="age"
                    onChange={(e) => {
                        setExpertForm({ ...expertForm, age: e.target.value })
                        setClientErrors({...clientErrors, age : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.age}</p>)}

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
                
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Skills :</label>
                <Select
                    options={newData}
                    id="category"
                    onChange={handleSelectCategories}
                    className="w-96"
                    isMulti />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.categories}</p>)}

                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience :</label>
                <input
                    type="number"
                    id="experience"
                    onChange={(e) => {
                        setExpertForm({ ...expertForm, experience: e.target.value })
                        setClientErrors({...clientErrors, experience : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.experience}</p>)}


                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location :</label>
                <input
                    type="text"
                    id="location"
                    onChange={(e) => {
                        setExpertForm({ ...expertForm, location: { ...expertForm.location, address: e.target.value } })
                        setClientErrors({...clientErrors, location : null})
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.location}</p>)}

                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">Documents :</label>
                <input
                    type="file"
                    id="documents"
                    multiple
                    onChange={handleDocumentChange}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                {clientErrors && ( <p className="text-red-500 text-xs">{clientErrors.documents}</p>)}


                <button
                    type="submit"
                    className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
            </form>
        </>
    )
}
