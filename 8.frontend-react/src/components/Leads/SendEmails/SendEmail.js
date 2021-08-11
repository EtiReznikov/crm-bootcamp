
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../../../Views/Form.scss';
import './SendEmail.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ErrorMsg from '../../SubComponents/ErrorMsg/ErrorMsg';
function SendEmail(props) {


    const [formState, setState] = useState({
        content: "",
        subject: ""
    })
    const [btnActive, setBtnActive] = useState(true);


    /* when send email button is submitted*/
    const onSubmit = (e) => {
        props.setEmailData(formState.subject, formState.content)
        props.closeModal();
    }



    return (
        <div className="form_wrapper" id="send-email ">
            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>

            <div className="form_container">
                <div className="title_container">
                    <h2>Send Email</h2>
                </div>
                <form>
                    <div className="input_field" >
                        <span>
                            <i aria-hidden="true" className="fa fa-info"></i>
                        </span>
                        <input
                            name="subject"
                            type="text"
                            placeholder="Subject"
                            value={formState.subject}
                            onChange={e =>
                                setState({
                                    ...formState,
                                    subject: e.target.value,
                                })
                            }
                        />

                    </div>
                    {(formState.subject === "" && <ErrorMsg text="Subject is require" />)}
                    {formState.subject !== "" && <ErrorMsg />}
                    <div className="input_field">
                        <span>
                            <i aria-hidden="true" className="fa fa-envelope-open"></i>
                        </span>
                        <textarea id="content" type="text" name="email content" placeholder="Email content"
                            value={formState.content}
                            onChange={(e) => {
                                setState({
                                    ...formState,
                                    content: e.target.value,
                                })
                            }}
                        />
                    </div>
                    {(formState.content === "" && <ErrorMsg text="Message content is require" />)}
                    {formState.content !== "" && <ErrorMsg />}
                    {btnActive && <input className="button" type="submit" value="Submit" disabled={!btnActive || formState.content === "" || formState.subject === ""}
                        onClick={(e) => {
                            setBtnActive(false);
                            onSubmit(e);
                        }
                        } />}
                    {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
                </form>
            </div >

        </div >
    )
}

export default SendEmail;

