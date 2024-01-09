import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const date = document.querySelector("#datetime-picker");
const btnStart = document.querySelector("[data-start]");
const day = document.querySelector("[data-days]");
const hour = document.querySelector("[data-hours]");
const min = document.querySelector("[data-minutes]");
const sec = document.querySelector("[data-seconds]");
const spans = document.querySelectorAll(".value");

let timerId = null;

btnStart.disabled = true;

flatpickr(date, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      Notiflix.Notify.failure("Будь ласка, оберіть дату у майбутньому");
      btnStart.disabled = true;
    } else {
      btnStart.disabled = false;
      Notiflix.Notify.success("Натисніть Start!");
    }
  },
});

btnStart.addEventListener("click", onBtnStartClick);

function onBtnStartClick() {
  spans.forEach((item) => item.classList.toggle("end"));
  btnStart.disabled = true;
  date.disabled = true;
  timerId = setInterval(() => {
    const choosenDate = new Date(date.value);
    const timeToFinish = choosenDate - Date.now();
    const { days, hours, minutes, seconds } = convertMs(timeToFinish);

    day.textContent = addLeadingZero(days);
    hour.textContent = addLeadingZero(hours);
    min.textContent = addLeadingZero(minutes);
    sec.textContent = addLeadingZero(seconds);

    if (timeToFinish < 1000) {
      spans.forEach((item) => item.classList.toggle("end"));
      clearInterval(timerId);
      date.disabled = false;
    }
  }, 1000);
}

function convertMs(ms) {
  // Кількість мілісекунд на одиницю часу
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Залишилось днів
  const days = Math.floor(ms / day);
  // Залишилось годин
  const hours = Math.floor((ms % day) / hour);
  // Залишилось хвилин
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Залишилось секунд
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

function addLeadingZero(value) {
  return `${value}`.padStart(2, "0");
}
