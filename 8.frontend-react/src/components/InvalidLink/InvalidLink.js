import React from 'react';
import Headline from '../Headline/Headline';
import Text from '../Text/Text';
// TODO: add middleware function
function InvalidLink(props) {
    return (
        <div className="box-container">
            <Headline text="Invalid Password Reset Link"/>
            <Text text="This link is no longer valid. please request a new link below" />
            <a href="/ForgotPassword">Get new reset password link</a>
        </div>

    );
}

export default InvalidLink;