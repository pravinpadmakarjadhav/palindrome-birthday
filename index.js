const numberOfDaysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const reverseStr = str => str.split('').reverse().join('');
const convertTwoDigit = dateObj => {
    let day = dateObj.day.toString();
    let month = dateObj.month.toString();
    let year = dateObj.year.toString();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month
    }
    day = day.toString()
    return { day, month, year }
}
const isPalendrome = dateInStringForm => {
    let reverse = reverseStr(dateInStringForm);
    if (reverse === dateInStringForm) {
        return true
    }
    return false
}
const isLeapYear = year => {
    if (year % 4 === 0) {
        return true
    }
    // if (year % 100 === 0) {
    //     return false
    // }
    if (year % 400 === 0) {
        return true
    }
    return false
}
const nexDate = dateObj => {
    let { day, month, year } = dateObj
    day++;
    if (month === 2) {
        //if its leap year
        if (isLeapYear(year)) {
            if (day > 29) {
                day = 1;
                month++
            }
        }//no leap year
        else {
            if (day > 28) {
                day = 1;
                month++
            }
        }

    } else {
        //if its last day of the month 
        if (day > numberOfDaysInMonths[month - 1]) {
            day = 1;
            month++;
        }
        //if its last month of the year 
        if (month === numberOfDaysInMonths.length) {
            month = 1;
            year++
        }
    }
    return { day, month, year }
}
const prevDate = dateObj => {
    let { day, month, year } = dateObj;
    day--
    if (month === 3) {
        if (isLeapYear(year)) {
            if (day < 1) {
                day = 29;
                month--
            }
        } else {
            if (day < 1) {
                day = 28;
                month--
            }
        }
    } else {
        if (day < 1) {
            day = numberOfDaysInMonths[month - 2]
            month--
        }
        if (month < 1) {
            month = numberOfDaysInMonths.length;
            day = numberOfDaysInMonths[month - 1]
            year--
        }
    }
    return { day, month, year }
}
const convertDateStringToObject = dateStr => {
    let date = {
        day: 0,
        month: 0,
        year: 0,
    }
    let dateArr = dateStr.split('-')
    date.year = Number(dateArr[0]);
    date.month = Number(dateArr[1]);
    date.day = Number(dateArr[2]);
    return date;
}
const isPalindromeInAllFormats = dateObj => {
    let date = convertTwoDigit(dateObj)
    let day = date.day;
    let month = date.month;
    let year = date.year;
    let flag = false;
    let allFormatArr = Object.values({
        ddmmyyyy: day + month + year,
        yyyyddmm: year + day + month,
        mmyyyydd: month + year + day,
        ddmmyy: day + month + year.slice(-2),
        yyddmm: year.slice(-2) + day + month,
        mmyydd: month + year.slice(-2) + day,
    })
    return allFormatArr.some(ele => isPalendrome(ele))
}
const nextPalindromeDate = dateObj => {
    let date = nexDate(dateObj)
    let count = 0;
    while (1) {
        count++;
        if (isPalindromeInAllFormats(date))
            break;
        date = nexDate(date)
    }
    date = convertTwoDigit(date)
    date = date.day + "/" + date.month + "/" + date.year;
    return [count, date]
}
const prevPlaindromeDate = dateObj => {
    let date = prevDate(dateObj)
    let count = 0;
    while (1) {
        count++;
        if (isPalindromeInAllFormats(date))
            break;
        date = prevDate(date)
    }
    date = convertTwoDigit(date)
    date = date.day + "/" + date.month + "/" + date.year;
    return [count, date]
}

const inputEle = document.querySelector("#date-input");
const btnSubmit = document.querySelector("#btn-submit-date")
const message = document.querySelector("#message")
const loadingSvg = document.querySelector("#loading-image")

btnSubmit.addEventListener('click', function () {
    let dateStr = inputEle.value;
    if (dateStr) {
        //render some loading animation 
        loadingSvg.style.display = "block"
        message.style.display = "none"
        setTimeout(function () {
            //remove rendering animation
            loadingSvg.style.display = "none"
            message.style.display = "block"


            let dateObj = convertDateStringToObject(dateStr)
            let isPal = isPalindromeInAllFormats(dateObj)
            if (isPal) {
                message.innerHTML = "Your Birthday is Palindrome🤩"
            } else {
                let [nextCount, commingDate] = nextPalindromeDate(dateObj)
                let [prevCount, dateGone] = prevPlaindromeDate(dateObj)
                if (nextCount > prevCount) {
                    console.log(prevCount, dateGone)
                    message.innerHTML = `Your Birthday is not palindrome 🥺 and you missed it by ${prevCount}. Nearest date is ${dateGone}`
                } else {
                    console.log(nextCount, commingDate)
                    message.innerHTML = `Your Birthday is not palindrome 🥺 and you missed it by ${nextCount}. Nearest date is ${commingDate}`
                }
            }

        }, 4000)
    } else {
        message.innerHTML = "Enter your birthday"

    }
})