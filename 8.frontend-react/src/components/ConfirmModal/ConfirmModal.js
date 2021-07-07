
import axios from 'axios';
import React, { useState } from 'react';
import ErrorMsg from '../ErrorMsg/ErrorMsg';
import Text from '../Text/Text';
import { emailValidation } from '../../tools/validation';
import '../../Views/Form.scss';
import { phoneValidation, nameValidation } from '../../tools/validation';
import {
    Redirect
} from "react-router-dom";
import './ConfirmModal.scss'
function ConfirmModal(props) {


    return (
        <div className="form_wrapper">
            <div className="form_container">
                <div className="title_container">
                    <h2>{props.text}</h2>
                </div>
                <div class="confirm-buttons-warper">
                    <div className="btn-warper" onClick={props.onDismiss}>
                        <button className="confirm-btn" id="no-btn" >
                            <i className="fa fa-times"></i>
                        </button>
                        <span className="btn-txt">No</span>
                    </div>
                    <div className="btn-warper" onClick= {props.onConfirm}>
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

