
import React, { useState } from 'react';
import FileUpload from '../FileUpload/FileUpload';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import ErrorMsg from '../SubComponents/ErrorMsg/ErrorMsg';
import axios from 'axios';
// import './FileUpload.scss'
function FileUploadModal(props) {
    const [selectedFile, setSelectedFile] = useState({});
    const [btnActive, setBtnActive] = useState(true);
    const onFileUpload = (file) => {
        setErrorMsg(1);
        setSelectedFile(file);
    }
    const [errorMsg, setErrorMsg] = useState(-1);
    const [FileUploaded, setFileUploaded] = useState(false);


    const onSubmit = (e) => {
        if (selectedFile.type === undefined)
            setErrorMsg(4)
        else if (!(selectedFile.type === "image/png" || selectedFile.type === "image/jpg" || selectedFile.type === "image/jpeg")) {
            setErrorMsg(3);
            setBtnActive(true);
        }
        else {
            const data = new FormData()
            data.append('file', selectedFile)
            data.append('client_id', props.clientData.client_id)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            // data.append('client_id', props.clientData.client_id)
            axios.post('http://localhost:8005/Files/addImgToClient', data, config, {
                clientId: props.clientData.clientId
            }
            ).then(function (response) {

                props.closeModal();
                props.changeDataState();
                setErrorMsg(1);
            })
                .catch(function (error) {
                    setErrorMsg(error.response.data.status);
                    setBtnActive(true)

                });
        }
        e.preventDefault();
    }



    return (
        <div className="form_wrapper">
            <button className="exit" onClick={props.closeModal} >
                <i id="exit-wind" className="fa fa-times"></i>
            </button>
            <div className="form_container">
                <FileUpload title={"Upload client image"} setSelectedFile={onFileUpload} />
            </div>
            {errorMsg === 2 && <ErrorMsg text="Something went wrong, please try again" />}
            {errorMsg === 4 && <ErrorMsg text="You must choose a file" />}
            {errorMsg === 3 && <ErrorMsg text="Only JPEG, JPG and PNG image formats are allowed" />}
            {errorMsg === 1 && <ErrorMsg />}
            {btnActive && <input className="button" type="submit" value="Save" disabled={!btnActive}
                onClick={(e) => {

                    setBtnActive(false);
                    onSubmit(e);
                }
                } />}

            {!btnActive && <Loader className="button-div" type="Oval" color="white" height="30" width="30" />}
        </div>
    )
}

export default FileUploadModal;