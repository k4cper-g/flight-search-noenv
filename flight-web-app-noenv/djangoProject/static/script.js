
function getOffers() {
    let from = document.getElementById("from").value
    let to = document.getElementById("to").value;
    let dep = document.getElementById("dep").value;
    let ret = document.getElementById("ret").value;

    if(from === "") {
        document.getElementById("myModal").style.display = "block";
    }
    if(to === "") {
        document.getElementById("myModal").style.display = "block";
    }
    if(dep === "") {
        document.getElementById("myModal").style.display = "block";
    }

    let regex = "(?<=\\[)[^\\[\\]]*(?=\\])";
    let fromCode = from.match(regex);
    let toCode = to.match(regex);

    let oneway = `/api/v1/flight/search_offers/?originCode=${fromCode}&destinationCode=${toCode}&departureDate=${dep}`
    let bothway =  `/api/v1/flight/search_offers_both/?originCode=${fromCode}&destinationCode=${toCode}&departureDate=${dep}&returnDate=${ret}`

    if(isOneWay()) {
        handleOneWay(oneway);
    } else {
        handleBoth(bothway);
    }
}
function isOneWay() {
    let ret = document.getElementById("ret").value;
    return ret === "";

}
function handleOneWay(link) {
    let offerArray = [];
    let offerElement = document.createElement("div");
    offerElement.className = "offers-box-both-oneway";

    fetch(link).then(response => response.json()).then(data => {
        offerArray = data.data

        offerArray.map((offer) => {
            console.log(offer);
            let offerWholeFooter = document.createElement("div");
            offerWholeFooter.className = "offer-both-footer";

            let tripType = document.createElement("p");
            tripType.className = "dest";
            tripType.innerHTML = "One way trip 📌";

            let offerWrapper = document.createElement("div");
            offerWrapper.className = "both-wrapper";

            let offerObj = document.createElement("div");
            offerObj.className = "offer-both";
            offerObj.id = "both";

            let offerFooter = document.createElement("div");
            offerFooter.className = "offer-footer"

            let code1 = offer.itineraries[0].segments[0].departure.iataCode;
            let code2 = offer.itineraries[0].segments[offer.itineraries[0].segments.length-1].arrival.iataCode;

            let h = document.createElement("h1");
            let price = document.createElement("p");
            let depart = document.createElement("p");
            let seats = document.createElement("p");
            let arr = document.createElement("p");
            let tr = document.createElement("p");

            seats.innerHTML = "Seats left: " + offer.numberOfBookableSeats + " 💺";

            h.innerHTML = code1 + " ➡ " + code2;

            let transfers = [];

            for(let i = 0; i < offer.itineraries[0].segments.length; i++) {
                if (!(offer.itineraries[0].segments[i].arrival.iataCode === code1 || offer.itineraries[0].segments[i].arrival.iataCode === code2)) {
                 transfers.push(offer.itineraries[0].segments[i].arrival.iataCode);
                }
            }

            if(transfers.length === 0) {
                tr.innerHTML = `Transfer: None 💼`;
            } else {
                tr.innerHTML = `Transfer: ${transfers} 💼`;
            }

            let split1 = (offer.itineraries[0].segments[0].arrival.at).split("T")
            let arrTime = split1[0] + " " + split1[1];
            let split2 =  (offer.itineraries[0].segments[0].departure.at).split("T");
            let depTime = split2[0] +  " " + split2[1];

            arr.innerHTML = `Arrival: ${arrTime} 🛬`;
            depart.innerHTML = `Departure: ${depTime} 🛫`;
            price.innerHTML = `Price: ${offer.price.total} ${offer.price.currency} 💵`;

            offerObj.appendChild(h);
            offerObj.appendChild(depart);
            offerObj.appendChild(arr);
            offerObj.appendChild(tr);

            offerFooter.appendChild(price);

            giveRowClass(price);
            giveRowClass(depart);
            giveRowClass(arr);
            giveRowClass(seats);
            giveRowClass(tr);


            offerWrapper.appendChild(offerObj);
            offerWholeFooter.appendChild(tripType);
            offerWholeFooter.appendChild(offerWrapper);
            offerWholeFooter.appendChild(seats);
            offerWholeFooter.appendChild(offerFooter);
            offerElement.appendChild(offerWholeFooter);
        })
    }).then(() => {
        if(offerArray.length === 0) {
            let box = document.getElementById("noF")
            document.getElementById("noFlightsModal").style.display = "block";
        }
    })
    document.body.appendChild(offerElement)
}
function handleBoth(link) {
    let offerArray = [];
    let offerElement = document.createElement("div");
    offerElement.className = "offers-box-both-twoway";



    fetch(link).then(response => response.json()).then(data => {
        offerArray = data.data

        offerArray.map((offer) => {
            let offerWholeFooter = document.createElement("div");
            offerWholeFooter.className = "offer-both-footer";

            let tripType = document.createElement("p");
            tripType.className = "dest";
            tripType.innerHTML = "Round trip 🌐";

            let offerWrapper = document.createElement("div");
            offerWrapper.className = "both-wrapper";

            let offerObjLeft = document.createElement("div");
            offerObjLeft.className = "offer-both";
            offerObjLeft.id = "both";

            let offerObjRight = document.createElement("div");
            offerObjRight.className = "offer-both";
            offerObjRight.id = "both";

            let offerFooter = document.createElement("div");
            offerFooter.className = "offer-footer"

            fillObject(offer, offerObjLeft, 0);
            fillObject(offer, offerObjRight, 1);

            let price = document.createElement("p");
            price.innerHTML = `Price: ${offer.price.total} ${offer.price.currency} 💵`;

            let seats = document.createElement("p");
            seats.innerHTML = "Seats left: " + offer.numberOfBookableSeats + " 💺";


            offerFooter.appendChild(price);

            giveRowClass(price);


            offerWrapper.appendChild(offerObjLeft);
            offerWrapper.appendChild(offerObjRight);
            offerWholeFooter.appendChild(tripType);
            offerWholeFooter.appendChild(offerWrapper);
            offerWholeFooter.appendChild(seats);
            offerWholeFooter.appendChild(offerFooter);
            offerElement.appendChild(offerWholeFooter);
        })
    })

    document.body.appendChild(offerElement)
}
function fillObject(offer, offerObj, itin) {
            let code1 = offer.itineraries[itin].segments[0].departure.iataCode;
            let code2 = offer.itineraries[itin].segments[offer.itineraries[itin].segments.length-1].arrival.iataCode;

            let h = document.createElement("h1");
            let depart = document.createElement("p");
            let arr = document.createElement("p");
            let tr = document.createElement("p");

            h.innerHTML = code1 + " ➡ " + code2;

            let transfers = [];

            for(let i = 0; i < offer.itineraries[itin].segments.length; i++) {
                if (!(offer.itineraries[itin].segments[i].arrival.iataCode === code1 || offer.itineraries[itin].segments[i].arrival.iataCode === code2)) {
                 transfers.push(offer.itineraries[itin].segments[i].arrival.iataCode);
                }
            }

            if(transfers.length === 0) {
                tr.innerHTML = `Transfer: None 💼`;
            } else {
                tr.innerHTML = `Transfer: ${transfers} 💼`;
            }

            let split1 = (offer.itineraries[itin].segments[0].arrival.at).split("T")
            let arrTime = split1[0] + " " + split1[1];
            let split2 =  (offer.itineraries[itin].segments[0].departure.at).split("T");
            let depTime = split2[0] +  " " + split2[1];

            arr.innerHTML = `Arrival: ${arrTime} 🛬`;
            depart.innerHTML = `Departure: ${depTime} 🛫`;

            giveRowClass(depart);
            giveRowClass(arr);
            giveRowClass(tr);

            offerObj.appendChild(h);
            offerObj.appendChild(depart)
            offerObj.appendChild(arr)
            offerObj.appendChild(tr);
}
function fillSearchFrom() {
    let keyWord = document.getElementById("from").value;
     let airArray = [];
    let items = document.getElementById("itemsFrom");

    fetchFunc(keyWord,airArray,items);

    filterFrom();
}
function fillSearchTo() {
    let keyWord = document.getElementById("to").value;
     let airArray = [];
    let items = document.getElementById("itemsTo");

    fetchFunc(keyWord, airArray, items)

    filterTo()
}
function fetchFunc(keyWord, airArray, items) {
    fetch(`http://127.0.0.1:8000/api/v1/flight/select_destination/${keyWord}`).then(response => response.json()).then(data => {
        airArray = data.data;

        airArray.map((airport) => {
            let item = document.createElement("li");
            addListener(item);
            let city = airport.address.cityName;
            let code = airport.iataCode;
            let country = airport.address.countryName;
            item.innerHTML = city + " [" + code + "] - " + country;

            if(checkEle(item)) {
             items.appendChild(item);
            }
        })
    })
}


