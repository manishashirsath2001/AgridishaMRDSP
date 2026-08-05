import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import Addunits from "../../core/modals/inventory/addunits";
import AddCategory from "../../core/modals/inventory/addcategory";
import AddBrand from "../../core/modals/addbrand";
import axios from "axios";
import { ACSPLGUID, baseUrl, convertToISODate } from "../../core/json/custom";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Info,
} from "feather-icons-react/build/IconComponents";
import { useDispatch, useSelector } from "react-redux";
import { setToogleHeader } from "../../core/redux/action";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { getUserData } from "../../Context/UserData";
const AddCompanyInfo = () => {
    const location = useLocation();
    const { CINFOID } = location.state || {};
    console.log('CINFOID', CINFOID);
    const { isAuthenticated, userdetail } = getUserData();
    if (isAuthenticated == true) {
        console.log("user", userdetail);
        console.log("getUserData", getUserData);
    }
    const companyidRef = useRef();
    const cnameRef = useRef();
    const TelephoneRef = useRef();
    const ccontactRef = useRef();
    const cemailRef = useRef();
    const cpincodeRef = useRef();
    const cregnoRef = useRef();
    const cregdateRef = useRef();
    const cpanRef = useRef();
    const cgstnoRef = useRef();
    const cifscRef = useRef();
    const caccountnameRef = useRef();
    const TwitterRef = useRef();
    const FacebookRef = useRef();
    const InstagramRef = useRef();
    const openingdtRef = useRef();
    const Addressref = useRef();
    const Arearef = useRef();
    const clandmarkref = useRef();
    const SaveRef = useRef();
    const Districtref = useRef();
    const Stateref = useRef();
    const navigate = useNavigate();
    const GUID = ACSPLGUID.getNew()
    const route = all_routes;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.toggle_header);
    const renderCollapseTooltip = (props) => (
        <Tooltip id="refresh-tooltip" {...props}>
            Collapse
        </Tooltip>
    );
    const handleKeyDown = (e, nextRef, isLastField = false) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (isLastField) {
                SaveRef.current?.click(); // **Trigger Save Button Click**
            } else {
                nextRef?.current?.focus();
            }
        }
    };
    const [sellingtype, setsellingtype] = useState([]);
    const [statetype, setstatetype] = useState([]);
    const [formData, setFormData] = useState({
        companyid: '',
        cname: '',
        ctelephone: '',
        ccontact: '',
        cemail: '',
        caddress: '',
        carea: '',
        clandmark: '',
        ccity: '',
        cstate: '',
        cpincode: '',
        cregno: '',
        cregdate: '',
        openingdt: '',
        ctype: '',
        cpan: '',
        cgstno: '',
        cstatus: '',
        cifsc: '',
        caccountname: '',
        Facebook: '',
        Instagram: '',
        Twitter: ''
    });
    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = { spincode: "%" };
                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/StatePincode",
                    data: JSON.stringify(payload),
                    headers: headers,
                });
                if (response.status === 200) {
                    const data = response.data;
                    const districtdata = data
                        .map(({ sdistrict, said }) => ({
                            label: sdistrict,
                            value: said,
                        }));
                    setsellingtype(districtdata)
                    const Statedata = data
                        .map(({
                            sstatename, sstatecode }) => ({
                                label: sstatename,
                                value: sstatecode,
                            }));
                    setstatetype(Statedata);
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
        fetchLocationData();
    }, []);
    useEffect(() => {
        if (CINFOID) {
            const fetchData = async () => {
                try {
                    const payload = {
                        "cinfoid": CINFOID,
                        "keyword": "%"
                    }
                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };
                    axios({
                        method: "POST",
                        url: baseUrl.Url + "/backend/api/GET_CompanyInfo",
                        data: JSON.stringify(payload),
                        headers: headers,
                    })
                        .then((response) => {
                            if (response.status != 200) throw new Error("Failed to Fetching Data");
                            const DATA = response.data[0];
                            setFormData({
                                companyid: DATA.companyid || '',
                                cname: DATA.cname || '',
                                ccontact: DATA.ccontact || '',
                                ctelephone: DATA.ctelephone || '',
                                cemail: DATA.cemail || '',
                                caddress: DATA.caddress || '',
                                cregdate: convertToISODate(DATA.cregdate) || '',
                                openingdt: convertToISODate(DATA.openingdt) || '',
                                ctype: DATA.ctype || '',
                                cpan: DATA.cpan || '',
                                cgstno: DATA.cgstno || '',
                                cstatus: DATA.cstatus || '',
                                cifsc: DATA.cifsc || '',
                                caccountname: DATA.caccountname || '',
                                Facebook: DATA.facebookid || '',
                                Instagram: DATA.instagramid || '',
                                Twitter: DATA.twitterid || '',
                            });
                            console.log("DATA", DATA)
                        })
                } catch (error) {
                    console.error("Error fetching Access Right Data:", error);
                }
            };
            fetchData();
        }
    }, [CINFOID]);
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                showExitAlert();
            }
            if (e.ctrlKey && e.key == 's' || e.ctrlKey && e.key == 'S') {
                e.preventDefault();
                validateinput();
            }
        };
        window.addEventListener('keydown', handleShortcut);
        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [formData, navigate]);
    useEffect(() => {
        if (companyidRef.current) {
            companyidRef.current.focus();
        }
    }, []);
    const handleSelectChange = (selectedOption, field) => {
        console.log('selectedcity', selectedOption.value)
        setFormData(prevData => ({
            ...prevData,
            [field]: selectedOption ? selectedOption.value : '',
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateinput()) {
            showConfirmationAlert(e);
        }
    };
    const handleFormSubmission = async () => {
        try {
            const payload = {
                "cinfoid": CINFOID ? CINFOID : GUID,
                "companyid": formData.companyid,
                "cname": formData.cname,
                "ctelephone": formData.ctelephone,
                "cemail": formData.cemail,
                "ccontact": formData.ccontact,
                "cpan": formData.cpan,
                "cgstno": formData.cgstno,
                "caddress": formData.caddress,
                "instagramid": formData.Instagram,
                "twitterid": formData.Twitter,
                "facebookid": formData.Facebook,
            };
            console.log('payload', payload)
            const headers = {
                "Content-Type": "application/json",
                Accept: "*/*",
            };
            axios({
                method: "POST",
                url: baseUrl.Url + "/backend/api/SP_AddUpdCompanyInfo",
                data: JSON.stringify(payload),
                headers: headers,
            })
            Swal.fire({
                icon: "success",
                title: "Saved!",
                text: "Data saved successfully.",
                confirmButtonText: "OK",
            });
            navigate(route.CompanyInfo)
        } catch (error) {
            console.error("Submission Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to save data. Please try again.",
            });
        }
    };
    const MySwal = withReactContent(Swal);
    const showConfirmationAlert = (event) => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to save this data?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "SAVE",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "CANCLE",
        }).then((result) => {
            if (result.isConfirmed) {
                handleFormSubmission(event); // Proceed with form submission
            }
        });
    };
    const showExitAlert = () => {
        MySwal.fire({
            title: "Are you sure?",
            text: "Do you want to Exit?",
            showCancelButton: true,
            confirmButtonColor: "#00ff00",
            confirmButtonText: "YES",
            cancelButtonColor: "#092C4C",
            cancelButtonText: "NO",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(route.CompanyInfo)
            }
        });
    };
    const validateinput = () => {
        const {
            companyid,
            cname,
            ccontact,
            cemail,
            cpincode,
            cgstno,
            Facebook,
            Instagram,
            Twitter
        } = formData;
        if (!companyid || companyid.trim() === '') {
            Swal.fire("Error", "Company ID is required.", "error");
            companyidRef.current.focus();
            return false;
        }
        if (!cname || !/^[A-Za-z\s]{2,100}$/.test(cname)) {
            Swal.fire("Error", "Company Name must be 2-100 characters and contain only letters and spaces.", "error");
            cnameRef.current.focus();
            return false;
        }
        if (!ccontact || !/^[789]\d{9}$/.test(ccontact)) {
            Swal.fire("Error", "Contact number must be 10 digits starting with 7, 8, or 9.", "error");
            ccontactRef.current.focus();
            return false;
        }
        if (cpincode && !/^\d{6}$/.test(cpincode)) {
            Swal.fire("Error", "Pincode must be a 6-digit number.", "error");
            cpincodeRef.current.focus();
            return false;
        }
        if (cemail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(cemail)) {
            Swal.fire("Error", "Invalid email format.", "error");
            cemailRef.current.focus();
            return false;
        }
        if (cgstno && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cgstno)) {
            Swal.fire("Error", "Invalid GST Number format.", "error");
            cgstnoRef.current.focus();
            return false;
        }
        if (Instagram && !/^[a-zA-Z0-9._]{3,30}$/.test(Instagram)) {
            Swal.fire("Error", "Instagram ID must be 3-30 characters (letters, numbers, underscore, dot).", "error");
            InstagramRef.current.focus();
            return false;
        }
        if (Facebook && !/^@?(\w){3,15}$/.test(Facebook)) {
            Swal.fire("Error", "Facebook ID handle must be 3-15 characters and can include letters, numbers, or underscore.", "error");
            FacebookRef.current.focus();
            return false;
        }
        if (Twitter && !/^@?(\w){3,15}$/.test(Twitter)) {
            Swal.fire("Error", "Twitter handle must be 3-15 characters and can include letters, numbers, or underscore.", "error");
            TwitterRef.current.focus();
            return false;
        }
        return true;
    };
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === "cpincode" && value.length === 6) {
            try {
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                };
                const payload = { spincode: value };
                const response = await axios({
                    method: "POST",
                    url: baseUrl.Url + "/backend/api/StatePincode",
                    data: JSON.stringify(payload),
                    headers: headers,
                });
                if (response.status === 200) {
                    const data = response.data;
                    const districtdata = data
                        .map(({ sdistrict, said }) => ({
                            label: sdistrict,
                            value: said,
                        }));
                    setsellingtype(districtdata)
                    const Statedata = data
                        .map(({ sstatename, sstatecode }) => ({
                            label: sstatename,
                            value: sstatecode,
                        })
                        );
                    setstatetype(Statedata)
                    c = response.data[0].said,
                        s = response.data[0].sstatecode,

                        setFormData((prevData) => ({
                            ...prevData,
                            cstate: s,
                            ccity: c,
                        }));
                } else {
                    console.error("Failed to fetch district and state for the pincode");
                }
            } catch (error) {
                console.error("Error fetching district and state data:", error);
            }
        }
    };
    return (
        <div className="page-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4>Manage Company</h4>
                        </div>
                    </div>
                    <ul className="table-top-head">
                        <li>
                            <OverlayTrigger placement="top" overlay={renderCollapseTooltip}>
                                <Link
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Collapse"
                                    id="collapse-header"
                                    className={data ? "active" : ""}
                                    onClick={() => {
                                        dispatch(setToogleHeader(!data));
                                    }}
                                >
                                    <ChevronUp className="feather-chevron-up" />
                                </Link>
                            </OverlayTrigger>
                        </li>
                    </ul>
                    <div className="page-btn">
                        <Link to={route.CompanyInfo} className="btn btn-secondary">
                            <ArrowLeft className="me-2" />
                            मागे
                        </Link>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card mbgcolor">
                        <div className="card-body add-product pb-0 mbgcolor">
                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample"
                            >
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingOne">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseOne"
                                            aria-controls="collapseOne"
                                        >
                                            <div className="addproduct-icon">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>Company Info</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseOne"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingOne"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">Company ID</label>
                                                        <input type="text" className="form-control"
                                                            title="Company ID required"
                                                            value={formData.companyid} name="companyid"
                                                            ref={companyidRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, cnameRef, true)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">Company Name</label>
                                                        <input type="text" className="form-control"
                                                            name="cname"
                                                            value={formData.cname}
                                                            pattern="^[A-Za-z]+( [A-Za-z]+)*$"
                                                            title="Name can only contain letters and spaces."
                                                            onChange={handleChange}
                                                            required
                                                            ref={cnameRef}
                                                            onKeyDown={(e) => handleKeyDown(e, TelephoneRef, true)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Telephone Number</label>
                                                        <input type="text" className="form-control"
                                                            title="Teliphone required ten digit number"
                                                            value={formData.ctelephone} name="ctelephone"
                                                            onChange={handleChange}
                                                            ref={TelephoneRef}
                                                            onKeyDown={(e) => handleKeyDown(e, cemailRef, true)}
                                                            required />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Email</label>
                                                        <input type="text" className="form-control"

                                                            value={formData.cemail} name="cemail"
                                                            ref={cemailRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, ccontactRef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">Phone  </label>
                                                        <input type="text" className="form-control"
                                                            value={formData.ccontact} name="ccontact"
                                                            title="Phone Must Be Ten Digit Number "
                                                            ref={ccontactRef}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, cpanRef, true)}
                                                            required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label required">PAN Number</label>
                                                        <input type="text" className="form-control"
                                                            onChange={handleChange}
                                                            value={formData.cpan} name="cpan"
                                                            ref={cpanRef}
                                                            title="Pan requird some charcter and number."
                                                            onKeyDown={(e) => handleKeyDown(e, cgstnoRef, true)}
                                                            required />
                                                    </div>
                                                </div>
                                                <div className="col-lg-3 col-sm-6 col-12">
                                                    <div className="form-label add-product">
                                                        <label className="form-label required">GST Number</label>
                                                        <input type="text" className="form-control" name="cgstno"
                                                            value={formData.cgstno}
                                                            title="Gst No cannto contain letters."
                                                            onChange={handleChange}
                                                            ref={cgstnoRef}
                                                            onKeyDown={(e) => handleKeyDown(e, cpincodeRef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div />
                                            </div>
                                            <div className="row">
                                                <div className="col-lg-12 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Address</label>
                                                        < textarea
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.caddress}
                                                            name="caddress"
                                                            onChange={handleChange}
                                                            ref={Addressref}
                                                            onKeyDown={(e) => handleKeyDown(e, Arearef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="accordion-card-one accordion"
                                id="accordionExample">
                                <div className="accordion-item mbgcolor">
                                    <div className="accordion-header" id="headingTwo">
                                        <div
                                            className=""
                                            data-bs-toggle="collapse"
                                            data-bs-target="#collapseTwo"
                                            aria-controls="collapseTwo"
                                        >
                                            <div className="addproduct-icon">
                                                <h5 >
                                                    <Info className="add-info" />

                                                    <span>Social Media</span>
                                                </h5>
                                                <Link to="#">
                                                    <ChevronDown className="chevron-down-add" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        id="collapseTwo"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="row">
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Instagram</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={InstagramRef}
                                                            name="Instagram"
                                                            value={formData.Instagram}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, TwitterRef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Twitter</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={TwitterRef}
                                                            name="Twitter"
                                                            value={formData.Twitter}
                                                            onChange={handleChange}
                                                            pattern="^[a-zA-Z\s]{3,50}$"
                                                            title="Branch name must contain only letters and spaces, and be 3 to 50 characters long."
                                                            onKeyDown={(e) => handleKeyDown(e, FacebookRef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 col-sm-6 col-12">
                                                    <div className="mb-3 add-product">
                                                        <label className="form-label">Facebook</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            ref={FacebookRef}
                                                            name="Facebook"
                                                            value={formData.Facebook}
                                                            onChange={handleChange}
                                                            onKeyDown={(e) => handleKeyDown(e, SaveRef, true)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-12">
                                <div className="btn-addproduct mb-4">
                                    <button
                                        type="button"
                                        onClick={showExitAlert}
                                        className="btn btn-cancel me-2">
                                        Exit
                                    </button>
                                    <button className="btn btn-submit"
                                        ref={SaveRef}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <Addunits />
            <AddCategory />
            <AddBrand />
        </div>
    );
};
export default AddCompanyInfo;

