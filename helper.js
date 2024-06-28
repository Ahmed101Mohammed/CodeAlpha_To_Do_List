// temperory message
const temperoryMessage = (message)=>
    {
        const timlyErrorElement = document.querySelector(".timly-error");
        const timlyErrorContentElement = document.querySelector(".timly-error .timly-error-content")
        timlyErrorContentElement.textContent = message;
        timlyErrorElement.classList.add("timly-error-style");
        timlyErrorContentElement.classList.add("timly-error-content-style");
        setTimeout(()=>
            {
                timlyErrorElement.classList.remove("timly-error-style");
                timlyErrorContentElement.classList.remove("timly-error-content-style");
                timlyErrorContentElement.textContent = "";
            }, 5000)
    }