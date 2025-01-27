import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCategories } from "../redux/slices.js/category-slice"
import Select from 'react-select'
import { createExpertProfile } from "../redux/slices.js/expert-slice"

const formInitialState = {
    experience: '',
    categories: [],
    location: { address: '' },
    documents: []
}

export default function ExpertCreation() {
    const [expertForm, setExpertForm] = useState(formInitialState)
    const dispatch = useDispatch()
    const { data } = useSelector((state) => state.category)

    const newData = data?.map(ele => ({ value: ele._id, label: ele.name }))

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    const handleExpertCreation = (e) => {
        e.preventDefault()
        const formData = new FormData();
    
    
        formData.append('experience', expertForm.experience);
        formData.append('location', JSON.stringify(expertForm.location)); 
        formData.append('categories', JSON.stringify(expertForm.categories)); 

  
        expertForm.documents.forEach((file, index) => {
            formData.append('documents', file); 
        });

        dispatch(createExpertProfile(formData))
    }

    const handleSelectCategories = (selectedOptions) => {
        setExpertForm((prevForm) => ({
            ...prevForm,
            categories: selectedOptions.map(ele => ele.value) || []
        }))
    }

    const handleDocumentChange = (e) => {
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
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience :</label>
                <input
                    type="number"
                    id="experience"
                    onChange={(e) => {
                        setExpertForm({ ...expertForm, experience: e.target.value })
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location :</label>
                <input
                    type="text"
                    id="location"
                    onChange={(e) => {
                        setExpertForm({ ...expertForm, location: { ...expertForm.location, address: e.target.value } })
                    }}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="documents" className="block text-sm font-medium text-gray-700 mb-1">Documents :</label>
                <input
                    type="file"
                    id="documents"
                    multiple
                    onChange={handleDocumentChange}
                    className="mt-1 block p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Skills :</label>
                <Select
                    options={newData}
                    id="category"
                    onChange={handleSelectCategories}
                    className="w-96"
                    isMulti />

                <button
                    type="submit"
                    className="mt-1 py-1 px-2 bg-blue-500 text-white font-semibold shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Register
                </button>
            </form>
        </>
    )
}
