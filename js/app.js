let UIcontroller = (function(){
    return {
        getinput: function(){
            return {
                perHour: Number(document.querySelector('.perHour').value),
                hours: Number(document.querySelector('.hours').value),
                date: document.querySelector('.date').value
            }
        },

        clearFields: function(){
            let parent = document.querySelector('.add__container');
            let children = parent.children;
            for(let i = 0; i <3; i++){
                children[i].value = '';
            }
        },
        showShift: function(shift){
            let element = document.querySelector('.shifts__list');           
            let html = '<div class="item clearfix"><div class="item__date">%date%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            // replace the placeholder text 
            let newHtml = html.replace('%date%', shift.date);
            newHtml = newHtml.replace('%value%', shift.perDay);
            // inseert the HTML into the DOM
            element.insertAdjacentHTML('beforeend', newHtml);
        },
        showSumMonth: function(sum) {
            let month = document.querySelector('.month-salary');
            month.textContent = sum;
        },
        displayDate: function(){
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let now = new Date();
            let month = now.getMonth();
            let year = now.getFullYear();
            let monthNum = month + 1;
            document.querySelector('.salary__title--month').textContent = months[month] + ' ' + year;

            // add attribute to input date for select day only in this month
            let inputDate = document.querySelector('.date');
            inputDate.setAttribute("min", `${year}-0${monthNum}-01`);
            inputDate.setAttribute("max", `${year}-0${monthNum}-30`);
        }
    }
})();


let DATAcontroller = (function(){
    
    let Shift = function(perHour, hours, date, perDay) {
        this.perHour = perHour;
        this.hours = hours;
        this.date = date;
        this.perDay = perDay;
    }

    let data = {
        allShifts: [],
        sumMonth: 0
    };

     

    return {
        addShift: function(perHour, hours, date, perDay){
            let newShift = new Shift(perHour, hours, date, perDay); 
            data.allShifts.push(newShift); // add shift to arry of shifts
            return newShift;
        },test: function(){
            console.log(data);
        },
        calcSalary: function(perHour, hours) {
            let daySalary, newHour;
            if (hours <= 8 ){
                daySalary = (perHour*hours);
            }
            else if(hours <= 10){
        
                let forHour125 = perHour*1.25;
                newHour = hours-8;
        
                daySalary =  (perHour*8)+(newHour*forHour125);
            }
            else{
                let forHour150 = perHour*1.5;
                newHour = hours-10;
        
                daySalary =  (forHour*8)+(forHour125*2)+(forHour150*newHour);
            }
            return {
                daySalary
            } 
        },
        calcMonth: function(){
            data.sumMonth =0;
            for (let i =0; i< data.allShifts.length; i++){
                data.sumMonth = data.sumMonth + data.allShifts[i].perDay;
            }
            return data.sumMonth
        },
        
        delete: function(id) {
            for (let i =0; i< data.allShifts.length; i++){
                if(data.allShifts[i].date == id){
                    
                    //delete from arry
                    data.allShifts.splice(i,1);
                    console.log(data.allShifts);
                     
                }
            }
        },
        checkDate: function(date) {
            let newDate = date.split("-");
            //return newDate
            let year = newDate[0];
            let month = newDate[1];
            let curYear = new Date().getFullYear();
            let curMonth = new Date().getMonth() + 1;

            if(year == curYear  &&  month == curMonth) {
                return true
            } else { return false }
        }

    }
})();

// function that tcontroll all (data & ui) 
// DATActrl = all data and culc data
// UIctrl = functions for ui 

let controllAll = (function(DATActrl,UIctrl){
    

    let setupEvent = function() {
        document.querySelector('.add__btn').addEventListener('click', ctrlAddShift);

        document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddShift();
            }
        });

        // event for delete shift
        document.querySelector('.container').addEventListener('click', function(e){

            if(e.target.className == 'ion-ios-close-outline'){
                let id= e.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.innerHTML;
                let item =e.target.parentNode.parentNode.parentNode.parentNode;
                item.parentNode.removeChild(item);
                deleteShift(id);
            }
        });
    };

    let ctrlAddShift = function() {

        //get data
        let input = UIctrl.getinput(); 

        if(DATActrl.checkDate(input.date)) {

            //calc
        let calcShift = DATActrl.calcSalary(input.perHour, input.hours);

        
        //add shift
        let newShift = DATActrl.addShift(input.perHour, input.hours, input.date, calcShift.daySalary);
        


        //clearFields
        UIctrl.clearFields();

        // show shift 
        UIctrl.showShift(newShift);
        
        //update sum month
        UIctrl.showSumMonth((DATActrl.calcMonth()));
        } else {
            alert('invalid date... pls choose a date in the current month ')
        }

        
    };

    // add delete shift //update
    let deleteShift = function(ID){

        DATActrl.delete(ID);
        //update
        UIctrl.showSumMonth((DATActrl.calcMonth()));
    }

    // display ui and update with changes
    return {
        init: function(){
            UIctrl.displayDate();
            setupEvent();
            

        }
    };

    
})(DATAcontroller, UIcontroller);

controllAll.init();