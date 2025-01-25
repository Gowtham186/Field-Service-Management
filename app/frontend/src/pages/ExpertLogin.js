import { Link } from "react-router-dom";
import ExpertRegister from "./ExpertRegister";

export default function ExpertLogin(){
    return(
        <>
            <h1>ExpertLogin</h1>
            <Link to="/expertregister"><ExpertRegister /></Link>
        </>
    )
}