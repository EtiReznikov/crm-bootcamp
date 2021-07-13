import React from 'react';


import '../../../Views/Form.scss';

import ErrorMsg from '../ErrorMsg/ErrorMsg';
import './ConfirmModal.scss'
function ConfirmModal(props) {


    return (
        <div className="form_wrapper">
            <div className="form_container" >
                <div className="title_container" id="confirm-title">
                    <h2>{props.text}</h2>
                </div>
                <div className="confirm-buttons-wrapper">
                    <button id="ok-btn" onClick= {props.onConfirm}>Yes</button>
                    <button id="no-btn" onClick={props.onDismiss}>No</button>
                    {/* <div className="btn-wrapper" onClick={props.onDismiss}>
                        <button className="confirm-btn" id="no-btn" >
                            <i className="fa fa-times"></i>
                        </button>
                        <span className="btn-txt">No</span>
                    </div>
                    <div className="btn-wrapper" onClick= {props.onConfirm}>
                        <button className="confirm-btn" id="yes-btn">
                            <i className="fa fa-check"></i>
                        </button>
                        <span className="btn-txt">Yes</span>
                    </div> */}
                </div>
                {props.errorMsg && <ErrorMsg id={"error-confirm"} text="Something went wrong, please try again."/>
                
                }
            </div>
        </div>
    )
}

export default ConfirmModal;

