import React, { useState } from "react";
import Model2 from "./Model2";

function Model1() {
    const [formData, setFormData] = useState({
        vyapariName: '',
        carrot: '',
        weight: '',
        rate: ''
    });

    // State to store table data
    const [tableData, setTableData] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission for adding new data
    const handleSaveChanges = () => {
        setTableData([...tableData, formData]);

        // Reset form data
        setFormData({
            vyapariName: '',
            carrot: '',
            weight: '',
            rate: ''
        });

        // Close second modal programmatically
        const secondModal = document.getElementById("secondmodel");
        if (secondModal) {
            const modalInstance = window.bootstrap.Modal.getInstance(secondModal);
            modalInstance?.hide();
        }
    };

    const openSecondModal = () => {
        const secondModal = new window.bootstrap.Modal(
            document.getElementById("secondmodel")
        );
        secondModal.show();
    };

    return (
        <div>
            {/* First Modal */}
            <div
                className="modal fade"
                id="firstmodel"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalFullscreenLabel">
                                Full Screen Modal - Form
                            </h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>

                        <div className="modal-body">
                            <form>
                                <div className="row custom-background">
                                    {/* Token No - 1st Row */}
                                    <div className="col-12 col-md-6 col-lg-2 mb-3">
                                        <label className="required">टोकन क्रमांक</label>
                                        <input type="text" className="form-control border" />
                                    </div>

                                    <div className="col-6 col-md-6 col-lg-3 mb-3">
                                        <label className="required">बिल क्रमांक</label>
                                        <input type="text" className="form-control border" />
                                    </div>

                                    {/* Farmer Name - 3rd Row */}
                                    <div className="col-6 col-md-6 col-lg-3 mb-3">
                                        <label className="required">तारीख</label>
                                        <input type="text" className="form-control border" />
                                    </div>

                                    <div className="col-12 col-md-6 col-lg-4 mb-3">
                                        <label className="required">शेतकऱ्याचे नाव</label>
                                        <input type="text" className="form-control border" />
                                    </div>

                                    {/* Village - 4th Row */}
                                    <div className="col-12 col-md-6 col-lg-4 mb-3">
                                        <label className="required">गाव</label>
                                        <input type="text" className="form-control border" />
                                    </div>
                                </div>

                                <div className="button-list">
                                    <button type="button" className="btn btn-primary mt-1 me-1" onClick={openSecondModal}>
                                        ADD (Open Second Modal)
                                    </button>
                                </div>

                                {/* Table */}
                                <div className="row mt-4">
                                    <div className="col-lg-12">
                                        <div className="modal-body-table">
                                            <div className="table-responsive" style={{ height: 'calc(60vh - 120px)' }}>
                                                <table className="table table-bordered">
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th className="col-3">व्यापारी</th>
                                                            <th className="col-1">जाळी</th>
                                                            <th className="col-1">वजन</th>
                                                            <th className="col-1">रेट</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {tableData.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{data.vyapariName}</td>
                                                                <td>{data.carrot}</td>
                                                                <td>{data.weight}</td>
                                                                <td>{data.rate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="col-12 text-end mt-3">
                                    <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">
                                        मागे
                                    </button>

                                    <button type="submit" className="btn btn-primary">
                                        सेव्ह
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                मागे
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Modal */}
            <Model2 handleSaveChanges={handleSaveChanges} formData={formData} handleInputChange={handleInputChange} />
        </div>
    );
}

export default Model1;
