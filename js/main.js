;(function () {
	'use strict'

	const text = `Как принято считать, базовые сценарии поведения пользователей объективно рассмотрены соответствующими инстанциями. В целом, конечно, понимание сути ресурсосберегающих технологий представляет собой интересный эксперимент проверки кластеризации усилий. Для современного мира постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет выполнить важные задания по разработке инновационных методов управления процессами.`

	const inputElement = document.querySelector('[data-input]')
	const textExampleElement = document.querySelector('[data-text-example]')

	const lines = getLines(text)

	let letterId = 1
	let startMoment = null
	let started = false

	let letterCounter = 0
	let letterCounter_error = 0

	init()


	function init () {
		update()

		inputElement.focus()
		
		// Где бы ни начали печатать - перемещаемся в инпут
		document.addEventListener('keydown', function (event) {
			inputElement.focus()

			const currentLineNumber = getCurrentLineNumber()
			const element = setPushedButton(event.key.toLowerCase(), event.code)
			const currentLetter = getCurrentLetter()

			if (event.key !== "Shift") {
				letterCounter += 1
			} 
				

			if (!started) {
				started = true
				startMoment = Date.now()
			}

			if (event.key.startsWith('F') && event.key.length > 1) {
				return
			}

			if (element) {
				element.classList.add('hint')
			}

			const isKey = event.key === currentLetter.original
			const isEnter = event.key === 'Enter' && currentLetter.original === '\n'
			if (isKey || isEnter) {
				letterId += 1
				update()
			}
			else {
				event.preventDefault()

				if (event.key !== "Shift") {
					letterCounter_error += 1
					for (const line of lines) {
						for (const letter of line) {
							if (letter.original === currentLetter.original) {
								letter.success = false
							}
						}
					}
					update()
				} 
			}

			if (currentLineNumber !== getCurrentLineNumber()) {
				inputElement.value = ''
				event.preventDefault()

				const time = Date.now() - startMoment
				document.querySelector('#wordsSpeed').textContent = Math.round(60000 * letterCounter / time)
				document.querySelector('#errorPercent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%'
				started = false
				letterCounter = 0
				letterCounter_error = 0
			}
		})

		inputElement.addEventListener('keyup', function (event) {
			const element = setPushedButton(event.key.toLowerCase(), event.code)

			if (element) {
				element.classList.remove('hint')
			}
		})
	}

	function setPushedButton (key, code) {
		let element
		if (key === "altgraph") {
				element = document.querySelector('[data-key="alt"]')
			} 
			else if (key === ',') {
				element = document.querySelector('[data-key="."]')
			} 
			else if (key === '\\') {
				element = document.querySelector('[data-key="Backslash"]')
			}
			else if (code === "ShiftLeft" || code === "ShiftRight") {
				element = document.querySelector(`[data-key="${code}"]`)
			}
			else {
				element = document.querySelector(`[data-key="${key}"]`)
			}
		return element
	}

	// Принимает длинную строку, возвращает массив строк со служебной информацией
	function getLines (text) {
		const lines = []

		let line = []
		let idCounter = 0
		let checkSpacePosition = []

		for (let i = 0; i<text.length; i++) {
			let letter = text[i]

			if (letter === ' ') {
				letter = '°'
			}

			if (letter === '\n') {
				letter = '¶\n'
			}

			checkSpacePosition.push(text[i])

			line.push({
				id: i+1,
				label: letter,
				original: text[i],
				success: true
			})

			// Оставляем в строке только целые слова
			if (line.length >=70 || letter === '¶\n') {
				let lastSpacePosition = checkSpacePosition.lastIndexOf(' ') + 1
				lines.push(line.slice(0, lastSpacePosition))
				i -= (70 - lastSpacePosition)
				line = []
				checkSpacePosition = []
			}
		}

		if (line.length > 0) {
			lines.push(line)
		}

		return lines
	}

	// Принимает строку с объектами со служебной информацией и возвращает html-структуру
	function lineToHtml (line) {
		const divElement = document.createElement('div')
		divElement.classList.add('line')

		for (const letter of line) {
			const spanElement = document.createElement('span')
			spanElement.textContent = letter.label

			divElement.append(spanElement)

			if(letterId > letter.id) {
				spanElement.classList.add('done')
			}
			else if (!letter.success) {
				spanElement.classList.add('hint')
			}
		}
		return divElement
	}

	 // Возвращает текущий номер строки
	function getCurrentLineNumber () {
		for (let i = 0; i <lines.length; i++) {
			for (const letter of lines[i]) {
				if (letter.id === letterId) {
					return i
				}
			}
		}
	}

	// Функция обновления 3-х отображаемых актуальных строк textExample
	function update () {
		const сurrentLineNumber = getCurrentLineNumber()

		textExampleElement.innerHTML = ''

		for (let i = 0; i <lines.length; i++) {
			const html = lineToHtml(lines[i])
			textExampleElement.append(html)

			if (i < getCurrentLineNumber || i > getCurrentLineNumber + 2) {
				html.classList.add('hidden')
			}
		}
	}

	// Возвращает объект символа, ожидаемый программой
	function getCurrentLetter () {
		for (const line of lines) {
			for (const letter of line) {
				if (letterId === letter.id) {
					return letter
				}
			}
		}
	}
})()