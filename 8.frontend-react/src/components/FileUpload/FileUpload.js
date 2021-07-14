import React, {useState} from 'react';
import Headline from '../SubComponents/Headline/Headline';
import './FileUpload.scss'
function FileUpload(props) {

    const onChangeHandler = (e) => {
        props.setSelectedFile(e.target.files[0]);
    }

    return <div className="form-group files">
        <label>{props.title} </label>
        <input type="file" className="form-control" onChange={onChangeHandler} />
    </div>
}

export default FileUpload;