import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

function NotFound() {
    const navigate = useNavigate()
    return (
        <div className="container-fluid text-center bg-danger-subtle" style={{ height: '97vh', paddingTop: '150px' }}>
            <h1 className="display-3 text-danger fw-bold mb-3">404 | Page not found</h1>
            <p className="fw-bold text-danger-emphasis mb-5">Op's we couldn't find the resource you were looking for</p>
            <button
                onClick={() => navigate(-1)}
                type="button"
                className="btn btn-outline-danger text-danger-emphasis fw-bold"
            >
                Go back please...
            </button>
            <Footer />
        </div>
    )
}

export default NotFound