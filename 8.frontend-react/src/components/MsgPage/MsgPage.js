import React from 'react';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';
import LinkHref from '../Link/LinkHref';
import './MsgPage.scss'
import logo from '../../Views/Daco_6140061.png'
// TODO: add middleware function
function MsgPage(props) {
    console.log(props)
    return (
        <div className="msg-page">
             <img id="logo" src={logo} />
            <Headline className="head-msg" text={props.location.state.headLine}/>
            <Text text={props.location.state.text_1}/>
            <LinkHref className="info-link" href={props.location.state.link} text={props.location.state.aText} />
            <Text text={props.location.state.text_2}/>
        </div>
    );
}

export default MsgPage;