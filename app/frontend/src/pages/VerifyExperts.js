import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getAllExperts } from "../redux/slices.js/expert-slice"

export default function VerifyExperts(){
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getAllExperts())
    },[dispatch])
    return(
        <>
            <h1>verify experts</h1>
        </>
    )
}