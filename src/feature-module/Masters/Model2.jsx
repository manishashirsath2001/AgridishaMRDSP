import React from "react";

function Model2({ formData, setFormData, tableData, setTableData, handleInputChange }) {

    const handleSaveChanges = (e) => {
        e.preventDefault();
        setTableData([...tableData, formData]);

        setFormData({
            vyapariName: '',
            carrot: '',
            weight: '',
            rate: ''
        });

        const secondModal = document.getElementById("secondmodel");
        if (secondModal) {
            const modalInstance = window.bootstrap.Modal.getInstance(secondModal);
            if (modalInstance) modalInstance.hide();
        }
    };

    return (
        <div>
            <div
                className="modal fade"
                id="secondmodel"
                tabIndex={-1}
                aria-labelledby="exampleModalFullscreenSmLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen-sm-down">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="exampleModalFullscreenSmLabel">
                                Second Modal - Form
                            </h4>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSaveChanges}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="vyapariName" className="form-label">व्यापारी नाव</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="vyapariName"
                                                name="vyapariName"
                                                value={formData.vyapariName}
                                                onChange={handleInputChange}
                                                placeholder="व्यापारी नाव"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="carrot" className="form-label">जाळी</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="carrot"
                                                name="carrot"
                                                value={formData.carrot}
                                                onChange={handleInputChange}
                                                placeholder="जाळी"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="weight" className="form-label">वजन</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="weight"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                placeholder="वजन"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="rate" className="form-label">रेट</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="rate"
                                                name="rate"
                                                value={formData.rate}
                                                onChange={handleInputChange}
                                                placeholder="रेट"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                        मागे
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        सेव्ह
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Model2;
