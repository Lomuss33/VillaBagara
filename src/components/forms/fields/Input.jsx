import "./Input.scss"
import React, {useEffect, useId, useState} from 'react'
import InputFieldWrapper from "/src/components/forms/base/InputFieldWrapper.jsx"
import {useUtils} from "/src/hooks/utils.js"

function Input({
    id,
    name = "",
    model = "",
    setModel = null,
    faIconPrefix = "",
    required = false,
    type = "text",
    className = "",
    placeholder = "",
    maxLength = 128
}) {
    const utils = useUtils()
    const generatedId = useId()
    const fieldId = id || generatedId

    const [isFocused, setIsFocused] = useState(false)
    const placeholderFull = `${placeholder}${utils.string.if(required, " *")}`
    const focusClass = utils.string.if(isFocused, "form-input-focused")

    return (
        <div className="form-field">
        <label className="form-field-label" htmlFor={fieldId}>
            {placeholder}{required && <span aria-hidden="true"> *</span>}
        </label>
        <InputFieldWrapper isFocused={isFocused}
                           faIconPrefix={faIconPrefix}>
            <input className={`form-control form-input ${focusClass} ${className}`}
                   id={fieldId}
                   type={type}
                   name={name}
                   value={model}
                   placeholder={placeholderFull}
                   required={required}
                   maxLength={maxLength}
                   onChange={(e) => { setModel && setModel(e.target.value) }}
                   onFocus={(e) => { setIsFocused(true) }}
                   onBlur={(e) => { setIsFocused(false) }}/>
        </InputFieldWrapper>
        </div>
    )
}

export default Input
