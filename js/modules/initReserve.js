import { addPreload, removePreload } from './util.js';
import { API_URL } from './const.js';

const year = new Date().getFullYear()

const renderSpec = (wrapper, data) => {
  const labels = data.map(item => {
    const label = document.createElement('label')
    label.classList.add('radio')
    label.innerHTML = `
      <input class="radio__input" type="radio" name="spec" value="${item.id}">
      <span class="radio__label radio__label_spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
    `
    return label
  })
  wrapper.append(...labels)
}

const renderMonth = (wrapper, data) => {
  const labels = data.map(month => {
    const label = document.createElement('label')
    label.classList.add('radio')
    label.innerHTML = `
      <input class="radio__input" type="radio" name="month" value="${month}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
        month: 'long'
      }).format(new Date(year, month))}</span>
    `
    return label
  })
  wrapper.append(...labels)
}

const renderDay = (wrapper, data, month) => {
  const labels = data.map(day => {
    const label = document.createElement('label')
    label.classList.add('radio')
    label.innerHTML = `
      <input class="radio__input" type="radio" name="day" value="${day}">
      <span class="radio__label">${new Intl.DateTimeFormat('ru-RU', {
        month: 'long', day: 'numeric'
      }).format(new Date(year, month, day))}</span>
    `
    return label
  })
  wrapper.append(...labels)
}

const renderTime = (wrapper, data) => {
  const labels = data.map(time => {
    const label = document.createElement('label')
    label.classList.add('radio')
    label.innerHTML = `
      <input class="radio__input" type="radio" name="time" value="${time}">
      <span class="radio__label">${time}</span>
    `
    return label
  })
  wrapper.append(...labels)
}

const addDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = true
  })
}

const removeDisabled = (arr) => {
  arr.forEach(elem => {
    elem.disabled = false
  })
}

export const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form')
  const { fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn } = reserveForm

  addDisabled([fieldspec,fielddata,fieldmonth,fieldday,fieldtime,btn])

  reserveForm.addEventListener('change', async (event) => {
    const target = event.target

    if (target.name === 'service') {
      addDisabled([fieldspec,fielddata,fieldmonth,fieldday,fieldtime,btn])

      fieldspec.innerHTML = `<legend class="reserve__legend">Специалист</legend>`

      addPreload(fieldspec)
      const response = await fetch(`${API_URL}/api?service=${target.value}`)
      const data = await response.json()

      renderSpec(fieldspec, data)
      removePreload(fieldspec)
      removeDisabled([fieldspec])
    }

    if (target.name === 'spec') {
      addDisabled([fielddata,fieldmonth,fieldday,fieldtime,btn])
      addPreload(fieldmonth)
      const response = await fetch(`${API_URL}/api?spec=${target.value}`)
      const data = await response.json()
      fieldmonth.textContent = ''
      renderMonth(fieldmonth, data)
      removePreload(fieldmonth)
      removeDisabled([fielddata, fieldmonth])
    }

    if (target.name === 'month') {
      addDisabled([fieldday,fieldtime,btn])
      addPreload(fieldday)
      const response = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`)
      const data = await response.json()
      fieldday.textContent = ''
      renderDay(fieldday, data, reserveForm.month.value)
      removePreload(fieldday)
      removeDisabled([ fieldday])
    }

    if (target.name === 'day') {
      addDisabled([fieldtime,btn])
      addPreload(fieldtime)
      const response = await fetch(`
        ${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}
      `)
      const data = await response.json()
      fieldtime.textContent = ''
      renderTime(fieldtime, data)
      removePreload(fieldtime)
      removeDisabled([ fieldtime])
    }

    if (target.name === 'time') {
      removeDisabled([ btn])
    }
  })
}