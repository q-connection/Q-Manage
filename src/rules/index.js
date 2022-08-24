const requiredHtml = {
    params: [],
    computesRequired: true,
    validate: value => {
        let result = {
            valid: false,
            required: true
        }

        if(!value) {
            return result
        }

        const elem = document.createElement('div')    
        elem.innerHTML = value
        
        const text   = elem.textContent || elem.innerText
        const hasImg = elem.querySelector('img')
        if(text.length <= 0 && hasImg == null) {
            return result
        }
        
        result.valid = true
        return result
    }
}

export {requiredHtml}