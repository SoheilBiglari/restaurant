let menu = document.querySelector('#menu-bar');
let navbar = document.querySelector('.navbar');
let getDatesBtn = document.getElementById('getDates');
let availableDates = document.getElementById('Available-dates');
let reserveBtn = document.getElementById('reserveBtn');
let reserveResponse = document.getElementById('post-response');
let dateRequestSent = false;
let fname = document.getElementById('fname');
let lname = document.getElementById('lname');
let tele = document.getElementById('tele');
let email = document.getElementById('email');
let date = "";

menu.onclick = () =>{

  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');

}

document.onload = () =>{dateRequestSent = false}

// get request
getDatesBtn.onclick = () =>{ 
  if(dateRequestSent){return}
  const opties = {
    method:'GET',
    headers: {
      'content-type':'application/json'
    }
  }
  fetch('https://goudvis.xn--druw-epa.be/reservations/getAvailableTimeSlots.php?fromDate=2021-10-1&toDate=2021-11-1', opties)
    .then(response=> {
    if(response.ok){
    return response.json();
    } else {
      throw new Error(response.status)
    }
  }).then(json =>{
    console.log(json);
    let counter = 0;
    json.forEach(element => {
      counter++;
      const radioButton = document.createElement('input');
      radioButton.setAttribute('type','radio');
      radioButton.setAttribute('name','date');
      radioButton.setAttribute('value',element.date);
      radioButton.setAttribute('id','date'+counter);
      radioButton.addEventListener('change', function() {
        (date.value) ? console.log(date.value): null;
        if (this.value !== date) {
            date = this.value;
        }});
      const label = document.createElement('label');
      label.setAttribute('for','date'+counter);
      label.innerText = element.date;
      availableDates.appendChild(label);
      availableDates.appendChild(radioButton);
      
    });
    
  }).catch((error)=> {
    console.log(error);
  })
  dateRequestSent = true;
}

// Post Request Baraye ferstadane etelaat be site e dige
reserveBtn.onclick = () =>{
  // check mikone bebine aya hameye mavared vared shode ya na (date ro ba click shode budanesh check mikone => dateRequestSent. in variable balaye safhe sakhte shode va harvaght dokmeye get list tu html rush click beshe, in variable True mishe az false. true yani ruye dokme click shode va false baraks.)
  if(!dateRequestSent||date == ""){
    reserveResponse.innerText="Get the date list first and select a date!!";
    reserveResponse.setAttribute('style','color:red!important;');
    return
  }else if(fname.value == "" || lname.value == "" || tele.value == "" || email.value == ""){
    reserveResponse.innerText="Fill All inputs";
    reserveResponse.setAttribute('style','color:red!important;');
    return
  }
  // data i ke bayad ferestade she
  const reservationDetails = {
    "firstname": fname.value,
    "lastname": lname.value,
    "datetime": date,
    "telephone": tele.value,
    "email": email.value
  };
  console.log(reservationDetails);
  // header haye request
  const opties = {
    method:'POST',
    headers: {
      'content-type':'application/json'
    },
    body: JSON.stringify(reservationDetails)
  }
  fetch('https://goudvis.xn--druw-epa.be/reservations/insert.php', opties)
    .then(response=> {
    if(response.ok){
    return response.json();
    } else {
      throw new Error(response.status)
    }
  }).then(json =>{
    console.log(json);
    reserveResponse.innerText="Reservation Completed Successfuly! Your Reserve-Code is " + json.code+" ";
  }).catch((error)=> {
    console.log(error);
  })
  dateRequestSent = true;
}


