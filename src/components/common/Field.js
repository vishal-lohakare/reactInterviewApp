import React from 'react';

const Field = (props) => {

    const { className, text, renderTextAfterChild } = props;

    return (
        renderTextAfterChild ? 
            <span className={className} >
                {props.children}
                {text}
            </span>
        :
            <span className={className} >
                {text}
                {props.children}
            </span>
    );

}

export default Field;