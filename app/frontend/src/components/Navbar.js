import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <div className="bg-orange-500 h-11">
           <ul className="flex space-x-4">
                <li><Link to="/customerlogin" className="text-black-500 hover:text-blue-700">Login</Link></li>
                <li><Link to="/expertlogin" className="text-black-500 hover:text-blue-700">Other Login</Link></li>
            </ul>
        </div>
    )
}