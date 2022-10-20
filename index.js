function Flight(destination, time, businessСlass, economyСlass){
    this.destination = destination;
    this.time = time;
    this.businessСlass = businessСlass;
    this.economyСlass = economyСlass;
}

// function Passenger(name, kol, id){
//     this.name = name;
//     this.kol = kol;
//     this.id = id;
// }

let flights = [];

if(!localStorage.getItem('flights')){
    flights.push(new Flight('Минск', '12.00', '5', '15'));
    flights.push(new Flight('Минск', '14.00', '3', '10'));
    flights.push(new Flight('Минск', '18.00', '7', '8'));
    flights.push(new Flight('Москва', '12.00', '10', '10'));
    flights.push(new Flight('Москва', '14.00', '12', '15'));
    flights.push(new Flight('Москва', '18.00', '4', '8'));
    localStorage.setItem('flights', JSON.stringify(flights));
}

let localflights = localStorage.getItem('flights');
if (localflights.length > 0) flights = JSON.parse(localflights);

//localStorage.removeItem('flights');


let bookingData = [];

const bookingAdd = function(e) {
    e.preventDefault();

    if(localStorage.getItem('bookingData')){
        let localBookingData = localStorage.getItem('bookingData');
        if (localBookingData.length > 0) bookingData = JSON.parse(localBookingData);
    }

    let form = this.closest('.form-add'),
    selectDestination = form.querySelector("#destination"),
    selectTime = form.querySelector("#time"),
    inputKol = form.querySelector("#kol"),
    radioBusinessClass = form.querySelector("#business"),
    radioEconomyClass = form.querySelector("#economy"),
    bookedSeat = document.querySelector(".booked-seat");
    
    if(!selectDestination.value || !selectTime.value || !inputKol.value){
        alert('Введите информацию!');
        return;
    }
    else if(Number(inputKol.value) < 1 || Number.isNaN(Number(inputKol.value))){
        alert('Некорректный ввод количества мест!');
        return;
    }
    
    let radioClass, noSeats = false, optionTimeRemoved;
    if(radioEconomyClass.checked === true) {
        radioClass = 'эконом-класс';
    } else {
        radioClass = 'бизнес-класс';
    }
    
    flights.forEach(function(flight){
        if(flight.destination === selectDestination.value && flight.time === selectTime.value){
            if(radioClass === 'эконом-класс'){
                if(Number(flight.economyСlass) >= inputKol.value){
                    flight.economyСlass = Number(flight.economyСlass) - inputKol.value;
                }
                else{
                    alert('Количество оставшихся мест по данному рейсу: '+ flight.economyСlass + '\nМест в бизнес-классе: ' + flight.businessСlass);
                    noSeats = true;
                }
            }
            else {
                if(Number(flight.businessСlass) >= inputKol.value){
                    flight.businessСlass = Number(flight.businessСlass) - inputKol.value;
                }
                else {
                    alert('Количество оставшихся мест по данному рейсу: '+ flight.businessСlass + '\nМест в эконом-классе: ' + flight.economyСlass);
                    noSeats = true;
                }
            }

            if(Number(flight.economyСlass) === 0 && Number(flight.businessСlass) === 0 ) {
                let optionsTime = selectTime.querySelectorAll('option');
                optionTimeRemoved = selectTime.value;

                optionsTime.forEach(function(optionTime, index){
                    if(optionTime.value === selectTime.value){
                        selectTime.removeChild(optionsTime[index]);
                        selectTime.value = '';
                    }
                });
            }
        }
    });

    if(noSeats){
        return;
    }

    let bookingSeat = {
        destination: selectDestination.value,
        time: selectTime.value,
        kol: inputKol.value,
        type: radioClass
    };

    if(!bookingSeat.time){
        bookingSeat.time = optionTimeRemoved;
    }

    bookingData.push(bookingSeat);
    console.log(bookingData);
    localStorage.setItem('bookingData', JSON.stringify(bookingData));


    localStorage.setItem('flights', JSON.stringify(flights));

    bookedSeat.innerText = 'Количество забронированных мест: ' + inputKol.value + '(' + radioClass + ') по направлению ' + selectDestination.value + ' в ' + selectTime.value;
    bookedSeat.style.display = 'flex';
}

const btnBook = document.querySelector("#book-btn");
if (btnBook) btnBook.addEventListener('click', bookingAdd);

//localStorage.clear();