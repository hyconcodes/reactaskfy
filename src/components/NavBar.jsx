import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NavBar = () => {
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('QTTY'));
    const handleLogout = () => {
        toast(`You have logged out ${user?.email.split('@')[0].charAt(0).toUpperCase() + user?.email.split('@')[0].slice(1)}`)
        localStorage.removeItem('QTTY');
        navigate('/')
    }

    return (
        <div className="py-3 bg-primary-subtle text-center">
            <div className="d-flex justify-content-around align-items-center">
                <p className="fs-2 text-primary-emphasis fw-bold">Tasfy</p>

                <div className="dropdown">
                    <p className="dropdown-toggle text-success fw-bold" type="button" id="triggerId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        My Account
                    </p>
                    <div className="dropdown-menu" aria-labelledby="triggerId">
                        <a className="dropdown-item text-capitalize"><span className="fw-bold">Username:</span> {user?.email.split('@')[0]}</a>
                        <a className="dropdown-item"><span className="fw-bold">Email:</span> {user?.email}</a>
                        <div className="dropdown-divider" />
                        <p className="dropdown-item text-danger fw-bold" style={{ cursor: 'pointer' }} onClick={handleLogout}>Logout</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default NavBar
