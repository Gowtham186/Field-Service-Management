import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getMyServices } from "../redux/slices.js/expert-slice"

export default function ExpertDashboard(){
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getMyServices())
    },[dispatch])
    
    return(
        <>
            <h2>Expert dashboard component</h2>
            <div>
                <h2>On-going service</h2>
            </div>
            <div>
                <h2>Upcoming Service</h2>
            </div>
        </>
    )
}