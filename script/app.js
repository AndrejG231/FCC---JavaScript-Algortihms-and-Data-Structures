const exx = {
    nav: document.querySelectorAll('.nav_link'),
    palindromeIn: document.getElementById('palindrome_in'),
    palindromeOut: document.getElementById('palindrome_out'),
    romanIn: document.getElementById('roman_in'),
    romanOut: document.getElementById('roman_out'),
    caesarIn: document.getElementById('caesar_in'),
    caesarOut: document.getElementById('caesar_out'),
    telephoneIn: document.getElementById('telephone_in'),
    telephoneOut: document.getElementById('telephone_out'),
    cashAdd: document.querySelectorAll('.add_cash'),
    cashRem: document.querySelectorAll('.remove_cash'),
    priceInput: document.querySelector('.price_input_form'),
    cashInput: document.querySelector('.cash_input_form'),
}

const palindrome = (str) => {
    str = str.replace(/[^0-9a-z]/gi, '').toLowerCase();
    if (str === '') {
        return ''
    }
    let reversedStr = str.split('').reverse().join('');
    return (reversedStr === str);
}

const roman = (int, i = 0, output = '') => {
    if (int != parseInt(int)) {
        console.log(typeof int)
        return 'Enter an integer number!'
    }
    let romVals = [1000000, 900000, 500000, 400000, 100000, 90000, 50000, 40000, 10000, 9000, 5000, 4000, 1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    let romChars = ['*M', '*C*M', '*D', '*C*D', '*C', '*X*C', '*L', '*X*L', '*X', '*I*X', '*V', '*I*V', 'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    if (!int) {
        return output
    }
    else if (romVals[i] > int) {
        return roman(int, i += 1, output)
    }
    else {
        return roman(int - romVals[i], i, output += romChars[i]);
    }
}

const caesar = (str) => {
    str = str.toUpperCase()
    let decoded = 'abcdefghijklmnopqrstuvwxyz'
    let coded = 'NOPQRSTUVWXYZABCDEFGHIJKLM'

    for (let i = 0; i < coded.length; i++) {
        var re = new RegExp(coded[i], 'g');
        str = str.replace(re, decoded[i]);
    }
    return str.toUpperCase();
}

const telephone = (str) => {
    if (str.match(/\d/g).length < 10) { return false; }
    let number = str.match(/^1[\s-]?[(][\s-]?\d{3}[\s-]?[)][\s-]?\d{3}[\s-]\d{4}|^1[\s-]\d{3}[\s-]\d{3}[\s-]\d{4}|^[(]\d{3}[)][\s-]?\d{3}[\s-]\d{4}|^\d{3}[\s-]?\d{3}[\s-]\d{4}|^\d{10}$/i) || "";
    if (number.length < 1) {
        return false;
    }
    if (number[0].length >= 10) {
        return true;
    }
    return false;
}

const cash = (price, cash, cid) => {
    const cName = ["ONE HUNDRED", "TWENTY", "TEN", "FIVE", "ONE", "QUARTER", "DIME", "NICKEL", "PENNY"];
    const cValue = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];

    var changeArr = [];
    var bank = {};
    var dispo = 0;

    for (let i = 0; i < cid.length; i++) {
        bank[cid[i][0]] = cid[i][1];
        dispo += cid[i][1];
    };
    
    let cashback = cash - price;

    if (dispo == cashback) {
        return {
            status: "CLOSED",
            change: cid
        };
    }else if (dispo < cashback) {
        return {
            status: "INSUFFICIENT_FUNDS",
            change: []
        }};

    let cb = [];

    for (let i = 0; i < cName.length; i++) {
        var currentcount = 0;

        while (cValue[i] <= cashback && cValue[i] <= bank[cName[i]]) {
            cashback = (cashback - cValue[i]).toFixed(2);
            bank[cName[i]] -= cValue[i];
            currentcount += cValue[i];
        };
        
        if (currentcount > 0) {
            changeArr.push([cName[i], currentcount])
        };
    }
    if (cashback == 0) {
        return {
            status: "OPEN",
            change: changeArr
        };
    }else{
        return {
            status: "INSUFFICIENT_FUNDS",
            change: []
        };
    };
};

let cashObject = {
    cidSum: 0,
    cidInput: [],
    cid: {
        "100": 5,
        "20": 10,
        "10": 10,
        "5": 10,
        "1": 20,
        "0.25": 20,
        "0.10": 30,
        "0.05": 30,
        "0.01": 50
    }
};