function checkEle(item) {
    let items = document.getElementsByTagName("li");
    for(let i = 0; i < items.length; i++) {
        if(item.textContent === items[i].textContent) {
            return false;
        }
    }
    return true;
}
function filterFrom() {
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('from');
  filter = input.value.toUpperCase();
  ul = document.getElementById("itemsFrom");
  li = ul.getElementsByTagName('li');

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
function filterTo() {
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('to');
  filter = input.value.toUpperCase();
  ul = document.getElementById("itemsTo");
  li = ul.getElementsByTagName('li');

  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}





function giveRowClass(element) {
    element.className = "row-offer";

}
let elements = document.getElementsByTagName("li");
for(let i = 0; i< elements.length; i++) {
    addListener(elements[i]);
}
function addListener(ele) {

    ele.addEventListener('click', function (event){
        event.stopPropagation()
        let from = document.getElementById("from");
        let to = document.getElementById("to")
        if(ele.parentElement.id === "itemsFrom") {
            from.value = ele.textContent;
        }
        if(ele.parentElement.id === "itemsTo") {
            to.value = ele.textContent;
        }
    })
}
document.getElementById("from").addEventListener('click', function (event) {
    event.stopPropagation()
    let box = document.getElementById("drpFrom");
    if(box.style.display === 'block') {
        console.log("none")
        box.style.display = 'none';
    } else {
        box.style.display = 'block';
    }
})
document.getElementById("to").addEventListener('click', function (event) {
    event.stopPropagation()
    let box = document.getElementById("drpTo");
    if(box.style.display === 'block') {
        console.log("none")
        box.style.display = 'none';
    } else {
        box.style.display = 'block';
    }
})

document.addEventListener('click', function handleClickOutsideBox(event) {
    event.stopPropagation();
  let from = document.getElementById('from');
  let to = document.getElementById('to');
  let drpF = document.getElementById("drpFrom");
  let drpT = document.getElementById("drpTo");

  if (!from.contains(event.target) || !to.contains(event.target)) {
    drpF.style.display = 'none';
    drpT.style.display = 'none';
  }
});
document.getElementById("from").addEventListener('keyup', function() {
     let from = document.getElementById('from');
    let drpF = document.getElementById("drpFrom");
    if(from.value === "") {
        console.log("none")
        drpF.style.display = "none";
    } else {
        drpF.style.display = "block";
    }
})
document.getElementById("to").addEventListener('keyup', function() {
     let to = document.getElementById('to');
    let drpT = document.getElementById("drpTo");
    if(to.value === "") {
        console.log("none")
        drpT.style.display = "none";
    } else {
        drpT.style.display = "block";
    }
})
document.getElementById("closeFlightsModal").addEventListener('click', function() {
    document.getElementById("noFlightsModal").style.display = "none";
})
document.getElementById("closeMyModal").addEventListener('click', function (){
     document.getElementById("myModal").style.display = "none";
})
