import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, formatDate } from "../../core/json/custom";
import { getUserData } from "../../Context/UserData";
import { ACSPLGUID } from "../../core/json/custom";

function VehicalFarmers({ VEHICLENO_, refreshKey, onClose }) {
    console.log(VEHICLENO_, "VEHICLENO_VEHICLENO_VEHICLENO_VEHICLENO_VEHICLENO_")
    const { isAuthenticated, userdetail } = getUserData();
    const [gateEntries, setGateEntries] = useState([]);

    useEffect(() => {
        if (VEHICLENO_) {
            const fetchGateEntries = async () => {
                try {
                    const payload = {
                        vehno: VEHICLENO_,
                        companyid: "",
                        deptid: ""
                    };

                    const headers = {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                    };

                    const response = await axios.post(
                        `${baseUrl.Url}/backend/api/GET_GateEntryDetailVehno`,
                        payload,
                        { headers }
                    );

                    if (response.status === 200 && response.data.length > 0) {
                        // setGateEntries(response.data);

                        const gateEntriesWithFlags = response.data.map(entry => ({
                            ...entry,
                            isChecked: entry.isChecked ?? false,
                            isdeleted: entry.isdeleted ?? false,
                        }));
                        setGateEntries(gateEntriesWithFlags);

                    } else {
                        setGateEntries([]);
                    }
                } catch (error) {
                    console.error("Error fetching gate entries:", error.message);
                    setGateEntries([]);
                }
            };

            fetchGateEntries();
        }
    }, [VEHICLENO_, refreshKey]);

    const handleCheckboxChange = async (index) => {
        try {
            const entry = gateEntries[index];
            const newIsChecked = !entry.isChecked;

            // Determine if it's a new entry
            const isNewEntry = !entry.dpkid || entry.dpkid === "";
            const dpkid = isNewEntry ? ACSPLGUID.getNew() : entry.dpkid;

            // Prepare payload
            const payload = {
                dpkid: dpkid,
                maid: entry.maid || "",
                toknno: "",
                village: entry.village || "",
                fullname: entry.fullname || "",
                caretS_COUNT: entry.caretS_COUNT || "0",
                isdeleted: !newIsChecked ? true : false,
                vehno: entry.vehno,
                aadharno: entry.aadharno || "",
                mobileno: entry.mobileno || "",
                croP_TYPE: entry.croP_TYPE || "",
                date: formatDate(userdetail.APPDT),
                uid: "",
                companyid: "",
                deptid: "",
                userid: userdetail?.uaid || "",
                isverified: true
            };

            await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            });

            // ✅ Update local state with new dpkid if it's a new entry
            if (isNewEntry) {
                setGateEntries(prev =>
                    prev.map((e, i) =>
                        i === index ? { ...e, isChecked: newIsChecked, isdeleted: !newIsChecked, dpkid } : e
                    )
                );
            } else {
                setGateEntries(prev =>
                    prev.map((e, i) =>
                        i === index ? { ...e, isChecked: newIsChecked, isdeleted: !newIsChecked } : e
                    )
                );
            }

        } catch (error) {
            console.error("Error saving checkbox entry:", error.message);
        }
    };



    // const handleCaretCountChange = (value, index) => {
    //     setGateEntries(prev =>
    //         prev.map((entry, i) =>
    //             i === index ? { ...entry, caretS_COUNT: value } : entry
    //         )
    //     );
    // };
    const handleCaretCountChange = async (value, index) => {
        try {
            const entry = gateEntries[index];
            const updatedEntry = { ...entry, caretS_COUNT: value };

            // Determine if it's a new entry
            const isNewEntry = !entry.dpkid || entry.dpkid === "";
            const dpkid = isNewEntry ? ACSPLGUID.getNew() : entry.dpkid;

            // Prepare payload with updated caret count
            const payload = {
                dpkid: dpkid,
                maid: entry.maid || "",
                toknno: "",
                village: entry.village || "",
                fullname: entry.fullname || "",
                caretS_COUNT: value || "0",  // Updated value
                isdeleted: entry.isdeleted ? true : false,
                vehno: entry.vehno,
                aadharno: entry.aadharno || "",
                mobileno: entry.mobileno || "",
                croP_TYPE: entry.croP_TYPE || "",
                date: formatDate(userdetail.APPDT),
                uid: "",
                companyid: "",
                deptid: "",
                userid: userdetail?.uaid || "",
                isverified: true
            };

            // Call API to update caret count
            await axios.post(`${baseUrl.Url}/backend/api/SP_AddUpdGateEntryDetail`, payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            });

            // Update local state after API success
            setGateEntries(prev =>
                prev.map((e, i) =>
                    i === index ? { ...updatedEntry, dpkid } : e
                )
            );
        } catch (error) {
            console.error("Error updating caret count:", error.message);
        }
    };

    const handleClose = () => {
        setGateEntries([]);  // clear the data
        onClose();           // notify parent to close the modal
    };




    return (
        <div className="modal fade"
            id="FarmerDetail_1"
            tabIndex={-1}
            aria-hidden="true"
            data-bs-backdrop="static"
            data-bs-keyboard="false">
            <div className="modal-dialog modal-fullscreen-lg-down">
                <div className="modal-content border-0 rounded-4 shadow">
                    <div className="modal-header bg-primary text-white rounded-top-4 px-4 py-3">
                        <h4 className="modal-title m-0">
                            <i className="bi bi-person-lines-fill me-2"></i> वाहन शेतकरी माहिती
                        </h4>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={handleClose}
                        />

                    </div>
                    <div className="modal-body px-4 pb-4 mbgcolor">
                        <div className="table-responsive" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                            <table className="table table-bordered table-striped mb-0">
                                <thead className="bg-dark text-white text-center sticky-top" style={{ top: 0, zIndex: 1 }}>
                                    <tr>
                                        <th style={{ width: '10%' }}>निवडा</th>
                                        <th style={{ width: '60%' }}>शेतकऱ्याचे नाव</th>
                                        <th style={{ width: '30%' }}>जाळी संख्या </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gateEntries.map((entry, index) => (
                                        <tr key={index}>
                                            <td className="text-center align-middle">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ transform: "scale(1.5)", cursor: "pointer" }}
                                                    checked={entry.isChecked || false}
                                                    onChange={() => handleCheckboxChange(index)}
                                                />
                                            </td>
                                            <td className="align-middle">{entry.fullname}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={entry.caretS_COUNT || ""}
                                                    onChange={(e) => handleCaretCountChange(e.target.value, index)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehicalFarmers;
