import { useState } from "react"
import { useDispatch } from "react-redux"
import { querying } from "../redux/slices.js/search-slice"

export default function SearchComponent(){
    const [searchValue, setSearchValue] = useState("")
    const dispatch = useDispatch()

    const handleSearch = async(e)=>{
        e.preventDefault()
        console.log(searchValue)
        const queryParams = new URLSearchParams()

        if(searchValue){
            queryParams.append("location", searchValue)
        }

        const queryString = queryParams.toString()
        console.log(queryString)
        try{
            dispatch(querying(queryString))
        }catch(err){
            console.log(err)
        }
    }

    const getCurrentLocation = ()=>{
        if("geolocation" in navigator){
         navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position.coords.latitude)
                console.log(position.coords.longitude)
            }
         )   
        }
    }

    return(
        <>
            <h1>Search Component</h1>
            <div>
                <form onSubmit={handleSearch}>
                <input 
                    type="search"
                    value={searchValue}
                    onChange={(e)=> setSearchValue(e.target.value)}
                    placeholder="location"
                    />
                <input 
                    type="submit"
                    value="search"
                />
                <button onClick={getCurrentLocation}>get current location</button>
                </form>
            </div>
            <div>
                <div>map</div>
                <div>categories</div>
            </div>
        </>
    )
}