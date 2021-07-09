import React from 'react';


import '../../../Views/Form.scss';


import './ConfirmModal.scss'
function ConfirmModal(props) {


    return (
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container">
                    <h2>{props.text}</h2>
                </div>
                <div class="confirm-buttons-wrapper">
                    <div className="btn-wrapper" onClick={props.onDismiss}>
                        <button className="confirm-btn" id="no-btn" >
                            <i className="fa fa-times"></i>
                        </button>
                        <span className="btn-txt">No</span>
                    </div>
                    <div className="btn-wrapper" onClick= {props.onConfirm}>
                        <button class="confirm-btn" id="yes-btn">
                            <i className="fa fa-check"></i>
                        </button>
                        <span className="btn-txt">Yes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal;

