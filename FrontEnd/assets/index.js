const worksApi = 'http://localhost:5678/api/works'
const categoriesApi = 'http://localhost:5678/api/categories'

const apiRequest = async (link) => {
  try {
    const response = await fetch(link)
    const data = await response.json()
    return data
  } catch (error) {
    return error
  }
}

let worksData = await apiRequest(worksApi)
let categoriesData = await apiRequest(categoriesApi)

const gallery = document.getElementsByClassName('gallery')[0]
const filters = document.getElementById('filters')
const loginBtn = document.getElementById('loginBtn')
const titleDiv = document.getElementsByClassName('title__div')[0]
const portfolio = document.getElementById('portfolio')

if (localStorage.token) {
  loginBtn.addEventListener('click', () => {
    location.reload, (localStorage.removeItem('token'))
  })
  loginBtn.children[0].textContent = 'logout'
  filters.remove()
  initModify()
} else if (!localStorage.token) {
  loginBtn.children[0].textContent = 'login'
  initFilters()
}

function initModifyPopup() {
  const modifyWindow = document.createElement('div')
  modifyWindow.classList.add('modify__window')

  modifyWindow.addEventListener('click', (e) => {
    if (e.target === modifyWindow) {
      removePopup()
    }
  })

  const form = document.createElement('form')

  const topDiv = document.createElement('div')
  topDiv.classList.add('top__div')

  const img = document.createElement('img')
  img.src = ''
  img.alt = ''
  const xmark = document.createElement('img')
  xmark.src = './assets/icons/xmark.svg'
  xmark.alt = 'xmark'
  xmark.addEventListener('click', () => removePopup())
  topDiv.appendChild(img)
  topDiv.appendChild(xmark)
  form.appendChild(topDiv)

  const h2 = document.createElement('h2')
  h2.textContent = 'Galerie photo'
  form.appendChild(h2)

  const modifyGallery = document.createElement('div')
  modifyGallery.classList.add('modify__gallery')
  for (let i = 0; i < worksData.length; i++) {
    const e = worksData[i]
    const div = document.createElement('div')
    div.classList.add(e.categoryId)
    const img = document.createElement('img')
    img.src = e.imageUrl
    img.alt = e.title
    div.appendChild(img)
    const div2 = document.createElement('div')
    const trashIcon = document.createElement('img')
    trashIcon.src = './assets/icons/trash.svg'
    trashIcon.alt = 'trashIcon'
    trashIcon.addEventListener('click', () => removeWork(e.id))
    div2.appendChild(trashIcon)
    div.appendChild(div2)
    modifyGallery.appendChild(div)
  }
  form.appendChild(modifyGallery)

  const lineBlack = document.createElement('div')
  lineBlack.classList.add('line__black')
  form.appendChild(lineBlack)

  const button = document.createElement('button')
  button.textContent = 'Ajouter une photo'
  button.addEventListener(
    'click',
    () => initImgUpload({ img, h2, modifyGallery, button, form }),
    { once: true }
  )
  form.appendChild(button)

  modifyWindow.appendChild(form)

  portfolio.insertBefore(modifyWindow, gallery)
}

