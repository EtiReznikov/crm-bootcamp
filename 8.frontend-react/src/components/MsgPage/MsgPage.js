import React from 'react';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';

// TODO: add middleware function
function MsgPage(props) {
    console.log(props)
    return (
        <div className="box-container">
            <Headline text={props.location.state.headLine}/>
            <Text text={props.location.state.text_1}/>
            <a href={props.location.state.link}>{props.location.state.aText}</a>
            <Text text={props.location.state.text_2}/>
        </div>
    );
}

export default MsgPage;