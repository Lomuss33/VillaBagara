/**
 * @author Lovro Music
 * @date 2025-05-10
 * @description This hook provides methods to interact with external APIs.
 */

import emailjs from "@emailjs/browser"
import {useConstants} from "/src/hooks/constants.js"
import {useUtils} from "/src/hooks/utils.js"

const constants = useConstants()
const utils = useUtils()

export const useApi = () => {
    return {
        validators,
        handlers
    }
}

const validators = {
    /**
     * @param {String} name
     * @param {String} email
     * @param {String} subject
     * @param {String} message
     */
    validateEmailRequest: (name, email, subject, message) => {
        const minWordCountForMessage = 3

        const validations = [
            { errorCode: constants.ErrorCodes.VALIDATION_EMPTY_FIELDS,      errorCondition: !name || !email || !subject || !message },
            { errorCode: constants.ErrorCodes.VALIDATION_EMAIL,             errorCondition: !utils.validation.validateEmail(email) },
            { errorCode: constants.ErrorCodes.VALIDATION_MESSAGE_LENGTH,    errorCondition: !utils.validation.isLongerThan(message, minWordCountForMessage),    messageParameter: minWordCountForMessage + 1},
            { errorCode: constants.ErrorCodes.VALIDATION_MESSAGE_SPAM,      errorCondition: utils.validation.isSpam(message) },
        ]

        const error = validations.find(validation => validation.errorCondition)
        return {
            success: !error,
            errorCode: error?.errorCode,
            errorParameter: error?.messageParameter,
            bundle: {
                name: name,
                from_name: name,
                email: email,
                from_email: email,
                custom_subject: subject,
                message: message,
                custom_source: utils.url.getAbsoluteLocation(),
                custom_source_name: "Villa Bagara"
            }
        }
    }
}

const handlers = {
    /**
     * @return {Promise<{success: (*|boolean)}>}
     */
    dummyRequest: async () => {
        await new Promise((resolve) => setTimeout(resolve, 700))
        window._dummyRequestSuccess = !window._dummyRequestSuccess

        return {
            success: window._dummyRequestSuccess
        }
    },

    /**
     * @param {Object} validationBundle
     * @param {String} publicKey
     * @param {String} serviceId
     * @param {String} templateId
     * @return {Promise<{success: boolean}>}
     */
    sendEmailRequest: async (validationBundle, publicKey, serviceId, templateId) => {
        if(!publicKey || !serviceId || !templateId) return {success: false, reason: 'configuration'}
        let timeout
        try {
            const result = await Promise.race([
                emailjs.send(serviceId, templateId, validationBundle, {publicKey}),
                new Promise((_, reject) => { timeout = window.setTimeout(() => reject(new Error('timeout')), 30000) })
            ])
            return {success: result.status === 200, status: result.status}
        } catch (error) {
            return {success: false, reason: error?.message === 'timeout' ? 'timeout' : 'provider', status: error?.status}
        } finally {
            window.clearTimeout(timeout)
        }
    }
}