async function removeWork(workId) {
  const response = await fetch(`${worksApi}/${workId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  })

  for (let i = 0; i < worksData.length; i++) {
    const e = worksData[i]
    if (e.id === workId) {
      const index = worksData.indexOf(e)
      worksData.splice(index, 1)
    }    
  }

  initGallery()
  removePopup()
  initModifyPopup()
}

function initImgUpload(tagToModify) {
  let [img, h2, modifyGallery, button, form] = Object.values(tagToModify)

  img.src = './assets/icons/arrow-left.svg'
  img.alt = 'arrowLeft'
  img.addEventListener('click', () => {
    removePopup()
    initModifyPopup()
  })

  h2.textContent = 'Ajout photo'

  modifyGallery.innerHTML = ''
  modifyGallery.classList = 'upload'

  const div = document.createElement('div')
  div.classList.add('upload__div')
  const imgLogo = document.createElement('img')
  imgLogo.src = './assets/icons/img__logo.svg'
  imgLogo.classList.add('img__logo')
  const addImgLabel = document.createElement('label')
  addImgLabel.setAttribute('for', 'addImg')
  addImgLabel.textContent = '+ Ajouter photo'
  const addImg = document.createElement('input')
  addImg.type = 'file'
  addImg.id = 'addImg'

  let file = ''
  addImg.addEventListener('change', (e) => {
    file = e.target.files[0]

    if (file.type === 'image/png' || file.type === 'image/jpeg') {
      if (file.size < 4000000) {
        const img = document.createElement('img')
        img.classList.add('addImgPreview')
        img.src = URL.createObjectURL(file)
        div.innerHTML = ''
        div.appendChild(img)
        enableButton()
      } else {
        alert('Veuillez utiliser un fichier inferieur a 4mo')
      }
    } else {
      alert('veuillez utiliser un fichier au format jpeg ou png')
    }
  })
  const imgInfo = document.createElement('span')
  imgInfo.textContent = 'jpg, png : 4mo max'
  div.appendChild(imgLogo)
  div.appendChild(addImgLabel)
  div.appendChild(addImg)
  div.appendChild(imgInfo)
  modifyGallery.appendChild(div)

  const titleLabel = document.createElement('label')
  titleLabel.textContent = 'Titre'
  titleLabel.classList.add('upload__label')
  const titleInput = document.createElement('input')
  titleInput.type = 'text'
  titleInput.name = 'title'
  titleInput.addEventListener('input', () => enableButton())

  const categoryLabel = document.createElement('label')
  categoryLabel.textContent = 'Catégorie'
  categoryLabel.classList.add('upload__label')
  const categorySelect = document.createElement('select')
  categorySelect.name = 'category'
  categorySelect.addEventListener('change', () => enableButton())
  const defaultOption = document.createElement('option')
  defaultOption.hidden = true
  defaultOption.disabled = true
  defaultOption.selected = true
  defaultOption.value = ''
  categorySelect.appendChild(defaultOption)
  for (let i = 0; i < categoriesData.length; i++) {
    const e = categoriesData[i]
    const option = document.createElement('option')
    option.value = e.name
    option.textContent = e.name
    categorySelect.appendChild(option)
  }

  modifyGallery.appendChild(titleLabel)
  modifyGallery.appendChild(titleInput)
  modifyGallery.appendChild(categoryLabel)
  modifyGallery.appendChild(categorySelect)

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = new FormData(form)

    formData.append('image', file)
    const category = formData.get('category')
    if (category === 'Objets') {
      formData.set('category', 1)
    } else if (category === 'Appartements') {
      formData.set('category', 2)
    } else if (category === 'Hotels & restaurants') {
      formData.set('category', 3)
    }

    const response = await fetch(worksApi, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Bearer ' + localStorage.token,
      },
    })

    const data = await response.json()

    worksData.push(data)
    initGallery()
  })

  button.disabled = true
  button.textContent = 'Valider'
  button.addEventListener('click', () => () => form.submit())

  function enableButton() {
    if (
      titleInput.value &&
      div.children[0].classList.contains('addImgPreview') &&
      categorySelect.value
    ) {
      button.disabled = false
    } else {
      button.disabled = true
    }
  }
}

function removePopup() {
  const modifyWindow = document.getElementsByClassName('modify__window')[0]
  modifyWindow.remove()
}

function activateFilters(button) {
  for (let i = 0; i < filters.getElementsByTagName('button').length; i++) {
    const e = filters.getElementsByTagName('button')[i]
    if (e.classList.contains('btn__activated')) {
      e.classList.remove('btn__activated')
    }
  }

  button.classList.add('btn__activated')

  initGallery(button.id)
}

function initModify() {
  const div = document.createElement('div')
  const img = document.createElement('img')
  img.src = './assets/icons/modify.svg'
  img.alt = 'modify'
  const span = document.createElement('span')
  span.textContent = 'modifier'
  div.appendChild(img)
  div.appendChild(span)
  div.addEventListener('click', () => initModifyPopup())
  titleDiv.appendChild(div)
}

function initFilters() {
  for (let i = 0; i < categoriesData.length; i++) {
    const e = categoriesData[i]
    const button = document.createElement('button')
    button.innerHTML = e.name
    button.id = e.id
    filters.appendChild(button)
  }

  for (let i = 0; i < filters.getElementsByTagName('button').length; i++) {
    const e = filters.getElementsByTagName('button')[i]
    e.addEventListener('click', () => activateFilters(e))
  }
}

function initGallery(categorie) {
  gallery.textContent = ''

  for (let i = 0; i < worksData.length; i++) {
    const e = worksData[i]
    if (!categorie || `${e.categoryId}` === categorie) {
      const figure = document.createElement('figure')
      figure.classList.add(e.categoryId)
      const img = document.createElement('img')
      img.src = e.imageUrl
      img.alt = e.title
      const figcaption = document.createElement('figcaption')
      figcaption.innerHTML = e.title
      figure.appendChild(img)
      figure.appendChild(figcaption)
      gallery.appendChild(figure)
    }
  }
}

initGallery()
