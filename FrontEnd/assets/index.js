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

const gallery = document.querySelector('.gallery')
const filters = document.getElementById('filters')
const loginBtn = document.getElementById('loginBtn')
const titleDiv = document.querySelector('.title__div')
const portfolio = document.getElementById('portfolio')

if (localStorage.token) {
  loginBtn.addEventListener('click', () => {
    location.reload, localStorage.removeItem('token')
  })
  loginBtn.children[0].textContent = 'logout'
  filters.remove()
  initModify()
} else if (!localStorage.token) {
  loginBtn.children[0].textContent = 'login'
  initFilters()
}

function initModifyPopupElements() {
  const modifyWindow = document.createElement('div')
  const form = document.createElement('form')
  const topDiv = document.createElement('div')
  const img = document.createElement('img')
  const xmark = document.createElement('img')
  const h2 = document.createElement('h2')
  const modifyGallery = document.createElement('div')
  const lineBlack = document.createElement('div')
  const button = document.createElement('button')

  return {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  }
}

function initModifyPopupAttributes() {
  const {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  } = initModifyPopupElements()

  modifyWindow.classList.add('modify__window')
  topDiv.classList.add('top__div')
  modifyGallery.classList.add('modify__gallery')
  lineBlack.classList.add('line__black')
  img.src = ''
  img.alt = ''
  xmark.src = './assets/icons/xmark.svg'
  xmark.alt = 'xmark'
  h2.textContent = 'Galerie photo'
  button.textContent = 'Ajouter une photo'

  return {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  }
}

function initModifyPopupEventListener() {
  const {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  } = initModifyPopupAttributes()

  modifyWindow.addEventListener('click', (e) => {
    if (e.target === modifyWindow) {
      removePopup()
    }
  })

  xmark.addEventListener('click', () => removePopup())

  button.addEventListener(
    'click',
    () => initImgUpload({ img, h2, modifyGallery, button, form }),
    { once: true }
  )

  return {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  }
}

function initModifyPopupGallery() {
  const {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  } = initModifyPopupEventListener()

  for (let i = 0; i < worksData.length; i++) {
    const element = worksData[i]
    const div = document.createElement('div')
    div.classList.add(element.categoryId)
    const img = document.createElement('img')
    img.src = element.imageUrl
    img.alt = element.title
    div.appendChild(img)
    const div2 = document.createElement('div')
    const trashIcon = document.createElement('img')
    trashIcon.src = './assets/icons/trash.svg'
    trashIcon.alt = 'trashIcon'
    trashIcon.addEventListener('click', () => removeWork(element.id))
    div2.appendChild(trashIcon)
    div.appendChild(div2)
    modifyGallery.appendChild(div)
  }

  return {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  }
}

function initModifyPopup() {
  const {
    modifyWindow,
    form,
    topDiv,
    img,
    xmark,
    h2,
    modifyGallery,
    lineBlack,
    button,
  } = initModifyPopupGallery()

  topDiv.appendChild(img)
  topDiv.appendChild(xmark)
  form.appendChild(topDiv)
  form.appendChild(h2)
  form.appendChild(modifyGallery)
  form.appendChild(lineBlack)
  form.appendChild(button)
  modifyWindow.appendChild(form)
  portfolio.insertBefore(modifyWindow, gallery)
}

async function removeWork(workId) {
  await fetch(`${worksApi}/${workId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.token,
    },
  })

  initGallery()
  removePopup()
  initModifyPopup()
}

function initImgUploadElements() {
  const div = document.createElement('div')
  const imgLogo = document.createElement('img')
  const addImgLabel = document.createElement('label')
  const addImg = document.createElement('input')
  const imgInfo = document.createElement('span')
  const titleLabel = document.createElement('label')
  const titleInput = document.createElement('input')
  const categoryLabel = document.createElement('label')
  const categorySelect = document.createElement('select')
  const defaultOption = document.createElement('option')

  return {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
  }
}

function initImgUploadAttributes(tagToModify) {
  const {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
  } = initImgUploadElements()
  const { img, h2, modifyGallery, button, form } = tagToModify

  img.src = './assets/icons/arrow-left.svg'
  img.alt = 'arrowLeft'
  h2.textContent = 'Ajout photo'
  modifyGallery.innerHTML = ''
  modifyGallery.classList = 'upload'
  div.classList.add('upload__div')
  imgLogo.src = './assets/icons/img__logo.svg'
  imgLogo.classList.add('img__logo')
  addImgLabel.setAttribute('for', 'addImg')
  addImgLabel.textContent = '+ Ajouter photo'
  addImg.type = 'file'
  addImg.id = 'addImg'
  imgInfo.textContent = 'jpg, png : 4mo max'
  titleLabel.textContent = 'Titre'
  titleLabel.classList.add('upload__label')
  titleInput.type = 'text'
  titleInput.name = 'title'
  categoryLabel.textContent = 'Catégorie'
  categoryLabel.classList.add('upload__label')
  categorySelect.name = 'category'
  defaultOption.hidden = true
  defaultOption.disabled = true
  defaultOption.selected = true
  defaultOption.value = ''
  button.disabled = true
  button.textContent = 'Valider'

  return {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
    img,
    h2,
    modifyGallery,
    button,
    form,
  }
}

function initImgUploadEventListener(tagToModify) {
  const {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
    img,
    h2,
    modifyGallery,
    button,
    form,
  } = initImgUploadAttributes(tagToModify)

  img.addEventListener('click', () => {
    removePopup()
    initModifyPopup()
  })

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

  titleInput.addEventListener('input', () => enableButton())

  categorySelect.addEventListener('change', () => enableButton())

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

  return {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
    img,
    h2,
    modifyGallery,
    button,
    form,
  }
}

function initImgUploadSelect(tagToModify) {
  const {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
    img,
    h2,
    modifyGallery,
    button,
    form,
  } = initImgUploadEventListener(tagToModify)

  for (let i = 0; i < categoriesData.length; i++) {
    const e = categoriesData[i]
    const option = document.createElement('option')
    option.value = e.name
    option.textContent = e.name
    categorySelect.appendChild(option)
  }

  return {
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
    img,
    h2,
    modifyGallery,
    button,
    form,
  }
}

function initImgUpload(tagToModify) {
  let {
    img,
    h2,
    modifyGallery,
    button,
    form,
    div,
    imgLogo,
    addImgLabel,
    addImg,
    imgInfo,
    titleLabel,
    titleInput,
    categoryLabel,
    categorySelect,
    defaultOption,
  } = initImgUploadSelect(tagToModify)

  div.appendChild(imgLogo)
  div.appendChild(addImgLabel)
  div.appendChild(addImg)
  div.appendChild(imgInfo)
  modifyGallery.appendChild(div)
  categorySelect.appendChild(defaultOption)
  modifyGallery.appendChild(titleLabel)
  modifyGallery.appendChild(titleInput)
  modifyGallery.appendChild(categoryLabel)
  modifyGallery.appendChild(categorySelect)
}

function removePopup() {
  const modifyWindow = document.querySelector('.modify__window')
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
