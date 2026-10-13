import "./OptionPickerButton.scss"
import React, {useRef} from 'react'
import {Dropdown} from "react-bootstrap"
import {_stringUtils} from "/src/hooks/utils/_string-utils.js"

function OptionPickerButton({ mode, options, selectedOptionId, onOptionSelected, tooltipLabel, label = null,
    ariaPressed = undefined, selectionMenu = false, showSelectedOptionOnDropdown = false }) {
    const toggleRef = useRef(null)
    const selectedOption = options.find(option => option.id === selectedOptionId) || options[0]
    if(!selectedOption) return null

    const availableOptions = options.filter(option =>
        showSelectedOptionOnDropdown || option.id !== selectedOption.id)
    const buttonBehaviorEnabled = mode === OptionPickerButton.Modes.MODE_BUTTON ||
        (mode === OptionPickerButton.Modes.MODE_AUTO && options.length <= 2)
    const accessibleLabel = _stringUtils.stripHTMLTags(label || tooltipLabel || selectedOption.label || "")
    const onCycle = () => {
        const index = options.indexOf(selectedOption)
        onOptionSelected(options[(index + 1) % options.length].id)
    }
    const onSelect = option => {
        onOptionSelected(option.id)
        requestAnimationFrame(() => toggleRef.current?.focus({preventScroll: true}))
    }
    const icon = <OptionPickerButtonPickerIcon option={selectedOption} size={2}/>

    return (
        <div className="btn-option-picker">
            {buttonBehaviorEnabled ? (
                <button className="btn btn-transparent btn-option-picker-toggle" type="button"
                        aria-label={accessibleLabel} aria-pressed={ariaPressed}
                        data-tooltip={label || tooltipLabel} title={accessibleLabel} onClick={onCycle}>
                    {icon}
                </button>
            ) : (
                <Dropdown focusFirstItemOnShow={true}>
                    <Dropdown.Toggle ref={toggleRef} variant="transparent"
                                     className="btn-option-picker-toggle"
                                     aria-label={accessibleLabel} aria-haspopup="menu"
                                     data-tooltip={tooltipLabel} title={accessibleLabel}>
                        {icon}
                        <i className="fa-caret-icon fa-solid fa-caret-down" aria-hidden="true"/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu role="menu" aria-label={_stringUtils.stripHTMLTags(tooltipLabel || accessibleLabel)}>
                        {availableOptions.map(option => (
                            <Dropdown.Item key={option.id} as="button" type="button"
                                           role={selectionMenu ? "menuitemradio" : "menuitem"}
                                           aria-checked={selectionMenu ? option.id === selectedOptionId : undefined}
                                           lang={option.lang}
                                           className={'btn-option-picker-menu-item ' + (option.id === selectedOptionId ? 'btn-option-picker-menu-item-selected' : '')}
                                           onClick={() => onSelect(option)}>
                                <OptionPickerButtonPickerIcon option={option} size={1}/>
                                <span className="btn-option-picker-menu-item-label">{option.label}</span>
                                {selectionMenu && option.id === selectedOptionId && (
                                    <i className="fa-solid fa-check ms-auto" aria-hidden="true"/>
                                )}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </div>
    )
}

function OptionPickerButtonPickerIcon({ option, size }) {
    return (
        <div className={'btn-option-picker-icon btn-option-picker-icon-size-' + size} aria-hidden="true">
            {option.img ? <img src={option.img} alt="" className="img"/> :
                <i className={'fa-icon ' + option.faIcon}/>}
        </div>
    )
}

OptionPickerButton.Modes = {
    MODE_AUTO: "mode_auto",
    MODE_BUTTON: "mode_button",
    MODE_DROPDOWN: "mode_dropdown"
}

export default OptionPickerButton