class Change {
    currentWindow(event) {
        //event.target.dataset.id
        exx.nav.forEach(item => {
            if (item.dataset.id === event.target.dataset.id) {
                document.getElementById(item.dataset.id).classList.remove('invisible');
            } else {
                document.getElementById(item.dataset.id).classList.add('invisible');
            }
        })
    }
    palindrome() {
        exx.palindromeOut.value = palindrome(exx.palindromeIn.value);
    }
    roman() {
        exx.romanOut.value = roman(exx.romanIn.value);
    }
    caesar() {
        exx.caesarOut.value = caesar(exx.caesarIn.value);
    }
    telephone() {
        exx.telephoneOut.value = telephone(exx.telephoneIn.value);
    }
    fixCash(objKey){
        cashObject[objKey + 'Sum'] = Object.keys(cashObject[objKey]).reduce((sum, key) =>
            sum + parseFloat(key)*cashObject[objKey][key], 0)
        cashObject[objKey + 'Sum'] = cashObject[objKey + 'Sum'].toFixed(2);
    };
    produceInput(objKey){
        const cName = ["ONE HUNDRED", "TWENTY", "TEN", "FIVE", "ONE", "QUARTER", "DIME", "NICKEL", "PENNY"];
        const cValue = [100, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01];

        cashObject[objKey + 'Input'] = Object.keys(cashObject[objKey]).map((key) => {
            return [
                cName[cValue.indexOf(parseFloat(key))],
                parseFloat((parseFloat(key) * cashObject[objKey][key]).toFixed(2))
            ]
        })
    };
    produceOutput(){
        let output = cash(exx.priceInput.value, exx.cashInput.value, cashObject['cidInput']);
        let change = output['change'].map(item => `<br>${item[0]} : ${item[1]}`)
        document.querySelector('#cash_out').innerHTML =
            `<p>Status: ${output['status']}<br>
            Change: ${change},`;
    }
    setup(item){
        const eventContainer = item.parentElement;
        const value = eventContainer.dataset.id;
        eventContainer.querySelector('.cash_count').innerText = `${cashObject['cid'][value]}x`;
        eventContainer.querySelector('.cash_value').innerText = `${(cashObject['cid'][value] * parseFloat(value)).toFixed(2)}$`;
        this.fixCash('cid');
        this.produceInput('cid');
        eventContainer.parentElement.querySelector('.cash_sum').innerText = `${cashObject['cidSum']}$`;
    }
    cash(event, amount) {
        const eventContainer = event.target.parentElement.parentElement;
        const value = eventContainer.dataset.id;
        const key = eventContainer.parentElement.id;
        const object = cashObject[key];
        
        object[value] += amount;

        if(object[value] < 0){
            object[value] = 0;
        };

        eventContainer.querySelector('.cash_count').innerText = `${object[value]}x`;
        eventContainer.querySelector('.cash_value').innerText = `${(object[value] * parseFloat(value)).toFixed(2)}$`;

        this.fixCash(key);

        eventContainer.parentElement.querySelector('.cash_sum').innerText = `${cashObject[key + 'Sum']}$`;

        this.produceInput(key);

        this.produceOutput()
    }
}


const eventListeners = () => {
    change = new Change;
    //Nav cards swap
    exx.nav.forEach(item => item.addEventListener('click', (event) => {
        event.preventDefault();
        change.currentWindow(event);
    }));
    //Palindrome 
    exx.palindromeIn.addEventListener('keyup', () => change.palindrome());
    //Roman Numeral Converter
    exx.romanIn.addEventListener('keyup', () => change.roman())
    //Caesars Cipher
    exx.caesarIn.addEventListener('keyup', () => change.caesar())
    //telepohne validator
    exx.telephoneIn.addEventListener('keyup', () => change.telephone())

    //cash register
    exx.cashAdd.forEach(
        item => {item.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(event)
            change.cash(event, 1);
        })
        change.setup(item);
        }
    );

    exx.cashRem.forEach(
        item => item.addEventListener('click', (event) => {
            event.preventDefault();
            change.cash(event, -1);
        })
    );

    exx.priceInput.addEventListener('keyup', () => change.produceOutput());
    exx.cashInput.addEventListener('keyup', () => change.produceOutput());
}


eventListeners();
