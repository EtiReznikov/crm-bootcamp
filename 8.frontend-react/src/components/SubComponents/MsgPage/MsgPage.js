import React from 'react';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';
import LinkHref from '../Link/LinkHref';
import './MsgPage.scss'


function MsgPage(props) {
    return (
        <div className="msg-page">
            <i id="msg-page-icon" className={props.location.state.icon}></i>
            <Headline className="head-msg" text={props.location.state.headLine}/>
            <div id="info-wrapper">
            <Text id="text-msg-page" text={props.location.state.text_1}/>
            <LinkHref id="msg-page-link" className={props.location.state.className} href={props.location.state.link} text={props.location.state.aText} />
            <Text text={props.location.state.text_2}/>
            </div>
        </div>
    );
}

export default MsgPage;