
// BUS DATA
const buses = [
    {
        id: 1,
        name: "Express Travels",
        from: "Hyderabad",
        to: "Bangalore",
        departure: "08:00 AM",
        arrival: "02:00 PM",
        type: "AC Sleeper",
        price: 850,
        seats: 20
    },
    {
        id: 2,
        name: "Orange Travels",
        from: "Hyderabad",
        to: "Vijayawada",
        departure: "09:30 AM",
        arrival: "01:30 PM",
        type: "AC Seater",
        price: 550,
        seats: 18
    },
    {
        id: 3,
        name: "Royal Roadways",
        from: "Delhi",
        to: "Jaipur",
        departure: "07:00 AM",
        arrival: "12:00 PM",
        type: "AC Sleeper",
        price: 650,
        seats: 15
    },
    {
        id: 4,
        name: "Green Line Travels",
        from: "Mumbai",
        to: "Pune",
        departure: "10:00 AM",
        arrival: "01:30 PM",
        type: "Non-AC Seater",
        price: 400,
        seats: 22
    },
    {
        id: 5,
        name: "Morning Star",
        from: "Hyderabad",
        to: "Bangalore",
        departure: "10:00 PM",
        arrival: "06:00 AM",
        type: "AC Sleeper",
        price: 1000,
        seats: 16
    }
];

const busContainer = document.getElementById("busContainer");
const searchForm = document.getElementById("searchForm");

// Set minimum journey date to today
const journeyDate = document.getElementById("journeyDate");
const today = new Date().toISOString().split("T")[0];

journeyDate.min = today;
journeyDate.value = today;

// Display buses
function displayBuses(busList) {
    busContainer.innerHTML = "";

    if (busList.length === 0) {
        busContainer.innerHTML = `
            <p class="no-buses">
                No buses found. Please try another route.
            </p>
        `;
        return;
    }

    busList.forEach(bus => {
        const busCard = document.createElement("div");
        busCard.className = "bus-card";

        busCard.innerHTML = `
            <h3>${bus.name}</h3>
            <p><strong>Route:</strong> ${bus.from} → ${bus.to}</p>
            <p><strong>Departure:</strong> ${bus.departure}</p>
            <p><strong>Arrival:</strong> ${bus.arrival}</p>
            <p><strong>Type:</strong> ${bus.type}</p>
            <p><strong>Available Seats:</strong> ${bus.seats}</p>

            <div class="bus-price">
                ₹${bus.price} <small>/ person</small>
            </div>

            <button class="book-button" data-bus-id="${bus.id}">
                Book Now
            </button>
        `;

        busContainer.appendChild(busCard);
    });
}

// Search buses
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const date = journeyDate.value;

    if (from.toLowerCase() === to.toLowerCase()) {
        alert("Departure and destination cities cannot be the same.");
        return;
    }

    if (!date || date < today) {
        alert("Please select a valid journey date.");
        return;
    }

    const results = buses.filter(bus =>
        bus.from.toLowerCase() === from.toLowerCase() &&
        bus.to.toLowerCase() === to.toLowerCase()
    );

    displayBuses(results);

    document.getElementById("buses").scrollIntoView({
        behavior: "smooth"
    });
});

// Booking button
busContainer.addEventListener("click", function(event) {
    const button = event.target.closest(".book-button");

    if (!button) return;

    const busId = Number(button.dataset.busId);
    const bus = buses.find(item => item.id === busId);

    if (bus) {
        openBookingForm(bus);
    }
});

// Create booking modal
function openBookingForm(bus) {
    const oldModal = document.querySelector(".booking-modal");

    if (oldModal) oldModal.remove();

    const passengers = Number(
        document.getElementById("passengers").value
    );

    const modal = document.createElement("div");
    modal.className = "booking-modal";

    modal.innerHTML = `
        <div class="booking-content">
            <button class="close-modal" type="button">&times;</button>

            <h2>Book Your Ticket</h2>

            <p><strong>${bus.name}</strong></p>
            <p>${bus.from} → ${bus.to}</p>
            <p>Departure: ${bus.departure}</p>
            <p>Price per seat: ₹${bus.price}</p>

            <form id="bookingForm">
                <label>Passenger Name</label>
                <input type="text" id="passengerName"
                    placeholder="Enter your name" required>

                <label>Mobile Number</label>
                <input type="tel" id="mobileNumber"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}" maxlength="10" required>

                <label>Select Seats</label>
                <div class="seat-grid" id="seatGrid"></div>

                <p id="seatMessage">Select ${passengers} seat(s).</p>

                <h3>Total: ₹<span id="totalPrice">0</span></h3>

                <button type="submit" class="confirm-button">
                    Confirm Booking
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const seatGrid = modal.querySelector("#seatGrid");
    const seatMessage = modal.querySelector("#seatMessage");
    const totalPrice = modal.querySelector("#totalPrice");
    const selectedSeats = [];

    // Demo seat selection
    for (let i = 1; i <= bus.seats; i++) {
        const seat = document.createElement("button");
        seat.type = "button";
        seat.className = "seat";
        seat.textContent = i;

        seat.addEventListener("click", function() {
            const index = selectedSeats.indexOf(i);

            if (index !== -1) {
                selectedSeats.splice(index, 1);
                seat.classList.remove("selected");
            } else {
                if (selectedSeats.length >= passengers) {
                    alert(`You can select only ${passengers} seat(s).`);
                    return;
                }

                selectedSeats.push(i);
                seat.classList.add("selected");
            }

            totalPrice.textContent =
                selectedSeats.length * bus.price;

            seatMessage.textContent =
                `Selected seats: ${selectedSeats.length} / ${passengers}`;
        });

        seatGrid.appendChild(seat);
    }

    // Close modal
    modal.querySelector(".close-modal").addEventListener("click", () => {
        modal.remove();
    });

    // Confirm booking
    modal.querySelector("#bookingForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = modal.querySelector("#passengerName").value.trim();
        const mobile = modal.querySelector("#mobileNumber").value.trim();

        if (selectedSeats.length !== passengers) {
            alert(`Please select exactly ${passengers} seat(s).`);
            return;
        }

        const booking = {
            bookingId: "BG" + Date.now(),
            passenger: name,
            mobile: mobile,
            bus: bus.name,
            route: `${bus.from} → ${bus.to}`,
            date: journeyDate.value,
            seats: [...selectedSeats],
            total: selectedSeats.length * bus.price
        };

        // Save demo booking in browser
        const bookings = JSON.parse(
            localStorage.getItem("busGoBookings") || "[]"
        );

        bookings.push(booking);
        localStorage.setItem("busGoBookings", JSON.stringify(bookings));

        // Show ticket
        modal.querySelector(".booking-content").innerHTML = `
            <h2>Booking Confirmed!</h2>
            <p>Your BusGo ticket has been booked successfully.</p>

            <hr>

            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Passenger:</strong> ${booking.passenger}</p>
            <p><strong>Mobile:</strong> ${booking.mobile}</p>
            <p><strong>Bus:</strong> ${booking.bus}</p>
            <p><strong>Route:</strong> ${booking.route}</p>
            <p><strong>Date:</strong> ${booking.date}</p>
            <p><strong>Seats:</strong> ${booking.seats.join(", ")}</p>

            <h3>Total Amount: ₹${booking.total}</h3>

            <button class="confirm-button" onclick="window.print()">
                Print Ticket
            </button>

            <button class="close-ticket" type="button">
                Close
            </button>
        `;

        modal.querySelector(".close-ticket").addEventListener("click", () => {
            modal.remove();
        });
    });
}

// Show all buses when website opens
displayBuses(buses);
