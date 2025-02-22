import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { getMyServices } from "../../redux/slices.js/expert-slice"
import UpcomingService from "../../components/UpcomingService"
import OngoingService from "../../components/OngoingService"
import ExpertLiveTracking from "../ExpertLiveTracking"

export default function ExpertDashboard(){
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getMyServices())
    },[dispatch])
    
    return(
        <>
            <div>
                <OngoingService />
            </div>
            {/* <div>
                <UpcomingService />
            </div> */}
            
        </>
    )
}