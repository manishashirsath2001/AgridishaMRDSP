import React, { useState, useRef, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { all_routes } from "../../Router/all_routes";

// import { getUserData } from '../../../Context/UserData';
import { getUserData } from '../../Context/UserData';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { baseUrl, ACSPLGUID } from '../../core/json/custom';
// import { baseUrl } from '../../json/custom';
// import { ACSPLGUID } from '../../json/custom';
import Swal from 'sweetalert2';
import {

    // PlusCircle,
    // Edit

} from "feather-icons-react/build/IconComponents";
// import OTP from 'antd/es/input/OTP';
const VyapariVerification = ({ NAME, MOBILE, ID }) => {

    // const GUID = ACSPLGUID.getNew()
    const VGUID = ACSPLGUID.getNew();
    const NGUID = ACSPLGUID.getNew();
    const [OGUID, setOGUID] = useState(ACSPLGUID.getNew())
    const { userdetail } = getUserData();
    const [formData, setFormData] = useState({
        Key: "",
        // VGUID: ""


    });

    // useEffect(() => {

    //     setFormData(prev => ({
    //         ...prev,
    //         Key: "",  
    //     }));


    // }, [NAME, MOBILE]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    //   const route = all_routes;
    console.log('NAME  ', NAME, MOBILE, ID)
    const navigate = useNavigate();
    const oneditClick = () => {
        navigate("/AddVyapari");
    };

    const nameInputRef = useRef(null);
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus(); // Focus the input element
        }
    }, []);



    const [showOTPInput, setShowOTPInput] = useState(false);

    // const [otp, setOtp] = useState('');
    const [vguid, setVguid] = useState(""); // store in state
    const generateOTP = () => {
        return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit integer OTP
    };


    const handleOTPButtonClick = async () => {
        setFormData(prev => ({
            ...prev,
            Key: "",
        }));
        setShowOTPInput(true);

        const Key = generateOTP();
        console.log("Generated OTP:", Key);


        const payload = {
            "pkoid": OGUID ? OGUID : NGUID,
            "vpaid": ID ? ID : VGUID,
            "mobile": MOBILE,
            "otp": Key,
            "vname": NAME,
            "companyid": userdetail?.companyID ? userdetail.companyID : "",
            "deptid": userdetail?.departmentID ? userdetail.departmentID : "",
        }
        setVguid(OGUID ? OGUID : NGUID);

        const headers = {
            "Content-Type": "application/json",
            Accept: "*/*",
        };
        try {
            const response1 = await axios.post(baseUrl.Url + "/backend/api/SP_AddUpdOTP", payload, { headers });

            if (response1.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "OTP Send!",
                    text: "OTP Send on Your Phone Number",
                    confirmButtonText: "OK",
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log("Data save success");
                    }
                });
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }


    };


    const handleNextClick = (e, Key, vguid) => {

        e.preventDefault();
        setShowOTPInput(false);
        console.log('otpValue', Key, vguid)
        console.log('otpValuee', FormData)
        // const modal = document.getElementById("add-verification");
        // if (modal) {
        //     modal.classList.remove("show");
        //     modal.style.display = "none";
        //     modal.setAttribute("aria-hidden", "true");

        //     const modalBackdrop = document.querySelector(".modal-backdrop");
        //     if (modalBackdrop) {
        //         modalBackdrop.remove();
        //     }
        //     document.body.classList.remove("modal-open");
        //     document.body.style.overflow = "auto";
        // }
        // const otpValue = formData.Key;
        navigate('/AddVyapari', { state: { OTP: Key, PKID: vguid } });
    };

    return (
        <div>
            {/* Add Category */}
            <div className="modal fade" id="add-verification">
                <div className="modal-dialog modal-dialog-centered custom-modal-two">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header border-0 custom-modal-header">
                                    <div className="page-title">
                                        <h4>व्यापारी पुष्टीकरण</h4>
                                    </div>
                                    <button
                                        type="button"
                                        className="close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body custom-modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">व्यापारी नाव</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                ref={nameInputRef}
                                                value={NAME}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">मोबाईल नंबर</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={MOBILE}
                                            />
                                        </div>


                                        <div className='row'>
                                            <div className="mb-3 col-lg-4 mt-4">
                                                <button
                                                    type="button"
                                                    className="btn btn-submit me-2"
                                                    onClick={handleOTPButtonClick}
                                                >
                                                    ओटीपी पाठवा
                                                </button>
                                            </div>


                                            {showOTPInput && (

                                                <div className="mb-3 col-lg-4">
                                                    <label className="form-label"></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name='Key'
                                                        required
                                                        value={formData.Key} // Bind value to formData.OTP
                                                        onChange={handleChange}
                                                    />
                                                </div>

                                            )}
                                        </div>


                                        <div className="modal-footer-btn">
                                            <button
                                                type="button"
                                                className="btn btn-cancel me-2"
                                                data-bs-dismiss="modal"
                                            >
                                                रद्द करा
                                            </button>


                                            {/* <Link to="#" className="btn btn-submit">
                                                Create Category
                                            </Link> */}
                                            <a
                                                className="me-2 p-2"
                                                data-bs-dismiss="modal"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    oneditClick();
                                                }}
                                                title="Edit"
                                            >
                                                {/* <Link  to="/AddVyapari" 
                                                    state={{ OTP: 123 }} 
                                                className="btn btn-submit"
                                                // onClick={(e) => {
                                                //     e.preventDefault();
                                                //     handleNextClick(); // Call the function to proceed to next page
                                                // }}
                                                >
                                                    पुढे
                                                </Link> */}


                                            </a>

                                            <button className="btn btn-submit"
                                                // data-bs-dismiss="modal"
                                                onClick={(e) => handleNextClick(e, formData.Key, vguid)}>
                                                पुष्टीकरण करा
                                            </button>
                                            {/* <Link to="/AddVyapari" state={{ OTP: 123 }} 
                                            className="btn btn-submit"
                                            >

                                                पुढे
                                            </Link> */}


                                            {/* <Link to="/AddVyapari" className="btn btn-submit">
                                                        Create Category
                                                    </Link> */}


                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Add Category */}
        </div>
    )
}

export default VyapariVerification;


