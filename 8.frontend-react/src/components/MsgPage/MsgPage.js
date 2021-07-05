import React from 'react';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';
import LinkHref from '../Link/LinkHref';
import './MsgPage.scss'
import logo from '../../Views/Daco_6140061.png'
// TODO: add middleware function

function MsgPage(props) {
    console.log(props.location.state)
    return (
        <div className="msg-page">
            <i id="msg-page-icon" className={props.location.state.icon}></i>
            <Headline className="head-msg" text={props.location.state.headLine}/>
            <div id="info-warper">
            <Text id="text-msg-page" text={props.location.state.text_1}/>
            <LinkHref id="msg-page-link" className={props.location.state.className} href={props.location.state.link} text={props.location.state.aText} />
            <Text text={props.location.state.text_2}/>
            </div>
        </div>
    );
}

export default MsgPage;